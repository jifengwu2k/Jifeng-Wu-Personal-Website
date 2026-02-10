---
title: Qt Bindings for Python Test Environments
date: 2026-01-18
categories:
- [Environments]
---

When testing Python code using PyQt compatibility packages such as [detect-qt-binding](https://github.com/jifengwu2k/detect-qt-binding), we would need to test the code with different Qt bindings for Python. Here I summarize what environment is required to run those bindings.

## [PyQt6](https://pypi.org/project/PyQt6/#files)

- `cp39-abi3-win_amd64`
- `cp39-abi3-win_arm64`
- `cp39-abi3-manylinux_2_34_x86_64`
- `cp39-abi3-manylinux_2_39_aarch64`
- `cp39-abi3-macosx_10_14_universal2`

A Conda environment would do.

## [PySide6](https://pypi.org/project/PySide6/#files)

- `cp39-abi3-win_amd64`
- `cp39-abi3-win_arm64`
- `cp39-abi3-manylinux_2_34_x86_64`
- `cp39-abi3-manylinux_2_39_aarch64`
- `cp39-abi3-macosx_13_0_universal2`

A Conda environment would do.

## [PyQt5](https://pypi.org/project/PyQt5/#files)

- `cp38-abi3-win_amd64`
- `cp38-abi3-win32`
- `cp38-abi3-manylinux_2_17_x86_64`
- `cp38-abi3-macosx_11_0_x86_64`
- `cp38-abi3-macosx_11_0_arm64`

A Conda environment would do.

## [PySide2](https://pypi.org/project/PySide2/#files)

- `cp35.cp36.cp37.cp38.cp39.cp310-none-win_amd64`
- `cp35.cp36.cp37.cp38.cp39.cp310-none-win32`
- `cp35.cp36.cp37.cp38.cp39.cp310-abi3-macosx_10_13_intel`
- `cp27-cp27m-macosx_10_13_intel`
- `cp35.cp36.cp37.cp38.cp39.cp310-abi3-manylinux1_x86_64`
- `cp27-cp27mu-manylinux1_x86_64`

A Conda environment would do.

## PyQt4

Ubuntu 16 Xenial Xerus has the `python3-pyqt4` package (unavailable on PyPI!)

To run Ubuntu 16 Xenial Xerus, consider [building proot](/2025/12/06/Building-C-C-Open-Source-Applications-in-a-Conda-Environment/), and then setting up a Ubuntu 16 Xenial Xerus proot environment:

```bash
curl -O https://partner-images.canonical.com/core/xenial/current/ubuntu-xenial-core-cloudimg-amd64-root.tar.gz
mkdir ubuntu-rootfs
# Ignore error messages
tar -xpf ubuntu-*-core-cloudimg-*-root.tar.gz -C ubuntu-rootfs
```

Then, we can start the proot environment with:

```bash
proot \
	-0 \
	-b /dev/ \
	-b /etc/group \
	-b /etc/host.conf \
	-b /etc/hosts \
	-b /etc/mtab \
	-b /etc/networks \
	-b /etc/nsswitch.conf \
	-b /etc/passwd \
	-b /etc/resolv.conf \
	-b /etc/localtime \
	-b /proc/ \
	-b /run/ \
	-b /sys/ \
	-b /var/run/dbus/system_bus_socket \
	-r ~/ubuntu-rootfs \
	-w / \
	/bin/bash
```

In the proot environment, install:

```bash
apt update
apt install python3 python3-pip python3-pyqt4
```

## [PySide](https://pypi.org/project/PySide/#files)

- `cp34-none-win32`
- `cp33-none-win32`
- `cp27-none-win_amd64`
- `cp27-none-win32`
- `cp26-none-win_amd64`
- `cp26-none-win32`

Installing Python 2.7 on a 32-bit Windows environment (such as Wine) is a good bet.
