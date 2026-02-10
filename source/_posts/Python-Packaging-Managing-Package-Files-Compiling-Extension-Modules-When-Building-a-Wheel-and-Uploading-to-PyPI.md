---
title: >-
  Python Packaging: Managing Package Files, Compiling Extension Modules When Building a Wheel, and Uploading to PyPI
date: 2025-07-11
categories:
- [DevOps]
---

# Managing Package Files

When creating a Python package, the location of files depends on your project structure.

## Basic `pyproject.toml` Configuration

```toml
[build-system]
requires = ["setuptools"]
build-backend = "setuptools.build_meta"

[project]
name = "your-package"  # PyPI name (can contain hyphens)
version = "0.1.0"
description = "A description of your-package"
readme = "README.md"
requires-python = ">=2"
license = "MIT"
authors = [
  { name="Jane Doe", email="jane.doe@example.com" }
]
classifiers = [
    "Programming Language :: Python :: 2",
    "Programming Language :: Python :: 3",
    "Operating System :: OS Independent"
]
dependencies = [
  "numpy"
]

[project.urls]
"Homepage" = "https://github.com/janedoe/my-package"
"Bug Tracker" = "https://github.com/janedoe/my-package/issues"
```

## Single Python File (or Extension Module) as Module

```
your-package/
  - pyproject.toml
  - your_package.py # or `your_package.cpython-312-x86_64-linux-gnu.so`, etc.
  - README.md
  - tests/
```

This single-file module will be copied into the site-packages directory during installation.

> ⚠️ This layout makes it difficult to include non-.py or non-extension data files (e.g., .json, .html). If you need to include such resources, use the folder-as-module approach described below.

## Folder as Module

```
your-package/
  - pyproject.toml
  - your_package/
    - __init__.py
    - module1.py
    - module2.py
    - subpackage1/
      - __init__.py
      - module_a.py
    - subpackage2/
      - __init__.py
      - module_b.py
    - utils/
      - __init__.py
      - helpers.py
    - data/
      - config.json
      - schema.sql
    - templates/
      - default.html
  - README.md
  - tests/
```

Each subfolder intended as a submodule must include an `__init__.py` file (even if empty).

Configure pyproject.toml:

```toml
[tool.setuptools]
# Importable package name (no hyphens allowed)
packages = ["your_package"]
package-dir = {"your_package" = "your_package"}
```

To include non-.py or non-extension data files (e.g., configs, templates):

```toml
[tool.setuptools]
include-package-data = true

[tool.setuptools.package-data]
your_package = [
    "data/*.json",
    "templates/*.html",
    "static/**/*",  # Recursively include all files under `static`
]
```

# Compiling Extension Modules When Building a Wheel

To compile extension modules when building a wheel, implement a custom setuptools `build_ext` command.

## Project Structure

```
your-package/
  - pyproject.toml
  - your_package/
    - __init__.py
    - _build_ext_command.py # Custom `build_ext` command
```

## Custom `build_ext` Command (`your_package/_build_ext_command.py`)  

```python
import os
import subprocess
from setuptools.command.build_ext import build_ext

def check_compiler(self):
    try:
        subprocess.check_call(["c++", "-v"], stdout=subprocess.DEVNULL)
        return True
    except:
        return False

class BuildExtCommand(build_ext):
    def run(self):
        if not check_compiler():
            raise RuntimeError("c++ compiler not found!")
        subprocess.check_call(["c++", "mymodule.cpp", "-o", "mymodule.so"])
        super().run()  # Continue default build_ext flow (no-op)
```

## `pyproject.toml` Configuration

```toml
[tool.setuptools]
# Declare the package as non-ZIP-safe to ensure files are extracted during installation
# Required for custom build logic to execute properly
zip-safe = false
# Bind the custom command to the `build_ext` phase
cmdclass = { "build_ext" = "your_package._build_ext_command.BuildExtCommand" }
```

If `BuildExtCommand` requires third-party libraries (e.g., `pybind11`), declare them under `[build-system]`:

```toml
[build-system]
requires = [
    "setuptools>=42",
    "wheel",
    "pybind11>=2.6",
    "numpy>=1.21",
    "requests>=2.25",
]
```

# Uploading to PyPI

## Install Required Tools

First, install `build` and `twine`:

```bash
pip install build twine
```

## Build the Package

Run the following command in your project's root directory:

```bash
python -m build
```

This generates `.tar.gz` and `.whl` files in the `dist/` folder.

## Upload to PyPI

Use `twine` to upload your package. Navigate to the `dist/` directory and run:

```bash
twine upload dist/*
```

You'll be prompted for your PyPI API token. Refer to the [official PyPI documentation](https://packaging.python.org/latest/guides/publishing-packages/) for details.

## Verify Publication

After uploading, check PyPI to see if your package is listed:
[https://pypi.org/](https://pypi.org/)

Search for your package name-it may take a few minutes to appear.