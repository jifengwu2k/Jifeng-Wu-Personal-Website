---
title: Local CUDA vLLM Setup for Python-Only Development Using a Precompiled Wheel
date: 2026-05-19
categories:
  - "AI and Machine Learning"
tags:
  - "reference"
  - "vllm"
  - "llm"
  - "python"
  - "machine-learning"
  - "systems"
  - "linux"
excerpt: How to run vLLM directly from a local clone with editable Python code while using precompiled native libraries from a nightly wheel — no full source compilation required.
---

This guide shows how to:

- run `vllm` directly from a local clone
- make **Python-only** code changes in the repo
- use precompiled native libraries from a nightly wheel

This is useful when you want:

- editable Python code from your clone
- working native extensions (`vllm._C`, etc.)
- no full source compilation

## 1. Create and activate a virtual environment

From the repo root:

```bash
uv venv --python 3.12 --seed
source .venv/bin/activate
```

## 2. Inspect available nightly wheel variants

Check the nightly index:

```bash
curl -L https://wheels.vllm.ai/nightly/
```

Example output:

```html
<!DOCTYPE html>
<html>
  <!-- Generated on 2026-05-19T03:30:43.127052 (commit 287471b99442b44c5a16c4d70b0f3e178dd52732) -->
  <meta name="pypi:repository-version" content="1.0">
  <body>
    <a href="cpu/">cpu/</a><br/>
    <a href="cu129/">cu129/</a><br/>
    <a href="cu130/">cu130/</a><br/>
    <a href="vllm/">vllm/</a><br/>
  </body>
</html>
```

Notes:

- `cu129` = CUDA 12.9 wheel variant
- `cu130` = CUDA 13.0 wheel variant
- the HTML comment contains the latest built nightly commit

## 3. Pick a CUDA variant

For a server with CUDA 13.0 support, use:

```bash
cu130
```

To inspect that variant:

```bash
curl -L https://wheels.vllm.ai/nightly/cu130/vllm/metadata.json
```

Example output:

```json
[
  {
    "package_name": "vllm",
    "version": "0.21.1rc1.dev89+g287471b99",
    "python_tag": "cp38",
    "abi_tag": "abi3",
    "platform_tag": "manylinux_2_24_aarch64",
    "filename": "vllm-0.21.1rc1.dev89+g287471b99-cp38-abi3-manylinux_2_24_aarch64.whl",
    "path": "../../../287471b99442b44c5a16c4d70b0f3e178dd52732/vllm-0.21.1rc1.dev89%2Bg287471b99-cp38-abi3-manylinux_2_24_aarch64.whl"
  },
  {
    "package_name": "vllm",
    "version": "0.21.1rc1.dev89+g287471b99",
    "python_tag": "cp38",
    "abi_tag": "abi3",
    "platform_tag": "manylinux_2_24_x86_64",
    "filename": "vllm-0.21.1rc1.dev89+g287471b99-cp38-abi3-manylinux_2_24_x86_64.whl",
    "path": "../../../287471b99442b44c5a16c4d70b0f3e178dd52732/vllm-0.21.1rc1.dev89%2Bg287471b99-cp38-abi3-manylinux_2_24_x86_64.whl"
  }
]
```

Choose the entry matching your machine.

For a typical Linux x86_64 server, select:

```json
"platform_tag": "manylinux_2_24_x86_64"
```

### Python tag note

You may see:

```text
cp38-abi3
```

That is okay for Python 3.12 because the wheel uses the stable ABI.

## 4. Download the wheel file manually

Using the `x86_64` entry above:

```bash
curl -L "https://wheels.vllm.ai/287471b99442b44c5a16c4d70b0f3e178dd52732/vllm-0.21.1rc1.dev89%2Bg287471b99-cp38-abi3-manylinux_2_24_x86_64.whl" -o /tmp/vllm-cu130.whl
```

## 5. Sanity-check the wheel contents

```bash
python -m zipfile -l /tmp/vllm-cu130.whl | head -40
```

You should see native libraries such as:

```text
vllm/_C.abi3.so
vllm/_C_stable_libtorch.abi3.so
vllm/_moe_C.abi3.so
vllm/_flashmla_C.abi3.so
vllm/cumem_allocator.abi3.so
vllm/spinloop.abi3.so
```

If you see a `BrokenPipeError` at the end because of `| head`, that is harmless.

## 6. Install vLLM editable using the exact wheel file

Set the environment variables:

```bash
export VLLM_USE_PRECOMPILED=1
export VLLM_PRECOMPILED_WHEEL_LOCATION=/tmp/vllm-cu130.whl
```

Then install:

```bash
uv pip install -U -e . --torch-backend=cu130
```

Why use `VLLM_PRECOMPILED_WHEEL_LOCATION`?

- it bypasses flaky automatic wheel selection logic
- it forces the build to use the exact wheel you downloaded
- it still installs the package in editable mode from your local repo

## 7. Verify that Python loads from your clone

```bash
python -c "import vllm, inspect; print(inspect.getfile(vllm))"
```

Expected result:

```text
/home/ubuntu/vllm/vllm/__init__.py
```

This confirms that Python code is coming from your local clone.

## 8. Verify that the native extension loads

```bash
python -c "import vllm._C; print('ok')"
```

Expected output:

```text
ok
```

This confirms that the precompiled native library is usable.

## 9. Verify the CLI works

```bash
vllm --help
```

If this works, the setup is ready.

## 10. Run the server

Example:

```bash
CUDA_VISIBLE_DEVICES=0 vllm serve Qwen/Qwen2.5-1.5B-Instruct --host 0.0.0.0 --port 8000
```

In another shell, test it:

```bash
curl http://localhost:8000/v1/models
```

## 11. Development workflow

If you modify Python files under the repo, for example:

- `vllm/entrypoints/...`
- `vllm/engine/...`
- `vllm/core/...`
- other Python modules

then restart the process and your changes should be picked up.

You do **not** need to reinstall for normal Python-only changes.
