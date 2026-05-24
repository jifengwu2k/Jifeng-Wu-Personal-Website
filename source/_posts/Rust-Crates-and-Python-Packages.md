---
title: "Rust Crates and Python Packages"
date: 2026-05-23
categories:
  - "Programming"
tags:
  - "reference"
  - "rust"
  - "python"
  - "programming-languages"
excerpt: A side-by-side comparison of Rust's crate system and Python's package system — covering project structure, visibility, distribution, version resolution, import paths, and publishing.
---

## What Is a Crate?

A **crate** is Rust's unit of distribution. Think of it as the Rust equivalent of a Python package.

| Concept | Python | Rust |
|---|---|---|
| Unit of distribution | Package | Crate |
| Registry | [pypi.org](https://pypi.org) | [crates.io](https://crates.io) |
| Discovery | `pip search` / PyPI website | `cargo search` / crates.io |
| Manifest | `pyproject.toml` | `Cargo.toml` |
| Library entry point | `__init__.py` | `src/lib.rs` |
| Binary entry point | Console scripts / `__main__.py` | `src/main.rs` |
| CLI tool (publish) | `twine upload` | `cargo publish` |

## Project Structure — Side by Side

Here is the same small library

### Python Package

```
my_project/
├── pyproject.toml            # (0) manifest — next to the package
└── my_pkg/
    ├── __init__.py           # (1) package root
    ├── config.py             # (2)
    ├── database/
    │   ├── __init__.py       # (3)
    │   ├── connection.py     # (4)
    │   └── models.py         # (5)
    └── network/
        ├── __init__.py       # (6)
        └── server.py         # (7)
```

```toml
# ===== (0) my_project/pyproject.toml =====
[project]
name = "my_pkg"
version = "0.1.0"
dependencies = ["requests>=2"]
```

```python
# ===== (1) my_project/my_pkg/__init__.py =====
from .config import Settings
from .database import connect
from .network.server import serve
```

```python
# ===== (3) my_project/my_pkg/database/__init__.py =====
from .connection import connect
from .models import User
```

```python
# ===== (6) my_project/my_pkg/network/__init__.py =====
from .server import serve
```

**Usage:**

```python
from my_pkg import Settings, connect, serve
# or
from my_pkg.database.models import User
```

### Rust Crate


```
my_crate/
├── Cargo.toml                # (0) manifest — next to src/
└── src/
    ├── lib.rs                # (1) crate root
    ├── config.rs             # (2)
    ├── database/
    │   ├── mod.rs            # (3)
    │   ├── connection.rs     # (4)
    │   └── models.rs         # (5)
    └── network/
        ├── mod.rs            # (6)
        └── server.rs         # (7)
```

```toml
# ===== (0) my_crate/Cargo.toml =====
[package]
name = "my_crate"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1", features = ["derive"] }
```

```rust
// ===== (1) my_crate/src/lib.rs =====
mod config;        // declare child — REQUIRED, or config.rs is dead
mod database;      // declare child — REQUIRED, or database/ is dead
mod network;       // declare child — REQUIRED, or network/ is dead

pub use config::Settings;
pub use database::connection::connect;
pub use network::server::serve;
```

```rust
// ===== (3) my_crate/src/database/mod.rs =====
pub mod connection;   // declare child — REQUIRED
pub mod models;       // declare child — REQUIRED
```

```rust
// ===== (6) my_crate/src/network/mod.rs =====
pub mod server;       // declare child — REQUIRED
```

**Usage:**

```rust
use my_crate::{Settings, connect, serve};
// or
use my_crate::database::models::User;
```

## Visibility: `pub` (Everything Private by Default)

| | Python | Rust |
|---|---|---|
| Default visibility | Public (convention: `_prefix` for "private") | **Private** (keyword: `pub` to expose) |
| Export a function | `def foo():` — nothing extra needed | `pub fn foo()` |
| Export a class/struct | `class Foo:` — nothing extra needed | `pub struct Foo` |
| Export a field | All fields public | `pub field: Type` — field-by-field opt-in |

```rust
// lib.rs
pub fn greet() {}           // ✅ external crates can use this
fn helper() {}              // ❌ crate-internal only

pub struct Config {
    pub host: String,       // ✅ external code can read/write
    port: u16,              // ❌ private — inaccessible from outside
}
```

## Distribution: Source, Not Wheels

Crates are published and distributed as **source code** (`.rs` files). Cargo downloads the source and compiles it on your machine.

| Python | Rust |
|---|---|
| Wheels (`.whl`) — pre-compiled binaries (optional C extensions) | Everything compiles from source |
| `pip install` fetches best wheel, falls back to source tarball | `cargo build` always compiles from source |
| Dynamic linking common for native code | Static linking is the default |

This is like C++ templates (which must be in headers to compile everywhere), except in Rust it is the *default* for everything. The upside: trivial cross-compilation and no ABI issues. The downside: longer initial compile times.

## Version Resolution — The Killer Feature

Rust's approach to dependency conflicts is fundamentally different from Python's.

### Python: Flat Namespace

```txt
requests==2.28.0
some-lib → requests==2.31.0
# 💥 pip: "conflict!" — you must resolve by hand
```

`site-packages/` is flat. Only one version of `requests` can exist. Conflicts are your problem.

### Rust: Multi-Version Coexistence

| Scenario | Cargo's behavior |
|---|---|
| Same major version (e.g., `serde 1.0.180` and `serde 1.0.210`) | Picks the **highest** compatible version. Compiled once. |
| Different major versions (e.g., `serde 0.9` and `serde 1.0`) | Compiles **both** into the binary. No conflict, no error. |
| Irresolvable (no version satisfies all constraints) | Clear build error. Extremely rare in practice. |

## Import Paths

| Python | Rust |
|---|---|
| `from pkg.db.models import User` | `use crate::db::models::User;` |
| `from . import sibling` | `use super::sibling;` |
| `.` path separator | `::` path separator |
| Package-root-relative by default | Module-relative by default (`crate::` for absolute) |

**Important:** In Rust, a bare path like `use database::connect;` is resolved relative to the *current module*, not the crate root. Always use `crate::` for absolute paths:

```rust
// Inside database/mod.rs
use models::User;             // relative → crate::database::models (correct: sibling)
use crate::config::Settings;  // absolute → crate::config (unambiguous)
```

## Publishing a Crate

| Step | Python | Rust |
|---|---|---|
| Register | PyPI account | crates.io account (login with GitHub) |
| API token | PyPI token | crates.io token → `cargo login` |
| Package | `python -m build` | `cargo package` |
| Dry run | — | `cargo publish --dry-run` |
| Upload | `twine upload dist/*` | `cargo publish` |
| Immutability | Versions are immutable | Versions are immutable (can only yank) |

Required metadata in `Cargo.toml`:

```toml
[package]
name = "my-crate"
version = "0.1.0"
edition = "2021"
description = "A short description of what it does"
license = "MIT OR Apache-2.0"
repository = "https://github.com/you/my-crate"
readme = "README.md"
keywords = ["some", "relevant", "tags"]
categories = ["category-slug"]
```
