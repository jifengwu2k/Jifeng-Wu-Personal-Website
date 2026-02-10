---
title: YAML Coding Guidelines
date: 2026-01-20
categories:
- [Reference]
---

### Rationale

- These YAML standards are intentionally common sense and intuitive.
- If your data or configuration needs exceed these rules, use a more expressive serialization language or schema (e.g., JSON, TOML, or a database).

### Guidelines

- **General Formatting**:
  - Favor clarity and ease of reading in all YAML files.
  - Use UTF-8 encoding for all YAML files.
  - Indent consistently using 2 spaces.
  - Use comments liberally to document structure and intent.
  - All lists and dicts must use block (indented) style.
  - Do not use flow style or JSON style.
- **Structure**:
  - The top layer of every YAML file must be a list or a dict.
  - Do not use multiple documents in a file (`---` separator).
  - Do not use node anchors (`&`, `*`) or refs.
  - Do not use explicit YAML tags (`!!str`).
- **Dict Keys**:
  - Dict keys must be strings.
- **Atoms**:
  - Only use `true` and `false` (lowercase) for bools.
  - Let YAML auto-detect ints and floats.
  - Do not use multiline strings.
  - Do not use `y`, `yes`, `n`, `no`, `on`, or `off` (case-insensitive) under any circumstances, not even when quoted.
    - If you need a positive/affirmative, negative/denial, or state/flag value, always express it as an explicit bool, `true`/`false`.

### Examples

```yaml
# list
- Casablanca
- North by Northwest
- The Man Who Wasn't There
```

```yaml
# dict
is_enabled: true  # bool
threshold: 123  # int
ratio: 123.0  # float
```

```yaml
# list[list]
-
  - First
  - Second
  - Third
-
  - Fourth
  - Fifth
  - Sixth
```

```yaml
# list[dict]
- instrument: Lasik 2000
  pulseEnergy: 5.4
  pulseDuration: 12
  repetition: 1000
  spotSize: 1mm
- instrument: Lasik 2000
  pulseEnergy: 5.0
  pulseDuration: 10
  repetition: 500
  spotSize: 2mm
```

```yaml
# dict[list]
men:
  - John Adams
women:
  - Mary Smith
  - Susan Williams
```

```yaml
# dict[dict]
alice:
  age: 20
  major: Physics
bob:
  age: 22
  major: Mathematics
```

### In Python

Install PyYAML using pip:

```sh
pip install pyyaml
```

Load from a string:

```python
import yaml

yaml_str = """name: Alice
age: 30
languages:
  - Python
  - JavaScript
  - C++"""

print(yaml.safe_load(yaml_str))
# {'name': 'Alice', 'age': 30, 'languages': ['Python', 'JavaScript', 'C++']}
```

Load from a file:

```python
import yaml

with open('example.yaml', 'r') as f:
    print(yaml.safe_load(f))
```