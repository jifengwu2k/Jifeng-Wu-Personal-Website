---
title: 'Paper Reading: Modular Checking for Buffer Overflows in the Large'
date: 2022-11-13
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Automated Testing, Bug Detection, and Program Analysis](https://www.carolemieux.com/teaching/CPSC539L_2022w1.html). The original paper can be found [here](https://doi.org/10.1145/1134285.1134319).

# Background Information

## Datalog

- Declarative Programming Language which began as a Query Language for Relational Databases, and is now used in Data Integration, Information Extraction, Program Analysis, Cloud Computing, Machine Learning, etc.
- Akin to SQL in many aspects.
  - Not Turing Complete.
  - Used as a Domain Specific Language.
  - No Canonical Implementation, many different Implementations exist for different Applications (c.f. SQLite, MySQL, PostgreSQL, etc. for SQL).
- Follows the 'Logic Programming' Paradigm.
  - A Program consists of Constants, Variables, Facts, and Rules (based on First Order Logic, in a form similar to "a new Fact A is true if B, C, and D are already known to be true").
  - The Execution of a Program is *iteratively inferring new Facts given the Rules*.
  - Maps very nicely to many problems encountered during Program Analysis.

# Summary of the Paper

The authors proposed a Methodology for detecting possible Buffer Overflow-based Security Exploits in C code and providing developers with instant feedback during the build process. The Methodology prefers usability over accuracy, and should be used alongside other tools in a Swiss Cheese Model against Security Exploits.

First, the authors proposed a Simple Annotations Language for annotating Pointers passed as parameters to and returned from Functions, to denote Preconditions and Postconditions of Function Execution. The authors propose that for new code, annotation should be inserted manually, and code should be fully annotated before being checked in to Version Control.

For legacy codebases and/or third-party code without such Annotations, the authors propose an Inference Engline, SALInfer, which tries to infer such Annotations, preferring Coverage over Accuracy. SALInfer supports specifying Inference Algorithms using Datalog.

Finally, the authors propose a modular checker, ESPX, which tries to infer if a program is potentially vulnerable to Buffer Overflow-based Security Exploits by statically analyzing the annotations within the program's code. The confidence of the inference results vary based on the extent and quality of the annotations.

# Questions Regarding the Paper

- What is the relevance of such a technique to "safe" programming languages that do not allow using overflowable buffers?
- The authors state that "control over annotation insertion is given to individual developers". However, developers might be reluctant to insert Annotations, and inserting Annotations can negatively affect developer productivity. Furthermore, the quality of the inserted Annotations is not guaranteed. Last but not least, inferring Annotations for legacy codebases and/or third-party code without such Annotations prefers Coverage over Accuracy, which may not lead to sound results. Considering all these real concerns, the practical usability of this tool is seriously compromised.
- The authors did an evaluation on an unnamed Microsoft product. With little information regarding the product being disclosed, such an evaluation is far from convincing, and I suspect that there might be manipulation of some kind within the evaluation.

