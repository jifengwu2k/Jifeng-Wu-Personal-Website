---
title: Setting Up a VNC Server for Remote Desktop Access
date: 2025-08-21
categories:
  - "Systems"
tags:
  - "reference"
  - "systems"
  - "vnc"
  - "remote-desktop"
---

While SSH is a staple tool and almost universally understood among Linux users, setting up **VNC for remote desktop access** - especially headlessly or with virtual framebuffers - remains mysterious to many, and for good reasons:

- Requires understanding of X11 and graphical sessions (DISPLAY variables, X servers, etc.)
- Involves properly launching graphical sessions

However, for many professionals, researchers, and IT administrators, secure remote desktop access is not just a convenience - it's an inelastic requirement. Unlike other features you can work around or delay, robust GUI access to a remote host is sometimes the only way to get mission-critical work done. For example:

- **Work-from-home** mean you need to access graphical applications (like IDEs, simulators, and visualization tools) installed on remote lab or office machines.
- **Remote servers without physical monitors** demand a headless-only setup - you can't just "plug in a monitor and keyboard" to start a desktop session.

This post covers two common scenarios:

- **Ubuntu Desktop VNC** for sharing an already-running physical desktop session
- **Headless VNC** for running a virtual desktop with no monitor attached

## Ubuntu Desktop VNC Setup Guide

This guide shows how to set up **real VNC access** on **Ubuntu Desktop**.

### Install Required Packages

Open a terminal and run:

```bash
sudo apt update
sudo apt install x11vnc
```

### Identify the Display

For a normal Ubuntu Desktop session, the display is usually `:0`.

You can check with:

```bash
echo $DISPLAY
```

If you are logged into the desktop normally, it will often be:

```text
:0
```

### Start the VNC Server

Run:

```bash
x11vnc -display :0 -rfbport 5900 -localhost -forever -shared
```

This command:

- Connects to the existing desktop session at display `:0`
- Listens for VNC connections on port 5900
- Restricts connections to localhost only (for security, VNC is not encrypted)
  - **Never expose VNC directly to the public Internet!**
- With `-forever`, x11vnc won't exit after the last client disconnects
- With `-shared`, multiple viewers can connect if needed

After running the command:

- It may print informational or warning messages depending on the environment.
- But it should **NOT** exit after running for a while. If it exits after running for a while, there's a problem to solve before moving on.


## Headless VNC Setup Guide

### Install Required Packages

First, install the necessary packages on the **remote host**:

- `xvfb`
- `x11vnc`
- `xterm` (for demonstration purposes in this tutorial)

**We would have to run `xvfb`, `x11vnc`, and `xterm` concurrently.** For this purpose, I recommend using `tmux` (or any other comparable tool) to manage multiple terminal windows and persistent sessions.

### Start the Virtual Display

In your first terminal window on the remote host, start Xvfb:

```bash
Xvfb :1 -screen 0 800x600x16
```

This creates a virtual X11 display number `:1` (using TCP port 6001) with resolution `800x600` and 16-bit color depth.

**Xvfb has properly started only if the above command neither logs output nor exits after being invoked.** If it logs messages or exits immediately, there's a problem to solve before moving on. Common issues include:

- Port 6001 already in use (try a different display number like `:2`)
- Permission issues with `/tmp/.X11-unix` directory. The `/tmp/.X11-unix` directory must be readable and writable. **In some environments like WSL, this directory might be read-only, which will prevent Xvfb from starting properly.**

### Start the VNC Server

In a second terminal window on the remote host, start x11vnc:

```bash
x11vnc -display :1 -rfbport 5901 -localhost -forever
```

This command:

- Connects to the virtual X server's framebuffer at display `:1`
- Listens for VNC connections on port 5901
- Restricts connections to localhost only (for security, VNC is not encrypted)
  - **Never expose VNC directly to the public Internet!**
- With `-forever`, x11vnc won't exit after the last client disconnects

After running the command:

- It may print informational or warning messages depending on the environment.
- But it should **NOT** exit after running for a while. If it exits after running for a while, there's a problem to solve before moving on.

### Test with a Simple Application

In a third terminal window on the **remote host**, launch a test application:

```bash
# The `DISPLAY=:1` environment variable must be set
# For all GUI apps you wish to appear in the VNC session
export DISPLAY=:1
xterm
```

### Important Caveat: Single-Instance Applications

Many desktop applications are designed to run **only one instance per user account**:

- Browsers: Firefox, Chrome/Chromium
- Advanced editors: gedit, kate, geany (configurable), code/VSCode
- File managers: nautilus, pcmanfm (configurable), dolphin
- Document viewers: evince
- Many modern GTK/Qt apps that use D-Bus for activation

**If your remote host has a physical desktop, and such an app is already running on your physical desktop**, new instances will try to communicate with the existing instance via D-Bus, **creating windows on your physical desktop instead of in your virtual framebuffer, even after `export DISPLAY=:1`.**

Solution:

- Ensure applications aren't already running on your main desktop before launching them in your VNC session.
- Or use a different user account for VNC access.

## Secure Access with SSH Tunneling

VNC is not encrypted, and in both setups `x11vnc` is configured to listen on `localhost` only, so SSH tunneling is the recommended access method for **both** setups in this post:

- **Ubuntu Desktop**: forward remote port `5900` to local port `5900`
- **Headless VNC**: forward remote port `5901` to local port `5901`

You can either use basic SSH port forwarding (which may be confusing), or [set up the `pull_remote_port.sh` wrapper](https://github.com/jifengwu2k/port-tunnel-manager) on your **local machine** to pull the remote VNC port to `localhost`.

After **cloning its GitHub repository and completing its prerequisites**, run:

```bash
bash pull_remote_port.sh [-p <ssh_port>] -u <remote_user> -h <remote_host> -r <remote_vnc_port> -l <local_port>
```

Examples:

```bash
# Ubuntu Desktop
bash pull_remote_port.sh -u <remote_user> -h <remote_host> -r 5900 -l 5900

# Headless VNC
bash pull_remote_port.sh -u <remote_user> -h <remote_host> -r 5901 -l 5901
```

This makes the remote host's VNC port available on your local machine via a secure SSH tunnel. After setting up the port forwarding, point your VNC viewer to the corresponding local address:

- `localhost:5900` for Ubuntu Desktop
- `localhost:5901` for Headless VNC

Common VNC clients:
- TigerVNC Viewer
- RealVNC Viewer
- Remmina

