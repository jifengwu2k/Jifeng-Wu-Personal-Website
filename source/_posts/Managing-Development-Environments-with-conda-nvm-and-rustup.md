---
title: Managing Development Environments with conda, nvm, and rustup
date: 2025-07-10
updated: 2026-04-15
categories:
  - "Systems"
tags:
  - "reference"
  - "systems"
  - "software-engineering"
  - "programming-languages"
  - "shell"
  - "conda"
sticky: 1
---

Modern development often requires more than just installing one language runtime globally and calling it a day. Installing everything system-wide quickly becomes messy, hard to reproduce, and annoying to debug. This is where command-line environment and toolchain managers come in. Three important examples are:

- `conda` for Python-centric environments and mixed native dependencies
- `nvm` for Node.js versions
- `rustup` for Rust toolchains

These tools all help developers **install**, **manage**, and **switch between** multiple development environments without constantly modifying the system-wide setup.

## Conda

`conda` is strongest when your environment includes more than pure Python packages. It can manage:

- Python itself
- Python libraries
- native libraries
- command-line tools
- GPU-related packages such as CUDA stacks

That makes it especially practical for data science, machine learning, and scientific computing.

### Install Miniconda

A lightweight way to start is Miniconda.

Create an installation directory:

```bash
mkdir -p ~/miniconda3
```

Download the installer:

- Linux x86_64:
  ```bash
  wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
  ```
- macOS arm64:
  ```bash
  curl https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh -o ~/miniconda3/miniconda.sh
  ```
- macOS x86_64:
  ```bash
  curl https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh -o ~/miniconda3/miniconda.sh
  ```

Run the installer:

```bash
bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3 && rm ~/miniconda3/miniconda.sh
```

Activate conda in the current shell:

```bash
source ~/miniconda3/bin/activate
```

Initialize shell integration if desired:

```bash
conda init --all
```

Reverse that change if needed:

```bash
conda init --all --reverse
```

### Common Conda Commands

Create an environment:

```bash
conda create --name myenv python=3.12
```

Activate it:

```bash
conda activate myenv
```

Install packages:

```bash
conda install numpy pandas
```

List environments:

```bash
conda env list
```

Export the environment:

```bash
conda env export > environment.yml
```

Recreate it elsewhere:

```bash
conda env create -f environment.yml
```

Remove an environment:

```bash
conda env remove --name myenv
```

## nvm

`nvm` stands for **Node Version Manager**. Its job is simple and extremely useful: it lets you install multiple Node.js versions and switch between them from the shell. This matters because JavaScript projects often depend on a specific Node major version. One project may want Node 18 LTS, while another may require Node 22.

### Install nvm

Install from the official script:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Then load it into the current shell. Depending on your shell configuration, you may need:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

After that, verify installation:

```bash
nvm --version
```

### Common nvm Commands

Install the latest LTS Node.js:

```bash
nvm install --lts
```

Install a specific version:

```bash
nvm install 22
```

List installed versions:

```bash
nvm ls
```

Switch versions in the current shell:

```bash
nvm use 22
```

Set a default version:

```bash
nvm alias default 22
```

Remove an installed version:

```bash
nvm uninstall 20
```

### Project-Level Use with `.nvmrc`

A common pattern is to put the desired Node version in a file named `.nvmrc`:

```text
22
```

Then, inside that project directory, run:

```bash
nvm use
```

This makes it easy to align a project with its expected Node version.

## rustup

`rustup` is the official Rust toolchain manager. It installs and manages:

- Rust compiler toolchains
- channels such as `stable`, `beta`, and `nightly`
- components like `rustfmt` and `clippy`
- additional targets for cross-compilation

Compared with `nvm`, `rustup` is more than a version switcher. It is a full toolchain management layer for Rust development.

### Install rustup

Install from the official script:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Load the Rust environment into the current shell:

```bash
source "$HOME/.cargo/env"
```

Verify installation:

```bash
rustup --version
rustc --version
cargo --version
```

### Common rustup Commands

Install toolchains:

```bash
rustup toolchain install stable
rustup toolchain install nightly
rustup toolchain install 1.78.0
```

List installed toolchains:

```bash
rustup toolchain list
```

Set the global default:

```bash
rustup default stable
```

Override the toolchain inside a specific project directory:

```bash
rustup override set nightly
```

Remove a toolchain:

```bash
rustup toolchain uninstall nightly
```

Add common components:

```bash
rustup component add rustfmt
rustup component add clippy
```

Add a compilation target:

```bash
rustup target add wasm32-unknown-unknown
```

### Project-Level Use with `rust-toolchain.toml`

Rust projects often pin a toolchain using `rust-toolchain.toml`, for example:

```toml
[toolchain]
channel = "stable"
components = ["rustfmt", "clippy"]
```

This gives the project an explicit, reproducible toolchain specification.
