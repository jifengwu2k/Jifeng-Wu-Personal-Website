---
title: 'Paper Reading: Hybrid dynamic data race detection'
date: 2022-11-23
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Automated Testing, Bug Detection, and Program Analysis](https://www.carolemieux.com/teaching/CPSC539L_2022w1.html). The original paper can be found [here](https://doi.org/10.1145/781498.781528).

The paper proposes a hybrid approach to dynamically (at runtime) data races in multithreaded Java programs. It first proposes two specific detection approaches, each with its strengths and weaknesses. The first is lockset-based detection, which identifies a data race when multiple threads use a shared memory location without holding a shared lock object. Such an approach is fast but may lead to false positives. As a result, the paper proposes another approach, happens-before detection, which uses several heuristics to reason about relations between events and infer whether a potential race has occurred at a particular memory location. In comparison, this approach is more computationally expensive and may lead to false negatives. Considering that neither approach is sound, they combine the two approaches by first using lockset-based detection to identify potential data races before using happens-before detection to reason whether these are probable. The paper then conducts an experimental study of their hybrid approach on various Java programs, demonstrating its effectiveness and efficiency.

I like this paper's idea of combining a pessimistic and optimistic approach when doing program analysis. Are there any other works that use such an idea?

However, I have a question concerning the applicability of the hybrid approach in real life. Although pessimistic, shouldn't lockset-based detection be enough to stamp out all potential data races by providing programmers with feedback to add relevant locks to prevent such possible data races? This is relevant to the requirements for defensive programming. Or are there design patterns where multiple threads can safely use a shared memory location without holding a common lock and not lead to data races?

------

Feedback from the Class Discussion

Difference Between Race Condition and Data Race:
- Race Condition: There are multiple threads, and the behavior of program depends on thread scheduling.
- Data Race: Different from race condition. This frequently happens when you parallelize a program that shouldn't be parallelized. Data race can be solved by using locks, but there may still be race coditions.

```
Thread-1:

synchronized(...) {
    x = 1;
}
```

```
Thread-2:

synchronized(...){
    x = 2;
}
```

Modelling in the Paper:
- Lamport Timestamps/Vector Clocks
- Thread events: statement executions in threads. A thread event is dependent on previous thread events. This is captured used using the happens-before formal definition in the paper, but leads to false negatives.
- Thread communications: signals (enforce order) and locks (mutually exclusive).
- Message send/receive: enqueue and dequeue.

Architecure-dependednt atomic operations can also be a lock-free solution (e.g. C++'s atomic).
