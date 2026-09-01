---
title: "Introduction to OpenMP"
date: 2026-08-31
updated: 2026-08-31
categories:
  - "Programming"
tags:
  - "reference"
  - "c++"
  - "computer-architecture"
  - "systems"
excerpt: "Study notes on OpenMP shared-memory parallelism, data scoping, tasks, and GPU offloading."
---

## Why Start with OpenMP

OpenMP is the most approachable entry point into shared-memory parallel programming. It works through compiler directives (`#pragma omp ...`), so you can add parallelism incrementally to existing C++ code without restructuring your whole application.

Instead of managing OS threads, mutexes, or thread lifetimes by hand, you annotate your code with directives and let the compiler and runtime generate the threads for you.

## The Fork-Join Execution Model

OpenMP uses a fork-join model:

1. Your program starts as a single sequential thread, called the **initial thread**.
2. When execution reaches an OpenMP *parallel* construct, the initial thread **forks** into a team of threads.
3. All threads run the same block of code concurrently.
4. When the block ends, the threads **join** back together, leaving only the initial thread to continue.

Because the directives are standard compiler pragmas, a compiler without OpenMP support simply ignores them and builds your program as ordinary sequential code.

### Creating a Parallel Region

```cpp
#include <iostream>
#include <omp.h>

int main() {
    #pragma omp parallel
    {
        int thread_id = omp_get_thread_num();
        int total_threads = omp_get_num_threads();
        std::cout << "Hello from thread " << thread_id << " out of "
                  << total_threads << std::endl;
    }
    return 0;
}
```

When compiled with OpenMP enabled (for example, `g++ -fopenmp main.cpp`), every thread in the team executes the block inside the braces independently.

### Parallelizing Loops

The most common everyday use of OpenMP is distributing loop iterations across threads with the `for` work-sharing construct:

```cpp
#include <vector>

void vector_add(const std::vector<double>& a,
                const std::vector<double>& b,
                std::vector<double>& c) {
    const int n = a.size();
    #pragma omp parallel for
    for (int i = 0; i < n; ++i) {
        c[i] = a[i] + b[i];
    }
}
```

OpenMP automatically splits the range `0` to `n - 1` among the available hardware threads, so each iteration runs exactly once across the team.

## Managing Data: The Hidden Pitfall

Because all threads share the same memory, keeping data safe is your responsibility. When two threads write to the same variable at the same time, you get a **race condition**, and the result is undefined behavior.

OpenMP uses clauses to control how variables are shared:

- `shared`: The default for most variables. Every thread reads and writes the *same* memory location.
- `private(var)`: Gives each thread its own uninitialized copy of `var`. Changes made by one thread are invisible to the others.
- `reduction(op : var)`: Combines each thread's local result into a single global value using an operation such as `+`, `*`, `max`, or `min`. This is essential for accumulation loops like sums and dot products.

```cpp
double sum = 0.0;
#pragma omp parallel for reduction(+:sum)
for (int i = 0; i < n; ++i) {
    sum += a[i];
}
```

## Task-Based Parallelism

Traditional OpenMP is built around structured loops, but many modern algorithms — graph traversals, recursive divide-and-conquer, and tree searches — do not map cleanly onto flat arrays. **Tasks** handle these irregular workloads.

```cpp
void process_node(Node* node) {
    if (!node) return;

    do_work(node);

    // Spawn a task for each child.
    #pragma omp task
    process_node(node->left);
    #pragma omp task
    process_node(node->right);

    // Wait for this node's child tasks to finish.
    #pragma omp taskwait
}

void traverse(Node* root) {
    #pragma omp parallel
    {
        // Only one thread starts the recursion; tasks do the rest.
        #pragma omp single
        {
            process_node(root);
        }
    }
}
```

The `single` construct ensures only one thread begins the recursion. Each recursive call then creates tasks that the team executes as work becomes available, letting the program adapt to whatever shape the workload takes.

## GPU Offloading with `target`

OpenMP began as a CPU-focused model, but OpenMP 4.5 and later add **target offloading**, which lets you compile and run loops directly on GPUs.

```cpp
double sum = 0.0;
#pragma omp target teams distribute parallel for reduction(+:sum)
for (int i = 0; i < n; ++i) {
    sum += a[i];
}
```

Offloading is powerful, but the syntax tends to be verbose, and compiler support varies more than it does for CPU execution. Check your compiler's documentation before relying on it.

## Next Step: Kokkos for Performance Portability

Once you are comfortable with CPU multithreading through OpenMP, a natural next step is **Kokkos**. Developed by Sandia National Laboratories, Kokkos is a C++ programming model that lets you write an algorithm once and run it on multi-core CPUs as well as NVIDIA, AMD, and Intel GPUs, without rewriting it for each hardware back end.
