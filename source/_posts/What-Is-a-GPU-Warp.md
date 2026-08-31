---
title: What Is a GPU Warp? SIMT, Thread IDs, Divergence, and Synchronization
date: 2026-08-28
categories:
  - "AI and Machine Learning"
tags:
  - "reference"
  - "computer-architecture"
  - "systems"
  - "machine-learning"
excerpt: "A warp is a bundle of 32 threads that a GPU executes in lockstep under a single instruction. This post explains what a warp is, where the name comes from, how thread IDs and private registers let one shared instruction act on different data, what happens on warp divergence, and when threads in a warp share data or synchronize."
---

When you write a GPU kernel, you never mention a "warp" in your code. Yet the warp is the single most important concept for understanding *why* GPU code is fast or slow. This post walks through the idea from first principles: what a warp is, where the name comes from, what each thread inside one actually owns, how one shared instruction produces thirty-two different results, what happens when threads disagree on a branch, and when those threads need to talk to each other.

## 1. What is a warp?

A **warp** is the fundamental unit of execution on an NVIDIA GPU: a group of exactly **32 threads** that are bundled together and execute the **same instruction at the same time**.

A kernel launches thousands of individual threads, and the hardware groups them into warps of 32 behind the scenes. The warp — not the individual thread — is what the scheduler actually feeds to the GPU's cores. When a warp runs, the scheduler fetches one instruction and broadcasts it to all 32 threads at once; each thread performs that *same* operation, but applies it to its *own* piece of data.

The concept is not unique to NVIDIA. AMD's equivalent is the **wavefront**, traditionally 64 threads (newer RDNA architectures use 32). But "warp" is the name that stuck in the CUDA world, and it has a story behind it.

## 2. Why is it called a warp?

The name is a deliberate pun on **textile weaving**.

On a traditional loom, fabric is made from two sets of threads:

- **The warp** — a bundle of parallel threads held tightly in tension lengthwise across the loom.
- **The weft** — a single thread woven back and forth over and under the warp threads.

When NVIDIA introduced the concept in the CUDA architecture, they needed a word for a bundle of parallel computing "threads" grouped together and operated on simultaneously. The physical warp on a loom is *literally* a bundle of parallel threads constrained to move together, so the analogy was a perfect fit. In their foundational 2008 paper on the architecture, NVIDIA engineers explicitly noted the reference to weaving, jokingly calling it "the first parallel thread technology."

## 3. Each thread has a unique ID and its own registers

A warp steps through code in lockstep, but the 32 threads are not interchangeable. Two things make each thread distinct:

**A unique thread ID.** Every thread carries a hardware-assigned identity. In CUDA this is exposed through built-in variables like `threadIdx.x` — thread 0 knows it is 0, thread 1 knows it is 1, and so on.

**Private registers.** Every thread has its own dedicated set of registers to hold the specific piece of data it is working on. Thread 0's register 1 and Thread 7's register 1 are completely separate physical storage.

Together these two facts answer a question that confuses everyone at first: *if all threads execute the same instruction, how do they load different data?* The instruction is not an absolute command like "load address 100." It is a **formula** that uses the thread ID. The program supplies a base pointer shared by everyone; each thread then computes its own address:

```
address = base + threadIdx.x
```

So `Thread 0` loads `base + 0`, `Thread 1` loads `base + 1`, and so on up to `Thread 31`. It is like telling a row of people "take the paper directly in front of you" — one verbal command, but everyone picks up a different sheet because they stand in a different place.

Because all 32 threads are requesting *adjacent* data at once, the hardware can often bundle those requests into one large contiguous memory fetch. That optimization is called **memory coalescing**, and it is one of the biggest factors in GPU performance.

## 4. One shared instruction, thirty-two different actions

The same-instruction-different-data principle is not limited to loading. Because the instruction refers to *which registers to use* rather than *what values they hold*, almost every instruction produces a different outcome in each thread. A few categories stand out:

- **Arithmetic and logic.** An `add` broadcast to the warp uses the same operation everywhere, but each thread's registers hold different inputs, so every thread lands on a different result.
- **Control flow.** A comparison like "if my value is greater than 10, jump" is evaluated against each thread's own register. Thread 0 may want to jump while Thread 1 wants to skip — and that disagreement is exactly what causes divergence, the subject of the next section.
- **Warp shuffle.** Modern GPUs have instructions that let threads read directly from each other's registers. A "shuffle down" tells every thread to grab a value from the neighbor next to it; the instruction is identical, but each thread's lane position makes it reach to a different source.
- **Atomics.** If all 32 threads run `atomicAdd` on one shared counter, they cannot write simultaneously without corrupting it. The hardware intercepts the request and serializes the 32 operations into a queue, so the same instruction causes each thread to execute at a slightly different time and observe a different previous value.

In short: the instruction is a recipe, the thread ID and registers are the ingredients, and the dish comes out different on every lane.

## 5. Warp divergence

Because a warp shares a single instruction fetcher, the GPU *cannot* send half the threads down an `if` path and the other half down an `else` path at the same time. When threads disagree on a branch, the hardware resolves the conflict by **serializing** the two paths.

The process works like this:

1. The warp evaluates the condition. Each thread returns true or false based on its private data.
2. The scheduler builds an **active mask** — a 32-bit map of 1s and 0s. Threads that evaluated false are masked out and temporarily disabled.
3. The warp executes the `if` path. Masked threads sit completely idle, doing zero useful work.
4. The scheduler inverts the mask: the threads that just ran are put to sleep, and the idle threads wake up.
5. The warp executes the `else` path using only the newly awakened threads.
6. Both paths finish, the mask is cleared, and all 32 threads reconverge on the next shared instruction.

This is one of the biggest performance killers in GPU programming. In a 50/50 `if/else` split, the warp runs at roughly **50% efficiency**, because half the lanes are asleep at any moment, and the branch costs the *sum* of both paths' execution times. The worst case is a `switch` or deeply nested branch where all 32 threads take different routes: the warp must run 32 sequential paths, and its efficiency collapses toward **1/32 (about 3%)**.

Crucially, divergence is **logically invisible** — you write ordinary scalar `if/else` in your kernel, and the hardware handles the masking automatically, so your code still produces the correct answer. It is only **practically visible** in performance, which is why tools like NVIDIA Nsight Compute report a "branch efficiency" metric showing how many lanes were masked out. Programmers then reorganize data (sorting so a warp processes similar values, or replacing branches with arithmetic) to keep whole warps on one path.

## 6. Threads in a warp can share data and synchronize

Warps are not just a scheduling artifact — they are also the smallest scope at which threads can talk to each other directly, *without* round-tripping through memory.

The normal way for Thread 0 to hand a value to Thread 1 is through shared memory: write, wait, read. **Warp shuffle** instructions bypass that entirely, letting Thread 0 copy a value straight from its private register into Thread 1's register in a single step. This is the foundation of several common patterns:

- **Parallel reduction.** Summing 32 values is slow if one thread adds them sequentially. With shuffles, each thread passes a partial sum down the line, and a warp can reduce 32 numbers in a handful of hardware steps instead of 32.
- **Warp voting.** Instructions like `__any_sync` let threads ask a collective question — "did *anyone* find the target?" — and the hardware broadcasts the answer to all 32 lanes so they can exit a search loop early.
- **Broadcast.** One thread fetches a shared value and instantly distributes it to the whole warp, instead of 32 threads each issuing their own memory request.

Sharing data safely requires the threads to be **aligned in time**. If Thread 0 reads Thread 1's register before Thread 1 has finished computing the value, Thread 0 gets garbage. Historically this alignment was guaranteed for free. But starting with the Volta architecture, NVIDIA introduced **Independent Thread Scheduling**, which lets threads within a warp drift apart. As a result, programmers now insert an explicit **`__syncwarp()`** immediately before a shuffle or vote, forcing the 32 threads to catch up to the same line of code before they exchange data.

There is one sharp edge worth remembering: if you put a warp-level synchronization *inside* a divergent branch, you risk a **deadlock**. If half the warp is masked out and the other half waits for data from the sleeping lanes, the program freezes. This is the one place where divergence stops being an invisible performance issue and becomes a visible correctness bug.

