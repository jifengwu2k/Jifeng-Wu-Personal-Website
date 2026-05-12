---
title: vLLM Internals — PagedAttention and Custom Accelerator Compilation
date: 2026-05-12
categories:
  - "AI and Machine Learning"
tags:
  - "reference"
  - "llm"
  - "inference"
  - "vllm"
  - "machine-learning"
  - "systems"
  - "pytorch"
excerpt: How vLLM applies OS-style paging to the KV cache for efficient memory management, enables continuous batching and memory sharing, and routes computation graphs to custom compiler backends for new accelerator platforms.
---

## PagedAttention: Origin and Benefits

The deployment of large language models in production environments presents unique computational, infrastructural, and theoretical challenges.

When a user submits a prompt, the model processes the entire input sequence simultaneously in a phase known as the **"prefill"** stage. During this stage, the model computes and stores the contextual states for every token in the prompt. The actual generation of the response occurs through **"autoregressive decoding,"** where the model generates one token at a time. Each newly generated token is appended to the original sequence, and the model then processes this extended sequence to predict the next token.

If the model had to mathematically re-evaluate every preceding token to generate each next token, the computational overhead would become prohibitive. To avoid this, inference engines use a **Key-Value (KV) cache**, which functions as the model's short-term memory. During the prefill stage, the model computes Key and Value tensors for every token and stores them in this cache. When predicting the next token, it only needs to calculate the state of the newest token while reusing the cached context of all previous tokens.

While the KV cache solves the compute bottleneck, it creates a major memory bottleneck. As sequences grow longer, the KV cache scales dynamically and consumes enormous amounts of VRAM. Traditional inference libraries often allocate contiguous blocks of memory for the maximum possible sequence length. Because actual output lengths are unpredictable and usually shorter than the maximum, large amounts of GPU memory remain reserved but unused.

If a user needs only 50 output tokens but the system reserves space for 2000, the unused 1950 token slots are wasted. This is **internal fragmentation**. In addition, contiguous allocation leaves gaps between memory regions that may be too small to reuse, causing **external fragmentation**.

vLLM addresses these issues by applying the operating-system concepts of virtual memory and paging to the GPU KV cache. In operating systems, physical RAM is divided into fixed-size chunks called page frames, while programs use logical addresses that are mapped to physical pages.

**PagedAttention** adapts this idea by breaking the KV cache into small, fixed-size blocks instead of one large contiguous region. Each block stores the key and value tensors for a fixed number of tokens. In this analogy, blocks act like memory pages, tokens act like bytes, and generation requests act like active processes.

When a prompt arrives, vLLM allocates only the exact number of physical blocks needed for that prompt. As new tokens are generated, additional fixed-size blocks are allocated on demand. vLLM keeps a lightweight page table for each active sequence, mapping the logical token sequence to physical memory blocks that may be scattered across the GPU.

During attention computation, the PagedAttention kernel consults the page table, streams the non-contiguous blocks into shared memory, and computes attention as usual. Because blocks are uniform in size, external fragmentation is eliminated, and internal fragmentation is limited to the unused slots in the final block of a sequence. This efficient memory management allows the GPU to support many more concurrent sequences.

### Continuous Batching

Block-level memory management also enables **continuous batching**, also called rolling batching. Traditional static batching processes a fixed group of requests together and forces the batch to wait until the longest request finishes before admitting new ones. This can leave hardware underutilized.

With continuous batching, vLLM dynamically inserts new requests into the batch as soon as GPU resources become available. This improves utilization and throughput.

### Memory Sharing Between Requests

PagedAttention also enables **memory sharing between requests**. If multiple users submit prompts that contain the same large shared context, such as the same document, vLLM can let their page tables point to the same physical KV-cache blocks instead of duplicating them. This reduces both memory use and time to first token.

## Compilation for Custom Accelerators

vLLM uses PyTorch Dynamo through `torch.compile` to trace the model's forward pass and capture it as a computation graph. This graph is represented as a PyTorch `fx.GraphModule`. An `fx.GraphModule` is a specialized PyTorch class and a subclass of `torch.nn.Module` that contains three main components:

1. A **Graph**: the intermediate representation consisting of connected nodes that represent executed operations such as matrix multiplications, parameter access, and function calls.
2. **Parameters and state**: the original module's weights and attributes.
3. **Generated code**: a dynamically generated `forward()` method that preserves the mathematical semantics of the captured graph.

To route the graph to a custom compiler for a new accelerator platform:

1. You must implement a hardware-specific `Platform` class, which inherits from `vllm.platforms.interface.Platform`.
2. The hardware-specific `Platform` class must override `get_compile_backend` to point to the custom compiler backend.
3. The custom compiler backend must implement vLLM's compiler interface, specifically the `compile` method.
4. The custom `compile` method must take an `fx.GraphModule`, `example_inputs`, and the `compiler_config`, compile the `fx.GraphModule` for the target hardware, and return a Python callable along with a handle used for caching.
    - Because the result is a normal callable, vLLM's execution loop does not need to know the runtime's internal details.
    - During the forward pass, the model executor simply calls the returned function and passes runtime tensors as standard arguments.
