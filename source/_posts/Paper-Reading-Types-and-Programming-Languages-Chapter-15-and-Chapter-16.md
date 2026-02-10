---
title: >-
  Paper Reading: "Types and Programming Languages" Chapter 15 and Chapter 16
date: 2023-02-10
categories:
- ["Research Inspiration"]
---

# Summary

Chapter 15, "Subtyping," describes adding Subtyping with Functions and Records into Simply Typed Lambda Calculus. It formalizes the Subtype Relation as a collection of Inference Rules, verifies that verify that the Preservation and Progress Theorems of Simply Typed Lambda Calculus still apply, examines Ascription (or Casting) in the context of Subtyping, and proposes Subtyping Rules for Variants, Lists, References, and Arrays. Finally, it presents alternative Coercion Semantics for Subtyping. Chapter 16, "Metatheory of Subtyping," observes that the Subtyping Rules presented in the previous chapter are not syntax-directed and have overlapping conclusions, which impedes implementing a Typechecking Algorithm, and develops the Algorithmic Subtype Relation and the Algorithmic Typing Relation to address these problems.

# Critique

## Acquired Insights

I will first summarize the insights that I gained while reading these Chapters.

An empty Bottom Type is useful, both as a way of expressing that a Function is not intended to return and telling the Typechecker that the Term can be associated with any Type.

Implementing Ascription (Casting) in Subtyping is non-trivial, especially for Downcasting. As blindly following Type Assertions may lead to potentially serious consequences, the Compiler would need to insert a Runtime Type Check, essentially adding the Machinery for Typechecking to the Runtime System. This might incur a significant performance overhead.

Different from an Inheritance Based Class Hierarchy, which is a physical relationship between Types, Subtyping generally is more of a *logical relationship* between Types. For example, in the alternative Coercion Semantics for Subtyping, we can consider that `int` and `float`, two Types that do not inherit from one another, have a Subtyping Relation, as they can be converted to one another. In this case, the Subtyping Relation is compiled to Coercions at runtime (instructions physically converting an `int` to a `float`, or vice versa), which are much more efficient than virtual function calls frequently seen in an Inheritance Based Class Hierarchy.

## Background Knowledge

There is no doubt that the Chapters are written in great detail. However, I find some of the content, especially the terminology, a little difficult to understand, and I have looked into background knowledge concerning the topic. Below summarizes what I have read.

### Polymorphism

Polymorphism describes that a single Interface can work with Terms of Different Types in Programming Languages. There are different kinds of Polymorphism in the context of Programming Languages, including:

#### Parametric Polymorphism

Also known as "Generic Programming". Using Abstract Symbols that can substitute for any Type instead of specifying Concrete Types in Interfaces. C++'s Template Metaprogramming comes close to Parametric Polymorphism (except for Template Specializations).

#### Ad Hoc Polymorphism

Defining a Common Interface for a Set of Individually Specified Types. Includes Function Overloading, Operator Overloading, and C++'s Template Metaprogramming with Template Specializations.

#### Subtyping 

It is a form of Polymorphism in which the Terms of a Subtype `T`, which is related to another Type known as the Supertype `T'` in some way, can be safely used in any Context where the Terms of `T'` are used.

The Concept of Subtyping has gained visibility with the advent of Object Oriented Programming Languages, where it is frequently the case that an Inheritance Based Class Hierarchy forms the basis of Subtyping, and such Safe Substitution is known as the Liskov Substitution Principle.

However, stepping out of this specific and widely known context, there are several different Schemes of Subtyping. They can be broadly classified along two dimensions: Nominal Subtyping vs. Structural Subtyping and Inclusive Implementations vs. Coercive Implementations.

Nominal Subtyping requires the Subtyping Relation to be explicitly declared among the two Types. This is the case with the Subtyping based on an Inheritance Based Class Hierarchy frequently encountered in Object Oriented Programming Languages. In contrast, in Structural Subtyping, a Type `T` is **implicitly** the Subtype of another Type `T'` if Terms of `T` has all the Properties of Terms of `T'` and can handle all the Messages Terms of `T'` can handle. This is closely related to Row Polymorphism or the so-called Duck Typing in Dynamically Typed Programming Languages.

On another dimension, Implementations of Subtyping can be divided into Inclusive Implementations and Coercive Implementations. In Inclusive Implementations, any Term of a Subtype, left unchanged, is **automatically** a Term of a Supertype. This is often the case with the Subtyping based on an Inheritance Based Class Hierarchy frequently encountered in Object Oriented Programming Languages. A Term can have multiple Types in this situation. In contrast, Coercive Implementations are defined by **Type Conversion Functions** from Subtype to Supertype and allow a Term of a Subtype to be **converted** to a Term of a Supertype, such as the case for `int`'s, `float`'s, and `str`'s. It is also worth noticing that applying the Type Coercion Function from `A` to `B` and then from `B` to `C` might have a different result from directly applying the Type Coercion Function from `A` to `C`. For example, `str(float(2))` returns a value different from `str(2)`.

Based on the concept of Subtyping, the concept of Variance reference to how the Subtyping Relations between more complex Types relates to the Subtyping Relations between the simpler Types they include. For example, given that `Cat` is a Subtype of `Animal`, should a List of `Cat`'s be a Subtype of a List of `Animal`'s? What about a Function that takes a Term of Type `Cat` as an Arugument and a Function that takes a Term of Type `Animal` as an Arugument?

Different Programming Languages have different implementations, but most Programming Languages respect the following patterns.

- If the Complex Types are **Read Only and/or capable of returning Terms of the Simple Types**, they should have the **same** Subtyping Relations as the Simple Types. This is known as **Covariance**. For example,
  - A read-only List of `Cat`'s can be used whenever a read-only List of `Animal`'s is required, as each Term read from the read-only List of `Cat`'s is of Type `Cat`, which is a Subtype of `Animal`. In other words, `const List<Cat>` *is* a Subtype of `const List<Animal>`.
  - It is not safe to use a `const List<Animal>` where a `const List<Cat>` is required, as a Term read from a `const List<Animal>` may not be of Type `Cat`. In other words, `const List<Animal>` *is not* a Subtype of `const List<Cat>`.
- If the Complex Types are **Write Only and/or capable of accepting Terms of the Simple Types as Parameters**, they should have the **opposite** Subtyping Relations as the Simple Types. This is known as **Contravariance**. For example,
  - A Function that takes a Term of Type `Animal` as a Parameter may be used where a Function that takes a Term of Type `Cat` as a Parameter is used, as each Term of Type `Cat` can also be passed as a Parameter of Type `Animal`. In other words, `Animal -> T` *is* a Subtype of `Cat -> T`.
  - It is not safe to use a `Cat -> T` where an `Animal -> T` is required, as a Term of Type `Animal` may not be passed as a Parameter of Type `Cat`. In other words, `Cat -> T` *is not* a Subtype of `Animal -> T`.
- If the Complex Types are **Read/Write**, they should have **no** Subtying Relations. This is known as **Invariance**. For example,
  - A Term written into a `List<Animal>` need not be of Type `Cat`, but a Term written into a (non-constant) `List<Cat>` *must* be of Type `Cat`. Thus, it is not safe to use a `List<Cat>` where a `List<Animal>` is required. In other words, `List<Cat>` *is not* a Subtype of `List<Animal>`.
  - A Term read from a (non-constant) `List<Animal>` may not be of Type `Cat`. Thus it is not safe to use a `List<Animal>` where a `List<Cat>`is required. In other words, `List<Animal>` *is not* a Subtype of `List<Cat>`.

### References

- https://en.wikipedia.org/wiki/Polymorphism_(computer_science)
- https://stackoverflow.com/questions/36948205/why-is-c-said-not-to-support-parametric-polymorphism
- https://en.wikipedia.org/wiki/Subtyping
- https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science)

Having acquired such Background Knowledge, I will also summarize the insights that I gained while reading these Chapters.

## Acquired Insights

An empty Bottom Type is useful, both as a way of expressing that a Function is not intended to return and telling the Typechecker that the Term can be associated with any Type.

Implementing Ascription (Casting) in Subtyping is non-trivial, especially for Downcasting. As blindly following Type Assertions may lead to potentially serious consequences, the Compiler would need to insert a Runtime Type Check, essentially adding the Machinery for Typechecking to the Runtime System. This might incur a significant performance overhead.

Different from an Inheritance Based Class Hierarchy, which is a physical relationship between Types, Subtyping generally is more of a *logical relationship* between Types. For example, in the alternative Coercion Semantics for Subtyping, we can consider that `int` and `float`, two Types that do not inherit from one another, have a Subtyping Relation, as they can be converted to one another. In this case, the Subtyping Relation is compiled to Coercions at runtime (instructions physically converting an `int` to a `float`, or vice versa), which are much more efficient than virtual function calls frequently seen in an Inheritance Based Class Hierarchy.
