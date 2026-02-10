---
title: 'Paper Reading: Finding and Understanding Bugs in C Compilers'
date: 2022-09-24
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Automated Testing, Bug Detection, and Program Analysis](https://www.carolemieux.com/teaching/CPSC539L_2022w1.html). The original paper can be found [here](https://doi.org/10.1145/1993316.1993532).

## What is the problem being tackled?

Finding compiler bugs, especially bugs in the "middle end" of a compiler that performs transformations on an intermediate representation, to improve the quality of C compilers.

## How was it addressed by prior work?

Compilers have been tested using randomized methods for nearly 50 years.

In 1998, McKeeman coined the term "differential testing". His work resulted in DDT, a family of program generators that conform to the C standard at various levels. However, DDT avoided only a small subset of all undefined behaviors, and only then during test-case reduction, not during normal testing. Thus, it is not a suitable basis for automatic bug-finding.

Lindig used randomly generated C programs to find several compiler bugs related to calling conventions. His tests are self-checking, but far less expressive than Csmith.

Sheridan also used a random generator to find bugs in C compilers. Sheridan's tool produces self-checking tests. However, it is less expressive than Csmith and it fails to avoid undefined behavior such as signed overflow.

Zhao et al. created an automated program generator for testing an embedded C++ compiler, which allows a general test requirement, such as which optimization to test, to be specified.

## What are the innovation(s) proposed in this paper?

The paper proposes Csmith, a randomized test-case generation tool which generates programs that cover a large subset of C while avoiding the undefined and unspecified behaviors that would destroy its ability to automatically find wrong-code bugs. This advances the state of the art in compiler testing.

Csmith supports compiler bug-hunting using differential testing. Csmith generates a C program, a test harness then compiles the program using several compilers, runs the executables, and compares the outputs.

## How are those innovations evaluated? How does the paper's evaluation match with the proposed problem statement?

The authors conducted five experiments.

1. Finding and reporting bugs in a a variety of C compilers over a three-year period. They have found and reported more than 325 bugs in mainstream C compilers including GCC, LLVM, and commercial tools.
2. Compiling and running one million random programs using several years' worth of versions of GCC and LLVM, to understand how their robustness is evolving over time.
3. Evaluating Csmith's bug-finding power as a function of the size of the generated C programs.
4. Comparing Csmith's bug-finding power to that of four
previous random C program generators.
5. Investigating the effect of testing random programs on branch, function, and line coverage of the GCC and LLVM source code.

The experiments thoroughly evaluate and demonstrate Csmith's bug-finding power and provide guidelines for using Csmith to find bugs.

## Which technical innovations are most compelling to you?

Csmith uses randomized differential testing. This has the advantage that no oracle for test results is needed. It exploits the idea that if one has multiple, deterministic implementations of the same specification, all implementations must produce the same result from the same valid input. When two implementations produce different outputs, one of them must be faulty. Given three or more implementations, a tester can use voting to heuristically determine which implementations are wrong.

How Csmith designs the results used for differential testing is also worthwhile. A Csmith-generated program prints a value summarizing the computation performed by the program, which is implemented as a checksum of the program's non-pointer global variables at the end of the program's execution. Thus, if changing the compiler or compiler options causes the checksum emitted by a Csmith-generated program to change, a compiler bug has been found.

Also compelling are the mechanisms that Csmith uses to avoid generating C programs that execute undefined behaviors or depend on unspecified behaviors, including performing incremental pointer and dataflow analysis in the process of generating programs.

## What remains unclear after reading the paper? Are there any clarification questions whose answers would substantially change your opinion of the paper?

In the process of randomly generating programs, Csmith randomly selects an allowable production from its grammar for the current program point. To make the choice, it consults a probability table and a filter function specific to the current point: there is a table/filter pair for statements, another for expressions, and so on. The table assigns a probability to each of the alternatives, where the sum of the probabilities is one.

However, how this probability table is constructed and maintained, which obviously is critical to generating high-quality random programs, is not stated in the paper, and requires clarification.

## Do you forsee any barriers to the applicability of the technique proposed in the paper? If so, how could these barriers be overcome? Which problems remain unsolved after this paper?

The most important language features not currently supported by Csmith are strings, dynamic memory allocation, floating-point types, unions, recursion, and function pointers. These are language features that are ubiquitous in real-world programs, thus, not supporting them is a serious barrier to the applicability of Csmith. The authors plan to add some of these features to future versions of our tool.

Although Csmith-generated programs allowed discovering bugs missed by compilers' standard test suites, branch, function, and line coverage of the GCC and LLVM source code did not significantly improve compared to the compilers' existing test suites. 'Coverage-guided' fuzzing may represent a future direction of research to discover more bugs lurking in unvisited sections of compiler source code.

