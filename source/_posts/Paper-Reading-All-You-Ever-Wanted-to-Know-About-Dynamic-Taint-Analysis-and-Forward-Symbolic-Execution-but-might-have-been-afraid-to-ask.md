---
title: >-
  Paper Reading: All You Ever Wanted to Know About Dynamic Taint Analysis and
  Forward Symbolic Execution (but might have been afraid to ask)
date: 2022-10-25
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Automated Testing, Bug Detection, and Program Analysis](https://www.carolemieux.com/teaching/CPSC539L_2022w1.html). The original paper can be found [here](https://doi.org/10.1109/SP.2010.26).

Forward symbolic execution and dynamic taint analysis are quickly becoming "staple techniques in security analyses". 

1. Dynamic taint analysis runs a program and observes which computations are affected by predefined taint sources such as user input.
2. Dynamic forward symbolic execution automatically builds a logical formula describing a program execution path, which reduces the problem of reasoning about the execution to logic, allowing us to reason about the behavior of a program on many different inputs at one time.
3. The two analyses can be used in conjunction to build formulas representing only the parts of an execution that depend upon tainted values.

Forward symbolic execution:

1. Test Case Generation (automatically generate inputs to test programs, generate inputs that cause two implementations of the same protocol to behave differently)
2. Automatic Input Filter Generation (input filters that detect and remove exploits from the input stream)

Cristian Cadar, Daniel Dunbar, and Dawson Engler. Klee: Unassisted and automatic generation of high-coverage tests for complex systems programs. In Proceedings of the USENIX Symposium on Operating System Design and Implementation, 2008.

Cristian Cadar, Vijay Ganesh, Peter Pawlowski, David Dill, and Dawson Engler. EXE: A system for automatically generating inputs of death using symbolic execution. In Proceedings of the ACM Conference on Computer and Communications Security, October 2006.

Patrice Godefroid, Nils Klarlund, and Koushik Sen. DART: Directed automated random testing. In Proceedings of the ACM Conference on Programming Language Design and Implementation, 2005.

Dynamic taint analysis:

1. Unknown Vulnerability Detection (misuses of user input)
2. Automatic Network Protocol Understanding. Dynamic taint analysis has been used to automatically understand the behavior of network protocols when given an implementation of the protocol.
3. Malware Analysis (analyze how information flows through a malware binary, explore trigger-based behavior, and detect emulators)

However, there has been little effort to formally define them and summarize critical issues that arise when applying these techniques in "typical security contexts".

The authors formalize the runtime semantics of dynamic taint analysis and forward symbolic execution by using SIMPIL (Simple Intermediate Language), which is "representative of internal representations used by compilers and is powerful enough to express typical languages".

------

Concepts:

- Statements: assignments, assertions, jumps, conditional jumps.
- Expressions: constants, variables, binary operators, unary operators, get_input.
- Execution state: the list of program statements, the current memory state, the current value for variables, the program counter, the current statement.

Notation:

- $\Sigma$: list of program statements
  - $\Sigma[v_1]$: statement at $pc = v_1$.
- $\mu$: memory state
  - $\mu[v_1]$: memory content at address $v_1$
- $\Delta$: register state (values of all variables)
  - $\Delta[x]$: value of variable $x$
  - $\Delta[x \leftarrow 10]$: setting the value of variable $x$ to 10
- $pc$: program counter.
- $\mu, \Delta \vdash e \Downarrow v$: Given memory state $\mu$ and register state $\Delta$, the value of expression $e$ is $v$.
- $\Sigma, \mu, \Delta, pc, EXPRESSION \rightsquigarrow \Sigma, \mu', \Delta', pc', {EXPRESSION}'$: Given list of program statements $\Sigma$, memory state $\mu$, register state $\Delta$, program counter $pc$, executing expression $EXPRESSION$ leads to new memory state $\mu'$, new register state $\Delta'$, new program counter $pc'$, and the next expression is ${EXPRESSION}'$.

Other high-level language constructs such as functions or scopes can be easily represented using these constructs.

------

Dynamic taint analysis tracks values in a program dependent on data derived from a "taint source" at runtime. As it is conducted at runtime, it can be expressed by extending SIMPIL.

Dynamic taint analysis is conducted in different ways (i.e., under different "taint policies") for different applications. The differences lie in "how new taint is introduced to a program", "how taint propagates as instructions execute", and "how taint is checked during execution". The author presents the example of the "tainted jump policy" for attack detection, points out several challenges it faces, and analyzes the proposed solutions.

- "Distinguishing between memory addresses and cells is not always appropriate". An alternative "tainted addresses policy" could be used, but this may also overtaint.
- Information flow can occur through control dependencies in addition to dataflow dependencies. This requires "reasoning about multiple paths", while pure dynamic taint analysis "executes on a single path at a time". Solutions include "supplementing dynamic analysis with static analysis" and "using heuristics".
- Taint is only added and never removed (i.e., "sanitized"), leading to the problem of "taint spread", reducing precision. Well-known constant functions (i.e. using XOR to zero out registers in x86 code) can be checked. In addition, we can consider the outputs of some functions like cryptographic hash functions as untainted, due to limited influence of input on output. This can be quantified (Newsome  et al.) to automatically recognize such cases. Furthermore, values can be untainted "if the program logic performs sanitization itself" (e.g., index bounds checking).


In conclusion, this paper is an useful introductory paper in forward symbolic execution and dynamic taint analysis, and I have mainly learned the following two things from the paper:

- The idea of formalizing runtime semantics using RISC-like bytecode
- An introduction to dynamic taint analysis - what it is, what it can do, and what challenges it faces

------

Feedback from the Class Discussion

- What is the difference between a statement and an expression? A statement can modify program state when it is executed, while an expression doesn't modify program state.
- In the formalism of SIMPIL, we determine which expression to evaluate by **pattern-matching the rule**.
- LLVM has a dataflow sanitization pass, which may be useful for implementing taint analysis.
- Dynamic program analysis only looks at a single path. If we are to **prove something about a program**, static program analysis would be a better direction.
