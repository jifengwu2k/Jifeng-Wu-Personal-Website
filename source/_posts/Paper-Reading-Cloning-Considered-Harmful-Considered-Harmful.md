---
title: 'Paper Reading: "Cloning Considered Harmful: Considered Harmful'
date: 2022-10-05
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Advanced Software Engineering](https://github.com/ubccpsc/507/tree/2022sept). The original paper can be found [here](https://doi.org/10.1109/WCRE.2006.1).

# What were the primary contributions of the paper as the author sees it? How was the work validated?

Current literature on the topic of duplicated code in software systems often considers duplication harmful to the system quality, and the reasons commonly cited for duplicating code often have a negative connotation.

While these positions are sometimes correct, during our case studies we have found that this is not universally true, and we have found several situations where code duplication seems to be a reasonable or even beneficial design option.

This paper introduces eight cloning patterns that we have uncovered during case studies on large software systems, and discusses the advantages and disadvantages associated with using them.

- Forking, cloning used to bootstrap development of similar solutions, with the expectation that evolution of the code will occur somewhat independently
  - Hardware variation
  - Platform variation
  - Experimental variation
- Templating, directly copy behavior of existing code but appropriate abstraction mechanisms are unavailable
  - Boiler-plating due to language in-expressiveness
  - API/Library protocols
  - General language or algorithmic idioms
- Customization, currently existing code does not adequately meet a
new set of requirements
  - Bug workarounds
  - Replicate and specialize

# What were the main contributions of the paper as you (the reader) see it? How does this work move the research forward? How could this research be extended?

This paper introduces the notion of categorizing high level patterns of cloning in a similar fashion to the cataloging of design patterns or anti-patterns. There are several benefits that can be gained from this characterization.

1. It provides a flexible framework on top of which we can document our knowledge about how and why cloning occurs in software. This documentation crystallizes a vocabulary that researchers and practitioners can possibly use to communicate about cloning.
2. This categorization is a first step towards formally defining these patterns to aid in automated detection and classification. These classifications can then be used to define metrics concerning code quality and maintenance efforts. Automatic classifications will also provide us with better measures of code cloning in software systems and severity of the problem in general.

# How could this research be applied in practice?

In each uncovered cloning pattern, the author describes its advantages, disadvantages, how it can be managed, issues to be aware of when deciding to use it as a long-term solution, as well as real examples in large software systems. These provide practical guidelines when considering a trade-off between code cloning and formulating abstractions for code reuse, as well as how to manage code cloning should it be used, when developing a software project.

