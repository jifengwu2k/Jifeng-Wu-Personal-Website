---
title: >-
  Paper Reading: Do Automatically Generated Unit Tests Find Real Faults? An
  Empirical Study of Effectiveness and Challenges
date: 2022-09-22
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Advanced Software Engineering](https://github.com/ubccpsc/507/tree/2022sept). The original paper can be found [here](https://doi.org/10.1109/ASE.2015.86).

# What were the primary contributions of the paper as the author sees it? How could this research be applied in practice?

The paper conducts an empirical study of the effectiveness and challenges of automatically generated unit tests at finding real faults, and derive insights to support the development of automated unit test generators that achieve a higher fault detection rate.

1. Improving the obtained code coverage so that faulty statements are executed in the first instance.
2. A high code coverage ratio does not necessarily indicate that the bug was covered. Improving the propagation of faulty program states to an observable output, coupled with the generation of more sensitive assertions, is also required.
3. Improving the simulation of the execution environment to detect faults that are dependent on external factors such as date and time.

# How was the work validated?

The authors applied three state-of-the art unit test generation tools for Java (Randoop, EvoSuite, and Agitar) to the 357 real faults in the Defects4J dataset and investigated how well the generated test suites perform at detecting these faults.

1. To account for randomness in test generation, we generated 10 test suites for each tool and fault.
2. Tools may generate flaky tests, which may also fail on the fixed version. They are automatically removed.
3.  Even if a test is not flaky, it might still fail on the buggy version for reasons unrelated to the actual fault. Such false positives are identified.
4. For each executed test, we collected information on whether it passed or failed, and the reason of failure.
5. In order to study how code coverage relates to fault detection, we measured statement coverage, and also bug coverage - whether a fault was 1) fully covered (all modified statements covered), 2) partially covered (some modified statements covered), or 3) not covered.

To gain insights on how to increase the fault detection rate of test generation tools, the authors did case studies on the challenges that prevent fault detection, and studied the root causes for flaky and false-positive tests.

# What were the main contributions of the paper as you (the reader) see it? How does the work apply to you? How could this research be extended?

The revelations from the case studies supporting the primary contributions of the paper as the author sees it are particularly important, as they identify specific challenges and provide plausible solutions for increasing the fault detection rate of test generation tools.

Creation of complex objects, such as a control flow graph, which often requires a certain sequence of prior method calls. Viable solutions include seeding objects observed at runtime, mining of common usage patterns of objects to guide object creation, or carving of complex object states from system tests.

Complex strings satisfying a certain syntax. Search-based tools are capable in principle of generating string inputs, but doing so can take very long. Symbolic approaches using string solvers or dedicated solvers for regular expressions are generally restricted to fixed length strings. If an input grammar is known, this can be used to generate test data more efficiently.

Complex conditions which randomly initialized inputs are unlikely to satisfy. Dynamic symbolic execution would not suffer from this problem.

Errors are not propagated. To some extent, this is the result of focusing on simple structural criteria such as branch coverage, rather than aiming to exercise more complex intra-class data flow dependencies.

Environmental dependencies and dependencies on the static state of the system under test resulting in flaky tests.

Aggressive mocking, which monitors and asserts on the internal state (e.g. the order of method calls) of the class under test, rather than testing the class on what its public method returns, and its side effects.

