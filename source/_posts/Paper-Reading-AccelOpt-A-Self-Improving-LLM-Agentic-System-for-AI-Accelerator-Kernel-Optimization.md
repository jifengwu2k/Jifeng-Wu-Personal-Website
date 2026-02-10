---
title: "Paper Reading: AccelOpt: A Self-Improving LLM Agentic System for AI Accelerator Kernel Optimization"
date: 2025-12-11
categories:
  - "Computer Architecture, Operating Systems, Computer Networks, Distributed Systems"
tags:
  - Paper Readings
---

## Summary

### Approach

- Agentic workflow: Three LLM-based agents (Planner, Executor, Summarizer):
	- Planner: proposes optimization plans.
	- Executor: codes up, tests, measures kernels.
	- Summarizer: distills and records useful strategies.
- Optimization memory: Past experiences (slow-fast kernel pairs, code snippets, and summarized optimization lessons) are stored and reused in future searches.
- Beam search: LLM agents generate and iteratively improve candidate kernels in parallel.

> Prompts included in the appendix.
> 
> Agent suitability: The executor agent’s LLM quality is most critical; planner quality is less sensitive.

### Benchmark & Evaluation

- NKIBench: a new benchmark suite of Trainium kernels (from real LLM workloads) with peak performance estimates for each task.
- Experiments on AWS Trainium 1 and 2: Measured:
    - Average % of peak throughput ("absolute" optimization metric).
    - Whether AccelOpt could match or beat proprietary models like Claude Sonnet 4 in both performance and cost.

### Limitations

- For very hard or poorly specified kernels, performance may plateau.
- The efficiency of self-improvement is limited by the quality/capability of the underlying LLM, especially for coding/execution.
- Currently focuses on single-core kernels, not (yet) on multi-core/large-scale parallelism.

## Ideas

Investigate the Executor, especially how it transforms fuzzy natural language into precise commands.
