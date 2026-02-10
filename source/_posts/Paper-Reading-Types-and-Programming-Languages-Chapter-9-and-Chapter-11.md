---
title: >-
  Paper Reading: "Types and Programming Languages" Chapter 9 and Chapter 11
date: 2023-01-25
categories:
- ["Research Inspiration"]
---

# Summary

Chapter 9 of "Types and Programming Languages" presents the simply typed lambda calculus, which constructs a type system for pure lambda calculus, explaining theoretical aspects such as the typing relation and the Curry-Howard Correspondence along the way.

Chapter 11 introduces simple extensions to the simply typed lambda calculus presented in Chapter 9, such as base types, derived forms, type ascriptions, let bindings, and some compound data structures (pairs, tuples, records, sums, variants, and lists), making it better resemble a real-world programming language.

# Critique

## Foreword

I have found the textbook hard to follow in many places. Thus, I have followed the textbook and looked into many online resources to grasp the content. Below summarizes my understanding after studying the material.

## Basic Concepts in Type Theory

### Terms and Types

In Type Theory, every Term has a Type, often written together as `<Term>: <Type>`. Types include Natural Numbers (`nat`) and Boolean Logic Values (`bool`). For example (assuming `x: nat` and `y: nat`):

- `0: nat`
- `x: nat`
- `1 + 1: nat`
- `x + y: nat`
- `true: bool`
- `x + y: nat`

### Functions

Functions are also Terms with Types, represented as Lambda Terms.

A Lambda Term looks like `(λ <First Parameter Name>: <First Parameter Type> <Second Parameter Name>: <Second Parameter Type> ... . <Term to Return>)`.

It has type `<First Parameter Type> → <Second Parameter Type> → ... → <Type of Term to Return>`. This indicates that the Lambda Term is a function that takes Parameters of `<First Parameter Type>`, `<Second Parameter Type>`, etc., and returns a Term of `<Type of Term to Return>`.

Examples of Lambda Terms:

- `(λ x: nat . (x + x)): nat → nat`: a Function which takes in a Parameter `x` of Type `nat` and returns the doubled Parameter.
- `(λ x: nat y: nat . (x + y)): nat → nat → nat`: a Function which takes in two Parameters `x`, `y` all of Type `nat` and returns their sum.

A Lambda Term is often called an Anonymous Function because it has no Name. We can use the notion to give a Name to a Lambda Term:

- `add: nat → nat → nat ::= (λ x: nat y: nat . (x + y))`

### Function Applications

In Type Theory, a Function Call is called a Function Application, which "takes a Term of a Type and results in a Term of another Type." Function Application is written as `<Function> <Argument> <Argument> ...` (akin to Function Calls in Haskell and Commands in Unix Shell) instead of the conventional `<Function>(<Argument>, <Argument>, ...)` in Programming Languages.

If we define a Function `add` that takes two `nat`'s and returns a `nat`, the following are valid Terms:

- `add 0 0: nat`
- `add 2 3: nat`
- `add 1 (add 1 (add 1 0)): nat`

### Dependent Typing

Sometimes, the Type returned by a Function depends on the Value of its Argument. This is known as Dependent Typing. 

For example, a function `if` takes three arguments, with `if true b c` returning `b`, and  `if false b c` returning `c`. If `b` and `c` have different Types, then the type of `if` depends on the value of `a`.

Dependent Typing is a reasonably complicated subject that is an active domain of research.

### Zero Type, Unit Type, and Universal Type

#### Zero Type

In some programming languages, there is a **Zero Type** or **Bottom Type** - a Type whose Set of Terms is the empty set and a Subtype of all other Types.

In these programming languages, denoting the Zero Type as a Function's Return Type frequently indicates that **the Function never returns (never completes computation) - instead, it may loop forever, throw an exception, or terminate the process**.

As a real-world example, in Rust, the Zero Type is called the Never Type and is denoted by !. It is the kind of calculation that never returns any result. For example, the exit function `fn exit(code: i32) -> !` terminates the process without returning.

#### Unit Type

In some programming languages, the **Unit Type** is a Type whose Set of Terms is a singleton set, i.e., the type allows only one value. **It is typically used to describe the Argument Type of a Function that doesn't need arguments or the Return Type of a Function whose only goal is to have a side effect.** For example:

- In Haskell, Rust, and Elm, the Unit Type is the Type of the 0-tuple `()`.
- In Python, the Unit Type is `NoneType`, which only has a single instance `None`.
- In JavaScript, both `Null` (which only has a single instance `null`) and `Undefined` (which only has a single instance `undefined`) are Unit Types.

In languages such as C, C++, Java, and C#, `void`, which designates that a Function accepts no Arguments or does not return anything, plays a similar role to the Unit Type. However, there are also key differences:

- There are no Terms (Instances) of `void`.
- A proper Unit Type may always be the Type of an Argument to a Function, but `void` cannot be the Type of an Argument.

#### Universal Type

Most object-oriented programming languages include a universal base class. In Type Theory, this is known as a **Universal Type** or a **Top Type**. Its Set of Terms encompasses any valid Term in the programming language, and all other types in the programming language are subtypes. For example:

- `Object` in Smalltalk and JavaScript
- `java.lang.Object` in Java
- `System.Object` in C#, Visual Basic .NET, and other .NET Framework languages
- `object` in Python (can also be type-annotated as `typing.Any`)
- `Any` in Scala and Julia

Some object-oriented programming languages, such as C++, Objective-C, and Swift, do not have a universal base class. In these languages, some constructs function similarly to the Universal Type.

- In C++, `void *` can accept any non-function pointer (even though `void` itself is more akin to the Unit Type).
- In Objective-C, `id` can accept pointers to any object.
- In Swift, the protocol `Any` can accept any type.

Languages that are not object-oriented usually do not have a Universal Type.

### Typing Context

A Typing Context (or Typing Environment) $\Gamma$ is a Mapping from Terms to Types (or a collection of Term - Type Pairs). The judgement $\Gamma \vdash e: \tau$ is read as "$e$ has type $\tau$ in Context $\Gamma$".

In Statically Typed Programming Languages, these Typing Contexts are used and maintained by Typing Rules to Type Check a given Program or Expression.

### Type Inhabitation

Given a Typing Environment, a Type is **inhabitated** if an existing Term of the Type is available or a Term of the Type can be readily obtained (i.e., via Function Application).

### Derived Forms

In Type Theory, Syntactic Sugar is known as **Derived Forms**, while replacing a Derived Form with its lower-level definition (usually during compile time) is known as **desugaring**. For example:

- In C, `a[i]` and `*(a + 1)`, `a->x` and `(*a).x`.
- In the tidyverse collection of R packages, `x %>% f(y)` is equivalent to `f(x, y)`.

A programming language is typically divided into a compact core language, **a rich set of syntax defined in terms of that core (Derived Forms)**, and a comprehensive standard library. This makes the language maintainable for engineers while making it convenient for users.

### Type Ascription

**Type Ascription** is an assertion within source code that a term has a particular type. This can lead to cleaner, easier-to-understand code documentation. 

## Important Derived Forms

- Tuple
- Record (Struct, Rows in a Database) - a collection of Fields, possibly of different Types
- Variant (Datatype, Tagged Union, Discriminated Union, Disjoint Union)
  - A data structure to hold a Term that could take on "several different, but fixed Types."
  - Contains a Value field and a Tag field
  - Widely used for defining recursive data structures (e.g. Trees containing Leaves and Internal Nodes)
- List

## Curry-Howard Correspondence

The Curry-Howard Correspondence, independently discovered by logicians Haskell Curry in 1958 and William Howard in 1969, states that "proofs in a given subset of mathematics are exactly programs from a particular programming language". Specifically,

- Types correspond to logical formulas.
  - A Term having a Type can be understood as evidence that the Type is inhabited. For example, `3110: int` is evidence that `int` is inhabited.
  - Logical Atoms $a$, $b$ correspond to whether Types `A`, `B` are inhabited.
    - `true` corresponds to a Type that is always inhabited. The simplest of them all is the Unit Type.
    - `false` corresponds to a Type that is never inhabited - the Zero Type.
  - Conjunction $a \land b$ corresponds to a Type inhabited when both Types `A` and `B` are inhabited - `Tuple[A, B]`.
  - Disjunction $a \lor b$ with the added condition that **you know which one of $a$, $b$ is true when $a \lor b$ is true** corresponds to a Type that is inhabited when one of `A`, `B` is inhabited, and you know which one is inhabited - `Variant[A, B]`.
  - Implication $a \rightarrow b$ corresponds to a Type that, when inhibited, ensures `B` must be inhabited when `A` is inhabited - a Function Type, `A -> B`.
- Programs correspond to proofs.
- Analyzing the types of expressions evaluated during the execution of a program corresponds to simplifying a proof.

## References

- https://en.wikipedia.org/wiki/Type_theory
- https://en.wikipedia.org/wiki/Bottom_type
- https://en.wikipedia.org/wiki/Typing_environment
- https://softwareengineering.stackexchange.com/questions/277197/is-there-a-reason-to-have-a-bottom-type-in-a-programming-language
- https://stackoverflow.com/questions/32505911/what-is-the-role-of-bottom-%E2%8A%A5-in-haskell-function-definitions
- https://doc.rust-lang.org/std/primitive.never.html
- https://en.wikipedia.org/wiki/Unit_type
- https://en.wikipedia.org/wiki/Top_type
- https://cs3110.github.io/textbook/chapters/adv/curry-howard.html#types-correspond-to-propositions
- https://wiki.haskell.org/Curry-Howard-Lambek_correspondence
- https://www.pédrot.fr/slides/inria-junior-02-15.pdf
- https://math.stackexchange.com/questions/2686280/what-do-logicians-mean-by-type
- https://homepages.inf.ed.ac.uk/stg/NOTES/node35.html
- https://cs.wellesley.edu/~cs251/s02/scheme-intro.pdf
- https://cs.brown.edu/~sk/Publications/Papers/Published/pk-resuarging-types/paper.pdf
- https://en.wikipedia.org/wiki/Syntactic_sugar
- https://www.wikidata.org/wiki/Q73072308
- https://stackoverflow.com/questions/36389974/what-is-type-ascription
- https://github.com/rust-lang/rfcs/blob/master/text/0803-type-ascription.md
- https://medium.com/@andrew_lucker/things-you-cant-do-in-rust-type-ascription-5253951c7427
- https://docs.scala-lang.org/style/types.html
- https://futhark-lang.org/examples/type-ascriptions.html
- https://en.wikipedia.org/wiki/Record_(computer_science)
- https://en.m.wikipedia.org/wiki/List_(abstract_data_type)

# Feedback from the Class Discussion

An Introduction Rule describes how Elements of the Type can be Created, and is akin to a description of a Constructor. Similarly, an Elimination Rule describes how Elements of the Type can be used in an Expression, and is akin to a description of an Overloaded Operator.

A lot of papers propose Typing Rules that don't make much sense in isolation, but can be plugged into other Type Systems to add a Feature (i.e., allow the non-intrusive addition of other Typing Rules).

Well-designed Type Systems provide guarantees on a program's behavior (i.e., guarantee predictable runtime behavior).

C introduced types, not for verification, but to determine how much space a variable would take up in memory.

Uniqueness of Typing (i.e., a Term can only have one Type) doesn't hold when there is Subtyping.

Curry Style allows representing errors explicitly and describing the type of errors, which is suitable for languages where things can go wrong. In comparision, Church Style does not allow errors

The Erasure Property is built upon the assumption that the Execution of the Program doesn't rely on Types.

Type Ascription woule be beneficial for giving hints to the Type Inference/Type Checking Algorithm.

Usually, Desugaring happens before Type Checking, as the Type System does not directly handle the Syntactic Sugar. 

Tuples are also called Sum Types, and Variants are also called Product Types. This is based on how many possible values the Tuple or Variant Type has. For example, `std::pair<char, bool>` has `256 * 2 = 512` values, `std::variant<char, bool>` has `256 + 2 = 258` values, and `std::optional<char>` has `256 + 1 = 257` values.

Enums can be seen as Variants where each value is associated with the Unit Type.

Tuples and Records are distinct Types because Compilers implement them differently

Programming in Dynamically Typed Programming is akin to programming with variables which are Variants of all possible types.
