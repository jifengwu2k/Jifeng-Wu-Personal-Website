---
title: "Profile a NEFF Executable"
date: 2026-07-19
updated: 2026-07-19
categories:
  - "Systems"
tags:
  - "reference"
  - "neuron"
  - "python"
  - "shell"
excerpt: "Capture and visualize execution traces from pre-compiled NEFF binaries using neuron-explorer."
---

Suppose you have obtained a NEFF (Neuron Executable File Format) binary — for example, through the workflows described in:

- [Compile NEFF Executables from NKI Kernels](/2026/05/14/Compile-NEFF-Executables-from-NKI-Kernels/)
- [Compile NEFF Executables from PyTorch Code](/2026/07/19/Compile-NEFF-Executables-from-PyTorch-Code/)

This post covers the next step: profiling that NEFF on a NeuronDevice, capturing the execution trace, and exploring it interactively with Neuron Explorer.

## 1. Capture an execution trace

The following command executes the NEFF on the NeuronDevice and records a raw execution trace into a NTFF (Neuron Trace File Format) artifact:

```sh
neuron-explorer capture \
    -n <neff file> \
    -s <ntff file> \
    --profile-nth-exec=2 \
    --enable-dge-notifs
```

### Flags explained

| Flag | Description |
|---|---|
| `-n <neff file>` | Path to the compiled NEFF binary to profile |
| `-s <ntff file>` | Output path for the NTFF trace artifact |
| `--profile-nth-exec=2` | Profile the **second** execution of the NEFF. The first iteration is discarded, which avoids one-time warmup delays (e.g., cold cache effects) from polluting the profile |
| `--enable-dge-notifs` | Enable capture of DGE DMA events. **Caveat:** this may overflow the status notification queue and cause execution timeouts when the NEFF contains many DGE instructions |

At this point you should have both the NEFF and the NTFF trace file ready for analysis.

## 2. Explore the trace in the web UI

Neuron Explorer includes an interactive, web-based UI for exploring execution traces:

```sh
neuron-explorer view --data-path <workspace directory>
```

This prints a URL you can open in a browser:

```
View a list of profiles at http://localhost:3001/
```

By default, `neuron-explorer` starts a web server on port **3001** and an API server on port **3002**.

### Accessing the UI on a headless instance

If you are profiling on a remote server without a desktop environment, you have two options:

**Option 1: Port forwarding (lighter weight).** Download the NEFF and NTFF files to your local machine, then run Neuron Explorer on the remote instance and forward both ports (the web server on 3001 and the API server on 3002) to your local machine via SSH. Open `http://localhost:3001/` in your local browser — it loads the NEFF and NTFF files from your local copy to render the trace visualization.

**Option 2: VNC (full remote desktop).** Install a browser on the instance and use a VNC-based remote desktop setup:

> [Setting Up a VNC Server for Remote Desktop Access § Headless VNC Setup Guide](/2025/08/21/Setting-Up-a-VNC-Server-for-Remote-Desktop-Access/#Headless-VNC-Setup-Guide)

Once the VNC session is active, open a browser inside it and connect to `http://localhost:3001/` to interact with the trace viewer.

## References

- Adapted from [Use Neuron Profile — AWS Neuron Documentation](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/guides/use-neuron-profile.html#step-3-profile-the-generated-neff)
