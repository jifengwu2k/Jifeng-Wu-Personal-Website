---
title: 'Paper Reading: Bi-directional type checking'
date: 2023-01-30
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Type Systems](https://williamjbowman.com/teaching/2022/w2/cpsc539b/). The original paper can be found [here](http://www.davidchristiansen.dk/tutorials/bidirectional.pdf).

# Summary

The paper first explains that except Syntax Directed Systems, Typing Rules cannot be directly translated into Algorithms for Type Checking and Type Inference. It presents a motivating example of this using a Simply Typed Lambda Calculus having Bool and Function as Types and Bool Constants, Variables, Function Abstractions, Function Applications, and Conditional Expressions as Terms, in which the Typing Rule for Function Abstractions cannot be directly translated into a Function for Type Inference.

It then presents Bidirectional Typing as a remedy to this problem. It explains what Bidirectional Typing is, discusses its advantage, and adds Bidirectional Typing into the previously presented Simply Typed Lambda Calculus, presenting how Bidirectional Typing works during the process.

Finally, it discusses the limitations of Bidirectional Typing and presents academic literature for further reading.

# Critique

Overall, I believe this paper is written very well, as I can grasp most of it after reading it. I will summarize my takeaways from this paper before presenting some questions and comments.

## My Takeaways From This Paper

### What Bidirectional Typing Is

Bidirectional Typing splits each Typing Rule $\Gamma \vdash t: T$ into:

- An Inference Rule $\Gamma \vdash t \Rightarrow T$, which *infers* $t$'s type to be $T$ in Context $\Gamma$.
- A Type Checking Rule $\Gamma \vdash t \Leftarrow T$, which *checks* $t$'s type to be $T$ in Context $\Gamma$.

The Inference Rules and Type Checking Rules would work together and call each other.

### Advantages of Bidirectional Typing

- Makes general Typing Rules more Syntax Directed, thus, simplifying implementing Algorithms for Type Checking and Type Inference.
- Requires relatively few additional Type Annotations.
- Produces good error messages that report where the error occurs.

### Limitations of Bidirectional Typing

- Variables in a Derivation can no longer be replaced by the Derivation for a Term of the same Type. This is because Bidirectional Typing uses Inference Mode to check Variables but uses Checking Mode to check many other Terms.
- In some situations, explicit Type Annotations may need to be written within complex Terms, such as a direct Application of a Function Abstraction, like `(λ b . if b then false else true) true: Bool`

## Questions and Comments

- Page 8 mentions, "remember that the derivation, like the bidirectional typing rules, should be read bottom-to-top and left-to-right." However, Inference Rules have the form of $\frac{Premise}{Conclusion}$. So, why should the derivation be read from Conclusion to Premise?
- What are the meanings of the small-step rule $\frac{}{t : T 	\rightarrow t}$ and the large-step rule $\frac{t \Downarrow t'}{t : T \Downarrow t'}$ on Page 8?
- I believe explicit Type Annotations should be enforced for the Parameters within Function Abstractions, such as `(λ b: Bool . if b then false else true)` instead of `(λ b . if b then false else true)`.
  - This aligns with real-world programming languages (C++, Java, Rust, Swift, Haskell, etc.)
  - This increases readability.
  - This simplifies both the Typing Rules and the Inference Rules and Type Checking Rules of Bidirectional Typing.

# Feedback from the Class Discussion

Small Step Semantics, represented using $\rightarrow$'s, depict **one step in Evaluation**. For example, if $e$ is $true$ itself, $\text{if}\: e \: \text{then} \: e_1 \: \text{else} \: e_2$ can be Evaluated **in one step** to $e_1$. This can be represented using $\frac{e \rightarrow true}{\text{if}\: e \: \text{then} \: e_1 \: \text{else} \: e_2 \rightarrow e_1}$

Big Step Semantics, represented using $\Downarrow$'s, depict **Reducing a Subexpression to a Value through several Small Steps**. For example, if $e$ is a Subexpression that can be Reduced to $true$ after several Small Steps, $\text{if}\: e \: \text{then} \: e_1 \: \text{else} \: e_2$ can be Reduced to $e_1$ **after several Small Steps**. This can be represented using $\frac{e \Downarrow true}{\text{if}\: e \: \text{then} \: e_1 \: \text{else} \: e_2 \Downarrow e_1}$.

Syntax Directed means a one-to-one correspondence between the Type of the Term and the Syntax (Derivation of the Grammar Rules) of the Term.

There is no precise definition for Bidirectional Typing. Instead, Bidirectional Typing points a direction toward implementing a Type Inference/Type Checking Algorithm.

In Bidirectional Typing, we prefer to start from Inference Mode because if we can Infer the Type of a Term, we can Check the Type of the Term, while Checking falls back on Inference.

Why is there only a Checking Rule and no Inference Rule for `if t then t else t`?

- This gives better error messages.
  - Should the Terms in the `then` branch and the `else` branch have different types, it is possible to give an error message directly stating this information.
  - If an Inference Rule had been proposed instead, it would blame one branch for having a wrong type, which may be confusing and go against programmer intent.

We can read Typing Rules either from top to bottom or from bottom to top, with slightly different interpretations.

- Reading from top to bottom describes how to use the information for Type Checking.
- Reading from bottom to top describes how a Type Inference Algorithm works, e.g., what needs to be Checked to Infer the Type of a Term.

From a historical perspective, there are two Design Philosophies for Type Systems.

- The first is to augment a Programming Language with more information, such as C which uses it to determine how much space a variable would take up in memory.
- The second is to express programmer intent.

Type Annotations (Ascriptions) for Parameters are required for Functions that are not immediately used, such as Top Level Functions. However, it is helpful to omit Type Annotations (Ascriptions) for Parameters for immediately used Lambda Terms within Higher Order Functions.
