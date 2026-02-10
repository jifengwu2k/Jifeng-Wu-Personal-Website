---
title: 'Paper Reading: Registerless Hardware Description'
date: 2025-10-09
categories: 
- ["Research Inspiration"]
---

## Problem Addressed / Motivation

- **Traditional RTL (e.g., Verilog, VHDL):**
    - "Tyranny of the clock": Designers must manage schedulers and pipelining, making code verbose and non-portable.
    - All hardware state is modeled with explicit registers.

- **High-Level Synthesis (HLS):**
    - Difficult to express simple periodic operations.
    - Sequential semantics hinder natural concurrency/parallelism.

- **Need:** A better approach should:
    - Be expressive for all hardware use-cases (like RTL).
    - Be abstract enough for tools to automate pipelining/etc., not tie logic to clocks and registers.


## Background

- **Registers & Their Use-Cases:**
    - Synchronous Technology Backend: pipelining, synchronizers.
    - Synchronous Technology Interface: IO timing.
    - State: Carrying computation over cycles, FSM state, accumulators.

## Approach

- **DF-HDL (e.g., DFiant):**
    - Describes hardware by operations and dependencies (token stream), rather than cycles and registers.
    - Real-time constraints expressed directly as timers/rates.
    - State is managed via *signal history* (e.g., `.prev` gives access to past values), not explicit registers.
    - Registers for pipelining, balancing, etc., are inferred by the tool.

## What I Noticed: Relationship to [Functional Reactive Programming (FRP)](/2024/01/24/Paper-Reading-Asynchronous-Functional-Reactive-Programming-for-GUIs/)

### **Explicit Relation**

- Synchronous dataflow languages (Lustre, Signal) are cited as relatives/"grandfathers" of FRP (Elm).
- Deep similarity with FRP , especially around state propagation/events over time.
    - Elm's `foldp`, `map` ~ DFiant's `.prev`, stream operations.
    - Elm's "state over time" = DFiant's handling of accumulators, averages, etc.

### What's New/Different in DFiant

- Blends FRP ideas with HW-specific needs:
    - Interfaces with real hardware constraints (timers, IO, path balancing).
    - Explicit state distinction (commit/derived).
    - Enables automatic pipeline/register inference (not in pure FRP).

## 7. Strengths / Weaknesses

- **Strengths:**
    - More expressive and concise than both RTL and HLS in many cases.
    - Reduces manual handling of clock/register intricacies.

- **Limitations/Questions / To Investigate:**
    - Toolchain maturity, synthesis support?
      - How does debug/profiling work? Is Elm-like [time-travel debugging](https://www.youtube.com/watch?v=lK0vph1zR8s) supported?
    - Any classes of hardware difficult to describe?
    - How portable is generated code across synthesis targets?
    - Adoption in industry/real-world examples?
