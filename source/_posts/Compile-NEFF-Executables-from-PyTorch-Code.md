---
title: "Compile NEFF Executables from PyTorch Code"
date: 2026-07-19
updated: 2026-07-19
categories:
  - "AI and Machine Learning"
tags:
  - "reference"
  - "neuron"
  - "python"
  - "llm"
excerpt: "Compile NEFF Executables from PyTorch Code"
---

## Motivation

When deploying models on AWS Inferentia or Trainium, `torch_neuronx.trace` compiles a PyTorch function into a NEFF (Neuron Executable File Format) binary. The API is straightforward in principle — you pass a callable and example inputs — but there are a few practical requirements that are easy to overlook:

1. The traced callable must accept and return **only** tensors, or (possibly nested) lists, dicts, and tuples of tensors. Scalar arguments like `int` or `bool` are not allowed directly.
2. Input shapes and dtypes must be fully concrete at trace time.
3. The resulting NEFF is saved to a compiler working directory, not returned as an in-memory object.

This post walks through a concrete example: compiling a RoPE (Rotary Position Embedding) forward pass into a NEFF executable.

## RoPE Implementation

The core implementation is adapted from `ApplyRotaryEmb.forward_static` in common vLLM kernels. It gathers cos/sin at the given positions, rotates the first `rotary_dim` dimensions of query (and key when present), and passes the tail through unchanged.

```python
import torch


def _apply_rotary_emb(x, cos, sin, is_neox_style):
    """Rotate the rotary portion of x."""
    cos = cos.unsqueeze(-2).to(x.dtype)
    sin = sin.unsqueeze(-2).to(x.dtype)

    if is_neox_style:
        x1, x2 = torch.chunk(x, 2, dim=-1)
    else:
        x1 = x[..., ::2]
        x2 = x[..., 1::2]

    o1 = x1 * cos - x2 * sin
    o2 = x2 * cos + x1 * sin

    if is_neox_style:
        return torch.cat((o1, o2), dim=-1)
    return torch.stack((o1, o2), dim=-1).flatten(-2)


def _rotate_tensor(t, cos, sin, num_tokens, head_size, rotary_dim, is_neox_style):
    """View as heads, rotate [..., :rotary_dim], pass tail, restore shape."""
    orig_shape = t.shape
    t = t.view(num_tokens, -1, head_size)
    t_rot = t[..., :rotary_dim]
    t_pass = t[..., rotary_dim:]
    t_rot = _apply_rotary_emb(t_rot, cos, sin, is_neox_style)
    return torch.cat((t_rot, t_pass), dim=-1).reshape(orig_shape)


def rope_forward(
    positions,
    query,
    key=None,
    cos_sin_cache=None,
    head_size=None,
    rotary_dim=None,
    is_neox_style=True,
):
    """RoPE forward pass.

    Returns (rotated_q, rotated_k | None). key stays None under KV sharing.
    """
    positions = positions.flatten()
    num_tokens = positions.shape[0]
    cos_sin = cos_sin_cache.index_select(0, positions)
    cos, sin = cos_sin.chunk(2, dim=-1)

    query = _rotate_tensor(query, cos, sin, num_tokens, head_size, rotary_dim, is_neox_style)
    if key is not None:
        key = _rotate_tensor(key, cos, sin, num_tokens, head_size, rotary_dim, is_neox_style)
    return query, key


def _build_cos_sin_cache(rotary_dim, max_pos, base):
    """Precompute [max_pos, rotary_dim] concatenated cos/sin table."""
    inv_freq = 1.0 / (base ** (torch.arange(0, rotary_dim, 2, dtype=torch.float) / rotary_dim))
    t = torch.arange(max_pos, dtype=torch.float)
    freqs = torch.einsum("i,j->ij", t, inv_freq)
    return torch.cat((freqs.cos(), freqs.sin()), dim=-1)
```

## Static Inputs

Every input must be a concrete tensor with fixed shapes and dtypes:

```python
torch.manual_seed(0)

# Model config
head_size = 64
rotary_dim = 64
num_heads_q = 32
num_heads_k = 8           # GQA

# RoPE config
max_pos = 128
base = 500000.0            # Llama-3 rope_theta

# Example inputs (single token for tracing)
positions = torch.randint(0, max_pos, (1,))
cache = _build_cos_sin_cache(rotary_dim, max_pos, base)
q = torch.randn(1, num_heads_q * head_size)
k = torch.randn(1, num_heads_k * head_size)
```

## Wrapping in a `torch.nn.Module`

`torch_neuronx.trace` requires the callable to accept only tensors and nested tensor containers. Scalars like `head_size`, `rotary_dim`, and `is_neox_style` cannot be passed directly. The idiomatic fix is to capture them in a `torch.nn.Module`:

```python
class Wrapper(torch.nn.Module):
    def __init__(self, head_size, rotary_dim, is_neox_style=True):
        super().__init__()
        self.head_size = head_size
        self.rotary_dim = rotary_dim
        self.is_neox_style = is_neox_style

    def forward(self, positions, query, key=None, cos_sin_cache=None):
        return rope_forward(
            positions, query, key, cos_sin_cache,
            self.head_size, self.rotary_dim, self.is_neox_style,
        )
```

Scalars are baked in at construction time. At trace time, only tensor arguments flow through `forward`.

## Tracing with `torch_neuronx`

With the wrapper and static inputs ready, tracing is a single call:

```python
import torch_neuronx

wrapper = Wrapper(head_size, rotary_dim, is_neox_style=True)

traced = torch_neuronx.trace(
    wrapper,
    (positions, q, k, cache),
    compiler_args="--lnc=2",
    compiler_workdir="./compiler_workdir",
)
```

- The second argument is a tuple of example inputs matching `forward`'s signature.
- `--lnc=2` targets two NeuronCores.
- The NEFF file is written to `./compiler_workdir/`.
- The returned `traced` object can also be used directly for inference within the same process.

## Loading and Executing the Compiled NEFF

Once you have the NEFF binary, you can load and run it independently of the compilation toolchain using [`spike`](https://github.com/aws-neuron/nkipy/blob/main/spike/README.md). This is useful when you want to ship a pre-compiled kernel without bundling the full Neuron compiler at deploy time.

I covered the full workflow — loading a NEFF, inspecting I/O metadata, creating `SpikeTensor` inputs, running inference, and reading results back — in the companion post: **[Compile NEFF Executables from NKI Kernels §4](https://jifengwu2k.github.io/2026/05/14/Compile-NEFF-Executables-from-NKI-Kernels/#4-Load-and-execute-a-compiled-NEFF-with-spike)**. The `spike` API is the same regardless of whether the NEFF originated from NKI or from `torch_neuronx.trace`.
