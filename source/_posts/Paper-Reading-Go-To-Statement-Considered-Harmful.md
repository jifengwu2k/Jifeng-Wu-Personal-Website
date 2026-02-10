---
title: 'Paper Reading: Go To Statement Considered Harmful'
date: 2022-10-04
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Advanced Software Engineering](https://github.com/ubccpsc/507/tree/2022sept). The original paper can be found [here](https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf).

The author has been familiar with the observation that the quality of programmers is a decreasing function of the density of go to statements in the programs they produce, and in this paper, he explains why the use of the go to statement has negative effects.

He first remarks that the process taking place under control of the program, instead of the program itself, is the true subject matter of a programmer's activity, and it is this process whose behavior has to satisfy the desired specifications. He then argues that our intellectual powers can better master static relations than visualize processes evolving in time, for which reason we should shorten the conceptual gap between the static program and the dynamic progress. The author continues characterizing the progress of a progress, explaining that it can be uniquely characterized by a mixed sequence of textual and/or dynamic indices, when conditionals, procedures, and repetition clauses are considered. However, the unbridled use of the go to statement has an immediate consequence that it becomes terribly hard to find a meaningful set of coordinates in which to describe the process progress, which will in turn "make a mess of one's program". 

However, in my opinion, although the go to statement is considered harmful, abolishing the go to statement from all "higher level" programming languages is an overstatement. As the author himself stated:

- The exercise to translate an arbitrary flow diagram more or less mechanically into a jump-less one, is not to be recommended. Then the resulting flow diagram cannot be expected to be more transparent than the original one.

There exist situations where an "arbitrary flow diagram" has to be implemented (especially when implementing Finite-State Machines in lexers, regex engines, and protocols), and in these situations, implementing the flow diagram using go to statements is much more direct, straightforward and easier to reason about (not to mention more efficient) than mashing up structured programming constructs.

