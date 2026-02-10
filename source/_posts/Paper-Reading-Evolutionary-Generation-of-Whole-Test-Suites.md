---
title: 'Paper Reading: Evolutionary Generation of Whole Test Suites'
date: 2022-10-24
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Automated Testing, Bug Detection, and Program Analysis](https://www.carolemieux.com/teaching/CPSC539L_2022w1.html). The original paper can be found [here](https://doi.org/10.1109/QSIC.2011.19).

# Background

Automatically deriving test cases for realistically sized programs:

- Select one coverage goal (e.g., program branch) at a time, and derive a test case that exercises this particular goal.
  - Solving path constraints generated with symbolic execution / dynamic symbolic execution
  - Meta-heuristic search techniques
  - Mutation testing
- Alternative approaches not directly aimed to achieve code coverage
  - Randoop
    - incrementally generate sequences of function calls to find buggy test sequences
    - requires automated oracles (e.g. developer-written assertions and exceptions)

------

# Problems

Many coverage goals are unreachable.

```java
void push(int x) {
    if (size >= values.length) {
        resize();
    }
    if (size < values.length) {
        values[size++] = x;
    }
    else {
        // UNREACHABLE
    }
}
```

------

# Problems

Some coverage goals are more difficult to satisfy than others.

The order of coverage goals is important: a lucky choice can result in a good test suite, while an unlucky choice can result in a waste of resources.

```java
void push(int x) {
    if (size >= values.length) {
        // HARD
        resize();
    }
    else {
        // EASY
    }
    if (size < values.length) {
        values[size++] = x;
    }

}
```

------

# Problems

Satisfying a particular coverage goal frequently entails satisfying further coverage goals by accident.

The order of coverage goals is important.

```java
int pop() {
    if (size > 0) {
        // May imply coverage in `push` and `resize`
        return values[size];
    }
    else {
        throw new EmptyStackException();
    }
}
```

------

# Our Solution: EvoSuite

- Optimize an entire test suite at once instead of considering distinct test cases.
- Evolve a population of test suites towards satisfying a coverage criterion.
- Assume automated oracles are not available, and require the outputs of the test cases to be manually verified.
  - The generated test suites should be of manageable size.

Solves the problem of:

- difficult and unreachable coverage goals
- order of coverage goals
- accidentally satisfying further coverage goals

------

# Our Solution: EvoSuite

Questions:

- We are interested in sequences in OOP. Should coverage in terms of a new ordering seen in the last $n$ function calls in the sequence should make more sense? (Praveen)
- It seems like Evosuite offloads the responsibility of adding in correct assertions to the developers. How easy is it for the developers to do this, especially when compared with manually writing all of the test suite? (Shizuko, ToTo, Larry)

------

# EvoSuite Modeling

Population 1 .. M Test Suite 1 .. N Test Case 1 .. L Statement

Four types of statements are modeled.

- Primitive statements: numeric variables (e.g. `int var0 = 54;`)
- Constructor statements: new instances of a class (e.g. `Stack var1 = new Stack();`). All parameters of the constructor call have to be values of previous statements.
- Field statements: public fields of objects (e.g. `int var2 = var1.size;`). If the field is non-static, then the source object of the field has to be a value of a previous statement.
- Method statements: public methods of objects (e.g. `int var3 = var1.pop();`). The source object and all parameters have to be values of previous statements.

------

# EvoSuite Modeling

The set of available classes, their public constructors, methods, and fields are extracted from the given software under test.

An optimal solution is a test suite that covers all the feasible branches/methods and is minimal in the number of statements.

------

# EvoSuite Process Overview

- Randomly generate a set of initial test suites.
- Evolve using evolutionary search towards satisfying a coverage criterion.
- Minimize the best resulting test suite.

Questions:

- How are test suites randomly generated? The author discusses "sampling". Where are we sampling from? (Larry, Jifeng)

------

# Evolutionary Search

- Test Suite Fitness Function
- Crossover
- Accepting the Mutated Offspring
- Bloat Control

------

# Test Suite Fitness Function

Covering all branches $B$ and methods $M$ of a program.

- To estimates how close a test suite $T$ is to covering all branches $B$ of a program, for each branch $b$, **minimal branch distance** $d_{min}(b, T)$ is measured. If the branch predicate is $x \ge 10$, and during execution, $x == 5$, then the minimal branch distance is $10 - 5 = 5$.
- The minimal branch distance is then normalized to get the **branch distance** $d(b, T) = f(d_{min}(b, T))$, where $f(x) = \frac{x}{x + 1}$.

$fitness(T) = |M| - |M_T| + \sum_{b \in B}{d(b, T)}$

If execution exceeds a time limit of 5 minutes, maximum fitness is automatically assigned.

------

# Test Suite Fitness Function

Questions:

- What does branch distance actually mean? Why do we use it? (Eric, Rut, Yayu, Udit, Jifeng)
- Doesn't $\sum_{b \in B}{d(b, T)}$ already consider that branch distances are maximal in unvisited methods? Why do we need an additional $|M| - |M_T|$ term? Furthermore, different methods could have a different number of branches. Should the branch distance sum for all branches within a method be normalized? (Jifeng)

------

# Crossover

Rank selection based on the fitness function is used to select two parent test suites $P_1$ and $P_2$ for crossover. In case of ties, smaller test suites are assigned better ranks.

During crossover:

- a random value $\alpha$ is chosen from $(0, 1)$
- the first offspring test suite $O_1$ will contain the first $\alpha |P_1|$ test cases from $P_1$ and the last $(1 - \alpha)|P_2|$ test cases from $P_2$
- the second offspring test suite $O_2$ will contain the first $\alpha |P_2|$ test cases from $P_2$ and the last $(1 - \alpha)|P_1|$ test cases from $P_1$
- because test cases are independent, $O_1$ and $O_2$ will always be valid

------

# Mutation

The two offspring test suites $O_1$ and $O_2$ are then mutated.

When a test suite T is mutated, each of its **test cases** is mutated with probability $\frac{1}{|T|}$.

If a test case $t$ is mutated, **remove statements**, **change statements**, and **insert statements** are each applied with probability $\frac{1}{3}$. Then, a number of new random test cases are added to $T$.

------

# Remove Statements

- If a test case $t$ contains $n$ statements, each statement is removed with probability $\frac{1}{n}$.
- If the removed statement $s_i$ is subsequently used by $s_j (j > i)$, try to replace this use with another statement before $s_j$.
  - If this is not possible, recursively remove $s_j$.
- If all statements have been removed from $t$, remove $t$ from $T$.

------

# Change Statements

- If a test case $t$ contains $n$ statements, each statement is changed with probability $\frac{1}{n}$.
- If the changed statement $s_i$ is a primitive statement, its numeric value is changed by a random value.
- Otherwise, a method, field, or constructor with the same return type is randomly chosen.

------

# Insert Statements

- With probability $p$, a new statement is inserted at a random position in the test case.
- With probability $p^2$, a second statement is inserted, and so on.

------

Questions:

- What are the justifications for the probabilities? (Kevin)
- Can we change the probabilities used in the mutation and insertion by using method calls they kept track of and variables generated in each iteration? (Joyce)
- When deleting, if the statement is chosen from the beginning few statements, is there a high probability that many/multiple following statements would be removed? Because an initial statement usually has a higher probability of containing an initialization/declaration function. (Rut)
- Why is the probability of inserting the first, second, etc. statement different? This is not the case with remove statements and change statements. (Jifeng)
-  To mutate and generate test cases, the GA algorithm should have knowledge of the programming language constructs, fields & methods of the software under test, etc. Does this require a significant engineering effort? (Udit)

------

# Accepting the Mutated Offspring

The coverage achieved by the Mutated Offspring is measured by the Test Suite Fitness Function.

Conditions for accepting the mutated offspring:

- The coverage achieved by the Mutated Offspring **exceeds that achieved by its parents**, or is on par with that achieved by its parents, **and that the mutated offspring are shorter**.
- Their length do not exceed **twice** that of the Test Suite with the best coverage in the community.

------

# Accepting the Mutated Offspring

Questions:

- Are the parents removed before adding the children? (Rut)
- Compared with the single branch strategy, only the crossover is different, and the mutation is done in the same way. (Tarcisio)

------

# Bloat Control

A **variable size representation** could lead to bloat, where **small negligible improvements in the fitness value are obtained with larger solutions.**

This is a **very common problem in Genetic Programming**.

The following measures are used for bloat control:

- Limit the maximum number $N$ of test cases within a test suite and the maximum number of statements $L$ within a test case. (still need to choose comparatively larger $N$ and $L$ and then reduce their length during/after the search to dramatically boost coverage)
- Crossover selection policy
- Mutated offspring acception policy

------

# Bloat Control

Questions:

- Does coverage-guided fuzzing, which uses a variant of Genetic Programming, suffer from bloat? If so, could any measures be applied to solve this problem? (Jifeng)
- How to reduce the length during/after the search? (Yayu, Jifeng)

------

# Evaluation

EvoSuite is compared with the traditional single branch approach on top of EvoSuite infrastructure.

- Offspring is generated using the crossover function, but is conducted on two sequences of statements.
  - Because there are dependencies between statements, the statements of the second part are appended one at a time, trying to satisfy dependencies with existing values, generating new values if necessary.
- The traditional approach level plus normalized branch distance fitness function is used.

The two approaches are compared on five open source libraries and a subset of an industrial case study project previously used by Arcuri et al. The units are testable without complex interactions with external resources and are not multithreaded.

------

# Evaluation

"Best practices" based on past experience are used for EvoSuite:

- Population size: 80
- Maximum test suite size $N = 100$
- Maximum test case size $L = 80$
- The initial test suites are generated with 2 test cases each
- Initial probability for test case insertion: 0.1
- Crossover probability: 3 / 4
- Initial probability for statement insertion: 0.5

------

# Evaluation

The search operators for test cases make use of only the type information in the test cluster, and so difficulties can arise when method signatures are imprecise. To overcome this problem for container classes, we always put Integer objects into container classes, and cast returned Object instances back to Integer.

As the length of test cases can vary greatly and longer test cases generally have higher coverage, we decided to take the number of executed statements as execution limit. The search is performed until either a solution with 100% branch coverage is found, or $k = 1,000,000$ statements have been executed as part of the fitness evaluations.

------

# Evaluation

Questions:

- Why not compare EvoSuite to any other (non genetic-testing based) approach? (Zack)
- Why "the units are testable without complex interactions with external resources and are not multithreaded"? (Marie)
- Is there a justification for these "best practices"? (Praveen, Kevin, Madonna, Jifeng)
- Do the "best practices" overfit the 5 open-source libraries? (Joyce)
- Why the choice of an Integer? And does it work in practice? Given that the internals of the program might be expecting something else? (Rut)

------

# Results

- Whole test suite generation achieves higher coverage than single branch test case generation.
- Whole test suite generation produces smaller test suites than single branch test case generation.

------

# Results

Questions:

- While we have focused on branch coverage in this paper, the findings also carry over to other test criteria is an unwarranted extrapolation. (Zack)
- Evosuite claims that the test cases are smaller, but how much smaller? (not obvious from Figure 7) (ToTo)
- High coverage test suite does not necessary mean high bug-finding abilities.
- How does the performance compare to other tools? (ToTo, Praveen, Kevin, Madonna)
- The authors did not evaluate EvoSuite against a human in software engineering. Whether EvoSuite will improve the ability to test software from a software developer's point of view is unknown. (Marie)

