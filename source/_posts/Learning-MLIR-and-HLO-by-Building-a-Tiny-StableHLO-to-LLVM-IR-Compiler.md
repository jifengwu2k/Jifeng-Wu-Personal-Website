---
title: "Learning MLIR and HLO by Building a Tiny StableHLO-to-LLVM IR Compiler"
date: 2026-04-26
updated: 2026-04-26
categories:
  - "Systems"
tags:
  - "reference"
  - "systems"
  - "machine-learning"
  - "c++"
  - "build-systems"
excerpt: "This project explored how to lower machine-learning-oriented IR into low-level compiler IR by building a small MLIR-based compiler. The tool reads StableHLO MLIR, applies a sequence of lowering and cleanup passes, lowers the result to the MLIR LLVM dialect, translates that module to standard textual LLVM IR, and prints the final .ll-style output."
sticky: 0.5
---

## Summary

This project explored how to lower machine-learning-oriented IR into low-level compiler IR by building a small MLIR-based compiler. The tool reads StableHLO MLIR, applies a sequence of lowering and cleanup passes, lowers the result to the MLIR LLVM dialect, translates that module to standard textual LLVM IR, and prints the final `.ll`-style output.

The work had three major outcomes:

- A **validated local toolchain setup** establishing that `StableHLO v1.13.9` is compatible with the local `LLVM-22.1.3-Linux-X64` installation, with a small patch to support a library-only StableHLO build.
- A **working end-to-end prototype** that accepts StableHLO input and produces textual LLVM IR.
- A **practical workflow for agent-assisted compiler development**, where coding agents helped accelerate documentation lookup, pass discovery, incremental code edits, rebuild-and-run cycles, and failure-driven replanning.

This mini project was successful because it followed an incremental implementation strategy, verified IR at each stage, used realistic sample input to validate the lowering pipeline, and made effective use of coding agents to reduce the implementation-detail burden of working with MLIR and StableHLO.

---

## Project Goal

The goal of the project was to become familiar with:

- **MLIR** as a multi-level compiler infrastructure,
- **HLO-family IRs**, especially **StableHLO**, and
- the path from a machine-learning frontend representation to low-level code generation.

The intended deliverable was a compiler executable that:

- reads **StableHLO source code** from a file,
- parses it into MLIR,
- runs a sequence of lowering and canonicalization passes,
- lowers the program through progressively lower-level MLIR dialects,
- reaches the MLIR **LLVM dialect**,
- translates that module into textual **LLVM IR**, and
- emits the result as a `.ll` file.

A representative CLI shape is:

```bash
hlo-compiler input.mlir -o output.ll
```

---

## Background

### Lowering in MLIR

A useful way to understand MLIR lowering is as **dialect elimination**. Given a module containing a set of dialects, the task is to drive the program toward a target dialect set.

For example:

```text
have: {affine, scf, arith, memref, func}
want: {llvm}
```

This naturally leads to questions such as:

- How do we eliminate `affine`?
- How do we eliminate `scf`?
- How do we eliminate `func`?
- How do we eliminate `arith`?
- How do we eliminate `memref`?
- How do we eliminate `cf` if it is introduced along the way?

A typical candidate pass sequence might include:

- `lower-affine`
- `scf-to-cf`
- `func-to-llvm`
- `arith-to-llvm`
- `memref-to-llvm`
- `cf-to-llvm`
- `reconcile-unrealized-casts`

MLIR does not provide a fully general automatic planner for this process. In practice, lowering is driven by knowledge of:

1. Which dialects are currently present?
2. Which dialects are desired?
3. Which passes are available?
4. The preconditions and postconditions of those passes.

That makes the work highly iterative and well-suited to a Karpathy loop of planning, editing, building, running, and revising.

### Where StableHLO Comes From

Machine learning frameworks such as **JAX** do not normally expose LLVM IR directly. Instead, they lower from frontend programs through higher-level compiler representations. For this project, the most useful interchange representation was **StableHLO** because it:

- is an MLIR dialect,
- preserves tensor-level semantics,
- supports portability and interchange, and
- remains much closer to the source computation than LLVM IR.

A practical way to obtain StableHLO is to lower a `jax.jit`-compiled function and request compiler IR in the `stablehlo` dialect.

Example:

```python
import jax
import jax.numpy as jnp


def matmul_bias_relu(x, w, b):
    y = x @ w
    y = y + b
    y = jnp.maximum(y, 0.0)
    return y

x = jnp.ones((4, 8), dtype=jnp.float32)
w = jnp.ones((8, 16), dtype=jnp.float32)
b = jnp.ones((16,), dtype=jnp.float32)

lowered = jax.jit(matmul_bias_relu).lower(x, w, b)
stablehlo_module = lowered.compiler_ir(dialect="stablehlo")
print(stablehlo_module)
```

Conceptually, this kind of program lowers to operations such as:

- `stablehlo.dot_general` for matrix multiplication,
- `stablehlo.broadcast_in_dim` for bias expansion,
- `stablehlo.add` for bias addition,
- `stablehlo.constant` for constants, and
- `stablehlo.maximum` for ReLU.

---

## Local Environment and Compatibility Findings

The project used a **hub-and-spoke** dependency model:

- The fixed local LLVM installation served as the **hub**;
- Different StableHLO tags acted as **spokes**;
- Compatibility was determined empirically by configuring and building candidate versions.

### Observed Version Boundary

The newest StableHLO tag verified to build successfully against the installed LLVM package was:

- **`v1.13.9`**

Observed results:

- `v1.13.7`, `v1.13.8`, and `v1.13.9` build successfully;
- `v1.14.0` and newer tested tags fail against this LLVM installation due to **MLIR API drift**.

The local checkout was moved to `v1.13.9`, patched for a library-only build, and installed successfully.

---

## Packaging Caveat

The LLVM install package includes MLIR headers, libraries, and CMake packages, but it does **not** provide the full test/tool integration expected by StableHLO's default build. In particular, the stock StableHLO build expects targets or tools such as:

- `FileCheck`
- `not`
- a usable `LLVM_EXTERNAL_LIT`

This matters for building the default tests, tools, and integration targets. It does **not** matter for a library-only build, provided those subdirectories are excluded from the build.

---

## Minimal Patch for a Library-Only StableHLO Build

For this project, a library-only StableHLO build was sufficient. The minimal patch touched four files:

1. `CMakeLists.txt`
2. `stablehlo/CMakeLists.txt`
3. `stablehlo/conversions/linalg/CMakeLists.txt`
4. `stablehlo/conversions/tosa/CMakeLists.txt`

### 1. Top-Level `CMakeLists.txt`

Change:

```cmake
add_subdirectory(stablehlo)
add_subdirectory(examples)
```

To:

```cmake
add_subdirectory(stablehlo)
```

### 2. `stablehlo/CMakeLists.txt`

Change:

```cmake
add_subdirectory(api)
add_subdirectory(conversions)
add_subdirectory(dialect)
add_subdirectory(integrations)
add_subdirectory(reference)
add_subdirectory(tests)
add_subdirectory(testdata)
add_subdirectory(tools)
add_subdirectory(transforms)
```

To:

```cmake
add_subdirectory(api)
add_subdirectory(conversions)
add_subdirectory(dialect)
add_subdirectory(transforms)
```

To install StableHLO headers as part of the library-only install, append:

```cmake
install(
  DIRECTORY
    ${CMAKE_CURRENT_SOURCE_DIR}/api
    ${CMAKE_CURRENT_SOURCE_DIR}/conversions
    ${CMAKE_CURRENT_SOURCE_DIR}/dialect
    ${CMAKE_CURRENT_SOURCE_DIR}/transforms
  DESTINATION include/stablehlo
  FILES_MATCHING
    PATTERN "*.h"
)

install(
  DIRECTORY
    ${CMAKE_CURRENT_BINARY_DIR}/api
    ${CMAKE_CURRENT_BINARY_DIR}/conversions
    ${CMAKE_CURRENT_BINARY_DIR}/dialect
    ${CMAKE_CURRENT_BINARY_DIR}/transforms
  DESTINATION include/stablehlo
  FILES_MATCHING
    PATTERN "*.h.inc"
)
```

### 3. `stablehlo/conversions/linalg/CMakeLists.txt`

Remove:

```cmake
add_subdirectory(tests)
```

### 4. `stablehlo/conversions/tosa/CMakeLists.txt`

Remove:

```cmake
add_subdirectory(tests)
```

---

## Building and Installing StableHLO

With the library-only patch applied, StableHLO can be configured, built, and installed as follows:

```bash
export STABLEHLO_SRC=...
export STABLEHLO_BUILD=...
export STABLEHLO_PREFIX=...
export LLVM_PREFIX=...
```

```bash
cmake -G Ninja -S "$STABLEHLO_SRC" -B "$STABLEHLO_BUILD" \
  -DMLIR_DIR="$LLVM_PREFIX/lib/cmake/mlir" \
  -DLLVM_DIR="$LLVM_PREFIX/lib/cmake/llvm" \
  -DSTABLEHLO_ENABLE_BINDINGS_PYTHON=OFF \
  -DCMAKE_BUILD_TYPE=Release
```

```bash
cmake --build "$STABLEHLO_BUILD"
```

```bash
cmake --install "$STABLEHLO_BUILD" --prefix "$STABLEHLO_PREFIX"
```

### What the Install Produces

The install step provides:

- StableHLO static libraries in `$STABLEHLO_PREFIX/lib`
- StableHLO source headers in `$STABLEHLO_PREFIX/include/stablehlo/...`
- generated `.h.inc` headers in `$STABLEHLO_PREFIX/include/stablehlo/...`

The install step does **not** produce:

- a StableHLO CMake package config

As a result, the install root is a usable **headers + libraries prefix**, but not a complete `find_package(StableHLO)` SDK.

### Include Paths for Downstream Compilation

A downstream application can compile against:

- `-I$LLVM_PREFIX/include`
- `-I$STABLEHLO_PREFIX/include`

Example compile command:

```bash
$CXX -std=c++17 \
  -I"$LLVM_PREFIX/include" \
  -I"$STABLEHLO_PREFIX/include" \
  -D_GNU_SOURCE \
  -D_GLIBCXX_USE_CXX11_ABI=1 \
  -D__STDC_CONSTANT_MACROS \
  -D__STDC_FORMAT_MACROS \
  -D__STDC_LIMIT_MACROS \
  -c simple_stablehlo_app.cpp -o simple_stablehlo_app.cpp.o
```

Minimal source example:

```cpp
#include "mlir/IR/DialectRegistry.h"
#include "mlir/IR/MLIRContext.h"
#include "stablehlo/dialect/Register.h"

int main() {
  mlir::DialectRegistry registry;
  mlir::stablehlo::registerAllDialects(registry);
  mlir::MLIRContext ctx(registry);
  return 0;
}
```

### Linking Strategy

For this setup, using raw compiler and linker commands was simpler than using downstream CMake because the installed StableHLO tree is not a full packaged SDK.

A straightforward working link strategy is:

- include all StableHLO static archives,
- include all MLIR static archives,
- include all LLVM static archives,
- wrap them in a linker group so archive order does not matter.

Example:

```bash
$CXX simple_stablehlo_app.cpp.o -o simple_stablehlo_app \
  -Wl,--start-group \
  "$STABLEHLO_PREFIX"/lib/*.a \
  "$LLVM_PREFIX"/lib/libMLIR*.a \
  "$LLVM_PREFIX"/lib/libLLVM*.a \
  -Wl,--end-group \
  -lrt -ldl -lm \
  -lz \
  -lzstd
```

---

## Intended Compiler Pipeline

The project was never intended to translate StableHLO directly into LLVM IR in a single step. The educational value comes from observing the intermediate representations and their transformations.

A reasonable conceptual pipeline is:

```text
StableHLO
  -> canonicalization / CSE
  -> Linalg / Tensor / Arith
  -> bufferization to MemRef
  -> lowering structured ops to SCF loops
  -> lowering to LLVM dialect
  -> translation to LLVM IR (.ll)
```

### Stage-by-Stage Interpretation

#### StableHLO

StableHLO is the input language. It represents tensor-level computation and ML semantics, such as:

- broadcasts,
- reductions,
- dot products,
- reshapes, and
- elementwise operations.

This form is useful for interchange but is still far from machine code.

#### Linalg / Tensor / Arith

At this level, computation becomes more explicit in MLIR terms.

Typical mappings include:

- `stablehlo.add` -> `linalg.generic` or an equivalent structured op
- `stablehlo.dot_general` -> `linalg.matmul` or `linalg.generic`
- `stablehlo.maximum` -> elementwise `linalg.generic` with `arith` inside
- shape-preserving tensor manipulations -> `tensor` operations

This stage expresses high-level tensor semantics as structured computations over tensors.

#### MemRef / Bufferization

Bufferization converts tensor values into explicit storage objects.

Before bufferization, tensors are SSA values. After bufferization, data is represented in memory through `memref` objects. This stage answers questions such as:

- where outputs live,
- what gets allocated,
- what can be updated in place, and
- how temporaries are stored.

#### SCF

Structured ops are lowered into explicit loop-based control flow.

For example, elementwise tensor addition eventually becomes something conceptually like:

```text
for i ...
  for j ...
    out[i, j] = lhs[i, j] + rhs[i, j]
```

Matrix multiplication similarly becomes nested loops over indices.

#### LLVM Dialect

This is the last MLIR stage before translation to standard LLVM IR. At this point:

- functions become `llvm.func`,
- memory is converted to LLVM-compatible representations,
- structured control flow is lowered to lower-level control flow, and
- arithmetic is converted into LLVM-compatible forms.

#### LLVM IR Source (`.ll`)

The final product is textual LLVM IR. This representation is easy to inspect, diff, save, and pass to downstream LLVM tools.

---

## Implementation Status

The current executable milestone was implemented in `simple_stablehlo_app.cpp`.

The program now:

1. accepts an input MLIR file path on the command line,
2. registers core MLIR dialects,
3. registers StableHLO dialects,
4. registers the external `BufferizableOpInterface` models required by one-shot bufferization,
5. registers the translation interfaces required to export MLIR to LLVM IR,
6. parses the input into an `mlir::ModuleOp`,
7. verifies the parsed module,
8. runs `canonicalizer` and `cse`,
9. runs `stablehlo-legalize-to-linalg`,
10. runs `canonicalizer` and `cse` again,
11. verifies and prints the intermediate Linalg/Tensor/Arith form,
12. runs `one-shot-bufferize` with function-boundary bufferization enabled,
13. runs `convert-bufferization-to-memref`,
14. verifies and prints the MemRef-oriented form,
15. runs `convert-linalg-to-loops`,
16. verifies and prints the SCF-based form,
17. runs `scf-to-cf`, `lower-affine`, `index-to-llvm`, `arith-to-llvm`, `memref-to-llvm`, `func-to-llvm`, `cf-to-llvm`, and `reconcile-unrealized-casts`,
18. runs cleanup again,
19. verifies and prints the LLVM dialect result, and
20. translates that LLVM dialect module to standard textual LLVM IR and prints it.

In short, the prototype now functions as a working:

- StableHLO reader,
- parser and verifier,
- StableHLO-to-Linalg lowering driver,
- one-shot bufferization driver,
- bufferization-to-MemRef conversion prototype,
- Linalg-to-loops prototype,
- LLVM-dialect lowering prototype,
- LLVM IR translation prototype, and
- multi-stage printer.

It also performs basic CLI validation and reports errors if parsing, verification, or lowering fails.

---

## Validation and Testing

The prototype was tested with:

- `jit_matmul_bias_relu.mlir`

Example usage:

```bash
./simple_stablehlo_app input.mlir
```

### Test Outcome

The test succeeded end-to-end:

- the file parsed successfully,
- the input module verified successfully,
- the StableHLO-to-Linalg cleanup and lowering pipeline ran successfully,
- the intermediate Linalg/Tensor/Arith module verified successfully,
- the one-shot bufferization plus bufferization-to-MemRef pipeline ran successfully,
- the MemRef-oriented module verified successfully,
- the Linalg-to-loops pipeline ran successfully,
- the SCF-based module verified successfully,
- the LLVM-dialect lowering pipeline ran successfully,
- the final LLVM dialect module verified successfully,
- the LLVM dialect module translated successfully to standard LLVM IR, and
- all printed stages were produced successfully.

On `jit_matmul_bias_relu.mlir`, the tool completed four meaningful MLIR dialect transitions followed by a final LLVM IR export.

The sample input was a useful smoke test because it exercised nontrivial tensor behavior:

- matrix multiplication,
- broadcast,
- elementwise addition,
- elementwise maximum, and
- constants.

---

## Remaining Work

Although the end-to-end LLVM IR path now works, several follow-on improvements remain:

- add output-file support such as `-o output.ll`,
- design a more polished CLI for stage selection and output control,
- separate debug-stage dumps from final `.ll` output,
- improve memory management beyond the current educational prototype if needed.

### Recommended Next Step

The next milestone should turn the current stdout-based prototype into a more compiler-like tool:

```text
StableHLO input
  -> parse / lower / export to LLVM IR
  -> write final textual LLVM IR to -o output.ll
  -> optionally gate intermediate MLIR dumps behind debug flags
```

---

## Why This Mini Project Succeeded

This mini project succeeded because it combined a clear objective, incremental implementation, continuous validation, and effective use of coding agents.

### 1. Clear, Concrete Scope

The goal was not vaguely to "learn MLIR." It was to build a small compiler executable that:

- reads StableHLO MLIR,
- lowers it through intermediate MLIR stages,
- reaches the MLIR LLVM dialect, and
- emits textual LLVM IR.

That concrete scope kept the work focused and measurable.

### 2. Incremental Milestones

The implementation progressed in small, testable steps:

1. parse and verify StableHLO,
2. canonicalize and CSE,
3. lower StableHLO to Linalg/Tensor/Arith,
4. bufferize to MemRef,
5. lower Linalg to SCF loops,
6. lower to the MLIR LLVM dialect,
7. translate to textual LLVM IR.

This reduced risk and made failures easier to diagnose.

### 3. Verification at Every Stage

The program consistently:

- parsed input,
- verified IR before transformations,
- ran passes,
- verified IR after transformations, and
- printed intermediate results.

That discipline turned each milestone into a stable foundation for the next one.

### 4. Meaningful Test Input

Using `jit_matmul_bias_relu.mlir` as a smoke test ensured the pipeline was exercised on a realistic tensor computation rather than a trivial toy example.

### 5. Effective Delegation to Coding Agents

Coding agents were especially useful for the repetitive and implementation-heavy parts of the work, including:

- reading MLIR and StableHLO documentation,
- identifying relevant passes and headers,
- mapping lowering ideas to concrete APIs,
- editing the C++ driver incrementally,
- rebuilding and rerunning after each change,
- inspecting failures and adjusting the pass pipeline, and
- updating the accompanying markdown documentation.

This was valuable because MLIR is conceptually elegant but operationally detailed. Much of the difficulty lies not in the broad lowering idea, but in the implementation burden:

- which headers to include,
- which passes exist in the installed version,
- which interfaces must be registered,
- what order passes should run in, and
- what each stage expects as input.

---

## Conclusion

This project achieved its central goal: building a small but functional MLIR-based compiler driver that lowers StableHLO to textual LLVM IR.

Beyond the executable itself, the work also produced a practical understanding of:

- MLIR's staged lowering model,
- StableHLO's role as a portable tensor-level IR,
- one-shot bufferization and lower-level dialect conversion,
- how coding agents can accelerate iterative compiler engineering by handling documentation lookup, code edits, rebuilds, and failure-driven replanning, and
- the realities of version compatibility and packaging when working with LLVM/MLIR-based projects.

The prototype is already a useful educational compiler driver. With output-file support and a cleaner CLI, it can be turned into a more polished standalone tool.
