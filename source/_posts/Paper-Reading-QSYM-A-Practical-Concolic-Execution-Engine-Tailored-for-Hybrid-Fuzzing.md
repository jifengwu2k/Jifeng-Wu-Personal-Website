---
title: >-
  Paper Reading: QSYM: A Practical Concolic Execution Engine Tailored for Hybrid Fuzzing
date: 2022-10-11
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Automated Testing, Bug Detection, and Program Analysis](https://www.carolemieux.com/teaching/CPSC539L_2022w1.html). The original paper can be found [here](https://www.usenix.org/system/files/conference/usenixsecurity18/sec18-yun.pdf).

# What is the problem being tackled? How was it addressed by prior work?

There are two notable technologies to automatically find vulnerabilities in software:

- Coverage-guided fuzzing, quickly explores the input space, but only good at discovering inputs leading to an execution path with loose branch conditions
- Concolic execution, good at finding inputs driving the program into tight and complex branch conditions, but very expensive to formulate and solve constraints

A hybrid approach, hybrid fuzzing, was recently proposed.

- The fuzzer will quickly explore trivial input spaces (loose conditions)
- The concolic execution will solve the complex branches (tight conditions)
- Still suffer from scaling to find real bugs in real-world applications. Bottlenecks are their concolic executors. The symbolic emulation is too slow in formulating path constraints, and it is often not even possible to generate constraints due to incomplete and erroneous environment models.

# What are the innovation(s) proposed in this paper? Which technical innovations are most compelling to you?

Concolic executors adopt IR in their symbolic emulation. Although IR makes implementation easy, it incurs additional overhead and  blocks further optimization. According to our measurement with real-world software, only 30% of instructions require symbolic execution. This implies an instruction-level approach has an opportunity to reduce the number of unnecessary symbolic executions.

Concolic execution engines use snapshot techniques to reduce the overhead of re-executing a target program when exploring its multiple paths. However, in hybrid fuzzing, test cases from the fuzzer are associated with greatly different paths, rendering snapshoting inefficient. Furthermore, snapshots cannot reflect external status, and solving this problem through full system concolic execution or external environment modeling is expensive and/or inaccurate.

Concolic execution tries to guarantee soundness by collecting complete constraints. However, this can be expensive, and also over-constrain a path, limiting finding future paths.

To solve these problems, Qsym uses Intel Pin along with a coverage-guided fuzzer:

- Get input test cases and validate newly produced test cases (potentially unsound) from the fuzzer.
- Employ instruction-level taint tracking, and only symbolically execute tainted instructions.
- Generate more relaxed (incomplete) forms of constraints that can be easily solved (can result in unsound test cases, but quickly checked with fuzzer).
- Fast execution makes re-execution much preferable to snapshoting for repetitive concolic testing.
- Considers external environments as "black-boxes" and simply executes them concretely (can result in unsound test cases, but quickly checked with fuzzer).
- Chooses the last constraint of a path for optimistic solving. It typically has a very simple form, and avoids solving irrelevant constraints repeatedly tested by fuzzers. **This can be applied to other domains to speed up symbolic execution, if the domain has an efficient validator like a fuzzer.**
- If a basic block has been executed too frequently in a context (a call stack of the current execution), Qsym stops generating further constraints from it. Extremely suitable for loops. **This can directly be applied to other concolic executors as a heuristic path exploration strategy.**

# How are those innovations evaluated? How does the paper's evaluation match with the proposed problem statement?

A series of experiments are conducted.

1. To highlight the effectiveness, we applied QSYM to non-trivial programs that are large in size and well-tested - all applications and libraries tested by OSS-Fuzz.
2. To show how effectively our concolic executor can assist a fuzzer in discovering new code paths, we measured the achieved code coverage during the fuzzing process using Qsym and AFM with a varying number of input seed files. We selected libpng as a fuzzing target because it contained various narrow-ranged checks.
3. To show the performance benefits of QSYM's symbolic emulation, we used the DARPA CGC dataset to compare QSYM with Driller, which placed third in the CGC competition.
4. To evaluate the effect of optimistic solving, we compared Qsym with others using the LAVA dataset, a test suite that injects hard-to-find bugs in Linux utilities to evaluate bug-finding techniques.
5. To show the effect of basic block pruning, we evaluated Qsym with and without this technique with four widely-used open-source programs - libjpeg, libpng, libtiff, and file.
6. The author then analyzes new bugs found by Qsym.

These experiments comprehensively assess different innovations and support the notion that Qsym "scales to find real bugs in real-world applications". However, I do have some questions concerning the experimental study, stated below.

# What remains unclear after reading the paper? Are there any clarification questions whose answers would substantially change your opinion of the paper?

Qsym generates more relaxed (incomplete) forms of constraints that can be easily solved. Specifically how this is done is not clear.

Questions concerning the experimental study:

1. The experiments "to highlight the effectiveness" and "to show the performance benefits of QSYM's symbolic emulation" seem to be redundant.
2. To show how effectively our concolic executor can assist a fuzzer in discovering new code paths, we compared Qsym with AFM on libpng, because it contained various narrow-ranged checks. The benchmark appears to be cherry-picked. This is also the case with "to show the effect of basic block pruning".
3. Why are completely different datasets used in different experiments?

# Which problems remain unsolved after this paper? Do you foresee any barriers to the applicability of the technique proposed in the paper?

The coverage-guided fuzzer used within Qsym is "vanilla" AFL. Other coverage-guided fuzzers exist that enhance AFL. How Qsym can complement these fuzzers can be a direction for future research.

Unlike other IR-based executors, QSYM cannot test programs targeting other architectures. We plan to overcome this limitation by improving QSYM to work with architecture specifications, rather than a specific architecture implementation. **(Is taint analysis on IR+JIT also a possible solution?)**

QSYM currently supports only memory, arithmetic, bitwise, and vector instructions. Other instructions, including floating-point operations, remain to be supported.

