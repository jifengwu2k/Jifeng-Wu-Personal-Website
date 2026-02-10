---
title: >-
  Paper Reading: A Practical Guide for Using Statistical Tests to Assess
  Randomized Algorithms in Software Engineering
date: 2022-10-16
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Automated Testing, Bug Detection, and Program Analysis](https://www.carolemieux.com/teaching/CPSC539L_2022w1.html). The original paper can be found [here](https://doi.org/10.1145/1985793.1985795).

# Overview

There are many problems in software engineering which are undecidable and use randomized algorithms, such as automated unit test generation, random testing, and search algorithms (including Genetic Algorithms). As the outcomes of these randomized algorithms vary greatly from run to run, assessing their effectiveness is an important topic.

To uncover whether randomized algorithms are properly assessed in software engineering research, the authors conducted a small-scale systematic review on three representative software engineering venues, namely IEEE Transactions of Software Engineering (TSE), IEEE International Conference on Software Engineering (ICSE) and International Symposium on Search Based Software Engineering (SSBSE), in the year 2009. The review shows that the analyses "are either missing, inadequate, or incomplete", and "randomness is not properly taken into account". The authors then put forward guidelines for properly assessing randomized algorithms in software engineering research.

# Definitions

Censoring
: a condition in which only the **range** (i.e. above a certan value, below a certain value, within an interval) of a measurement or observation is known, and its precise value is unknown.
: Akin to **clamping** in saturated arithmetic.
: Commonly encountered in software engineering experiments when **time limits** are used.

# Assessment Procedure and Guidelines

A novel randomized algorithm is commonly compared against an existing technique. After determing a measure to compare (e.g. source code coverage, execution time), we should run both algorithms **a large enough number of times independently (the author recommends "a very high number of runs" and not the rule of thumb of $n = 30$ in medicine and behavioral science, as human aspects are not involved**. With the collected measure data, we conduct the following:

## Statistical Testing

We use a **statistical test** to assess "whether there is enough empirical evidence to claim a difference between the two algorithms".

**In such a statistical test, the null hypothesis is typically "there is no difference", and we verify whether we should reject the null hypothesis.**

### Definitions related to Statistical Testing

There are two conflicting types of error when performing statistical testing: (I) we reject the null hypothesis when it is true, and (II) we accept the null hypothesis when it is false.

- The **p-value** of a statistical test is the probability of rejecting the null hypothesis when it is true.
- The **significant level $\alpha$** of a statistical test is the highest p-value we accept for rejecting the null hypothesis. There is a tradition of using $\alpha = 0.05$ in the natural sciences. **However, an increasing number of researchers believe that, and the author endorses that, such thresholds are arbitrary, and that researchers should "simply report p-values and let the reader decide in context".**
- The **statistical power** of a statistical test is the probability of rejecting the null hypothesis when it is false.

### Selection of Statistical Test

In different statistical tests, **different probability distributions of the collected measures** are assumed, and **different aspects of the probability distributions of the collected measures** are being compared. Common statistical tests include:

- parametric
  - Student's t-test
  - Welch's t-test
  - F-test
  - ANOVA
- nonparametric
  - Fisher exact test
  - Wilcoxon signed ranks test
  - Mann-Whitney U-test

When selecting a statistical test, tt is worth paying attention to the probability distributions of the collected measures:

- there may be a "very strong departure from normality"
- the mean and variance may not exist
- the data may be censored

## Effect Size Measurement

In addition to using a statistic test to assess improvement of one algorithm over another, it is also critical to assess "the magnitude of the improvement", for which effect size measures are used.

- Unstandardized effect size measures: dependent on the unit of measurement
  - difference in mean
- Standardized effect size measures:
  - d family / Mahalanobis distance, **assumes the normality of the data**
  - Common Language (CL) Statistic. The probability that a randomly selected score from the first population $X_1$ is greater than a randomly selected score from the second population $X_2$, $P(X_1 > X_2)$.
  - Measure of Stochastic Superiority. A generalization of Common Language Statistic, $A_{12} = P(X_1 > X_2) + 0.5 P(X_1 = X_2)$. **Recommended.**
  - Odds ratio. A measure of "how many times greater the odds are that a member of a certain population will fall into a certain category than the odds are that a member of another population will fall into that category". If the total number of runs is $n$, and the number of times two algorithms find optimal solutions are $n_1$ and $n_2$, then the odds ratio is $\psi = \frac{\frac{n_1}{n - n_1}}{\frac{n_2}{n - n_2}}$. **Recommended.**

### Multiple Statistical Tests and Effect Size Measurements

When comparing $k$ algorithms, we frequently would like to know the performance of each algorithm "compared against all other alternatives individually". This incurs $\frac{k (k - 1)}{2}$ comparisons.

However, when doing multiple stastical tests, given a significant level $\alpha$ and the number of tests $n$, the probability that at least one null hypothesis is true is $1 - {(1 - \alpha)}^n$, which converges to $1$ as $n$ increases.

A remedy is the Bonferroni adjustment, in which we use an adjusted significant level $\frac{\alpha}{n}$. However, this has been "seriously criticized in the literature", and the author recommends **"simply report p-values and let the reader decide in context"** instead.

