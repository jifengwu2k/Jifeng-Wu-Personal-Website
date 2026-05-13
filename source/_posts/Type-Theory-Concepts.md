---
title: "Type Theory Concepts: A to Z"
date: 2026-05-13
updated: 2026-05-13
categories:
  - "Programming"
tags:
  - "type-theory"
  - "reference"
  - "programming-languages"
excerpt: An introduction to type theory concepts using Python, C++, and layman's terms.
---

Type theory is the study of *what values can flow where* — it's the formal backbone behind every type checker you've used, from Python's `mypy` to Rust's borrow checker to C++20 concepts. If you've ever wondered what inference rules actually mean, how a compiler decides your code is well-typed, or what "operational semantics" really refers to, this post is for you.

We'll walk through key concepts in alphabetical order, grounding each in Python or C++ code so you can map the formalism to something concrete.

## Bidirectional Type Checking and Inference Example

At the heart of many modern type checkers is **bidirectional type checking** — a two-mode algorithm where `check` verifies that an expression has a given type, and `infer` discovers the type from the expression itself. They call each other recursively. Observe:

```python
from dataclasses import dataclass


# ---- Expression forms ----

@dataclass(frozen=True)
class Expression:
    """Base class for all expression forms."""


@dataclass(frozen=True)
class Variable(Expression):
    name: str


@dataclass(frozen=True)
class Lambda(Expression):
    param: str
    body: Expression


@dataclass(frozen=True)
class Apply(Expression):
    func: Expression
    arg: Expression


@dataclass(frozen=True)
class Literal(Expression):
    value: int


@dataclass(frozen=True)
class Add(Expression):
    left: Expression
    right: Expression


# ---- Type forms ----

@dataclass(frozen=True)
class Type:
    """Base class for all type forms."""


@dataclass(frozen=True)
class IntType(Type):
    pass


@dataclass(frozen=True)
class FunctionType(Type):
    param: Type
    ret: Type


Context = dict[str, Type]


# ---- Bidirectional type checker ----

def check(ctx: Context, expr: Expression, expected: Type) -> None:
    """Verify that expr has type `expected` in context `ctx`. Raise TypeError if not."""
    match expr:
        case Literal():
            if not isinstance(expected, IntType):
                raise TypeError(f"literal has type Int, not {expected}")

        case Variable(name):
            if name not in ctx:
                raise TypeError(f"unbound variable: {name}")
            actual = ctx[name]
            if actual != expected:
                raise TypeError(f"{name}: {actual}, expected {expected}")

        case Lambda(param, body):
            # Must be a function type
            if not isinstance(expected, FunctionType):
                raise TypeError(f"lambda has function type, not {expected}")
            # Check body under extended context
            new_ctx = {**ctx, param: expected.param}
            check(new_ctx, body, expected.ret)

        case Apply(func, arg):
            # Infer the function type, then check the argument
            func_ty = infer(ctx, func)
            if not isinstance(func_ty, FunctionType):
                raise TypeError(f"applying non-function of type {func_ty}")
            check(ctx, arg, func_ty.param)
            if func_ty.ret != expected:
                raise TypeError(f"application returns {func_ty.ret}, expected {expected}")

        case Add(e1, e2):
            check(ctx, e1, IntType())
            check(ctx, e2, IntType())
            if not isinstance(expected, IntType):
                raise TypeError(f"addition has type Int, not {expected}")

        case _:
            raise TypeError(f"cannot check {expr}")


def infer(ctx: Context, expr: Expression) -> Type:
    """Infer the type of `expr` in context `ctx`."""
    match expr:
        case Literal():
            return IntType()
        case Variable(name):
            if name not in ctx:
                raise TypeError(f"unbound variable: {name}")
            return ctx[name]
        case Lambda():
            raise TypeError("cannot infer lambda type without annotation")
        case Apply(func, arg):
            func_ty = infer(ctx, func)
            if not isinstance(func_ty, FunctionType):
                raise TypeError(f"applying non-function of type {func_ty}")
            check(ctx, arg, func_ty.param)
            return func_ty.ret
        case Add(e1, e2):
            check(ctx, e1, IntType())
            check(ctx, e2, IntType())
            return IntType()
        case _:
            raise TypeError(f"cannot infer type of {expr}")
```

## Fixed-point Combinator

A lambda expression `f` that can't refer to itself by name can still express recursion through a **fixed-point combinator**: a function `g` that operates on another function, such that `g(f)` behaves like `f(g(f), ...)`, effectively tying the recursive knot. In C++, this maps to a template struct that passes `*this` into a lambda as the recursive self-reference, and the compiler optimizes it to zero overhead.

See [Fixed-point Combinators, Tying the Recursive Knot, and Recursive Lambda Expressions](/2023/03/01/Type-Theoretic-Constructs-in-CXX/#Fixed-point-Combinators-Tying-the-Recursive-Knot-and-Recursive-Lambda-Expressions) for the full implementation with LLVM IR.

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

**Notation:** $\Gamma \vdash e : \tau$ reads "under context $\Gamma$, expression $e$ has type $\tau$." $\Gamma$ is a mapping from variable names to types — the set of variables currently in scope. $\tau$ (tau) is a type.

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

Now that you can read inference rules and understand how evaluation proceeds, we turn to the type-level side: how do type systems support polymorphism?

## Type Abstractions

**Type abstractions** let you write a function once and use it at many types. In C++ this is `template <typename X> auto id(X x) { return x; }` — a single definition that works for `int`, `string`, or any other type. Instantiating it at a concrete type (`id<int>`) is called a *type application*. The compiler inlines these aggressively — a `double_<int>([](int x) { return 2 * x; })` call compiles down to a single `shl` instruction.

See [Type Abstractions and Template Functions](/2023/03/01/Type-Theoretic-Constructs-in-CXX/#Type-Abstractions-and-Template-Functions) for the full implementation with LLVM IR.

## Type Classes

**Type classes** answer "I want to say this type supports equality without inheritance." C++20 **concepts** implement this for templates: you declare a predicate like `template <typename T> concept Eq = requires (T t) { { t == t } -> std::same_as<bool>; };` and the compiler enforces it *at the template interface*, not deep in the instantiation. The error message improves from a cryptic iterator-subtraction failure to a clear "concept not satisfied."

See [Type Classes and Concepts in C++](/2023/03/01/Type-Theoretic-Constructs-in-CXX/#Type-Classes-and-Concepts-in-C) for the full comparison, including Haskell-to-C++ concept mappings.

You've now seen inference rules up close, and you know how type abstractions and type classes generalize code over types. It's time to put it all together: what does it mean to *design* a type system?

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
| **Correctness** | Prevent all errors $\to$ Prevent some | OCaml (all) vs. C (some) |
| **Annotation burden** | Fully annotated $\to$ Fully inferred | Java (verbose) vs. OCaml (mostly inferred) |
| **Expressiveness** | Reject more safe programs $\to$ Accept more | Simple types vs. dependent types |
| **Decidability** | Always terminates $\to$ May diverge | OCaml/Haskell inference vs. dependent types |
| **Complexity** | Simple rules $\to$ Complex metatheory | Simple type systems vs. Rust's borrow checker |

Great type systems find a **sweet spot** on these axes for their intended use case.
