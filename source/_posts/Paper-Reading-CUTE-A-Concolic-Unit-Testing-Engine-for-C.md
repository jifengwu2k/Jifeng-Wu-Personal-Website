---
title: 'Paper Reading: CUTE: A Concolic Unit Testing Engine for C'
date: 2022-10-02
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Automated Testing, Bug Detection, and Program Analysis](https://www.carolemieux.com/teaching/CPSC539L_2022w1.html). The original paper can be found [here](https://doi.org/10.1145/1095430.1081750).

**NOTE: I believe the paper to be written very obscurely, so I will explain the ideas of the paper in my own words.**

# What is the problem being tackled? How was it addressed by prior work?

Unit testing is a method for modular testing of a program's functional behavior. Such testing requires specification of values for the inputs (or test inputs) to the unit. Manual specification of such values is labor intensive and cannot guarantee that all possible behaviors of the unit will be observed during the testing. 

Several techniques have been proposed to automatically generate values for the inputs.

- Randomly choose the values over the domain of potential inputs
  - Many values may lead to the same behavior and are redundant.
  - The probability of selecting inputs causing buggy behavior may be astronomically small.
- Symbolic Exection
  - Addresses the problem of redundant executions and increases test coverage
  - For large or complex units, it is intractable to maintain and solve the constraints required for test generation
- Incrementally generating test inputs by combining concrete and symbolic execution
  - During a concrete execution, a conjunction of symbolic constraints along the path of execution is generated. These constraints are modified and then solved to generate further test inputs to direct the program along alternative paths. If it is not feasible to solve, simply substitute random concrete values.
  - This problem is particularly complex for programs with dynamic data structures using pointer operations. Pointers may have aliases.

In this paper, we provide a method for representing and solving approximate pointer constraints to generate test inputs. Our method is thus applicable to a broad class of sequential programs.

# What are the innovation(s) proposed in this paper? Which technical innovations are most compelling to you?

We consider the execution of a function to be determined by **all the stack variables, global variables, and heap objects** it exercises.

- Only primitive types and pointer types are taken into consideration.
- For structures and arrays, each member is considered to be a separate variable.
- External OS services are not modelled.

We associate the following **properties** with each stack variable, global variable, and heap object.

- Concrete Value
- Symbolic Value
- Concrete Address
- Symbolic Address

The branches taken within an execution can be described with a predicate sequence called a **path constraint**.

- Each predicate is described using the aforementioned stack variables, global variables, and/or heap objects.
- Symbolic values are used when available, otherwise, concrete values are used.
- Predicates involving primitive types are of the form $a_1 x_1 + \dots + a_n x_n + c~R~0, R \in \{<, >, \le, \ge, =, \ne\}$, where $a_i, \dots, a_n, c$ are integer constants. (Essentially considers only linear combinations of primitive types)
- Predicates involving pointers are of the form $x~R~y$ or $x~R~NULL$, $R \in \{=, \ne\}$. (Essentially considers only being able to assign to a pointer NULL or another previously known address, and does not allow converting integers to pointers)

Running process of CUTE.

- while True:
  - Execute, in the process:
    - When **allocating** a stack variable, global variable, or heap object **without initialization** (incl. function parameters):
      - Modify "known stack variables, global variables, and heap objects" if needed.
      - If its concrete value has been stored, initialize it to its stored concrete value. Otherwise, generate a random concrete value for it.
      - Record its concrete value and concrete address.
    - When **allocating** a stack variable, global variable, or heap object **with initialization**:
      - Modify "known stack variables, global variables, and heap objects" if needed.
      - Record its concrete value and concrete address.
      - Record its symbolic value and symbolic address.
    - When **assigning** an existing stack variable, global variable, or heap object:
      - Update its concrete value.
      - Update its symbolic value.
    - When **taking a branch**, add a new predicate to the path constraint.
  - After execution, **negate the last predicate within the path constraint**, and **solve for the concrete values of "stack variables, global variables, and heap objects allocated without initialization"**. Update their recorded concrete values.
    - Solving optimizations:
      - Check if the last predicate is syntactically the negation of any preceding predicate
      - Identify and eliminate common arithmetic subconstraints.
      - Identify dependencies between predicates and exploit them. The path constraints from two consecutive concolic executions, $C$ and $C'$ differ only in a small number of predicates, and their respective solutions are similar. The solver collects all the predicates in C that are dependent on the negation of the last and solves for them. In practice, we have found that the size of this set is almost one eighth the size of $C$ on average.

- Generated random concrete values:
  - Primitive Type: random number
  - Pointer Type: NULL

We next consider **testing of functions that take data structures as inputs**. We want to test such functions with valid inputs only. There are two main approaches to obtaining valid inputs:

- Generating inputs with call sequences
- **Use the functions that check if an input is a valid data structure by solving them**, i.e., generating input for which they return true. Previous techniques include a search that uses purely concrete execution and a search that uses symbolic execution for primitive data but concrete values for pointers. CUTE, in contrast, uses symbolic execution for both primitive data and pointers. This allows it to solve these functions asymptotically faster than the fastest previous techniques.

# How are those innovations evaluated? How does the paper's evaluation match with the proposed problem statement?

We illustrate two case studies that show how CUTE can detect errors.

1. We applied CUTE to test its own data structures. Our goal in this case study was to detect memory leaks in addition to standard errors such as segmentation faults, assertion violation etc.
2. We also applied CUTE to unit test SGLIB version 1.0.1, a popular, open-source C library for generic data structures. We chose SGLIB as a case study primarily to measure the efficiency of CUTE. We found two bugs in SGLIB using CUTE.

The case studies showcase the power of CUTE's concolic unit testing approach, and match well with the proposed problem statement.

# What remains unclear after reading the paper? Are there any clarification questions whose answers would substantially change your opinion of the paper?

After execution, negate the last predicate within the path constraint, and solve for the concrete values of "stack variables, global variables, and heap objects allocated without initialization". A solving optimization that the author proposed is "identifing and eliminating common arithmetic subconstraints". However, how this is done is not explained.

# Which problems remain unsolved after this paper? Do you foresee any barriers to the applicability of the technique proposed in the paper?

- For structures and arrays, each member is considered to be a separate variable. Although this facilicates analysis, this could incur significant overhead and impede scalability.
- External OS services are not modelled. 
- Predicates involving primitive types are of the form $a_1 x_1 + \dots + a_n x_n + c~R~0, R \in \{<, >, \le, \ge, =, \ne\}$, where $a_i, \dots, a_n, c$ are integer constants. This essentially considers only linear combinations of primitive types.
- The author shows preference to using the technique of "using the functions that check if an input is a valid data structure by solving them" to solve the problem of testing of functions that take data structures as inputs. However, such an approach may be impossible for object-oriented languages such as C++, in which data structures are encapsulated in classes, and the logic of validness is enforced with the constructor and public methods of the classes.

