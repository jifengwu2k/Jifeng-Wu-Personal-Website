---
title: "Critique of \"RFSeek and Ye Shall Find: A tool for summary visualization and analysis of RFCs\""
date: 2026-04-16
updated: 2026-04-16
categories:
  - "Research Notes"
tags:
  - "paper-reading"
  - "llm"
  - "systems"
  - "visualization"
  - "software-engineering"
excerpt: A critique of RFSeek, arguing that provenance-linked RFC visualization is valuable but that the underlying methodology remains closer to a retrieval-augmented prompting pipeline than to an agentic, verification-centered protocol-analysis system.
---

[*RFSeek and Ye Shall Find*](https://arxiv.org/abs/2509.10216) addresses a real and important problem: RFCs are long, prose-heavy, internally cross-referential, and often underspecify operational behavior in their official diagrams. The paper's strongest contribution is its emphasis on **provenance-aware visualization**: extracted transitions are linked back to RFC text, which makes the output more auditable than prior diagram-recovery approaches. This is valuable.

That said, from a 2026 perspective, the paper's underlying methodology feels more like a **carefully engineered prompting pipeline** than a modern protocol-analysis system.

## The methodology is largely prompt engineering, not agentic analysis

Although the paper presents a multi-stage workflow, the core method is still a fixed sequence of LLM calls: partition the RFC, retrieve related passages, summarize chunks, extract transitions from summaries, and then ground transitions back to source text. The authors' own methodological discussion focuses primarily on **prompt variants**, such as whether to use targeted summaries, whether to include diagrams, and how to phrase the extraction request.

This is a reasonable 2024-2025 design, but in 2026 it reads as limited. The system does not appear to use an **agentic workflow** in which the model can decide what to inspect next, follow unresolved cross-references, challenge its own conclusions, or revisit earlier extractions after discovering contradictions. As a result, RFSeek looks more like a static LLM orchestration pipeline than a true reasoning system for protocol understanding.

## Provenance is a useful feature, but it is not operationalized strongly enough

One of RFSeek's main claims is that every edge can be traced back to RFC text. This is a meaningful contribution. However, the paper treats provenance mostly as **linked supporting passages**, not as a **first-class, checkable object**.

In other words, provenance is shown, but not deeply verified. The paper does not present a framework for testing whether:

- the cited passages actually entail the extracted transition,
- the transition is explicit versus inferred,
- the explanation overstates what the RFC says,
- there is counterevidence elsewhere,
- or the provenance should be downgraded to ambiguous or weakly supported.

This is especially important because the system also includes inferred transitions and synthesized logic. Once the method moves beyond direct extraction into interpretation, provenance needs to become more than citation display; it should become an explicit bridge between natural language evidence and structured claims, with its own validation criteria.

## The output is a visualization, not a runnable or verifiable artifact

The paper's end product is an interactive diagram. That is helpful for human exploration, but it is also a methodological limitation. Diagrams are inspectable, yet not strongly testable. They do not naturally support structural validation, trace replay, or formal analysis.

A stronger design would have the system produce a canonical machine-readable artifact—e.g. an evidence-carrying FSM or executable transition model—from which the visualization is derived. That would enable a genuine **Karpathy-style refinement loop**: generate a candidate model, run validators, inspect failures, repair the model, and repeat. Without such a loop, the paper remains dependent on qualitative plausibility and case-study interpretation rather than artifact-centered verification.

## What a stronger 2026 version would look like

The paper's ideas remain valuable, but the methodology would be more compelling if reframed around:

- an **agentic workflow** rather than a fixed prompt sequence,
- **on-demand retrieval and structural navigation** rather than global upfront chunking,
- a **canonical editable artifact** rather than a visualization-first output,
- a **"Karpathy-loop style refinement cycle"** in which the model produces a structured FSM, runs deterministic and semantic checks, and repairs failures, and
- **first-class provenance objects** that encode evidence, support type, justification, and ambiguity status, rather than just source links.

In that form, the system would not only visualize RFC logic but also iteratively construct and verify it.

## Overall assessment

RFSeek is a thoughtful and useful step toward more transparent RFC understanding tools. Its provenance-linked summaries are a genuine improvement over black-box extraction approaches, and the case studies show the practical value of surfacing protocol behavior omitted from official diagrams. However, its core methodology is still best understood as a **retrieval-augmented prompt pipeline**, not as a modern agentic or verification-centered system. The next step for this line of work is not merely better prompting, but a shift toward **artifact-based, tool-using, self-correcting protocol analysis**.
