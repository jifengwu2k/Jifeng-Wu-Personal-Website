---
title: 'Paper Reading: Feedback-Directed Random Test Generation'
date: 2022-10-18
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Automated Testing, Bug Detection, and Program Analysis](https://www.carolemieux.com/teaching/CPSC539L_2022w1.html). The original paper can be found [here](https://doi.org/10.1109/ICSE.2007.37).

# Overview

The authors present Randoop, a feedback-directed random unit test generator for object-oriented programs which generates sequences of method calls that create and mutate objects, and uses feedback obtained from executing the sequences to guide the search towards new sequences.

# Logic of Randoop

Randoop builds sequences incrementally starting from an empty set of sequences. In each iteration, it generates and executes a new sequence.

## Sequence Generation

First, it selects a method randomly among the public methods of classes.

Second, it finds arguments to provide to the method.

- If an argument is a primitive type, select a primitive value from a fixed pool of values.
- If an argument is a reference type, select an extensible value of the corresponding type from a previously generated sequence in $nonErrorSeqs$ and put the previous generated sequence into a temporary list if possible, or select null otherwise.

Third, a new sequence is formed by concatenating the sequences in the temporary list and the randomly selected method.

Fourth, the new sequence is checked whether it has been generated before. If so, the process is repeated.

Furthermore, the authors considers that repeated calls to a method may increase code coverage (e.g. reach code that increases the capacity of a container object, or reach code that goes down certain branches). Thus, with a probability $p = 0.1$, instead of appending a single call of a chosen method, a maximum of $N = 100$ calls are appended.

## Sequence Execution

After a new sequence is generated, each method call in the sequence is executed, and after each call, contracts are checked.

Default contracts checked by Randoop include:

- method throws no NullPointerException if no input parameter was null
- method throws no AssertionError
- o.equals(o) returns true and throws no exception
- o.hashCode() throws no exception
- o.toString() throws no exception

If at least one contract is violated, the sequence is put in $errorSeqs$, and no values within the sequence can be extended. If all contracts are not violated, the sequence is put in $nonErrorSeqs$, and all values within the sequence are checked whether they can be extended. If the value has been encountered before, is null, or an exception occurs when executing the sequence leading to the value, the value cannot be extended.

# Experimental Study

The authors evaluate the effectiveness of Randoop through three experiments.

1. Comparing the basic block and predicate coverage of Randoop and five systematic input generation techniques on four container data structures used previously to evaluate these systematic input generation techniques.
2. Comparing Randoop with JPF (a systematic testing technique) and undirected random testing on 14 widely-used libraries.
3. A case study using Randoop to find regression errors between different implementations of the Java JDK.

The experimental results strongly suggest that Randoop outperforms systematic and undirected random test generation in both coverage and error detection.

# Personal Thoughts

1. In my opinion, a key advantage of Randoop is the "sparse, global sampling" that it performs, which "retains the benefits of random testing (scalability, simplicity of implementation)", while avoiding undirected random testing's pitfalls (generation of redundant or meaningless inputs), and is better adapted to large-scale library code than the "dense, local sampling" of systematic test generation.
2. The sequences Randoop builds are akin to seeds in coverage-guided fuzzing, and I believe the efficiency and effectiveness of Randoop may be further boosted by applying a power schedule to the built sequences, much like applying a power schedule to the seeds in coverage-guided fuzzing.
3. The built sequences could possibly have overlapping prefixes. Would using a tree structure be better than storing each sequence on its own?
4. Randoop only supports a limited number of contracts, and its error-detection ability is rather weak. It may be appropriate on library code filled with assertions and checks, but may not work well on client code where these may be sparse.

