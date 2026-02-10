---
title: >-
  Paper Reading: Sized Types
date: 2023-03-25
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Type Systems](https://williamjbowman.com/teaching/2022/w2/cpsc539b/). The original paper can be found [here](https://doi.org/10.1145/237721.240882).

# Summary

You can check the presentation that I made for this paper [in this GitHub repository](https://github.com/abbaswu/sized-types-presentation).

# Critique

Although I liked the idea of Sized Types proposed in the motivation, this paper was difficult for me to grasp, and after spending days reading it, there are still sections which I am confused about. I have summarized my understanding of this paper in the uploaded PDF, and I will discuss my thoughts here.

1. I really like the idea of Sized Types that they can be used to prove data computations terminate and codata computations are productive using the same formalization.
2. Apparently, the requirement that size indexes in Sized Types be natural number size variables, the special index $\omega$, or linear functions of the size variables facilitates generating constraints in the type checking algorithm that can be solved by a constraint solver (e.g. an SMT solver). Although this may lead to overapproximation in certain scenarions (for example, representing the type of the factorial function), over all, I consider it to be a good balance point between expressiveness and usability.
3. 3.2 Semantics of Expressions, 3.3 The Universe of Types, 3.4 Continuity and Ordinals, 3.5 Semantics of Types, and 3.7 $\omega$-Types used a lot of concepts before properly introducing them, and I couldn't understand this part.
4. The example presented to demonstrate the type checking algorithm involves generating constraints. However, only the generated constraints are presented, while how the constraints are generated and what each symbol in the constraints stand for with regards to the aforementioned AST nodes is unknown.
