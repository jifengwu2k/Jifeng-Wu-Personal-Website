---
title: Powering `clangd`-based C++ IDEs with `compile_commands.json`
date: 2025-08-11
categories:
  - DevOps, SysAdmin
tags:
  - Reference
---

## What is `compile_commands.json?`

`clangd`, the C++ language server that powers IDE features in VS Code, CLion, etc. such as **code navigation, linting and error detection, and refactoring**, requires `compile_commands.json`, a JSON file that records exactly how each source file in your project should be compiled. The example shows a simple structure:


```json
[
  {
    "directory": "/path/to/project",
    "command": "clang++ -std=c++11 -g -Og main.cpp -o main",
    "file": "main.cpp"
  }
]
```

Each entry contains:

- `directory`: The absolute path of where the compilation occurs
- `command`: The full compilation command (Shell features such as variable and command substitution are NOT supported)
- `file`: The relative path of the source file being compiled

## Generating compile_commands.json

You can create one manually as shown in the following Shell script:

```bash
# The absolute path of the project directory (where the compilation occurs)
DIRECTORY="$(realpath .)"

# The relative path of the source file being compiled
FILE='main.cpp'

# The full compilation command (precompute variable and command substitutions)
COMMAND="clang++ -std=c++11 -g -Og -fprofile-instr-generate -fcoverage-mapping main.cpp -o main $(python3-config --includes) $(python3-config --ldflags)"

# Generate `compile_commands.json` under the project directory
cat > "$DIRECTORY/compile_commands.json" <<EOF
[
  {
    "directory": "$DIRECTORY",
    "command": "$COMMAND",
    "file": "$FILE"
  }
]
EOF
```

This approach works well for small projects. For larger ones, consider using CMake or `bear` (for make-based projects).
