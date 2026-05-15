---
title: "Compile NEFF Executables from NKI Kernels"
date: 2026-05-14
updated: 2026-05-14
categories:
  - "Systems"
tags:
  - "reference"
  - "systems"
  - "machine-learning"
  - "python"
  - "shell"
  - "neuron"
excerpt: "Compile NEFF Executables from NKI Kernels"
---

[AWS Neuron Kernel Interface (NKI)](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/index.html) lets you write custom compute kernels for [AWS Trainium and Inferentia](https://aws.amazon.com/ai/machine-learning/). This post documents a minimal end-to-end pipeline: writing an NKI kernel in Python, extracting its HLO, compiling the HLO to a Neuron Executable File Format (NEFF) binary with `neuronx-cc`, and loading the result on-device with `spike`.

## 1. Write a kernel: `matmul.py`

The example below implements a tiled matrix multiplication in NKI. It reads tiles from HBM into SBUF, accumulates partial results in PSUM via `nc_matmul`, and writes the final tile back to HBM.

```python
import nki
import nki.language as nl
import nki.isa as nisa
import numpy as np
import torch
from torch_xla.core import xla_model as xm
from nki._torch_xla import PyTorchXLAKernel


def matmul(lhsT, rhs):
    lhs_K, lhs_M = lhsT.shape
    lhs_dtype = lhsT.dtype

    rhs_K, rhs_N = rhs.shape
    rhs_dtype = rhs.dtype

    TILE_K = nl.tile_size.pmax
    TILE_M = nl.tile_size.gemm_stationary_fmax
    TILE_N = nl.tile_size.gemm_moving_fmax

    result = nl.ndarray((lhs_M, rhs_N), dtype=lhs_dtype, buffer=nl.shared_hbm)
    for m in nl.affine_range(lhs_M // TILE_M):
        for n in nl.affine_range(rhs_N // TILE_N):
            result_tile_psum = nl.ndarray(
                (TILE_M, TILE_N), dtype=nl.float32, buffer=nl.psum
            )
            for k in nl.affine_range(lhs_K // TILE_K):
                lhsT_tile = nl.ndarray(
                    (TILE_K, TILE_M), dtype=lhs_dtype, buffer=nl.sbuf
                )
                nisa.dma_copy(
                    dst=lhsT_tile,
                    src=lhsT[
                        k * TILE_K : (k + 1) * TILE_K,
                        m * TILE_M : (m + 1) * TILE_M,
                    ],
                )

                rhs_tile = nl.ndarray(
                    (TILE_K, TILE_N), dtype=rhs_dtype, buffer=nl.sbuf
                )
                nisa.dma_copy(
                    dst=rhs_tile,
                    src=rhs[
                        k * TILE_K : (k + 1) * TILE_K,
                        n * TILE_N : (n + 1) * TILE_N,
                    ],
                )

                nisa.nc_matmul(
                    dst=result_tile_psum, stationary=lhsT_tile, moving=rhs_tile
                )

            result_tile = nl.ndarray(
                (TILE_M, TILE_N), dtype=lhs_dtype, buffer=nl.sbuf
            )
            nisa.tensor_copy(
                dst=result_tile, src=result_tile_psum, dtype=lhs_dtype
            )

            nisa.dma_copy(
                dst=result[
                    m * TILE_M : (m + 1) * TILE_M,
                    n * TILE_N : (n + 1) * TILE_N,
                ],
                src=result_tile,
            )

    return result


if __name__ == '__main__':
    kernel = PyTorchXLAKernel(func=matmul)
    device = xm.xla_device()

    a = torch.randn((2048, 2048)).to(device=device)
    b = torch.randn((2048, 2048)).to(device=device)
    c = kernel(a, b)

    # Force XLA graph compilation
    xm.mark_step()
```

The function accepts a **transposed left-hand-side** (`lhsT`) — the kernel internally computes `lhsT.T @ rhs`, i.e., `A.T @ B` for the caller. The `if __name__ == '__main__'` block forces XLA graph capture; this is the entry point used by the extraction step below.

## 2. Extract HLO from the kernel

Neuron's XLA-based compilation path lowers NKI kernels through PyTorch/XLA into HLO modules. The helper function below sets two environment variables so the runtime dumps those modules to disk **without requiring device execution**:

- `NEURON_EXTRACT_GRAPHS_ONLY=1` — skip execution; only extract graphs
- `NEURON_COMPILE_CACHE_URL=<dir>` — write HLO artifacts directly into `<dir>`

```sh
extract_hlo_module() {
    # Usage: extract_hlo_module <file> <cache_dir> <platform>
    #
    #   file      - Python script containing an @nki.jit-decorated kernel
    #   cache_dir - Directory where HLO artifacts are saved
    #   platform  - Neuron target: trn1, trn2, trn3
    #
    # Runs the script with NEURON_COMPILE_CACHE_URL pointing to cache_dir
    # and NEURON_EXTRACT_GRAPHS_ONLY=1, so HLO modules are dumped directly
    # into cache_dir without device execution.

    file="$1"
    cache_dir="$2"
    platform="$3"

    if [ ! -f "$file" ]; then
        echo "ERROR: file not found: $file" >&2
        return 1
    fi

    script="$(cd "$(dirname "$file")" && pwd)/$(basename "$file")"

    NEURON_PLATFORM_TARGET_OVERRIDE="$platform" \
    NEURON_EXTRACT_GRAPHS_ONLY=1 \
    NEURON_COMPILE_CACHE_URL="$cache_dir" \
        python3 "$script"
}
```

After invoking `extract_hlo_module matmul.py ./hlo_artifacts trn1`, the output directory looks like:

```
hlo_artifacts/
  neuronxcc-2.22.12471.0+b4a00d10/
    MODULE_5318517502296525832+e30acd3a/
      model.hlo_module.pb      # NKI kernel HLO (~19 KB)
      compile_flags.json
```

The `model.hlo_module.pb` is a serialized HLO module containing the lowered kernel graph. Each run may produce multiple modules (runtime glue, parameter loading, etc.); the kernel's module is typically the largest.

------

A simpler path exists for [`nkipy`](https://github.com/aws-neuron/nkipy):

```python
import numpy as np

from nkipy.core.trace import NKIPyKernel
from nkipy.third_party.xla.service import hlo_pb2


def matmul(A, B):
    return A.T @ B


def extract_hlo_module(nkipy_kernel_function, hlo_file_path, sample_inputs):
    traced_kernel = NKIPyKernel.trace(nkipy_kernel_function)
    traced_kernel.specialize(*sample_inputs)

    hlo_proto = traced_kernel._code.to_proto()
    with open(hlo_file_path, 'wb') as f:
        f.write(hlo_proto.SerializeToString())


if __name__ == '__main__':
    A = ((np.random.rand(2048, 2048) - 0.5) * 2).astype(np.float32)
    B = ((np.random.rand(2048, 2048) - 0.5) * 2).astype(np.float32)

    extract_hlo_module(matmul, 'nkipy_matmul.pb', (A, B))
```

## 3. Compile HLO to NEFF with `neuronx-cc`

`neuronx-cc` is the Neuron compiler that takes an HLO module and emits a NEFF binary. The invocation is a single command:

```sh
neuronx-cc compile \
    --framework XLA \
    --target trn1 \
    <input.hlo_module.pb> \
    -o <output.neff>
```

### Key flags

| Flag | Description |
|---|---|
| `--framework XLA` | **Required.** Input is an XLA-generated HLO module |
| `--target trn1\|trn2\|trn3` | Neuron instance family to target |
| `-o <file>` | Output NEFF path (default: `file.neff`) |
| `--optlevel 1\|2\|3` | Optimization level (default: `2`) |
| `--enable-fast-loading-neuron-binaries` | Produce an uncompressed NEFF for faster loading |
| `--auto-cast matmult\|all` | Auto-cast FP32 to lower precision |
| `--auto-cast-type fp16\|bf16\|tf32` | Precision type for auto-cast (default: `bf16`) |
| `--logical-nc-config 1\|2` | NeuronCores per logical core (trn2 only) |

## 4. Load and execute a compiled NEFF with `spike`

The [spike](https://github.com/aws-neuron/nkipy/blob/main/spike/README.md) library provides a lightweight runtime for loading pre-compiled NEFF binaries and running them on Neuron devices. It does **not** invoke the compiler — it loads the NEFF directly.

```python
import numpy as np
import torch
from spike import SpikeModel, SpikeTensor

# 1. Load the kernel from a NEFF file (use .neff, NOT .hlo_module.pb)
model = SpikeModel.load_from_neff(
    './hlo_artifacts/neuronxcc-2.22.12471.0+b4a00d10/'
    'MODULE_8749100665346044836+e30acd3a/model.hlo_module.neff',
    'matmul'
)

# 2. Inspect expected I/O
model.input_tensors_info
# {'input1': TensorMetadata(size=16777216, dtype='float32', shape=[2048, 2048]),
#  'input0': TensorMetadata(size=16777216, dtype='float32', shape=[2048, 2048])}
model.output_tensors_info
# {'output0': TensorMetadata(size=16777216, dtype='float32', shape=[2048, 2048])}

# 3. Create inputs on host (torch → numpy → SpikeTensor)
A = torch.rand(2048, 2048)
B = torch.rand(2048, 2048)
device_A = SpikeTensor.from_numpy(A.numpy(), name='input1')
device_B = SpikeTensor.from_numpy(B.numpy(), name='input0')

# 4. Let the model auto-allocate outputs (pass outputs=None)
outputs = model(inputs={'input1': device_A, 'input0': device_B})

# 5. Read result back (SpikeTensor → numpy → torch)
result = torch.from_numpy(outputs['output0'].numpy())

# 6. Verify against PyTorch reference
#    This kernel computes input1.T @ input0 (A.T @ B)
assert torch.allclose(A.T @ B, result, atol=1e-3)
```

A few practical notes:

- Input and output tensors are identified by name (`input1`, `input0`, `output0`, etc.). The `input_tensors_info` / `output_tensors_info` dictionaries tell you the expected names, shapes, and dtypes.
- SpikeTensor names must match the kernel's parameter names.
- The NEFF is an opaque binary — no compilation step occurs at load time, which makes this path useful when you want to ship a pre-compiled kernel without bundling the full compiler toolchain.

## Summary

The full pipeline is three stages:

```text
NKI kernel (Python)
  → extract HLO module (.hlo_module.pb)   [NEURON_EXTRACT_GRAPHS_ONLY=1]
  → compile to NEFF binary (.neff)         [neuronx-cc compile --framework XLA]
  → load & execute on-device               [spike.SpikeModel.load_from_neff]
```

This workflow gives you a **self-contained, pre-compiled kernel** that can be distributed and loaded without the Neuron compiler at deploy time.
