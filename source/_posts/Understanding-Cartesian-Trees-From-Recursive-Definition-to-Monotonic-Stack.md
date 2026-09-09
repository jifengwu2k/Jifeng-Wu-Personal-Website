---
title: "Understanding Cartesian Trees: From Recursive Definition to Monotonic Stack"
date: 2026-09-09
categories:
  - "Programming"
tags:
  - "reference"
  - "data-structures"
  - "computer-science"
excerpt: "How the recursive definition of a Cartesian tree leads to a linear-time construction algorithm using a monotonic stack."
---

A Cartesian tree combines two kinds of order that at first seem unrelated. Given an array of distinct values, it is a binary tree whose:

1. **in-order traversal reproduces the original array**, and
2. **nodes satisfy the heap property**.

This post uses a min-heap Cartesian tree, so every parent is smaller than its children. For any array of distinct values, these two rules determine a unique tree.

The recursive definition is simple: choose the array's minimum as the root, recursively build the left subtree from everything before that minimum, and recursively build the right subtree from everything after it.

## The recursive definition

For an array `A[l:r]` (a half-open interval in Python-style notation: `l` inclusive, `r` exclusive), let `m` be the index of its minimum value. An empty interval is the base case and produces an empty subtree. Then:

- `A[m]` becomes the root;
- `A[l:m]` recursively forms its left subtree; and
- `A[m+1:r]` recursively forms its right subtree.

This construction immediately explains both defining properties:

- The root is the range minimum, so it is smaller than every node beneath it.
- An in-order traversal visits the left range, then `A[m]`, then the right range, preserving the array's order.

The straightforward implementation, however, repeatedly scans subarrays to find their minima. On an already sorted array, the minimum is always at one end. The scans then cost roughly

$$N + (N - 1) + (N - 2) + \cdots + 1 = O(N^2).$$

To obtain a linear-time algorithm, we need to stop searching for each subtree's minimum from scratch.

## Build from left to right instead

Suppose we have already built the Cartesian tree for `A[0:i]`, and the next value `A[i]` arrives.

Because `A[i]` is the newest array element, it must be the final node visited by an in-order traversal of the updated tree. Therefore, it cannot be inserted arbitrarily. It must attach somewhere along the existing tree's **right spine**: the path from the root to the rightmost node (the last node visited by an in-order traversal).

There are three possibilities for the new value:

1. **It is larger than the rightmost node on the spine.** It becomes that node's right child.
2. **It is smaller than the root.** It becomes the new root, and the entire old tree becomes its left subtree.
3. **It lies somewhere in between.** It enters the middle of the right spine: larger nodes move beneath it as its left subtree, while the closest smaller node remains above it as its parent.

All three cases share one essential property: `A[i]` becomes the new rightmost node, and every node moved beneath it came from an earlier position in the array. The in-order property is therefore preserved no matter which case applies; the cases differ only in how much of the old right spine becomes the new node's left subtree.

Thus, the problem at every step is not *where in the whole tree does `A[i]` belong?* It is only *where on the right spine does it belong?*

## Why the right spine is monotonic

In a min-heap Cartesian tree, values strictly increase as we move from the root down the right spine. Every edge goes from a parent to a child, and the min-heap property requires the parent to be smaller.

So the right spine is already a monotonic sequence:

```text
root                         rightmost leaf
  1  ->  3  ->  7  ->  12  ->  18
smallest                         largest
```

When a new value `x` arrives:

- every spine node smaller than `x` may legally remain its ancestor;
- every trailing spine node larger than `x` must move below it; and
- the boundary between those two groups is exactly the insertion point.

For example, inserting `8` into the spine above leaves:

```text
1  ->  3  ->  7  ->  8
                    /
                  12  ->  18
```

The subtree rooted at `12` becomes the left subtree of `8`. This is the only placement that keeps both required orders. In general, inserting `x` at the boundary between the last smaller spine node and the first larger spine node preserves the heap property: `x` is smaller than every node moved below it and larger than the node left above it, so every parent stays smaller than its children. The in-order property holds for the reason given earlier—the nodes moved below `x` all came from before it in the array.

This monotonicity is what will make the stack monotonic, letting each insertion find the boundary by popping only from the top of the stack. Since both required properties hold after every insertion, the tree is always the Cartesian tree for the prefix processed so far.

## Pointer walking works, but can be quadratic

We could find the insertion boundary by starting at the root and following `.right` pointers. We walk past smaller nodes, stop before the first larger node, and then rewire two links:

1. the last smaller node's `.right` link points to the new node; and
2. the first larger node becomes the new node's `.left` child.

This is correct, but starting from the root for every insertion repeats work. Consider the sorted input `[1, 2, 3, 4, 5]`:

- inserting `2` walks one edge;
- inserting `3` walks two edges;
- inserting `4` walks three edges; and
- in general, inserting the next value walks the entire current spine.

The total is again $1 + 2 + \cdots + N = O(N^2)$.

What we need is a way to remember the right spine and inspect it from its bottom, where each new value first tries to attach.

## The monotonic stack

A stack provides exactly that representation. Store the right-spine nodes in root-to-leaf order, with the deepest node at the top.

![Step-by-step construction of a Cartesian tree, with the right spine outlined in red and each inserted node shown in green](/static/images/cartesian-tree2.png)

*Constructing a Cartesian tree from left to right. The red outline marks the current right spine, and the green node is the value being inserted.*

For each new value `x`:

1. Pop while the stack top is larger than `x`.
2. Make the last popped node (the closest spine node larger than `x`) the new node's left child.
3. If the stack is not empty, make the new node the stack top's right child (the closest spine node smaller than `x`).
4. Push the new node.

Here is a compact Python implementation:

```python
from dataclasses import dataclass
from typing import Optional


@dataclass
class Node:
    value: int
    index: int
    left: Optional["Node"] = None
    right: Optional["Node"] = None


def build_cartesian_tree(values: list[int]) -> Optional[Node]:
    """Build a min-heap Cartesian tree for distinct values."""
    stack: list[Node] = []

    for index, value in enumerate(values):
        node = Node(value=value, index=index)
        last_popped = None

        while stack and stack[-1].value > value:
            last_popped = stack.pop()

        node.left = last_popped

        if stack:
            stack[-1].right = node

        stack.append(node)

    return stack[0] if stack else None
```

The stack is not a separate approximation of the tree. At every step, it contains exactly the nodes on the current right spine. Popping a node means that the node is no longer on that spine, not that it disappears from the tree: the popped chain is retained as the new node's left subtree.

## Why the running time is linear

A single insertion may pop many nodes, but each node is:

- pushed exactly once; and
- popped at most once.

Across all insertions, there are at most `N` pushes and `N` pops. The total construction time is therefore $O(N)$, or amortized $O(1)$ per element, with $O(N)$ auxiliary space in the worst case.

This is the key insight behind the monotonic-stack construction: the recursive definition tells us what the tree must look like, while left-to-right insertion reveals that only the right spine can change. The stack remembers that spine and prevents us from traversing the same path again and again.

## A note on duplicate values

The uniqueness statement assumes distinct values. If duplicates are allowed, choose a tie-breaking rule—for example, compare `(value, index)` pairs lexicographically—and apply it consistently in both the heap definition and the stack's pop condition. The same construction then produces a deterministic tree.

## Reference

- [Cartesian tree — OI Wiki](https://en.oi-wiki.org/ds/cartesian-tree/)
