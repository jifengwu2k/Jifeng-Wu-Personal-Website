---
title: "Schedules in Machine Learning Computation: What They Are and Who Needs to Know About Them"
date: 2026-05-03
categories:
  - "AI and Machine Learning"
tags:
  - "machine-learning"
  - "reference"
  - "systems"
  - "computer-architecture"
excerpt: "A schedule is the plan for how a computation is executed efficiently on hardware. This post maps out the schedule-specification spectrum across ML frameworks, explains who needs to care about scheduling, and why ML sometimes goes lower-level than mainstream software."
---

## What is a schedule

A **schedule** is the plan for **how** a computation is executed efficiently on hardware, as opposed to **what** the computation means mathematically.

- loop order
- tiling / blocking
- fusion
- vectorization
- parallelization
- memory placement
- GPU thread/block mapping

This matters because the same mathematical computation can have many implementations with very different performance.

## Different ML frameworks and how much they require schedule specification

Below is a practical spectrum.

### High-level tensor frameworks

The programmer usually specifies **no schedule directly**.

The user mostly writes:

- tensor ops
- module definitions
- training/inference logic

Scheduling decisions are left to:

- the framework
- backend compilers
- optimized libraries like cuBLAS and cuDNN

**Schedule burden on the programmer:** very low.

### ML compilers (JAX+XLA, TensorFlow+XLA, PyTorch compile paths)

The programmer still usually does **not explicitly write the schedule**, but they do need to write code that compiles well. That means understanding things like:

- fusion-friendly expression style
- avoiding patterns that trigger recompilation
- avoiding graph breaks
- being aware of shape and layout effects

The schedule is still mostly chosen by the compiler.

**Schedule burden on the programmer:** low to moderate, mostly indirect.

### Halide / TVM style systems

These may let the programmer explicitly control the schedule.

The programmer can specify or tune:

- tiling
- loop order
- placement of intermediate computations
- vectorization / parallelization
- GPU mapping

This is a much more direct engagement with scheduling.

**Schedule burden on the programmer:** moderate to high, depending on use.

### Triton
Triton does not always call it "schedule," but the programmer is effectively writing many schedule decisions directly into the kernel.

The programmer often controls:

- tile/block sizes
- memory access pattern
- reduction structure
- mapping of work to program instances
- autotuning search space

**Schedule burden on the programmer:** high for kernel authors, but only if writing custom kernels.

### CUDA C++

CUDA gives the programmer the most explicit control.

The programmer directly manages:

- blocks and threads
- shared memory usage
- synchronization
- memory access strategy
- occupancy and register pressure tradeoffs

This is lower-level than Triton.

**Schedule burden on the programmer:** very high.

## How important is learning about schedules?

The answer depends on what kind of ML programmer you are.

### Ordinary ML user / researcher

Usually, deep knowledge of schedules is **not necessary**.

What matters more is:

- understanding the framework
- knowing how to express computations in compiler-friendly ways
- using optimized libraries and built-in kernels
- profiling bottlenecks

This is analogous to ordinary CPU programming, where most programmers care more about compiler flags and coding style than about assembly.

**Importance of schedule knowledge:** low.

### Performance-conscious ML engineer
Some schedule intuition is very useful, even if they do not write schedules directly.

Helpful concepts include:

- fusion reduces memory traffic
- layouts and shapes affect performance
- materializing intermediates can be expensive
- memory bandwidth often dominates
- not all mathematically equivalent code compiles equally well

This is analogous to knowing about cache locality and vectorization in CPU programming.

**Importance of schedule knowledge:** moderate, mainly conceptual.

### Compiler engineer / kernel author / Triton user

Deep schedule knowledge becomes very important.

They may need to reason directly about:

- loop transformations
- tiling
- memory hierarchy
- register pressure
- occupancy
- autotuning
- code generation tradeoffs

This is analogous to compiler engineering, SIMD kernel writing, or assembly-level optimization in CPU land.

**Importance of schedule knowledge:** high to essential.

## Why ML sometimes goes lower-level than mainstream software

A natural question is: if most ordinary software developers do not write assembly, why is low-level kernel work more visible in ML?

The main reason is that ML is a domain where a small number of numeric kernels often dominate total runtime, while the abstractions, hardware mappings, and model patterns are still evolving quickly.

### Why most software engineers do not write assembly

In mainstream software:

- common workloads are relatively stable
- compilers are mature
- standard libraries are strong
- performance bottlenecks are often spread across I/O, networking, databases, and application logic
- portability and maintainability usually matter more than squeezing the last bit of performance from one loop

Even when low-level optimization matters, it is usually hidden inside mature libraries such as:

- BLAS
- compression libraries
- crypto libraries
- media codecs
- database engines

So ordinary programmers can stay at a high level.

### Why ML more often exposes low-level concerns

In ML:

- a small number of kernels may dominate runtime
- model architectures evolve quickly
- hardware features evolve quickly
- compiler support is improving but not always sufficient
- optimized libraries do not always cover new model variants

As a result, ML developers more often fall off the standard-library happy path and need custom kernels.

### Important clarification

This does **not** mean that most ML practitioners write Triton or CUDA.
In fact, most do not.

Most ML users stay at the framework level, just as most software engineers stay far above assembly.

The lower-level work is done by specialists:

- kernel authors
- compiler engineers
- inference/runtime teams
- performance-focused infrastructure teams

### Better analogy

The right analogy is usually:

- ordinary software engineer ↔ ordinary ML practitioner
- compiler/runtime/library engineer ↔ ML compiler/kernel systems engineer

So the ecosystems are not completely different. The difference is that ML currently has more visible pressure on the performance-critical substrate because:

- the hot loops are more dominant
- the workloads are more algebraic and hardware-sensitive
- the abstractions are less fully settled

### Practical consequence

ML today is in a phase where:

- high-level use is the norm for most users
- low-level optimization still delivers unusually large gains in some important cases
- the need for escape hatches like Triton remains higher than the need for assembly in ordinary software
