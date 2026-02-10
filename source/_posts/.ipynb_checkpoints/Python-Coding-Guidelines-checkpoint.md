---
title: Python Coding Guidelines
date: 2025-08-29
categories:
- [Reference]
---

> Philosophy:
>
> We have exceptionally strict coding standards.
>
> But we explicitly use them in tandem with LLMs.
>
> No brittle linters. The LLM *is* the living compliance checker, code reviewer, and first-pass automator.
>
> We achieve uncompromising quality control, reliability, and portability - *while moving faster than ever before*.

# Theory

## General Principles

- **One module = one purpose**: Each module must serve exactly one main purpose with a single entry point.
- **Portability to C++**: Code must be directly portable to C++ (avoid dynamic, Python-specific idioms).

## Compatibility

- **Python 2 & 3**: All code must run and be tested under both Python 2 and 3.
- **POSIX & NT**: All code must work on both UNIX-like and Windows systems.

## File and Package Structure

- All functions and classes must be public - no private/internal APIs.
- All directories must serve as modules and include an explicit `__init__.py` within them.
- Each top-level module maps precisely to its namespace and file name (`a.b.c` -> `a/b/c.py`).
- No `sys.path` manipulation.

### Utility Code: No "utils.py" - Publish Generalized Tools

- No local "utils.py" files: Do not keep grab-bag or miscellaneous utility functions/classes in a project-private `utils.py` file.
- **General-purpose tools must be published as standalone packages to PyPI**, each focusing on one well-defined function, class, or concept.
    - Move helpers that would otherwise go into "utils.py" into their own properly documented, versioned packages.
    - These utility packages should be:
        - Named after their actual purpose;
        - Well-tested and actively maintained;
        - Equipped with a README, proper docstrings, testable usage examples, semantic versioning, and a clear license.
- All projects share utilities via explicit dependencies rather than duplicating or copying helpers.
    - When a utility is improved or a bug is fixed, updating the package ensures all dependent projects benefit automatically - "write once, run everywhere."
    - This approach avoids hidden technical debt and promotes code quality, documentation, reuse, and maintainability across your entire codebase.
    - It also contributes to the wider Python ecosystem.

## Testing & Documentation

- Tests must:
    - Run successfully on both Python 2 and 3, POSIX and NT.
    - Be suitable for inclusion in `README.md` under "Usage" or "Quickstart".
        - Simultaneously serve as usage documentation (idiomatic examples).
        - Self-contained and runnable as a script or documentation block.

## Syntax & Language Features

### Division/Print

- Use `from __future__ import division, print_function` if using `/` or `print()`

### String Types

- **Always be explicit:**
    - `b''` = byte string
    - `u''` = Unicode string (as `typing.Text`)
    - Plain `str` only for ambiguous APIs (filesystem operations, `argparse`).

### String Formatting

- Only use the legacy `%` formatting syntax. No `.format()` or f-strings.

### Typing

- All APIs fully typed with type **comments only** (`# type: ...`)
    - No inline type annotations, no `AnnAssign`.
- Use only typing features as in Python 3.5 / PEP 484.
- Absolutely no dependent typing. A function must only return a value of the same type regardless of the value of its parameters.

### Classes

- No `attrs`, `dataclasses`, or `namedtuple`.
- All classes must have:
    - Declared `__slots__`
    - Explicit `object` base class 
    - Use `six.with_metaclass(meta, *bases)` for metaclasses
    - Mutable: `__init__`; Immutable: `__new__

### Enums

- Only manual/explicit values; do not use `auto()` even with `enum34`.

### Version Checks & Imports

- Use only `sys.version_info` for version-conditional code.
- No `except ImportError` or `sys.version` checks.

### Restricted Language Features

- Never use: `async`, `await`, `yield from`, walrus (`:=`), structural pattern matching (`match/case`).

## Input & Argument Parsing

### Input Handling

- For interactive input, always `import readline`.
- Use `open(...)` for binary files; `codecs.open(...)` for Unicode text files.

### Regular Expressions

- Regular expressions **only for simple parsing**.
- Use **Unix-style/basic** regex features:
    - `.`: any single character
    - `[ ]`: character set/class
    - `[^ ]`: negated class
    - `^, $`: line start/end
    - `( )`: grouping/subexpression
    - `*`: zero or more
- For **complicated input**:  
  Use a context-free grammar parser (e.g. [Lark](https://github.com/lark-parser/lark)), hand-written parser, or an LLM.

### Argument Parsing

- Use `argparse`.
- Use ambiguous `str` for all argument values (default API behavior).
- All arguments should have a `help=...` string.

#### Flag Arguments

- **Presence only:** `action='store_true'` -> `bool`
- **Counted:** `action='count'` -> `int`
- **Single value:** `type=str`, `required=True/False`, explicit `default=...`
- **Multiple occurrences:** `action='append'` -> `Optional[List[str]]`

#### Positional Arguments

- **Exactly one:** simple positional
- **0/1 (optional):** `nargs='?'`, must be last positional argument
- **0 or more/1 or more:** `nargs='*'`/`nargs='+'`, with plural argument name and singular `metavar`, must be last positional argument

## Python Packaging & Distribution

### File Layout

- All files start with a copyright and license block:
    - Boilerplate: `# Copyright (c) 2025 Jifeng Wu\n# Licensed under the <license> License. See LICENSE file in the project root for full license information.`
    - simple infrastructure: MIT/BSD
    - complex infra: Apache-2.0
    - applications: AGPL-3.0

### Required Files & Metadata

- `README.md` with standard boilerplate (see below)
- `LICENSE`
- `requirements.txt` (see example)
- `pyproject.toml` (see template)
- `setup.cfg` (see template)

### `README.md` Boilerplate

```
<Project Description>

## Installation

...

## Usage

...

## Contributing

Contributions are welcome! Please submit pull requests or open issues on the GitHub repository.

## License

This project is licensed under the [<license> License](LICENSE).
```

### Example `requirements.txt`

```
enum34; python_version < '3.4'
pyreadline
six
typing; python_version < '3.5'
```

### `pyproject.toml` Template

```
[build-system]
requires = ["setuptools"]
build-backend = "setuptools.build_meta"

[project]
name = "<project-name>"
version = "<version>"
description = "<Project Description>"
readme = "README.md"
requires-python = ">=2"
license = "<license>"
authors = [
  { name="Jifeng Wu", email="jifengwu2k@gmail.com" }
]
classifiers = [
    "Programming Language :: Python :: 2",
    "Programming Language :: Python :: 3",
    "Operating System :: OS Independent",
]
dependencies = [
    "<requirements.txt line 1>",
    "<requirements.txt line 2>",
    "<requirements.txt line 3>"
]

[project.urls]
"Homepage" = "https://github.com/jifengwu2k/<project-name>"
"Bug Tracker" = "https://github.com/jifengwu2k/<project-name>/issues"
```

Replace `<project-name>`, `<version>`, `<license>`, and requirements as appropriate.

### `setup.cfg` Template

```
[bdist_wheel]
universal = 1
```

# Practice

Ensure you meet the following prerequisites:

- Your Python project is a Git repository.
- You have `pbpaste` properly set up.

Execute the following to generate an LLM prompt:

```bash
LLM_PROMPT_FILE='llm_prompt.txt'

echo "This is my Python project:" > "${LLM_PROMPT_FILE}"
echo >> "${LLM_PROMPT_FILE}"

git ls-files --others --exclude-standard --cached | grep -v '.gitignore' | grep -v "${LLM_PROMPT_FILE}" | while read file
do
    echo "\`${file}\`:"
    echo
    cat "${file}"
    echo
done >> "${LLM_PROMPT_FILE}"

echo "Please do a code review and assess whether the code complies with these guidelines:" >> "${LLM_PROMPT_FILE}"
echo >> "${LLM_PROMPT_FILE}"
```

Copy some or all of the above guidelines.

```bash
pbpaste >> "${LLM_PROMPT_FILE}"
```

Feed that LLM prompt into your LLM of choice. Then `rm ${LLM_PROMPT_FILE}`.
