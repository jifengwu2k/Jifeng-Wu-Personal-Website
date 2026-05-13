---
title: Type Theory Fundamentals
date: 2026-05-13
updated: 2026-05-13
categories:
  - "Programming"
tags:
  - "type-theory"
  - "reference"
  - "programming-languages"
excerpt: A concise introduction to inference rules, operational semantics, and type system design.
---

## Inference Rules

$$
\frac{\text{Premise}_1 \quad \text{Premise}_2 \quad \ldots \quad \text{Premise}_n}
{\text{Conclusion}}
\;\text{RuleName}
$$

- Premises above the bar must be satisfied for the conclusion to hold
- The rule name labels the rule
- Side conditions are written next to the rule or in parentheses
- A rule with no premises (an axiom) is written with just the conclusion

Given:

$$
\frac{\Gamma, x\!:\!\tau_1 \vdash e : \tau_2 \qquad \Delta_1 = \Delta_2 \qquad fv(\tau) \subseteq dom(\Gamma)}
{\Gamma \vdash \lambda x.\, e : \tau_1 \to \tau_2 \; ! \; \Delta_1 \cup \Delta_2}
\;\text{T-Complex}
$$

Read it top-to-bottom as "to type-check $\lambda x.\, e$":

1. Check the body $e$ in extended context $\Gamma, x\!:\!\tau_1$; it must have type $\tau_2$
2. The effects $\Delta_1$ and $\Delta_2$ must be equal (whatever that means in context)
3. All free type variables in $\tau$ must be bound in $\Gamma$
4. If all that holds, the lambda has type $\tau_1 \to \tau_2$ with effect set $\Delta_1 \cup \Delta_2$

## Operational Semantics

You write:

```python
def apply_twice(f, x):
    return f(f(x))

result = apply_twice(lambda n: n + 1, 5)
```

You know this returns `7`. But *how* does it compute? What are the exact, step-by-step rules? If we wrote them down precisely enough that a machine could follow them, we'd have an **operational semantics**.

### Small-Step Operational Semantics

The core idea of **small-step operational semantics**: describe evaluation as a sequence of single reductions:

$$
\text{expression} \to \text{expression} \to \text{expression} \to \cdots \to \text{value}
$$

Each $\to$ is one atomic step. A **value** is an expression that cannot reduce further (a final result).

$$
e \to e'
$$

reads: **"expression $e$ reduces to expression $e'$ in one step."**

### Big-Step Operational Semantics

The notation $e \Downarrow v$ means **"$e$ evaluates to value $v$"** — not in one step, but in as many steps as needed.

## Type Systems

### Invariants

What guarantee do you want the type system to provide?

> **"A file handle must be closed exactly once. After it's closed, it can't be used."**

> **"Tensor dimensions must be compatible across operations. A matmul requires contracting dimensions to match."**

### Types

For file handles: $\text{Owned File}$ (must be closed) and $\text{Closed}$ (can't be used).

For tensors: $\text{Tensor}[N, M, \text{float}]$ (type parameterized by dimension values).

### Introduction Rules

How do values of each type come into existence?

$$
\frac{}
{\Gamma \vdash open(path) : \text{Owned File}}
$$

$$
\frac{\Gamma \vdash f : \text{Owned File} \text{ or } \text{Borrowed File}}
{\Gamma \vdash borrow(f) : \text{Borrowed File}}
$$

$$
\frac{\Gamma \vdash a : \text{Tensor}[M, K, \text{float}] \qquad \Gamma \vdash b : \text{Tensor}[K, N, \text{float}]}
{\Gamma \vdash matmul(a, b) : \text{Tensor}[M, N, \text{float}]}
$$

### Elimination Rules

How are values of each type used?

$$
\frac{\Gamma \vdash f : \text{Owned File}}
{\Gamma \vdash close(f) : \text{Unit}}
\qquad\text{($f$ consumed, becomes unavailable)}
$$

$$
\frac{\Gamma \vdash f : \text{Borrowed File}}
{\Gamma \vdash read(f) : (\text{Borrowed File}, \text{str})}
\qquad\text{(borrowed handle returned for continued use)}
$$

$$
\frac{\Gamma \vdash a : \text{Tensor}[N, M, \text{float}] \qquad \Gamma \vdash i : \text{Index}[N] \qquad \Gamma \vdash j : \text{Index}[M]}
{\Gamma \vdash a[i, j] : \text{float}}
$$

### Metatheories

What would you prove about this system?

> *If $\Gamma \vdash e : T$ and $e \to e'$, then $\Gamma \vdash e' : T$ (preservation).*

> *If $\Gamma \vdash e : \text{Owned File}$, then in any complete evaluation, $close(e)$ is called exactly once.*

### Examples

Construct programs that *should* type-check and programs that *shouldn't*. Walk through the rules for each.

**Well-typed:**

```python
f = open("data.txt")          # f : Owned File
data = read(borrow(f))        # f still Owned File, data : str
close(f)                      # f consumed, Unit
# f can't be used here — type error
```

**Ill-typed (file never closed):**

```python
f = open("data.txt")
data = read(borrow(f))
return data                   # TYPE ERROR: Owned File f not consumed
```

**Ill-typed (file used after close):**

```python
f = open("data.txt")
close(f)                      # f consumed
data = read(borrow(f))        # TYPE ERROR: f no longer available
```

### Design Spaces

Every type system is a point in a design space with these axes:

| Axis | Range | Example |
|---|---|---|
| **Correctness** | Prevent all errors $\to$ Prevent some | ML (all) vs. C (some) |
| **Annotation burden** | Fully annotated $\to$ Fully inferred | Java vs. Haskell vs. OCaml |
| **Expressiveness** | Reject more safe programs $\to$ Accept more | Simple types vs. dependent types |
| **Decidability** | Always terminates $\to$ May diverge | HM vs. full dependent types |
| **Complexity** | Simple rules $\to$ Complex metatheory | STLC vs. Rust's borrow checker |

Great type systems find a **sweet spot** on these axes for their intended use case.
