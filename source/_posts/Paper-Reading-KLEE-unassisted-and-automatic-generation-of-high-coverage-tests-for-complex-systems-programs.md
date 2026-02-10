---
title: >-
  Paper Reading: KLEE: unassisted and automatic generation of high-coverage tests for complex
  systems programs
date: 2022-10-04
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Automated Testing, Bug Detection, and Program Analysis](https://www.carolemieux.com/teaching/CPSC539L_2022w1.html). The original paper can be found [here](https://www.usenix.org/legacy/event/osdi08/tech/full_papers/cadar/cadar.pdf).

# What is the problem being tackled? How was it addressed by prior work?

Many classes of errors are difficult to find without executing a piece of code. The importance of such testing, combined with the difficulty and poor performance of random and manual approaches, has led to much work in **using symbolic execution to automatically generate test inputs**.

It has been an open question whether the approach has any hope of consistently achieving high coverage on real applications, facing the challenges in handling code that interacts with the environment, and the exponential number of paths through code.

Traditional symbolic execution systems either cannot handle programs interacting with the environment or require a complete working model. More recent work in test generation does allow external interactions, but forces them to use entirely concrete procedure call arguments, which limits the behaviors they can explore.

For the path explosion problem, search strategies proposed in the past include Best First Search, Generational Search, and Hybrid Concolic Testing. Orthogonal to search heuristics, researchers have addressed the path explosion problem by testing paths compositionally, and by tracking the values read and written by the program.

# What are the innovation(s) proposed in this paper? Which technical innovations are most compelling to you?

KLEE interprets programs compiled to LLVM IR, and typically requires no source modification. It functions as a hybrid between an operating system for symbolic processes and an interpreter. Each symbolic process has a register file, stack, heap, program counter, and path condition. Unlike a normal process, storage locations for a symbolic process - registers, stack and heap objects - refer to expression trees instead of raw data values. The leaves of an expression are symbolic variables or constants, and the interior nodes come from LLVM IR operations.

Conditional branches take a boolean expression and alter the instruction pointer of the symbolic process based on whether the condition is true or false. KLEE queries the constraint solver to determine if the branch condition is either provably true or false along the current path. If so, the instruction pointer is updated to the appropriate location. Otherwise, both branches are possible. KLEE forks the symbolic process so that it can explore both paths.

The number of forked symbolic processs grows quite quickly in practice. KLEE implements the heap as an immutable map, and portions of the heap structure itself can also be shared amongst multiple symbolic processs. Additionally, this heap structure can be forked in constant time, which is important given the frequency of this operation.

Potentially dangerous operations implicitly generate branches that check if any input value exists that could cause an error. For example, a division instruction generates a branch that checks for a zero divisor. If so, KLEE solves the current path's constraints to produce a test case that will follow the same path when rerun on an unmodified version of the checked program, and terminates the current symbolic process. KLEE will then continue execution on the false path, which adds the negation of the check as a constraint (e.g., making the divisor not zero).

The core of KLEE is an interpreter loop which selects a symbolic process to run and then symbolically executes a single instruction in the context of that symbolic process. Given more than one symbolic process, KLEE must pick which one to execute first. KLEE selects the symbolic process to run at each instruction by uses each strategy in a round robin fashion.
- Random Path Selection: Use a binary tree to record the program path followed for all active symbolic processs. A symbolic process is selected by traversing this tree from the root and randomly selecting the path to follow at branch points. This strategy has two important properties.
  - Favors symbolic processs high in the branch tree. They have less constraints on their symbolic inputs and have greater freedom to reach uncovered code.
  - Avoids starvation when some part of the program is rapidly creating new symbolic processs ("fork bombing") as it happens when a tight loop contains a symbolic condition.
- Coverage-Optimized Search: Select symbolic processs likely to cover new code in the immediate future using heuristics.

This loop continues until there are no symbolic processs remaining, or a user-defined timeout is reached.

KLEE ensures that a symbolic process which frequently executes expensive instructions will not dominate execution time by running each symbolic process for a "time slice" defined by both a maximum number of instructions and a maximum amount of time.

KLEE uses STP as its constraint solver. KLEE maps every memory object in the checked code to a distinct STP array. This representation dramatically improves performance since it lets STP ignore all arrays not referenced by a given expression. Furthermore, there are tricks to simplify expressions and ideally eliminate queries before they reach STP, including:

- Expression Rewriting
- Constraint Set Simplification
- Implied Value Concretization
- Constraint Independence
- Counter-example Cache: Redundant queries are frequent, and a simple cache is effective at eliminating a large number of them. However, it is possible to build a more sophisticated cache due to the particular structure of constraint sets. The counter-example cache maps sets of constraints to counter-examples (i.e., variable assignments), along with a special sentinel used when a set of constraints has no solution. **This mapping is stored in a custom data structure — derived from the UBTree structure of Hoffmann and Hoehler, which allows efficient searching for cache entries for both subsets and supersets of a constraint set.** By storing the cache in this fashion, the counter-example cache gains three additional ways to eliminate queries.
  - When a subset of a constraint set has no solution, then neither does the original constraint set.
  - When a superset of a constraint set has a solution, that solution also satisfies the original constraint set.
  - When a subset of a constraint set has a solution, it is likely that this is also a solution for the original set.

KLEE handles the environment by redirecting library calls to models that understand the semantics of the desired action well enough to generate the required constraints. The real environment can fail in unexpected ways. Such failures can often lead to unexpected and hard to diagnose bugs. To help catch such errors, KLEE will optionally simulate environmental failures by failing system calls in a controlled manner.

# How are those innovations evaluated? How does the paper's evaluation match with the proposed problem statement?

Four sets of experiments are conducted.

- We do intensive runs to both get high coverage and find bugs on Coreutils and BusyBox tools, do a comparision with random tests and developer test suites, and discuss the bugs found.
- To demonstrate KLEE's applicability to bug finding, we used KLEE to check all 279 BusyBox tools and 84 MINIX tools in a series of short runs.
- Thus far, we have focused on finding generic errors that do not require knowledge of a program's intended behavior. We now show how to do much deeper checking, including verifying full functional correctness on a finite set of explored paths. We use KLEE to find deep correctness errors by cross-checking purportedly equivalent Coreutils and BusyBox tool implementations.
- We have also applied KLEE to checking non-application code by using it to check the HiStar kernel.

We chose line coverage as reported by gcov as a conservative measure of KLEE-produced test case effectiveness, because it is widely-understood and uncontroversial.

The results of the experiments are very positive, and convincingly prove the proposed problem statement.

# What remains unclear after reading the paper? Are there any clarification questions whose answers would substantially change your opinion of the paper?

Coverage-Optimized Search tries to select symbolic processs likely to cover new code in the immediate future. It uses heuristics to compute a weight for each symbolic process and then randomly selects a symbolic process according to these weights. How these heuristics work, which is critical for performance, is not symbolic processd, and remains unclear.

KLEE ensures that a symbolic process which frequently executes expensive instructions will not dominate execution time by running each symbolic process for a "time slice" defined by both a maximum number of instructions and a maximum amount of time. Precisely how this "time slice" is calculated is also unclear.

KLEE handles the environment by redirecting library calls to models that understand the semantics of the desired action well enough to generate the required constraints. These models are written in normal C code which the user can readily customize, extend, or even replace without having to understand the internals of KLEE. However, what "understand the semantics of the desired action well enough" means is unclear.

# Which problems remain unsolved after this paper? Do you foresee any barriers to the applicability of the technique proposed in the paper?

KLEE does not currently support symbolic floating point, longjmp, threads, and assembly code. Additionally, memory objects
are required to have concrete sizes. These block KLEE's application towards floating point-heavy scientific computation and data science code, and may also limit KLEE to simple programming languages such as C, not supporting the numerous dynamics, including exception handling, within C++.

