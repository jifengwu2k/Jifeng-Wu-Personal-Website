---
title: >-
  Paper Reading: Efficient scalable thread-safety-violation detection: finding
  thousands of concurrency bugs during testing
date: 2022-11-27
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Automated Testing, Bug Detection, and Program Analysis](https://www.carolemieux.com/teaching/CPSC539L_2022w1.html). The original paper can be found [here](https://dl.acm.org/doi/10.1145/3341301.3359638).

This paper presents Thread Safety Violation Detection (TSVD), a tool that dynamically detects thread safety violations with low runtime overhead, and which is compatible with real-world, distributed-developed code employing different synchronization mechanisms. The tool frames thread safety violations as two methods, with one of them being a write operation, occurring concurrently. It infers thread safety violations using a very creative approach. First, it instruments the program and detects method calls that access objects behind thread-safety contracts. Later on, during the execution of the program, TSVD injects delays into threads with method calls accessing those objects and monitors whether another thread also accesses the same objects during the delay. As this may incur significant overhead, the tool uses two strategies to determine when to inject delays - keeping track of "near misses", where the two method calls of two threads occur within a time threshold apart from each other, and inferring "happens before" relations, to rule out two accesses which are causally related.

The tool was tested on 43000 .NET programs in Microsoft teams, and its bug-finding capability outperformed both existing tools and configuring TSVD to emulate the strategies of existing tools, which shows the feasibility of TSVD.

There are two questions that come to mind after reading this paper:

- How does the tool acquire the information on which methods are thread-unsafe?
- The approach the tool uses to infer thread safely - injecting delays and monitoring the behavior of other threads - sounds very interesting to me. Have there been any other applications of such an approach?
- What is the sensitivity of the relevant parameters used in TSVD to its effectiveness and efficiency? Is there any guide on how to properly adjust these parameters?

------

Feedback from the Class Discussion

The proposed approach can handle different concurrency models, such as:

- async
- task-based
- thread-based

But can it handle unstructured concurrency?

The approach generalizes data race for objects and data structures at the method-level (e.g. there cannot be two simultaneous calls to add() for a `List` class).

Using delays can handle many more cases than reasoning about thread scheduling. It is a "simple thing" which works for many cases (akin to fuzzing).

The approach requires manually specifying read and write APIs. Is it possible to create a semi-automatic approach starting from contracts labeled for standard library APIs?
