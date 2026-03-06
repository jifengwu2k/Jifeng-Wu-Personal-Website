---
title: "Docker and Podman Containers as Lightweight VMs for Interactive Work"
date: 2026-04-18
categories:
  - "Systems"
tags:
  - "reference"
  - "systems"
  - "linux"
  - "docker"
  - "podman"
excerpt: "Docker and Podman Containers as Lightweight VMs for Interactive Work"
---

# Docker and Podman Containers as Lightweight VMs for Interactive Work

## Scope

This note focuses on using **Docker** and **Podman** as lightweight VMs for interactive work rather than service deployment platforms.

The goal here is:

- quickly starting an instance
- mounting code or data
- entering a shell and running commands
- resuming a previously created instance
- deleting an instance when you are done

## One mental model, two CLIs

### Docker

Docker is the most widely recognized container workflow. If you see examples online, they are often written for Docker first.

### Podman

Podman has a very similar CLI and is often attractive because it is more comfortable in rootless and daemonless workflows.

For this document's use case, Docker and Podman are similar enough that it is easiest to describe them together.

- **Image**: a reusable base environment, such as `ubuntu:24.04`
- **Container**: a running or stopped instance created from an image
- **Bind mount / volume**: a way to keep files outside the container so your work persists

## Core commands

### `run`

Create a **new container** from an image and run a command inside it.

Format:

```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
podman run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

#### Common options

- `-i`, `--interactive`: keep stdin open
- `-t`, `--tty`: allocate a pseudo-terminal
- `--name`: give the container an easy-to-remember name
- `--rm`: automatically delete the container when it exits
- `-v host_path:container_path`: mount a local directory or file into the container
- `-w path`: set the working directory inside the container
- `--gpus all`: give the container access to available GPUs when supported

#### Disposable foreground shell

```bash
docker run -it --rm ubuntu:24.04 bash
podman run -it --rm ubuntu:24.04 bash
```

This is the simplest pattern when you want a clean temporary environment.

#### Reusable foreground workspace

```bash
docker run -it --name devbox -v "$PWD":/workspace -w /workspace ubuntu:24.04 bash
podman run -it --name devbox -v "$PWD":/workspace -w /workspace ubuntu:24.04 bash
```

This is the main pattern for a foreground-first workflow:

- start the container
- work in the shell
- exit when done
- restart it later if needed

#### GPU-capable Ubuntu example

```bash
docker run -it --gpus all --name gpu-ubuntu -v "$PWD":/workspace -w /workspace ubuntu:24.04 bash
podman run -it --gpus all --name gpu-ubuntu -v "$PWD":/workspace -w /workspace ubuntu:24.04 bash
```

#### Notes

- If the image is not already present locally, it is usually pulled automatically.
- For interactive use, `-it` is usually what you want.
- Without a mount such as `-v "$PWD":/workspace`, files created only inside the container are easier to lose.

### `ps`

List containers.

```bash
docker ps
podman ps
```

By default, this shows only running containers.

To show all containers, including stopped ones:

```bash
docker ps -a
podman ps -a
```

Example output:

```bash
CONTAINER ID   IMAGE           COMMAND   CREATED         STATUS                      NAMES
f97abc466d62   ubuntu:24.04    "bash"    2 minutes ago   Exited (0) 10 seconds ago   devbox
```

### `start`

Start an existing stopped container.

Format:

```bash
docker start [OPTIONS] CONTAINER [CONTAINER...]
podman start [OPTIONS] CONTAINER [CONTAINER...]
```

Useful options:

- `-a`, `--attach`: attach stdout/stderr
- `-i`, `--interactive`: attach stdin

For a foreground-first workflow, this is how you re-enter a previously created container:

```bash
docker start -ai devbox
podman start -ai devbox
```

You can specify the container by:

- container name
- container ID

Use `ps -a` to find them.

### `rm`

Remove containers.

Format:

```bash
docker rm [OPTIONS] CONTAINER [CONTAINER...]
podman rm [OPTIONS] CONTAINER [CONTAINER...]
```

Example:

```bash
docker rm devbox
podman rm devbox
```

Force removal if necessary:

```bash
docker rm -f devbox
podman rm -f devbox
```

Use this when you no longer need the container itself.

### `cp`

Copy files between the host and a container.

Host to container:

```bash
docker cp local_file.txt devbox:/workspace/
podman cp local_file.txt devbox:/workspace/
```

Container to host:

```bash
docker cp devbox:/workspace/output.txt ./output.txt
podman cp devbox:/workspace/output.txt ./output.txt
```

If you already use bind mounts, `cp` is often unnecessary, but it is still useful for one-off transfers.
