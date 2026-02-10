---
title: >-
  Paper Reading: "Types and Programming Languages" Chapter 13 and Chapter 14
date: 2023-02-05
categories:
- ["Research Inspiration"]
---

# Summary

Chapters 13 and 14 of "Types and Programming Languages" discuss adding Impure Features, also known as Computational Effects, into Simply Typed Lambda Calculus. Specifically, Chapter 13 discusses adding References to Mutable Cells that can be Allocated, Dereferenced, and Assigned and formalizes their Operational Behavior. Chapter 14 gradually adds Raising and Handling Exceptions, starting from a Term `error` of any Type that completely aborts Evaluation when applied as a Function or passed as an Argument to a Function, before supporting Exception Handling, as well as Raising a Value (potentially containing information about what unusual thing happened) as an Exception.

# Critique

Overall, I believe these two Chapters are written very well, as they progressively add realistic features to Simply Typed Lambda Calculus. I will summarize takeaways from this paper before presenting some questions and comments.

## Takeaways From This Paper

### References to Mutable Cells

The Formalization of the Operational Behavior of References to Mutable Cells encompasses Allocations (providing an initial value to a Mutable Cell), Dereferences (reading the current value of the referenced Cell), and Assignments (changing the value stored in the referenced Cell), but not Deallocations. Explicit Deallocations lead to the Dangling Reference Problem, which undermines Type Safety. Instead, References to Mutable Cells that are no longer needed should be Garbage Collected.

An interpretation of how Aliasing makes Program Analysis tricky is that Aliasing essentially sets up "Implicit Communication Channels in the form of Shared State" between different parts of a Program.

To formalize the Operational Behavior of References to Mutable Cells, we can consider a Reference $l \in L$, where $L$ is the set of Locations of the Program's Store (a.k.a. Heap Memory) $\mu$.

As the result of Evaluating an Expression depends on the current contents of the Store and may cause Side Effects for the Store, Evaluation Rules should, in addition to Terms and Types, take the Store as an Argument and return a new Store as part of the result of Evaluating an Expression.

Furthermore, in a naive implementation of Typing Rules for References to Mutable Cells, the Type of the Reference depends on the Type of the Mutable Cell, e.g., $\frac{\Gamma \vdash \mu(l): T}{\Gamma \vdash l: \text{Ref} \: T}$. However, this is inefficient where there are multiple levels of Indirection and is problematic where there are Cyclic References. To solve this problem, the Chapter proposes extending Typing Rules with a Store Typing $\Sigma$, which maps every Location $l \in L$ to a fixed, definite Type. In this case, the Typing Rule is written as $\frac{\Gamma | \Sigma \vdash \Sigma(l): T}{\Gamma | \Sigma \vdash l: \text{Ref} \: T}$.

### Raising and Handling Exceptions

The first (and most straightforward) Approach to Raising and Handling Exceptions, a Term `error` that completely aborts Evaluation when applied as a Function or passed as an Argument to a Function, effectively simulates Unwinding the Call Stack when it propagates `error` to the top level.

The final approach that supports both Exception Handling and Raising a Value as an Exception considers an Exception to be a Value $t_{exp}$ of Type $T_{exp}$ (instead of a Term `error`). It proposes a Term Constructor `raise t_{exp}` that describes Raising a Value as an Exception, and models Exception Handling with `try t_1 with t_2: T_1`, in which $t_1: T_1$ and $t_2: T_{exp} \rightarrow T_1$ (i.e., $t_2$ is a function, called when an Exception is Raised, taking a Raised Exception as Input and Returning a Value of the same Type as $t_1$ as Output). 

## Questions and Comments

After reading these two Chapters, the power of Functions as a Universal Abstraction has left a deep impression on me. For example:

- Arrays containing Terms of Type $T$ can be modeled as References to Functions of type $Nat \rightarrow T$. The Referenced Function looks up the Element given an Index.
- Exception Handling is modeled with `try t_1 with t_2`, in which $t_2$ is a function called when an Exception is Raised, taking a Raised Exception as Input and Returning a Value of the same Type as $t_1$ as Output).

This describes complex Side Effects in a realistic Programming Language in a Side Effect Free manner that is clean and easy to reason about while not sacrificing Expressiveness. Are there any other complex Side Effects that can be modeled like this using Functions?
