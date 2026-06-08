---
title: vLLM Platform System
date: 2026-06-07
updated: 2026-06-07
categories:
  - "AI and Machine Learning"
tags:
  - "vllm"
  - "llm"
  - "reference"
  - "systems"
  - "python"
  - "software-engineering"
excerpt: A deep dive into vLLM's plugin-based platform architecture, Python entry points, auto-detection pipeline, and how to add a new out-of-tree hardware platform.
---

# vLLM Platform System

## Overview

vLLM uses a **plugin-based platform architecture** that allows new hardware platforms to be supported **without modifying vLLM core source code**. A new platform integrates by:

1. Subclassing the `Platform` base class and overriding key methods
2. Publishing a Python package with a detector function as a `vllm.platform_plugins` entry point

vLLM discovers and activates the platform at runtime through Python's standard entry point system. Once activated, the `vllm.platforms.current_platform` platform singleton is used polymorphically by ~300 files of core vLLM code.

---

## Python's Entry Point System

### What Are Entry Points?

Entry points are a Python packaging standard (PEP 621 / `importlib.metadata`) that let a package **advertise named hooks**. Think of it as a **runtime plugin registry** built into the Python packaging system.

### How They Work

**1. A plugin package declares entry points** in its `pyproject.toml`:

```toml
[project.entry-points."myapp.plugins"]
plugin_a = "my_package.module:some_function"
plugin_b = "another_package:AnotherClass"
```

**2. The host application discovers plugins by group name:**

```python
from importlib.metadata import entry_points

# Discover all plugins registered under "myapp.plugins"
discovered = entry_points(group="myapp.plugins")
# → (EntryPoint(name="plugin_a", value="my_package.module:some_function"), ...)

for ep in discovered:
    print(f"Found: {ep.name} → {ep.value}")
    func = ep.load()  # Dynamically imports and returns the callable
    result = func()   # Invoke it
```

---

## vLLM's Platform Architecture

### Key Files

| File | Role |
|---|---|
| `vllm/platforms/interface.py` | Base `Platform` class (~600 lines), plus `DeviceCapability`, `PlatformEnum` |
| `vllm/platforms/__init__.py` | Plugin loading, auto-detection, lazy `current_platform` singleton |
| `vllm/plugins/__init__.py` | Generic entry-point plugin loader (`load_plugins_by_group`) |
| `vllm/platforms/cuda.py` | `CudaPlatform` — NVIDIA GPUs |
| `vllm/platforms/rocm.py` | `RocmPlatform` — AMD GPUs |
| `vllm/platforms/xpu.py` | `XPUPlatform` — Intel GPUs |
| `vllm/platforms/tpu.py` | `TpuPlatform` — Google TPUs |
| `vllm/platforms/cpu.py` | `CpuPlatform` — x86/ARM CPU inference |
| `vllm/platforms/zen_cpu.py` | `ZenCpuPlatform` — AMD Zen CPUs with zentorch |

### The Platform Base Class (the Contract)

Every platform subclasses `Platform` and overrides any number of ~50 classmethods and properties. The base class provides sensible defaults (typically no-op or `NotImplementedError`) so platforms only override what they need.

### The Auto-Detection Pipeline

Platform detection happens **lazily** the first time `vllm.platforms.current_platform` is accessed. The module-level `__getattr__` in `vllm/platforms/__init__.py` triggers `resolve_current_platform_cls_qualname()`, which runs the following pipeline:

- **Load builtin detection functions**:
   - `tpu_platform_plugin()`
   - `cuda_platform_plugin()`
   - `rocm_platform_plugin()`
   - `xpu_platform_plugin()`
   - `cpu_platform_plugin()`
- **Load out-of-tree (OOT) detection functions** from `entry_points(group="vllm.platform_plugins")`.

The loaded detection functions (builtin and OOT) follow a consistent pattern: **try to detect hardware presence statelessly, return the qualified class name or `None`**:

```python
def cuda_platform_plugin() -> str | None:
    try:
        import pynvml
        pynvml.nvmlInit()
        if pynvml.nvmlDeviceGetCount() > 0:
            return "vllm.platforms.cuda.CudaPlatform"
    except Exception:
        pass
    return None
```

Then:

- **Resolve exactly one platform.** OOT plugins take priority over builtins:
   - If exactly 1 OOT plugin activates → use it
   - If 0 OOT and exactly 1 builtin activates → use it
   - If 0 total → fall back to `UnspecifiedPlatform` (no-op stub)
   - If ≥2 of either → raise `RuntimeError` (ambiguous)
- **Instantiate the singleton**.
   - Dynamically imports the resolved class and instantiates it.
   - Stored in the module-level `_current_platform` variable for the process lifetime.

### The `vllm.platforms.current_platform` Singleton

vLLM core code dispatches behavior through `vllm.platforms.current_platform` — it's referenced in over 300 files. There are two main dispatch patterns:

### Pattern 1: Type Checks (Inline Branching)

Used when the difference between platforms is fundamental or when only a few cases need special-casing:

```python
# vllm/v1/sample/ops/topk_topp_sampler.py
if current_platform.is_cpu():
    arch = current_platform.get_cpu_architecture()
    # ... CPU-specific sampler implementation
elif current_platform.is_xpu():
    # ... XPU-specific path
elif current_platform.is_cuda():
    capability = current_platform.get_device_capability()
    # ... CUDA-specific path
```

### Pattern 2: Polymorphic Classmethod Calls

Used for standardized interfaces where the platform provides the entire implementation:

```python
# vllm/config/vllm.py - platform config hooks
current_platform.pre_register_and_update()
current_platform.apply_config_platform_defaults(self)
current_platform.check_and_update_config(self)

# vllm/config/model.py
current_platform.verify_quantization(self.quantization)
max_model_len = current_platform.check_max_model_len(max_model_len)

# vllm/v1/attention/backends/fa_utils.py
if current_platform.is_xpu():
    from vllm.v1.attention.backends import flash_attn as flash_attn_xpu
    return flash_attn_xpu.XPUFlashAttentionBackend
```

### These patterns serve the same goal:

Core code **never** writes:

```python
# Anti-pattern: never in vLLM core
if torch.cuda.is_available():
    ...
elif hasattr(torch, 'xpu') and torch.xpu.is_available():
    ...
```

Instead, it always writes:
```python
if current_platform.is_cuda():
    ...
elif current_platform.is_xpu():
    ...
```

This abstraction means adding a new platform type doesn't require finding and updating every hardware-specific branch — the platform subclass provides all the answers through its overrides.

---

## Adding a New Out-of-Tree (OOT) Platform

Here is a minimal example of adding a custom platform without touching vLLM's source tree.

### Step 1: Create a Python package

```
my_vllm_platform/
├── pyproject.toml
└── my_platform/
    ├── __init__.py
    └── platform.py
```

### Step 2: Write the detector function

`my_platform/__init__.py`:

```python
def detect_my_platform() -> str | None:
    """
    Return the fully-qualified class name if our hardware is available,
    or None otherwise. Called by vLLM at platform resolution time.
    """
    try:
        import my_hardware_driver
        if my_hardware_driver.device_count() > 0:
            return "my_platform.platform.MyHardwarePlatform"
    except ImportError:
        pass
    return None
```

### Step 3: Write the `Platform` subclass

`my_platform/platform.py`:

```python
from vllm.platforms import Platform, PlatformEnum
from vllm.platforms.interface import DeviceCapability

class MyHardwarePlatform(Platform):
    _enum = PlatformEnum.OOT          # Out-of-Tree
    device_name = "my_hardware"
    device_type = "my_hardware"
    dispatch_key = "MyHardware"        # PyTorch dispatch key
    ray_device_key = "GPU"             # Ray accelerator key
    device_control_env_var = "MY_HW_VISIBLE_DEVICES"
    dist_backend = "nccl"              # or custom backend

    supported_quantization = ["fp8", "awq"]

    @property
    def supported_dtypes(self):
        return [torch.bfloat16, torch.float16, torch.float32]

    @classmethod
    def get_device_capability(cls, device_id=0):
        # Query your hardware for compute capability
        return DeviceCapability(major=9, minor=0)

    @classmethod
    def get_device_name(cls, device_id=0):
        return "MyHardware Accelerator v1"

    @classmethod
    def get_device_total_memory(cls, device_id=0):
        return 80 * 1024**3  # 80 GiB

    @classmethod
    def get_attn_backend_cls(cls, selected_backend, attn_selector_config, num_heads=None):
        # Select the right attention backend for your hardware
        from vllm.v1.attention.backends.registry import AttentionBackendEnum
        return AttentionBackendEnum.FLASH_ATTN.get_path()

    @classmethod
    def import_kernels(cls):
        # Import your platform's C++ extension modules
        import my_custom_kernels._C  # noqa

    @classmethod
    def import_ir_kernels(cls):
        # Import your IR op implementations
        import my_custom_kernels.ir_ops  # noqa

    @classmethod
    def check_and_update_config(cls, vllm_config):
        # Validate / adjust config for your hardware
        if vllm_config.cache_config.block_size < 32:
            vllm_config.cache_config.block_size = 32
```

### Step 4: Register the Entry Point

`pyproject.toml`:

```toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.backends._legacy:_Backend"

[project]
name = "my-vllm-platform"
version = "0.1.0"

[project.entry-points."vllm.platform_plugins"]
my_hardware = "my_platform:detect_my_platform"

# Declare dependency on vllm
[project]
dependencies = ["vllm"]
```

### Step 5: Install and Run

```bash
pip install -e ./my_vllm_platform
# vLLM will now auto-detect the platform when current_platform is first accessed
```
