---
title: 'Paper Reading: Refinement Types'
date: 2023-03-19
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Type Systems](https://williamjbowman.com/teaching/2022/w2/cpsc539b/). The original paper can be found [here](https://arxiv.org/abs/2010.07763).

# Summary

This paper presents a clear and organized guide to refinement type systems by condensing the extensive literature on the topic and demonstrating the implementation of a refinement type checker. It first states the motivation for requirement types, a history of requirement types, and refinement logic, which is a logic system used in the proposed refinement type checker. The rest of the paper shows the implementation of a refinement type checker through a series of programming languages, beginning with simply-typed lambda calculus and incrementally adding additional features. This approach is influenced by the nanopass framework, which is used to teach compilation.

# Critique

Honestly, I have found the section on implementing a refinement type checker through a series of programming languages challenging to understand. Still, I have understood much of the paper before that. Therefore, I will summarize my gained insights and state questions that I have in mind.

## Insights

### Refinement Types as Subtypes

Type systems are the most commonly employed technique for ensuring the correct behavior of software. However, even well-typed programs can contain various bugs, such as buffer overflows, divisions by zero, logic bugs, and out-of-bounds array accesses. One approach to address this issue is to enhance a language's types with **subtypes that limit the range of valid values with predicates**, such as 'non-negative integer' from 'integer.' These subtypes are known as 'refinement types.' They enable developers to write precise contracts for valid inputs and outputs of functions and specify the correctness properties. This brings formal verification into mainstream software development.

### Refinement Logic and How it Maps to SMT Expressions

I was partically impressed by refinement logic, the logic system used in the proposed refinement type checker, as it is both expressive and easy to be verified using an SMT solver.

Refinement logic consists of two parts: predicates and constraints. 

Predicates are drawn from the quantifier-free fragment of linear arithmetic and uninterpreted functions (commonly used in SMT solvers), and may include boolean and integer literals, boolean and integer variables, arithmetic operators, boolean operators, comparisons, the 'if-then-else' expression, and uninterpreted functions (resembling those in `z3`).

Predicates are the building block of constraints, which are generated from refinement type checking. A constraint is either a predicate, an implication $\forall t: T \: p \Rightarrow c$ which states that for each term $t$ of type $T$, if the predicate $p$ holds then another constraint $c$ must be true, or a conjunction of two other constraints.

Constraints can be verified by **checking whether there is no satisfying assignment for the negated constraint**. In this process, they can be converted into SMT expressions in a straightforward way. 

For example, the constraint presented in the paper

$$c = \forall x: array \: 0 \le length(x) \Rightarrow \forall n: int \: n = length(x) \Rightarrow \forall i: int \: i = n - 1 \Rightarrow 0 \le i \land i < length(x)$$

can be negated as follows:

$$\neg c$$

$$\neg (\forall x: array \: 0 \le length(x) \Rightarrow \forall n: int \: n = length(x) \Rightarrow \forall i: int \: i = n - 1 \Rightarrow 0 \le i \land i < length(x))$$

$$\exists x: array \: 0 \le length(x) \land \neg (\forall n: int \: n = length(x) \Rightarrow \forall i: int \: i = n - 1 \Rightarrow 0 \le i \land i < length(x))$$

$$\exists x: array \: 0 \le length(x) \land \exists n: int \: n = length(x) \land \neg (\forall i: int \: i = n - 1 \Rightarrow 0 \le i \land i < length(x))$$

$$\exists x: array \: 0 \le length(x) \land \exists n: int \: n = length(x) \land \exists i: int \: i = n - 1 \land \neg (0 \le i \land i < length(x))$$

$$\exists x: array \: 0 \le length(x) \land \exists n: int \: n = length(x) \land \exists i: int \: i = n - 1 \land (0 > i \lor i \ge length(x))$$

We can verify the negated constraint using an SMT solver:

```python
In [1]: import z3

In [2]: L = z3.Int('L')

In [3]: n = z3.Int('n')

In [4]: i = z3.Int('i')

In [5]: solver = z3.Solver()

In [6]: solver.add(0 <= L)

In [7]: solver.add(n == L)

In [8]: solver.add(i == n - 1)

In [9]: solver.add(z3.Or(i < 0, i > L))

In [10]: check_sat_result = solver.check()

In [11]: check_sat_result
Out[11]: sat

In [12]: model_ref = solver.model()

In [13]: model_ref
Out[13]: [i = -1, L = 0, n = 0]
```

Note that `check_sat_result` is `sat` and we can find a satisfying assignment for $\neg c$: $i = -1, length(x) = 0, n = 0$. This means that the original constraint $c$ is invalid.

## Questions

Although the concept of refinement types is neat, what is the burden on programmers of writing refinement types that describe legal inputs and outputs of functions? This is a critical aspect to determine whether refinement types can bring formal verification into mainstream software development.

Furthermore, constraints in the proposed refinement logic generated by the refinement type checker can be negated and converted into SMT expressions. However, what is the feasibility of doing such checking for large-scale programs? Would it become unscalable?
