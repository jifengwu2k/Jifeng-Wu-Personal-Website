---
title: "Uncompromising Performance with Exocompilation: A Recap of Yuka Ikarashi's Talk"
date: 2026-01-28
updated: 2026-01-28
categories:
  - "Computer Architecture, Operating Systems, Computer Networks, Distributed Systems"
tags:
  - Talks
excerpt: "In a recent talk, Yuka Ikarashi, creator of the Exo programming language, introduced Exocompilation, a philosophy and toolkit that rethinks how we optimize for cutting-edge hardware. Unlike traditional compilers, Exo doesn't hard-bake hardware backends and optimizations, but instead, treats them as extensible, safe user libraries."
---

Key Ideas from the Talk

- Modern CPUs, GPUs, TPUs, and matrix engines are evolving rapidly, and the *potential* peak performance of these accelerators is enormous. In practice, typical code delivers less than 1% of the available peak performance. Achieving state-of-the-art performance requires manual, architecture-specific optimizations. These hand-tuned kernels (like those in cuBLAS or MKL) are extremely intricate ("fast code is complex").
- In current compiler design, hardware backends and optimization strategies are embedded directly in the compiler ("baked in").
  - Conventional compilers either automate too aggressively (trading away performance) or force programmers to drop into low-level, architecture-specific code, sacrificing productivity, portability, and safety.
  - Domain experts have almost no way to customize or extend these strategies safely (short of forking the compiler).
- Performance engineers want fine-grained control. Compiler users want productivity and safety. However, Yuka pointed out that in industry, the primary metric of success is often just raw performance rather than language design or usability. Compiler innovations that improve usability but do not deliver top benchmark results are often ignored or discarded. This creates unique challenges for anyone trying to innovate in the compiler space.
- The Exocompilation Solution: Shifting Control to User Libraries
  - Exocompilation is all about *not* hardcoding compiler automation. Instead, optimizations are represented as libraries  - extensible and verifiable.
  - **User-Schedulable Performance**: With Exo, optimizations are performed as verified rewrites guaranteeing functional equivalence.
  - **Real-World Impact**: Exo-generated kernels already match or surpass established libraries (like cuBLAS or MKL), and are deployed in production on Apple devices.

Q&A: Industry Incentives vs. Entrepreneurship

During the Q&A, I asked Yuka about the constraint of industry standards:

> *Me*: Given the industry's incentive structure - where usability is often secondary to raw performance - have you thought about entrepreneurship outside the traditional industry establishment?

Yuka shared candidly:

> *Yuka*: Yes, I tried, but gave up. I think it's really hard to do a compiler startup.

We discussed the challenge: compilers per se are not commodities you can easily sell like hardware or services. Developers expect their compilers to be open-source and maintained over the long term.

I suggested a more vertically integrated approach:

> *Me*: Have you considered vertical integration, like starting a knitting company? 

(Referencing Yuka's own illustration of how scheduling applies, from high-performance computing to knitting machines!)

This resonated with Yuka:

> *Yuka*: Yes, that's actually something I'm very interested in.

Perhaps the lesson is that compiler innovations, to find a path out of the lab and into the world, might need to own the vertical and deliver an end product - whether that's machine learning, hardware, or even knitting!
