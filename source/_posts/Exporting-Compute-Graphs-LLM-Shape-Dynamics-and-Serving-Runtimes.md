---
title: Exporting Compute Graphs, LLM Shape Dynamics, and Serving Runtimes
date: 2026-05-03
categories:
  - "AI and Machine Learning"
tags:
  - "reference"
  - "llm"
  - "inference"
  - "systems"
  - "machine-learning"
  - "pytorch"
  - "vllm"
excerpt: Why CNNs export to one graph while LLMs need many, how Hugging Face hides this complexity through eager execution, and why vLLM-style systems act as specialized inference operating systems rather than simple API wrappers.
---

## Exporting compute graphs

When exporting a model to **ONNX** or **StableHLO**, we usually provide a **sample input**. This is needed so the framework can determine:

- input **shape**
- input **dtype**
- input/output **structure**
- which **control-flow path** is taken

In that sense, export often involves some form of **tracing**.

## CNNs usually have one graph; LLMs often have many

This export model works especially well for **CNNs** and other workloads with mostly static shapes.

### Why CNNs are simpler

A CNN often has:

- fixed-rank inputs
- fixed image sizes or a very small set of allowed sizes
- no persistent decode-time state
- one-shot forward execution

So in practice, one exported graph is often enough, or at least a very small number of graphs.

### Why LLMs are harder

LLMs are much more dynamic. They usually involve:

- variable **sequence length**
- variable **batch size**
- separate **prefill** and **decode** phases
- **KV cache** carried from step to step
- generation loops with runtime stopping behavior

This means one graph is often not enough.

### Prefill vs. decode

These phases are naturally different programs:

- **Prefill** processes the full prompt and initializes/populates KV cache.
- **Decode** processes one or a few new tokens while reusing and updating KV cache.

They differ in:

- tensor shapes
- attention behavior
- performance goals
- memory access patterns

So in practice they are often exported or compiled separately.

### KV cache and functionalization

A major issue is the **KV cache**. Export IRs such as ONNX and StableHLO prefer **pure tensor functions**, so hidden mutation is awkward.

The model signature effectively becomes something like:

```text
(logits, new_cache) = f(tokens, old_cache, position, ...)
```

rather than:

```text
logits = f(tokens)
```

To avoid retracing at every decode step, systems usually make the cache shape **fixed-capacity** and pass an explicit write position.

## Hugging Face relies on PyTorch eager execution, so this complexity is mostly hidden

For the ordinary user running:

```python
model.generate(...)
```

most of the graph/export complexity is not visible.

The key reason is **PyTorch eager execution**.

It naturally tolerates:

- changing sequence lengths
- explicit cache objects
- Python-side generation loops
- runtime control flow for sampling/stopping

So Hugging Face does not need to force the entire generation process into one static exported graph.

Conceptually, generation is more like a runtime loop than a single graph:

1. tokenize prompt
2. run **prefill** on full prompt
3. receive **past_key_values** (KV cache)
4. repeatedly run **decode** with the newest token plus cache
5. sample/select the next token
6. stop when criteria are met

Users do not need to think about:

- symbolic dimensions
- many exported graph variants
- compiler IRs
- functionalized state signatures

Instead they just call a high-level API and PyTorch eager handles the shape and execution flexibility at runtime.

### Tradeoff

This simplicity comes with a tradeoff:

- excellent flexibility and ergonomics
- but not always the best possible throughput or latency under load

So eager execution is what makes Hugging Face feel straightforward, but it is not necessarily the final word in serving performance.

## In contrast, vLLM and similar systems are specialized LLM inference operating systems

At first glance, systems like **vLLM** may look like they mainly provide a clean or OpenAI-compatible API. But that API is only the surface. Their deeper role is to act as highly specialized **LLM inference runtimes**.

### Why an API wrapper is not enough

A naïve server could simply:

- receive a request
- call Hugging Face `generate()`
- return the result

That works, but it wastes performance under realistic multi-user load.

Problems include:

- poor batching behavior
- KV cache memory fragmentation
- Python overhead per request and per token
- weak GPU utilization
- difficulty mixing long and short requests efficiently

### What specialized systems actually do

These runtimes often implement:

- **continuous batching**
- request scheduling at the **token level**
- advanced **KV cache management**
- better memory utilization
- lower latency and higher throughput under load
- streaming and production serving features
- integration with specialized kernels and quantization
- multi-GPU and distributed serving support

### Why "inference operating system" is a useful phrase

LLM serving is not just stateless batch inference. It is more like managing many stateful token streams concurrently.

Each request has:

- its own prompt length
- its own decode progress
- its own KV cache state
- its own stopping condition

The runtime must decide:

- which requests to batch together
- when to run prefill vs. decode
- how to place/cache memory efficiently
- how to keep the GPU busy

That is much closer to a scheduling/runtime problem than to a simple model API wrapper.
