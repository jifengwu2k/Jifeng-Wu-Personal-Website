---
title: 'Hugging Face Model Repositories: Organization, Semantics, and Portability'
date: 2026-05-04
updated: 2026-05-04
categories:
  - "AI and Machine Learning"
tags:
  - "reference"
  - "huggingface"
  - "machine-learning"
  - "model-deployment"
excerpt: A practical mental model for what a Hugging Face model repository actually contains, where the model definition lives, and how to think about portability to separate runtimes.
---

## What a Hugging Face model repository is

A Hugging Face model repository does not necessarily contain a complete, formal description of the model computation. It is best understood as a **versioned artifact repository**. A typical repository contains:

```text
README.md
config.json
generation_config.json
tokenizer.json
tokenizer_config.json
special_tokens_map.json
model.safetensors.index.json
model-00001-of-000NN.safetensors
model-00002-of-000NN.safetensors
...
optional custom Python files
```

- `config.json` contains metadata and hyperparameters, but it does not fully define arbitrary model semantics.
- `safetensors` contains named tensors, but tensor names are only conventions unless interpreted by code.

## Where the model definition lives

There is usually no separate file called a "model definition." Instead, model structure is determined by a combination of:

```text
config.json
+ Transformers built-in implementation
+ optional custom Python code
```

### Standard Transformers-supported models

For known architectures, `config.json` contains fields such as:

```json
{
  "model_type": "llama",
  "architectures": ["LlamaForCausalLM"],
  "hidden_size": 4096,
  "num_hidden_layers": 32,
  "num_attention_heads": 32,
  "num_key_value_heads": 8,
  "intermediate_size": 11008,
  "vocab_size": 32000
}
```

In this case, the model definition is not stored in the repository; it is supplied by the installed `transformers` library. `transformers` reads `model_type` and maps it to an internal Python implementation.

### Custom models

If the architecture is not built into `transformers`, the repository may include files such as:

```text
configuration_my_model.py
modeling_my_model.py
```

The `config.json` may contain an `auto_map` field:

```json
{
  "model_type": "my_model",
  "auto_map": {
    "AutoConfig": "configuration_my_model.MyModelConfig",
    "AutoModelForCausalLM": "modeling_my_model.MyModelForCausalLM"
  }
}
```

Users then load the model with:

```python
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained(
    "your-org/your-model",
    trust_remote_code=True,
)
```

This downloads and executes Python code from the repository.

## Hugging Face as an artifact host for a separate runtime

A separate optimized runtime can use Hugging Face only as a host for:

```text
config.json
*.safetensors
tokenizer.json
generation_config.json
README.md
```

Most runtimes do not support arbitrary HF repositories. They support a known list of architectures:

```text
llama
mistral
qwen2
mixtral
deepseek_v3
gemma
custom_runtime_format_v1
```

Internally, they have architecture-specific loaders:

```text
LlamaLoader
QwenLoader
MixtralLoader
DeepSeekMoELoader
MyMoELoader
```

Each loader knows:

- expected config fields
- tensor naming patterns
- shape expectations
- attention layout
- RoPE conventions
- MLP/MoE structure
- quantization format
- how to pack weights
- how to construct the runtime execution plan

## Static framework conversion

There is no generally reliable path from:

```text
arbitrary HF custom model with PyTorch/Transformers code
```

to:

```text
correct and efficient ONNX/JAX/XLA implementation
```

Tracing and export tools may work for simple cases:

```text
torch.onnx.export
torch.export
torch.fx
torch.jit.trace
torch.jit.script
```

But they can fail or produce poor results when the model has:

- dynamic control flow
- shape-dependent behavior
- MoE routing
- custom kernels
- cache abstractions
- unsupported ops
- complex quantization
- backend-specific memory layouts

A correct and efficient port often requires:

```text
manual architecture reimplementation
manual weight conversion
adapter code
logit comparison tests
backend-specific optimization
```
