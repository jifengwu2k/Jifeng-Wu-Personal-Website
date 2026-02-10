---
title: >-
  Paper Reading: "Types and Programming Languages" Chapter 22
date: 2023-02-26
categories:
- ["Research Inspiration"]
---

# Summary

Chapter 22 of "Types and Programming Languages" explores the problem of Type Reconstruction (Type Inference) or deriving Types for Unannotated Arguments of Lambda Abstractions. It first introduces Type Variables and Substitutions before formalizing the Type Reconstruction problem. Then, it points out that Type Reconstruction can be implemented using a Constraint Typing Algorithm or an Algorithm that calculates a Set of Constraints between Types involving Type Variables and records them for later consideration, and proves the Completeness and Soundness of Constraint Typing. Moreover, it introduces a Unification Algorithm to calculate Principle Solutions (most general solutions) to Constraint Sets. Finally, the Chapter presents how the Typing Rules for Let Expressions can be modified to support Let Polymorphism - allowing an Untyped Function to generate different Constraints, thus be able to be Reconstructed to Different Types when applied to Terms of different Types.

# Critique

Overall, Chapter 22 is clearly written, and several sections intrigued me (such as that Parametric Polymorphism and Type Reconstruction can result from two different interpretations of Dependent Types containing Type Variables). Moreover, this Chapter provides essential inspiration for my Class Project, "Inferring Feasible Types for the Parameters and Return Values of Python Functions." However, the Chapter also used some Concepts without introducing them (such as the Unification Problem), and I had to look into them to understand parts of the Chapter.

## Background Knowledge

### Completeness and Soundness of a Theory

Using $TRUE$ and $PROVABLE$ to represent the Set of Facts that are True and Provable under a Theory, respectively:

- Completeness: $TRUE \subseteq PROVABLE$ or every Fact that is True is also Provable (but there may be some Facts that are Provable but are not True).
- Soundness: $PROVABLE \subseteq TRUE$ or every Fact that is Provable is also True (but there may be some True Facts that are not Provable).
- Completeness and Soundness: $TRUE = PROVABLE$.

An ideal Theory should be both Complete and Sound.

### Unification Problem

Given two Terms containing some Variables, find a Substitution (an Assignment of Terms to Variables) that makes the two Terms equal.

For example, given $f(x_1, h(x_1), x_2) = f(g(x_3), x_4, x_3)$, a valid Substitution is $\sigma = \{g(x_3): x_1, x_3: x_2, h(g(x_3)): x_4\}$.

## Takeaways From This Paper

### Parametric Polymorphism and Type Reconstruction

Given Dependent Types containing Type Variables (often the result of the Programmer leaving out Type Annotations in Source Code), we can make one of the following assumptions.

- All Substitution Instances are well-typed. Thus, it is possible for Type Variables to be held abstract during Type Checking and only be Substituted for Concrete Types later on. This is the basis of Parametric Polymorphism.
- Not all Substitution Instances are well-typed. In this case, we want to look for *valid* Substitutions. This leads us to the problem of Type Reconstruction.

### Deriving Constraint Sets and Calculating Solutions to Them

To explore valid ways that Concrete Types can substitute Type Variables, we can calculate a Set of Constraints between Types involving Type Variables. This is similar to an ordinary Type Checking Algorithm checking Requirements in the Premise but records these Requirements as Constraints for later consideration instead of checking them immediately.

After we have generated a Constraint Set, we can use a Unification Algorithm to calculate Solutions to it. The Unification Algorithm proposed in the Chapter removes a Constraint from the Constraint Set, processes it, and recursively processes the remaining Constraint Set.

There is a most general way to instantiate the Type Variables. This is known as a Principle Solution, which contains Principle Types, or the most general types, for Type Variables.

## Inspirations From This Paper

This Paper points out a viable way to implement my Class Project "Inferring Feasible Types for the Parameters and Return Values of Python Functions."

- Propose Typing Rules for Python Expressions.
- Implement an Algorithm similar to an ordinary Type Checking Algorithm checking Requirements in the Premise, but which records these Requirements as Constraints for later consideration instead of checking them immediately.

## Questions

- What are the specific types of Constraints that are recorded when deriving Constraint Sets? What do the derived Constraint Sets look like?
- Implementing the Unification Algorithm proposed to calculate Solutions to the Constraint Set seems non-trivial. Are there any implementations of it for more "real-world" (imperative, non-ML Family) Programming Languages? What adjustments have to be made to accomplish such an implementation?
