---
title: Running Theia (VSCode-like IDE) in the Cloud & Sharing it Securely
date: 2026-03-06
categories:
  - "Systems"
tags:
  - "reference"
  - "systems"
  - "theia"
---

Do you want a VSCode-like IDE running in your Linux cloud server accessible from anywhere? In this post, I'll walk you through:

1. Installing and building [Theia](https://github.com/eclipse-theia/theia-ide/)
2. Securely forwarding your IDE through SSH using [`push-pull-port`](https://github.com/jifengwu2k/push-pull-port) shell scripts.

Let's go!

## On Your Cloud Server

### Prerequisites

Make sure you have **the latest stable Node.js**, `git`, and `python3`.

For **Linux**:

Install the required development tools and libraries (Ubuntu/Debian, for other distros, see the [Theia docs](https://github.com/eclipse-theia/theia-ide/)):

```bash
sudo apt-get update
sudo apt-get install -y build-essential make gcc pkg-config python3 git
sudo apt-get install -y libx11-dev libxkbfile-dev libsecret-1-dev
```

**Globally install corepack** (for yarn and pnpm):

```bash
npm install -g corepack
```

### Cloning and Building Theia

Clone the repo and install dependencies:

```bash
git clone https://github.com/eclipse-theia/theia-ide.git
cd theia-ide
yarn
```

Building Theia is memory-intensive (~4GB RAM required).

To check your current max heap size (MB):

```bash
node -e 'console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024))'
```

If less than 4000, temporarily boost Node.js heap:

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
```

Now build:

```bash
yarn build
```

Then download plugins:

```bash
yarn download:plugins
```

### Running Theia

Start Theia (recommended to use tmux for a persistent session):

```bash
yarn browser start
```

By default, it starts at [http://localhost:3000/](http://localhost:3000/).

## On Your Local Machine

### Secure Remote Access

Open-sourcing a dev server is risky. Instead, **securely tunnel access to your local machine** using [`push-pull-port`](https://github.com/jifengwu2k/push-pull-port)—dead-simple shell scripts to "push" or "pull" TCP ports via SSH.

Benefits:

- No port forwarding rules
- No VPN
- Auto-reconnecting
- Jargon-free

### Prerequisites

- [autossh](https://www.harding.motd.ca/autossh/) (for robust tunnels):

    - **Ubuntu**
        ```bash
        sudo apt install autossh
        ```
    - **macOS**
        ```bash
        brew install autossh
        ```

- **SSH keys** set up for passwordless login to your cloud server.

    Generate an SSH keypair (if not yet):
    ```bash
    ssh-keygen
    ssh-copy-id [-p <ssh_port>] <user>@<host>
    ```

### Pull Theia Cloud Port to Your Local Machine

To "pull" remote port 3000 to your local port 13000:

```bash
sh pull-remote-port.sh -r 3000 -u your-ssh-user -h cloud.example.com -l 13000
```

- Now, visit [http://localhost:13000](http://localhost:13000) in your browser—**it connects right to your private cloud Theia instance, securely, via SSH.**

**Tip:** You can specify a custom SSH port with `-p`.

## Credits

- [StackOverflow](https://stackoverflow.com/questions/53230823/fatal-error-ineffective-mark-compacts-near-heap-limit-allocation-failed-javas)
- [Eclipse Theia documentation](https://github.com/eclipse-theia/theia-ide/).
