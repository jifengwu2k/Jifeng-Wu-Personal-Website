---
title: "Jie Liu's B-Exam: Abstractions and Optimizations for Sparse Tensor Computation on Modern Hardware"
date: 2026-04-17
updated: 2026-04-17
categories:
  - "Research Notes"
tags:
  - "defense-summary"
  - "computer-architecture"
  - "machine-learning"
  - "llm"
excerpt: "A summary of Jie Liu's B-exam on sparse tensor computation, covering sparse format conversion, asynchronous GPU execution, and the design of high-performance BCSR/WCSR SpMM kernels."
---

On **April 17, 2026**, Jie Liu gave her **B-exam** over Zoom, titled **"Abstractions and Optimizations for Sparse Tensor Computation on Modern Hardware."**

The central theme of the presentation was simple but important: **specialization is unavoidable in sparse computing**, yet manually engineering every sparse format and every sparse kernel for every hardware target does not scale. Jie framed her dissertation around two complementary directions:

1. **format specialization**: a unified abstraction and compiler framework for representing, converting, and generating code for many sparse tensor formats; and
2. **hardware specialization**: a systematic study of how to map sparse matrix-matrix multiplication efficiently onto modern asynchronous GPU architectures.

## Why sparse tensor computation remains hard

Sparse tensors show up everywhere: graph learning, scientific computing, recommender systems, and LLM inference. But sparse workloads are fundamentally harder to optimize than dense ones.

A recurring point in the talk was that, as sparsity increases, the computation becomes increasingly **memory-bound** rather than compute-bound. Compared with dense GEMM, sparse matrix-matrix multiplication (SpMM) often has:

- worse memory locality,
- less contiguous access to the dense operand,
- less reuse across iterations,
- and more irregular control flow.

At the same time, the sparse computing world keeps fragmenting:

- many specialized sparse formats have been proposed,
- different hardware platforms prefer different regularities,
- and kernels that are good on one system may be awkward or inefficient on another.

This creates a dual challenge: we need both **better abstractions** for sparse formats and **better strategies** for mapping them onto specialized hardware.

## Contribution 1: UniSparse

The first major contribution was **UniSparse**, a unified abstraction for sparse tensor formats.

Jie motivated UniSparse by contrasting it with prior systems such as **TACO**, which use a small fixed attribute vocabulary to describe sparse formats. Her argument was that such attribute-based schemes are useful, but fundamentally limited: they cannot naturally express the full diversity of existing and emerging sparse formats.

The key design move in UniSparse is to **separate sparse formats into two dimensions**:

- **data structure**: how sparse tensor metadata and coordinates are logically represented, and
- **data layout**: how the data is physically arranged in memory.

This decomposition makes the abstraction substantially more expressive.

### Core ideas in UniSparse

From the talk, the important ingredients were:

- **index maps** for describing how indices in a dense tensor map to indices in a sparse representation,
- **metadata trees** for reasoning about hierarchical sparse structure,
- **layout choices** expressed via traversal order,
- and a small set of well-defined **mutation primitives**, especially operations such as **merge** and **trim**.

The conceptual payoff is that many formats that look unrelated at first can be described as variations in structure, layout, and metadata transformation.

### What UniSparse enables

UniSparse is not only a descriptive language. It is also intended to support automation.

According to the talk, the framework supports:

- expressing a broad range of custom sparse formats,
- representing custom index-map transformations,
- describing hybrid formats and alternative memory layouts,
- **automated format conversion**,
- and **kernel generation** through an MLIR-based compiler infrastructure.

Jie emphasized that the compiler can infer conversion sequences between source and target formats by using reversible operators plus a reachable reference representation. In other words, UniSparse is meant to bridge custom format design and actual compiler automation, instead of serving as a purely theoretical notation.

This is a strong systems contribution because it aims to reduce the amount of handwritten sparse-format-specific infrastructure that researchers and engineers typically have to maintain.

## Contribution 2: optimizing sparse kernels on GPUs

The second half of the talk shifted from abstraction to performance engineering.

Here the focus was on **SpMM on NVIDIA Hopper GPUs**, especially on how to exploit Hopper's asynchronous execution features for sparse workloads. Jie argued that recent GPU architectures expose powerful mechanisms designed largely with dense matrix multiplication in mind, but sparse kernels do not automatically benefit from them.

That observation led to a systematic optimization study.

### Starting point: sparse is not dense

A useful lesson from the talk was that many optimizations that work beautifully for dense GEMM do **not** transfer cleanly to sparse workloads. Sparse matrices introduce:

- irregular nonzero distributions,
- padding overhead,
- load imbalance,
- and weaker reuse patterns.

So even if the hardware offers mechanisms such as tensor cores, asynchronous memory movement, or cluster-level execution, the burden is still on the kernel designer to mine enough regularity from the sparse structure.

### Hopper-specific mechanisms

The talk examined several Hopper features in detail, especially:

- **WGMMA** (warp-group matrix multiply-accumulate),
- **TMA** (Tensor Memory Accelerator),
- **warp specialization** with producer-consumer pipelines,
- thread-block clusters,
- and persistent-kernel style scheduling.

The optimization story was progressive rather than magical.

1. A basic implementation was far from efficient.
2. Replacing scalar FMA with **WGMMA** brought a large speedup.
3. Moving data with **TMA** improved throughput further.
4. Using **warp specialization** and circular buffers allowed load and compute to overlap more effectively.
5. Some inter-SM ideas, such as multicast and persistent scheduling, were studied carefully but did not always help because sparse irregularity reintroduced synchronization overhead and load imbalance.

That last point was one of the most interesting aspects of the talk: **negative results were treated as first-class technical insight**. Jie did not present Hopper as a magic solution. Instead, she showed where the architecture helps, where it hurts, and why sparse workloads expose limitations that dense-kernel techniques can hide.

## BCSR and WCSR

A particularly concrete part of the presentation was the discussion of specialized sparse formats for GPU execution.

### BCSR

The talk first used **BCSR (Block Compressed Sparse Row)** as a structured format that matches tensor-core-style execution reasonably well. BCSR makes it easier to feed blocked sparse data into Hopper's matrix-multiply machinery, but it can also introduce padding overhead when the sparse structure is highly irregular.

### WCSR

To reduce that overhead, Jie introduced **WCSR (Window Compressed Sparse Row)**.

The motivation was that BCSR still stores redundant zero substructures in some cases. WCSR is more compact and improves load balancing by splitting work at a finer granularity. The trade-off is that it sacrifices some regularity:

- BCSR is friendlier to fully contiguous accesses and async mechanisms such as TMA,
- while WCSR is more compact and better balanced, but requires more indirect access for some operands.

This kind of trade-off analysis made the talk especially strong: the design space was not presented as a single universal winner, but as a careful balancing act between compactness, regularity, and hardware friendliness.

## Main reported results

Two headline results stood out.

### Sparse kernel performance

On **SuiteSparse** benchmarks, Jie reported that:

- the **WCSR** kernel outperformed prior SpMM kernels,
- reaching **1.47×** over **AccSpMM**,
- and **6.24×** over **cuSPARSE**.

The **BCSR** kernel also performed very strongly when sparsity patterns were favorable, especially at moderate density.

### End-to-end LLM impact

The talk also connected sparse kernel design to a concrete LLM use case.

Using **Qwen2.5-7B** in the prefill stage, Jie combined:

- sparse attention from prior work, and
- her sparse FFN acceleration using block sparsity.

The reported end-to-end gain was a combined **2.66× speedup** at **90% block sparsity** with **64K tokens** over a **cuDNN/cuBLAS** baseline.

This was an important part of the presentation because it showed that the work is not only about microbenchmarks or isolated kernels. It also has implications for real model-serving pipelines.

## Questions that shaped the discussion

The Q&A was strong and revealed what I thought were the most intellectually interesting edges of the work.

### 1. Can specialized sparse formats be discovered automatically?

One audience question asked whether formats such as those used for warp-specialized SpMM, TMA-based movement, or multicast-friendly layouts were designed manually, and whether they could eventually be discovered automatically.

Jie said the formats were designed manually, but that she later realized they could be expressed using UniSparse's format-preprocessing framework. She also suggested that an LLM-guided feedback loop might make future format exploration more automatic.

That answer was notable because it hints at a future research direction: **use a rich sparse-format IR not just to encode known formats, but to search over format design spaces.**

### 2. Is UniSparse a library, or a portability layer?

Another question asked whether UniSparse should be thought of as a standalone sparse library, or more as an integration layer across libraries and backends.

Jie's answer clarified that UniSparse separates:

- **format conversion**, implemented through conversion operators lowered to linked function calls, and
- **kernel generation**, where existing lowering passes are reused or external implementations are linked.

So at least in its current form, UniSparse is not simply a drop-in universal wrapper. It is better understood as a **compiler and IR framework** that could, with additional engineering, become a useful integration layer for other sparse libraries.

### 3. Is Hopper really good for sparse workloads?

One of the best questions challenged the premise of the second half of the talk: if Hopper's features are mostly built for dense matrix multiplication, and sparse kernels still remain well below the roofline at high sparsity, should we conclude that Hopper is not really a good fit for sparse workloads?

Jie's answer was nuanced.

She did **not** claim that Hopper is ideal for sparse workloads. Instead, she emphasized that:

- GPUs remain the most mature widely available high-performance platform,
- sparse workloads are intrinsically more irregular than dense ones,
- and comparing a general-purpose GPU against a hypothetical sparse-specific accelerator is not always the most useful baseline.

In other words, Hopper is not the perfect sparse machine, but it is still the most practical and relevant platform for serious sparse-kernel work today.

### 4. What should NVIDIA change to make SpMM truly first-class?

Another memorable exchange asked what GPU designers should change if they wanted to make sparse matrix multiplication a first-class workload rather than something adapted from dense-math machinery.

Jie's answer suggested that the current sparse tensor core model is still too rigid, because it assumes specific structured sparsity patterns and often falls back on padding. Her instinct was that a truly better solution would likely require **more dedicated sparse-oriented hardware support**, rather than merely repurposing dense tensor cores.

That answer nicely captured a broader lesson from the whole talk: a lot of current sparse acceleration is still about forcing irregular computations into regular hardware templates.
