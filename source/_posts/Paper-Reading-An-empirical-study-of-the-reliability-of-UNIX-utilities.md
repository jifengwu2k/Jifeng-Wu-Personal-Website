---
title: 'Paper Reading: An empirical study of the reliability of UNIX utilities'
date: 2022-09-10
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Automated Testing, Bug Detection, and Program Analysis](https://www.carolemieux.com/teaching/CPSC539L_2022w1.html). The original paper can be found [here](https://doi.org/10.1145/96267.96279).

"An empirical study of the reliability of UNIX utilities" is the work that spawned research into the domain of software fuzzing. It proposes a technique later known as **random fuzzing**, testing the reliability of UNIX utilities by feeding them a stream of randomly generated characters and checking whether the program crashed with a core dump or hangs.

Although the technique is simple and is not a substitute for formal verification or testing, it is **inexpensive and easy to apply**. Its **effectiveness in identifying bugs and increasing overall system reliability** has been proven in many ways.

1. It crashed 25-33% of the utility programs considered to be "reliable" on each platform.
2. **It was able to find recurring security bugs resulting from bad programming practices that even the best static analysis tools have limited success in detecting**, including:
  - Accessing outside the bounds of a buffer
  - Dereferencing a null pointer
  - Unintentionally overwriting data or code
  - Ignoring return codes, especially error-indicating return codes
  - Faulty communication with subprocesses
  - Unintended interaction between modules
  - Improper error handling
  - Signed characters
  - Race conditions during signal handling
3. **Its relevance has remained strong over the years.** Subsequent studies using the same technique showed that similar problems also existed within other operating systems, such as Microsoft Windows. Even after thirty years, the utility programs in the modern Unix distributions of Linux, macOS, and FreeBSD are still crashing at a noticeable rate and not getting better, as evidenced in "The Relevance of Classic Fuzz Testing: Have We Solved This One?"

The contributions of this work is **multi-fold**.

1. As mentioned before, it proposed random fuzzing, an inexpensive, easy to apply, and time-proven way of finding security bugs which is complimentary with formal verification and testing.
2. It spawned research into the domain of software fuzzing. New fuzz tools usually take a gray- or white-box approach, diving deeper into a program's control flow, and they have been applied to many new contexts. However, they often require more advanced specification of the input and/or long execution times to explore the input and program control-flow space.
3. It provides revelations for software engineering: good design, good education, ongoing training, testing integrated into the development cycle, and most importantly, a culture that promotes and rewards reliability. 

Some personal thoughts after reading the paper.

1. **Given the source code of a program and an input, what is the mechanism through which the researchers determine the position where the program crashes and hangs when given the input?** This is mentioned in neither "An empirical study of the reliability of UNIX utilities" nor its sequel "The Relevance of Classic Fuzz Testing: Have We Solved This One?", but is of great practical value.
2. **There is a surprising number of security bugs stemming from language defects such as not checking array bounds and dereferencing null pointers, as well as ad-hoc, hacky solutions to recurring problems such as lexical analysis, syntax analysis, structured error handling, as well as graph algorithms including cycle detection, topological sort, etc.** Personally, this is not my style of coding. I make extensive a lot of "safe" language constructs such as null coalescing, heavily exploit performant and well-tested algorithms within standard libraries and widely-adapted third-party libraries (such as boost in C++ and networkx in Python), and use theoretically sound tools (such as automatically generated LALR parsers for syntax analysis) in software projects. **The efficiency, effectiveness, and practical value of these and other solutions, as well as how they can be improved, is an interesting question that comes to my mind after reading this paper.**

