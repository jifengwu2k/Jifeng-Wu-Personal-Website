---
title: >-
  Paper Reading: Lightweight Verification of Array Indexing
date: 2022-11-16
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Automated Testing, Bug Detection, and Program Analysis](https://www.carolemieux.com/teaching/CPSC539L_2022w1.html). The original paper can be found [here](https://doi.org/10.1145/3213846.3213849).

# Summary of the Paper

The authors propose a methodology to detect out-of-bound array accesses statically. They first define that criteria that ideal techniques for detecting out-of-bound array accesses should satisfy, before analyzing the insufficiency of existing academic and industrial approaches, and presenting their own approach, Index Checker, implemented for Java.

Index Checker reduces checking array bonds to identifying 7 kinds of knowledge, which concern array index and array length, and form a hierarchy. It models such hierarchical knowledge as a Type System, requires the user to write "Type" Annotations at procedure boundaries, and verifies that values have the given "Type" at runtime. This is implemented using Checker Framework, an "industrial-strength, open-source tool for building Java type systems".

The authors evaluate Index Checker on 3 large-scale, well-tested Java projects (Google Guava, JFreeChart, Plume-lib), and compare Index Checker with 3 other approaches (FindBugs, KeY, and Clousot), proving the effectiveness of Index Checker (scalability, finding bugs in well-tested programs, and low false positive rate). They also assess the burden of writing type annotations for Index Checker.

# Questions

- What is the rationale behind the 7 kinds of knowledge concerning array index and array length proposed in the paper?
- I am not very familiar with Type Theory, which may have impeded my understanding of the value of the paper. What are the benefits of using Type Systems and Type Inference, and using Type Annotations to capture known constraints? Is it just to leverage the power of Checker Framework, an "industrial-strength, open-source tool for building Java type systems", for sound inference? Or are there any further benefits?
- No matter what the benefits are, from this paper, modeling hierarchical knowledge as a Type System, using Type Annotations to capture known constraints, and using Type Inference to verify such constraints sounds like a very innovative technique with many potential use cases. Have there been any other applications of such a technique?

------

# Feedback from the Class Discussion

The hierarchy of knowledge is derived from Exploratory Data Analysis (trying stuff until it works, see Section 2.8).

"Subtype" is a kind of Comparable Partial Ordering ('<'). The Types in the Bottom have more information, while the Types in the Top have less information.

In Java, aside from Inheritance, another form of Subtyping is Function Subtyping. e.g. Comparator (to compare two Dog's we can pass a function that compares two Animal's) the inputs can be more general types.

Rules define what to do when a Pattern is encountered; however, it takes a (nontrivial) search to determine the order to apply the rules.

Fixed Point: Convergence of Information.

Reach a Fixed Point: Iterate until Convergence.

The Paper uses Subtyping to implement Widening.
