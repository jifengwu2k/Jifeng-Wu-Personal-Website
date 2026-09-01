---
title: "Memory Models and Forward-Progress Guarantees"
date: 2026-08-31
updated: 2026-08-31
categories:
  - "Systems"
tags:
  - "reference"
  - "systems"
  - "computer-architecture"
  - "programming-languages"
excerpt: "Memory models govern shared-memory visibility and ordering; forward-progress guarantees govern whether concurrent work can continue executing."
---

A **memory model** is a specification for how concurrent threads interact through shared memory. It defines the rules and guarantees around the visibility and ordering of reads and writes.

In a single-threaded program, execution appears strictly sequential. In a parallel program, the compiler and the processor may reorder instructions, cache values in registers or caches, and buffer writes. These optimizations are safe in isolation but can make multithreaded behavior unpredictable: one thread may not immediately observe a change made by another. The memory model says which reorderings are allowed and when a write becomes visible to other threads.

Three ideas are central:

- **Atomicity:** an operation—such as reading or writing a variable—completes as a single unit, so no other thread ever observes a half-completed result.
- **Visibility:** a change made by one thread becomes observable to other threads, typically through cache coherence and explicit synchronization.
- **Ordering:** the compiler or CPU is constrained from rearranging operations when their logical order matters.

## Forward-progress guarantees

Where the memory model says *what* a thread observes, a **progress model**—also called a **forward-progress guarantee**—says *whether* a thread keeps executing. It describes the hardware-level scheduling behavior that determines how processors and accelerators advance concurrent threads, tasks, or workgroups. Its purpose is to prevent permanent stalls caused by resource scheduling.

This is a liveness question. In concurrency theory:

- **Safety** means nothing bad happens—for example, no data race occurs.
- **Liveness** means something good eventually happens—for example, a thread finishes execution.

A progress guarantee is fundamentally a liveness guarantee. It does not replace correct synchronization, and it cannot resolve a logical deadlock in which two threads wait forever on each other. It matters when a thread is waiting for work that the hardware may fail to schedule.

### Common forward-progress levels

1. **Weak progress / no useful guarantee.** The hardware makes no promise that a waiting thread will resume while other tasks occupy the execution units. If thread A spins waiting for a flag set by thread B, and thread B is never scheduled, the system can hang indefinitely.

2. **Concurrent forward progress.** Every active thread eventually makes progress in finite time. Threads may be time-sliced onto the same resources, but a thread that waits on another is guaranteed that the other thread will eventually be scheduled. This resembles the goal of preemptive CPU scheduling.

3. **Parallel forward progress.** Waiting threads and the threads they depend on are guaranteed to be co-resident and to execute simultaneously on distinct execution units, so one thread's spin-wait cannot prevent another from running.

## Why this matters on GPUs

GPU execution makes progress assumptions especially important. A GPU has finite execution resources and schedules thread groups onto them. If one group occupies those resources while spin-waiting for another group that has not yet been scheduled, the second group may never run to satisfy the wait.

Historically, GPUs used tightly coupled SIMT execution, in which all threads in a warp executed instructions in lockstep. This created a hazard for locks: if one thread in a warp held a lock while other threads in the same warp spun waiting for it, the warp could stall. Because the warp executed a single instruction stream, the spinning threads kept issuing the spin-loop instruction while the lock holder was masked out and unable to release the lock.

Modern NVIDIA GPUs support Independent Thread Scheduling, which allows more flexibility within a warp. Nevertheless, correct GPU code must still use the documented synchronization primitives and should not assume that a waiting group can force another group to become resident.

When writing high-performance parallel code, both contracts matter. The **memory model** tells us how to publish and observe data safely. The **progress model** tells us whether the threads needed by that protocol can actually make forward progress. Together, they determine whether synchronization is both correct and live.
