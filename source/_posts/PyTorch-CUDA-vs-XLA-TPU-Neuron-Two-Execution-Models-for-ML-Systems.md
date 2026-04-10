---
title: 'PyTorch + CUDA vs. XLA + TPU: Two Execution Models for ML Systems'
date: 2026-04-10
updated: 2026-04-10
categories:
  - "AI and Machine Learning"
tags:
  - "reference"
  - "machine-learning"
  - "systems"
excerpt: A mental model for the difference between PyTorch + CUDA and the XLA + TPU execution style.
---

When people first move from the familiar **PyTorch + CUDA** world into **XLA + TPU**, the most confusing part is often not a single API. It is the **execution model**.

## PyTorch + CUDA: usually eager and op-by-op

In the typical PyTorch + CUDA workflow:

- execution is eager by default
- operations are issued op-by-op at runtime
- dispatch is driven by the ATen dispatcher
- performance is often dominated by kernels and vendor libraries such as `cuBLAS`, `cuDNN`, and `NCCL`
- work is executed immediately on the GPU

A useful conceptual diagram is:

```text
PyTorch eager ops
  → ATen dispatcher
  → CUDA kernels / libraries
  → GPU executes immediately
```

This is one reason PyTorch + CUDA feels so direct and interactive: the programming model is close to the runtime behavior.

## XLA + TPU: compilation over larger computation regions

The XLA + TPU style is different.

Instead of treating execution as a stream of isolated operations, it often treats execution as **compilation over larger computation regions**. Depending on the framework and configuration, this may be ahead-of-time or just-in-time.

A rough conceptual pipeline looks like this:

```text
Framework program
  ↓
trace / lower to XLA HLO
  ↓
PJRT runtime
  ↓
backend-specific compilation
  ↓
loaded executable
  ↓
runtime execution on device
```

### HLO and PJRT: the two key boundaries

**HLO** is the compiler IR.

It is valuable because it is:

- relatively framework-neutral
- high-level enough for graph optimization
- low-level enough to target hardware

**PJRT** is the runtime.

It gives a standard way to provide:

- device discovery
- executable loading
- buffer management
- execution

### Why PyTorch creates some friction here

PyTorch is naturally:

- eager
- dynamic
- mutable
- object- and state-oriented

The XLA + TPU style tends to prefer:

- graph capture
- stable shapes
- stable execution paths

So PyTorch is not the most natural philosophical fit for this model.

### Why JAX is a more natural fit

JAX more naturally encourages:

- functional style
- immutability
- explicit compilation through `jit`

So a short summary is:

- **JAX** is a philosophical fit for XLA + TPU
- **PyTorch/XLA** is a practical and commercially necessary compromise

That is a useful framing when trying to understand why XLA + TPU can feel elegant in JAX and more awkward in PyTorch/XLA.

### Why AWS Neuron likely chose this design

A backend like **AWS Neuron** has strong reasons to adapt the XLA + TPU style:

- it fits an ecosystem already used by JAX and PyTorch/XLA
- it allows one compiler and runtime stack to support multiple frameworks

A compact mental model for Neuron is:

```text
Framework program
  ↓
framework graph capture / tracing
  ↓
XLA HLO
  ↓
Neuron compiler (`neuronx-cc`)
  ↓
NEFF (compiled Neuron executable)
  ↓
Neuron Runtime (`libnrt.so`) loads and executes
```

#### The AWS Neuron runtime environment

On a Neuron-enabled system, the host environment typically contains a runtime/tooling stack under `/opt/aws/neuron`.

Typical binaries include:

- `neuron-ls` — enumerate Neuron devices and topology
- `neuron-monitor` — collect live runtime metrics
- `neuron-top` — top-like live monitor built on `neuron-monitor`
- `neuron-profile` — capture and analyze workload or device profiles
- `neuron-explorer` — inspect and view profiling output
- `neuron-bench` — benchmarking and reporting
- `neuron-dbg` — low-level device debugging
- `nccom-test` — communication and collectives testing
- `neuron-dump` — support-bundle or dump helper

Typical libraries include:

- `libnrt.so` — Neuron Runtime
- `libnccom.so` — Neuron collectives and communication
- `libndbg.so` — debug support
- `libncfw.so`
- `libnds.a`
- `libnrtucode_extisa.so`

Runtime API headers under `include/nrt/` typically include:

- `nrt.h`
- `nrt_async.h`
- `nrt_profile.h`
- `nrt_version.h`
- `nrt_status.h`

Driver and device headers under `include/ndl/` typically include:

- `ndl.h`
- `neuron_driver_shared.h`
- `neuron_driver_shared_tensor_batch_op.h`

