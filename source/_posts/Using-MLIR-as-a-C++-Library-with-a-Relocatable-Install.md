---
title: "Using MLIR as a C++ Library with a Relocatable Install"
date: 2026-04-19
updated: 2026-04-19
categories:
  - "Systems"
tags:
  - "reference"
  - "systems"
  - "c++"
  - "build-systems"
excerpt: "Using MLIR as a C++ Library with a Relocatable Install"
---

## Motivation

MLIR is widely used as reusable compiler infrastructure, but the practical workflow for consuming it as a C++ library is often less explicit than the workflow for building it in-tree. In practice, many users do not merely want to compile MLIR itself; they want to produce a stable SDK for external projects.

MLIR exposes both build-tree and install-tree CMake package configurations. The build tree is primarily an internal artifact for compilation, testing, and iterative development. It commonly contains absolute paths, generated intermediates, and configuration files intended for that particular build location. By contrast, the install tree is the artifact intended for downstream consumption. For users who wish to link against MLIR as a library, preserve a reusable package, archive it, copy it to another machine, or point multiple external projects at the same dependency prefix, the install tree is the correct deliverable.

The purpose of this document is therefore to give a concise, end-to-end workflow for producing a relocatable MLIR installation specifically for downstream library use.

## Workflow

### 1. Configure

From the LLVM monorepo root:

```bash
cmake -S llvm -B build -G Ninja \
  -DLLVM_ENABLE_PROJECTS="mlir" \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_INSTALL_PREFIX="$PWD/install"
```

Notes:

- `-S llvm` uses `llvm` as the CMake source root
- `-B build` creates a separate build directory
- `-G Ninja` generates Ninja files
- `-DCMAKE_INSTALL_PREFIX=...` defines the install location

### 2. Build with Ninja

Use Ninja directly, with whatever flags you want:

```bash
ninja -C build
```

---

### 3. Install

Install into the chosen prefix:

```bash
ninja -C build -v install
```

This creates the installed tree under:

```text
install/
```

This installed tree is the artifact you should use as your MLIR SDK.

---

### 4. Verify the install tree

Before deleting the build directory, verify that the install contains what you need.

Check the main install contents:

```bash
ls install/include
ls install/lib
ls install/bin
```

Confirm these exist:

```text
install/lib/cmake/LLVMConfig.cmake
install/lib/cmake/mlir/MLIRConfig.cmake
```

---

### 5. Delete the build directory

If your explicit goal is to **use MLIR as a library**, and the install tree is complete, then you can delete the build directory:

```bash
rm -rf build
```

This is normally safe for downstream library use.

---

### 6. Keep only the install directory

After that, keep only the install tree, for example:

```text
install/
```

You can also move it elsewhere:

```bash
mv install /tmp/llvm-mlir-sdk
```

That installed prefix is what your downstream projects should use.
