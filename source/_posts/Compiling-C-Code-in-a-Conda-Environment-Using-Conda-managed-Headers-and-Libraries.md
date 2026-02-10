---
title: >-
  Compiling C++ Code in a Conda Environment Using Conda-managed Headers and
  Libraries
date: 2025-08-24
categories:
- [Environments]
---

## Prerequisites

### Common Build Variables

#### Directly Used by `gcc`/`clang`

These environment variables are **automatically used by `gcc`/`clang` themselves**.

- `CPATH`
  - Colon-separated list of directories to search for headers before built-in include paths.
  - Like passing multiple `-I` options.
- `LIBRARY_PATH` 
  - Colon-separated list of directories to search for libraries (`.so`/`.a`) at **link time**.
  - Like passing multiple `-L` options.
  - **Doesn't affect how the executable finds shared libraries when running.**

#### For Build Systems (`make`, `cmake`, etc.)

These environment variables are not used by compilers **unless** your build tool (`make`, `cmake`, etc.) or script expands them.

- `CC` / `CXX`:
  - Which C/C++ compiler to use.
- `CFLAGS` / `CXXFLAGS`:
  - Extra flags for compiling C or C++ respectively, e.g., `-O2 -g -Wall`.
- `LDFLAGS`:
  - Extra flags when linking, such as `-L/path/to/lib`, `-lfoo`, `-Wl,-rpath,/my/libs`.

> 🚫 **Never stuff include/library/link flags inside `$CXX` or `$CC`. Always set them as separate variables, or pass them directly on the command line to the compiler.**

### C++ Libraries in Conda Environments

When you install a C++ library from `conda-forge`, it's placed inside your current environment, not in a system-wide directory.

- Headers: `$CONDA_PREFIX/include`
- Libraries: `$CONDA_PREFIX/lib`  

> Exception: The **C runtime** (`libc.so`, `libm.so`, etc.) always comes from the system, not Conda.

## Example

### Create a Conda Environment for C++ Compilation

```bash
conda install -c conda-forge clang clangxx libcxx libcxxabi libcxx-devel lld llvm-tools
```

- `libcxx`, `libcxxabi`, `libcxx-devel`: LLVM's C++ standard library and headers.

### Tell the Compiler Where to Look for Headers and Libraries

```bash
export CPATH="$CONDA_PREFIX/include"
export LIBRARY_PATH="$CONDA_PREFIX/lib"
```

This automatically adds Conda's include and lib directories to `clang`'s search paths.

### Set Common Build Variables for Build Systems

```bash
export CC="clang"
export CXX="clang++ -stdlib=libc++"
export LDFLAGS="-Wl,-rpath,$LIBRARY_PATH"
export AR="$CONDA_PREFIX/bin/llvm-ar"
export RANLIB="$CONDA_PREFIX/bin/llvm-ranlib"
export LD="$CONDA_PREFIX/bin/ld.lld"
```

- `LDFLAGS` sets an `rpath` such that the generated executable or shared library will hard-code `LIBRARY_PATH` as a shared library search path.

### Compile a Program

Let's say you have `hello_world.cpp`.

```bash
$CXX hello_world.cpp -o hello_world $LDFLAGS
```

### Check Your Binary

You can check what dynamic libraries your binary depends on using `ldd hello_world`:

```
$ ldd hello_world
    linux-vdso.so.1 (0x00007ffd05ead000)
    libc++.so.1 => /home/youruser/miniconda3/envs/clangxx-env/lib/libc++.so.1 (0x000071f5b0e86000)
    libc++abi.so.1 => /home/youruser/miniconda3/envs/clangxx-env/lib/libc++abi.so.1 (0x000071f5b0e48000)
    libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x000071f5b0d44000)
    libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x000071f5b0a00000)
    ...
```

**Good sign:** For anything above `libc`, it should point inside your Conda environment (e.g., `libc++.so.1`), not the system.