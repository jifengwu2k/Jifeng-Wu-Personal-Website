---
title: "llama.cpp Workflow: Download, Convert, Quantize, and Serve Models"
date: 2026-08-08
categories:
  - "AI and Machine Learning"
tags:
  - "reference"
  - "llm"
  - "llama.cpp"
  - "gguf"
  - "quantization"
---

llama.cpp supports **90+ model architectures** through its `convert_hf_to_gguf.py` conversion script. The architecture is auto-detected from the model's `config.json`.

Run `python convert_hf_to_gguf.py --print-supported-models` to see the full list for your version of llama.cpp.

---

## Workflow: Download → Convert → Quantize → Serve

### 1. Install prerequisites

**Python packages** (for downloading and converting models):

```bash
pip install huggingface_hub transformers torch gguf sentencepiece tiktoken
```

### 2. Download a model from Hugging Face

```bash
hf download Qwen/Qwen2.5-0.5B-Instruct --local-dir ~/Qwen/Qwen2.5-0.5B-Instruct
```

### 3. Convert to bf16 GGUF

```bash
python llama.cpp/convert_hf_to_gguf.py ~/Qwen/Qwen2.5-0.5B-Instruct --outtype bf16 --outfile ~/Qwen/Qwen2.5-0.5B-Instruct-BF16.gguf
```

> **Why bf16?** Most modern models are trained in bfloat16. Converting to bf16 preserves the original precision perfectly and serves as a lossless starting point before quantization.

### 4. Quantize

```bash
llama-quantize \
    ~/Qwen/Qwen2.5-0.5B-Instruct-BF16.gguf \
    ~/Qwen/Qwen2.5-0.5B-Instruct-Q4_K_M.gguf \
    Q4_K_M
```

Common quant choices:

| Type | Size (0.5B model) | Quality |
|---|---|---|
| `Q4_K_M` | ~0.4 GB | ✅ Best all-round |
| `Q5_K_M` | ~0.5 GB | Better quality |
| `Q8_0` | ~0.7 GB | Near-lossless |
| `IQ3_M` | ~0.3 GB | Smaller, decent |
| `IQ4_NL` | ~0.4 GB | Good quality/size |

### 5. Serve

```bash
llama-server -m ~/Qwen/Qwen2.5-0.5B-Instruct-Q4_K_M.gguf
```

The server is now available at:

- **Chat completions:** `http://127.0.0.1:8080/v1/chat/completions`
- **Web UI:** `http://127.0.0.1:8080/`

### 6. Test with curl

```bash
curl http://127.0.0.1:8080/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "messages": [{"role": "user", "content": "Hello, who are you?"}],
        "temperature": 0.7,
        "max_tokens": 256
    }'
```
