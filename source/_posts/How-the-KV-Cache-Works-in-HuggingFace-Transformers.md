---
title: How the KV Cache Works in HuggingFace Transformers
date: 2026-05-31
categories:
  - "AI and Machine Learning"
tags:
  - "reference"
  - "llm"
  - "transformers"
  - "inference"
---

Every token a Transformer generates forces it to re-read the entire conversation so far. The **KV cache** is what makes this tractable — it stores the key and value projections of every past token so they aren't recomputed from scratch. HuggingFace models manage this through a `Cache` abstraction, and the default implementation, `DynamicCache`, is a clean example of the full mechanism: how the cache is created, how position IDs coordinate RoPE rotations and causal masking, how each attention layer reads and updates it, and how it's threaded through the generation loop.

This post walks through the KV cache system end-to-end, using Qwen3-0.6B as a concrete reference.

---

## 1. `DynamicCache`

`DynamicCache` is the default KV cache and the central state object threaded through every HuggingFace generation loop. It is created once at the start and passed through every `model.forward()` call. All 28 decoder layers share the same `DynamicCache` instance; each layer accesses its own slot via `cache[layer_idx]`, which returns a `DynamicLayer`.

### 1.1 Cache creation

When `use_cache=True` and no `past_key_values` is passed, `Qwen3Model.forward` constructs a fresh cache:

```python
# In Qwen3Model.forward():
if use_cache and past_key_values is None:
    past_key_values = DynamicCache(config=self.config)
```

At this point the cache is empty. Per-layer storage will be lazily initialised to:

| What   | Shape                                   |
|--------|-----------------------------------------|
| Keys   | `[batch, 8, total_seq_len, 64]`         |
| Values | `[batch, 8, total_seq_len, 64]`         |

For the full 28-layer model at sequence length `S` (bf16):

```
28 layers × 2 (K + V) × batch × 8 heads × S × 64 dim × 2 bytes = 57,344 × batch × S bytes
```

### 1.2 `position_ids`

`position_ids` is a tensor of shape `[batch_size, seq_len]` that assigns an absolute integer position to every token.

#### Creation in `Qwen3Model.forward`

If the caller doesn't supply `position_ids` (the common case), they are computed from the cache state:

```python
if position_ids is None:
    past_seen_tokens = past_key_values.get_seq_length() if past_key_values is not None else 0
    position_ids = torch.arange(inputs_embeds.shape[1], device=...) + past_seen_tokens
    position_ids = position_ids.unsqueeze(0)
```

- **Prefill (first call, no cache):** `past_seen_tokens = 0` → `position_ids = [[0, 1, 2, ..., prompt_len-1]]`
- **Decode step 1:** `past_seen_tokens = prompt_len` → `position_ids = [[prompt_len]]`
- **Decode step N:** `past_seen_tokens = prompt_len + N - 1` → `position_ids = [[prompt_len + N - 1]]`

#### Before the layer loop

After `position_ids` is created, `Qwen3Model.forward` computes two things once, *before* entering the 28-layer loop. Both are reused unchanged by every attention layer.

**RoPE position embeddings** (consumes `position_ids`):

```python
position_embeddings = self.rotary_emb(hidden_states, position_ids)
```

Inside `Qwen3RotaryEmbedding.forward`:

```python
# inv_freq:          [head_dim/2]  — fixed per-head-dimension inverse frequencies
# position_ids:      [batch, seq_len]

inv_freq_expanded = self.inv_freq[None, :, None].expand(batch, -1, 1)    # [batch, head_dim/2, 1]
position_ids_expanded = position_ids[:, None, :].float()                 # [batch, 1, seq_len]

freqs = (inv_freq_expanded @ position_ids_expanded).transpose(1, 2)      # [batch, seq_len, head_dim/2]
emb = torch.cat((freqs, freqs), dim=-1)                                  # [batch, seq_len, head_dim]
cos = emb.cos() * self.attention_scaling
sin = emb.sin() * self.attention_scaling
```

Each position `p` produces a rotation angle `θ_p = p / base^(2i/d)` for head-dimension pair `2i` and `2i+1`. The result `(cos, sin)` has shape `[batch, seq_len, head_dim]`.

**Causal mask** (consumes `past_key_values` and `position_ids`):

```python
mask_kwargs = {
    ...,
    "position_ids": position_ids,
}
causal_mask_mapping = {
    "full_attention": create_causal_mask(**mask_kwargs),
}
```

`create_causal_mask` uses `past_key_values` (for `kv_length` and `kv_offset`) together with `position_ids` to build an additive attention mask (0 for allowed, −∞ for forbidden). Each query position can only attend to key positions ≤ itself, and the mask spans the *full* cached key length, not just the current input slice.

### 1.3 Per-layer attention flow

Inside each of the 28 attention layers, the flow proceeds in four steps:

1. **Project & normalize:**
   ```python
   query_states = self.q_norm(self.q_proj(hidden_states).view(hidden_shape)).transpose(1, 2)
   key_states   = self.k_norm(self.k_proj(hidden_states).view(hidden_shape)).transpose(1, 2)
   value_states = self.v_proj(hidden_states).view(hidden_shape).transpose(1, 2)
   ```
   Q, K, V are projected, reshaped to `[batch, num_heads, seq_len, head_dim]`, and Q and K are layer-normalised via `Qwen3RMSNorm` on the head dimension (a Qwen3-specific detail).

2. **Apply RoPE** (consumes `position_embeddings` from §1.2):
   ```python
   cos, sin = position_embeddings
   query_states, key_states = apply_rotary_pos_emb(query_states, key_states, cos, sin)
   ```

3. **Update cache** (consumes `past_key_values`):
   ```python
   if past_key_values is not None:
       key_states, value_states = past_key_values.update(key_states, value_states, self.layer_idx)
   ```
   This calls `DynamicLayer.update()`:
   ```python
   def update(self, key_states, value_states, *args, **kwargs):
       if not self.is_initialized:
           self.lazy_initialization(key_states, value_states)
       self.keys   = torch.cat([self.keys,   key_states],   dim=-2)
       self.values = torch.cat([self.values, value_states], dim=-2)
       return self.keys, self.values
   ```
   The new KV tensors are **concatenated along the sequence-length dimension** (`dim=-2`). The returned `key_states` and `value_states` now contain **all historical tokens** plus the current token.

4. **Run attention** (consumes the causal mask from §1.2 and the full cached K/V from step 3):
   Attention operates over the concatenated tensors, masked by the pre-computed causal mask (via `ALL_ATTENTION_FUNCTIONS`, which dispatches to Flash Attention, SDPA, or eager).

### 1.4 Returning the cache

`Qwen3Model.forward` returns:

```python
BaseModelOutputWithPast(
    last_hidden_state=hidden_states,        # [batch, seq_len, 1024]
    past_key_values=past_key_values if use_cache else None,
)
```

`Qwen3ForCausalLM.forward` projects through `lm_head` and returns:

```python
CausalLMOutputWithPast(
    loss=loss,
    logits=logits,                          # [batch, seq_len, 151936]
    past_key_values=outputs.past_key_values, # DynamicCache with 28 updated layers
)
```

---

## 2. The Cost of `torch.cat`

`DynamicCache` is correct and safe, but its core mechanism — `torch.cat` on every decode step — has a performance cost worth understanding.

Each `DynamicLayer.update()` does:

```python
self.keys   = torch.cat([self.keys,   key_states],   dim=-2)
self.values = torch.cat([self.values, value_states], dim=-2)
```

This **allocates a brand-new tensor**, **copies the entire old buffer** into it, then frees the old one. At sequence length 4096 with bf16:

```
28 layers × 2 (K+V) × 4096 × 8 heads × 64 dim × 2 bytes = ~225 MB
```

That's ~225 MB allocated, copied, and freed on every decode step. Additionally, because the tensor shape and memory address change on every step, `torch.compile` cannot statically trace the decode loop — no CUDA graphs, and the Python interpreter runs between every token.

---

## 3. `StaticCache` — a Pre-Allocated Alternative

For use cases that need `torch.compile` and CUDA graphs, HuggingFace provides `StaticCache`, a pre-allocated, zero-copy alternative.

Instead of growing dynamically, `StaticCache` allocates one fixed-size slab per layer upfront and writes into it in-place with `index_copy_`:

```
DynamicCache (torch.cat):
  Step 0:  []           → cat → [●●●●]        alloc 4, copy 0
  Step 1:  [●●●●]       → cat → [●●●●●]       alloc 5, copy 4
  Step N:  [●●...N]     → cat → [●●...N+1]    alloc N+1, copy N

StaticCache (index_copy_):
  Setup:   [ _ _ _ _ _ _ _ _ ]     alloc once
  Step 0:  [●●●● _ _ _ _ ]         in-place write
  Step 1:  [●●●●● _ _ _ ]          in-place write
```

Because tensor pointers never change, `StaticCache` supports `torch.compile(fullgraph=True)` and CUDA graph capture. The trade-off is that `max_cache_len` must be known upfront — there is no auto-grow.

Usage is a simple change:

```python
from transformers import StaticCache

past_key_values = StaticCache(
    config=model.config,
    max_cache_len=prompt_len + max_new_tokens,
)
output = model.generate(**inputs, past_key_values=past_key_values, max_new_tokens=50)
```
