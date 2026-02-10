---
title: 'Paper Reading: How We Refactor, and How We Know It'
date: 2022-10-10
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Advanced Software Engineering](https://github.com/ubccpsc/507/tree/2022sept). The original paper can be found [here](https://doi.org/10.1109/TSE.2011.41).

# What were the primary contributions of the paper as the author sees it? How does this work move the research forward? How was the work validated?

In his book on refactoring, Fowler catalogs 72 different refactorings, ranging from localized changes to more global changes, and Fowler claims that refactoring produces significant benefits.

Although case studies have demonstrated that refactoring is a common practice and can improve code metrics, they tend to examine just a few software products.

To help put refactoring research on a sound scientific basis, we replicate the study in wider contexts and explore factors that previous authors may not have explored. We analyze four sets of Eclipse IDE usage data and apply different several different refactoring-detection strategies to them. We then use this data to test nine hypotheses about refactoring, casting doubt on several previously stated assumptions about how programmers refactor, while validating others.

- Refactoring behavior of refactoring tool developers differs from that of their users. Specifically, RENAMEs and MOVEs are more frequent among users.
- About 40% of refactorings performed using a tool occur in batches (several refactorings of the same kind within a short time period).
- About 90% of configuration defaults of refactoring tools remain unchanged when programmers use the tools.
- messages written by programmers in commit logs do not reliably indicate the presence of refactoring.
- Programmers frequently floss refactor (interleave refactoring with other types of programming activity).
- About half of refactorings are not high-level, so refactoring detection tools that look exclusively for high-level
refactorings will not detect them.
- Refactorings are performed frequently.
- Almost 90% of refactorings are performed manually, and the kinds of refactorings performed with tools differ from the kinds performed manually.

# How could this research be extended? How could this research be applied in practice?

For the toolsmith:

- Most kinds of refactorings will not be used as frequently as the toolsmiths hoped. Improving the under-used tools or their documentation may increase tool use.
- Programmers often do not configure refactoring tools. Configuration-less refactoring tools, which have recently seen increasing support in Eclipse and other environments, will suit the majority of, but not all, refactoring situations.
- 30 refactorings did not have tool support, the most popular of these was MODIFY ENTITY PROPERTY, performed 8 times, which would allow developers to safely modify properties such as static or final.

For researchers:

- Questions still remain to answer.
  - Why is the RENAME refactoring tool so much more popular than other refactoring tools?
  - Why do some refactorings tend to be batched while others do not?
- Our experiments should be repeated in other projects and for other refactorings to validate our findings.

# What were the main contributions of the paper as you (the reader) see it? How does the work apply to you?

Of particular interest to me is the inspiration for the hypothesis the authors verify - previous literature (frequently in other software engineering domains), personal experience, anecdotes from programmers, surveys. The benefit from this is twofold. First, it provides a source of inspiration for formulating hypotheses. Second, it endorses the validity of the hypotheses.

- We hypothesize refactoring behavior of refactoring tool developers differs from that of their users. Toleman and Welsh assume a variant of this hypothesis - that the designers of software tools erroneously consider themselves typical tool users - and argue that the usability of software tools should be objectively evaluated.
- We hypothesize that programmers typically perform refactoring in batches. Based on personal experience and anecdotes from programmers, we suspect that programmers often refactor several pieces of code because several related program elements may need to be refactored in order to perform a composite refactoring. In previous research, Murphy-Hill and Black built a refactoring tool that supported refactoring several program elements at once, on the assumption that this is common.
- We hypothesize that programmers do not often configure refactoring tools. We suspect this because tweaking code manually after the refactoring may be easier than configuring the tool. In the past, we have found some limited evidence that programmers perform only a small amount of configuration of refactoring tools. When we did a small survey in September 2007 at a Portland Java Users Group meeting, 8 programmers estimated that, on average, they supply configuration information only 25% of the time.
- In Xing and Stroulia's automated analysis of the Eclipse codebase, the authors conclude that "indeed refactoring is a frequent practice". Although flawed, this becomes one of the authors' hypotheses.

Furthermore, some hypotheses are formed from a critique of previous literature, combined with domain expertise and/or other literature.

- Several researchers have used messages attached to commits into a version control as indicators of refactoring activity. However, we hypothesize that this assumption is false, because refactoring may be an unconscious activity, and because the programmer may consider it subordinate to some other activity, such as adding a feature.
- Past research has often drawn conclusions based on observations of high-level refactorings. We hypothesize that in practice programmers also perform many lower-level refactorings. We suspect this because lower-level refactorings will not change the program's interface and thus programmers may feel more free to perform them.

Additionally, much of the methodology presented in this paper can be borrowed.

- The fourth dataset used by the authors is Eclipse CVS, the version history of the Eclipse and JUnit code bases extracted from their Concurrent Versioning System (CVS) repositories. CVS does not maintain records showing which file revisions were committed as a single transaction. The standard approach for recovering transactions is to find revisions committed by the same developer with the same commit message within a small time window; we use a 60 second time window. In our experiments, we randomly sampled from about 3400 source file commits that correspond to the same time period, the same projects, and the same developers represented in Toolsmiths. Using these data, two of the authors inferred which refactorings were performed by comparing adjacent commits manually.
- Ratzinger describes the most sophisticated strategy for finding refactoring messages: searching for the occurrence of keywords such as "move" and "rename", and excluding "needs refactoring". We replicated Ratzinger's experiment for the Eclipse code base to nullify Ratzinger's conclusions.
- In order for refactoring activity to be defined as frequent, we seek to apply criteria that require refactoring to be habitual and occurring at regular intervals. First, we examined the Toolsmiths data to determine how refactoring activity was spread throughout development. Second, we examined the Users data to determine how often refactoring occurred within a programming session and whether there was significant variation among the population.
- We hypothesize that programmers often do not use refactoring tools, because existing tools may not have a sufficiently usable user-interface. To validate this hypothesis, we correlated the refactorings that we observed by manually inspecting Eclipse CVS commits with the refactoring tool usages in the Toolsmiths data set.

