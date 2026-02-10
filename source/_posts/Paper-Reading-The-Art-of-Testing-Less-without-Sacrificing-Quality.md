---
title: 'Paper Reading: The Art of Testing Less without Sacrificing Quality'
date: 2022-09-21
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Advanced Software Engineering](https://github.com/ubccpsc/507/tree/2022sept). The original paper can be found [here](https://www.microsoft.com/en-us/research/publication/the-art-of-testing-less-without-sacrificing-quality/).

# What were the primary contributions of the paper as the author sees it? How does this work move the research forward?

For large complex software products, there is a need to check that changes do not negatively impact other parts of the software and they comply with system constraints such as backward compatibility, performance, security etc. Ensuring these system constraints may require complex test procedures, but long tests conflict with strategic aims to shorten release cycles.

To accelerate test processes without sacrificing product quality, the paper develops a cost model for test executions based on historic test execution results that causes no test execution runtime overhead. The paper then presents a novel cost based test selection strategy, THEO, which skips test executions where the expected cost of running the test exceeds the expected cost of not running it, while ensuring that all tests will execute on all code changes at least once.

# How was the work validated?

The paper replayed past development periods of Microsoft Windows, Office, and Dynamics with THEO. THEO would have reduced the number of test executions by up to 50%, cutting down test time by up to 47%. At the same time, product quality was not sacrificed as the process ensures that all tests are ran at least once on all code changes. Simulation shows that THEO produced an overall cost reduction of up to $2 million per development year, per product.

Furthermore, this paper have convinced an increasing number of Microsoft product teams to explore ways to integrate THEO into their actual live production test environments. This further endorses THEO's effectiveness.

# How could this research be extended?

The paper stated that through reducing the overall test time, THEO would also have other impacts on the product development process, such as increasing code velocity and developer satisfaction. An empirical study on the effects of cost based test selection strategies on these aspects would be a direction for extending this research.

# What were the main contributions of the paper as you (the reader) see it? How does the work apply to you? How could this research be applied in practice?

In my opinion, the main contribution of this paper, and the aspect most able to be used as a reference in other projects, is the cost model where each test execution is considered an investment and the expected test result considered as return of investment.

Several factors are considered in the cost model, with their values easily derived from past observations.

1. $p_{TP}$, the probability the combination of test and execution context will detect a defect (true positive).
2. $p_{FP}$, the probability the combination of test and execution context will report a false alarm (false positive).
3. $engineers$, the number of engineers whose code changes passed the current code branch.
4. $time_{delay}$, the average time span required to fix historic defects on the corresponding code branch.

When a test is executed:

1. $cost_{machine}$: the per-minute infrastructure cost of test execution.
2. $cost_{inspect}$: the average cost per test inspection, equal to inspection time times the salary of the engineer. For simplicity reasons, an average cost of test inspection is used.

When a test is skipped:

1. $cost_{escaped}$: the average cost of an escaped defect, per developer and hour of delay. Defect severity is not modeled, as it cannot be determined beforehand, and all defects causing development activity to freeze on the corresponding branch must be considered severe.

After collecting these data, two cost functions are calculated: the expected cost of executing a test $cost_{exec} = cost_{machine} + p_{FP} \times cost_{inspect}$, and the expected cost for not executing a test $cost_{skip} = p_{TP} \times cost_{escaped} \times time_{delay} \times engineers$.

Through a reasonable and tested quantization like this, objective decisions can be made, boosting the efficiency of software development.

