---
title: "Understanding Lean's Type and Prop Through Python Metaclasses"
date: 2026-08-28
updated: 2026-08-28
categories:
  - "Programming"
tags:
  - "type-theory"
  - "programming-languages"
  - "functional-programming"
excerpt: A concise introduction to Lean's Type and Prop through Python's object–class–metaclass relationship.
---

In Python, **an object is an instance of a class, and a class is an instance of a metaclass**:

```python
isinstance(5, int)     # True
isinstance(int, type)  # True
```

`5` is an instance of `int`, while `int` is an instance of the metaclass `type`. See [Metaclass Fundamentals](/2025/07/25/Metaclass-Fundamentals/) for a more detailed explanation.

**In Lean, `Type` plays a role resembling Python's `type`.** "Ordinary classes" such as `Nat`, `String`, and `Bool` can be thought of as instances of the "metaclass" `Type`. Using Python vocabulary, `5` is an "object", `Nat` is its "class", and `Type` is the "metaclass" of `Nat`.

**Lean has another built-in "metaclass" called `Prop`.** Suppose `x` and `y` are natural numbers. Consider:

```text
x < y
```

In Python, this looks like an expression that should immediately evaluate to a Boolean value, `True` or `False`. **However, in Lean:**

- **`x < y` is a "class" whose "metaclass" is `Prop`.**
- **A proof of `x < y` is an "object" of that "class".**

As another example, let `P` and `Q` stand for two logical claims. Both of these expressions are "classes" whose "metaclasses" are `Prop` in Lean:

```text
P ∧ Q
Q ∧ P
```

Given that `h` is an "object" of the "class" `P ∧ Q`, we can prove `Q ∧ P` by constructing an "object" of the "class" `Q ∧ P` from the two objects stored in `h`, in reverse order:

```lean
theorem swapAnd (P Q : Prop) (h : P ∧ Q) : Q ∧ P :=
  And.intro h.right h.left
```

**If the code type checks, the theorem is proven.**