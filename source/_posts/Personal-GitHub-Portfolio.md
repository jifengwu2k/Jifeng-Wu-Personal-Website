---
title: Personal GitHub Portfolio
date: 2026-04-12
updated: 2026-04-12
categories:
  - "Programming"
tags:
  - "reference"
  - "software-engineering"
  - "python"
  - "c++"
excerpt: Personal GitHub Portfolio
sticky: 2
---

# Personal GitHub Portfolio

## Data Structures and Algorithms

### Libraries

- [`avl-order-statistic-set`](https://github.com/jifengwu2k/avl-order-statistic-set) — A C++11 header-only AVL-tree set that behaves like std::set while adding order-statistic operations such as rank queries and lookup by index.
- [`canonical-interval`](https://github.com/jifengwu2k/canonical-interval) — A self-normalizing interval data structure that keeps intervals in valid canonical form and provides useful utility methods.
- [`canonical-range`](https://github.com/jifengwu2k/canonical-range) — A Python implementation of canonical ranges with stronger invariants and richer behavior than the built-in range.
- [`cowlist`](https://github.com/jifengwu2k/cowlist) — An efficient, immutable, type-safe copy-on-write list implementation for Python 2+.
- [`fixed-width-int`](https://github.com/jifengwu2k/fixed-width-int) — A fixed-width integer implementation for Python that precisely emulates C-style integer behavior.
- [`frozen-odict`](https://github.com/jifengwu2k/frozen-odict) — An immutable, hashable, ordered mapping for Python.
- [`generalized-range`](https://github.com/jifengwu2k/generalized-range) — A flexible generator that extends Python’s range concept to arbitrary types via custom successor and comparator functions.
- [`intersperse`](https://github.com/jifengwu2k/intersperse) — A simple generator that inserts a separator value between elements of an iterable.
- [`lazily-sliced`](https://github.com/jifengwu2k/lazily-sliced) — A memory-efficient sequence wrapper that applies slicing lazily and defers data access until needed.
- [`less-than-key`](https://github.com/jifengwu2k/less-than-key) — A utility for sorting and data structures that lets you define ordering with a custom less-than function.
- [`minimal-thread-pool`](https://github.com/jifengwu2k/minimal-thread-pool) — A minimal thread pool for Python 2+ designed for clarity and without concurrent.futures.
- [`networkx-reverse-topological-sort`](https://github.com/jifengwu2k/networkx-reverse-topological-sort) — Utilities for reverse topological sorting and stratifying DAG nodes in NetworkX from leaves to root.
- [`prefix-free-sorted-cowlist-set`](https://github.com/jifengwu2k/prefix-free-sorted-cowlist-set) — A prefix-free sorted set of COWList values backed by a trie.
- [`put-back-iterator`](https://github.com/jifengwu2k/put-back-iterator) — A drop-in iterator wrapper that lets you put items back after consuming them, which is useful for parsing and backtracking.
- [`random-byte-array`](https://github.com/jifengwu2k/random-byte-array) — A lightweight utility for generating random byte arrays.
- [`reduce-ex`](https://github.com/jifengwu2k/reduce-ex) — An n-ary reduce utility that supports prefix and suffix elements and can yield intermediate results.
- [`seqtok`](https://github.com/jifengwu2k/seqtok) — A strtok-like tokenizer for generic Python sequences without global state.
- [`sorted-fractionally-indexed-cowlist-set`](https://github.com/jifengwu2k/sorted-fractionally-indexed-cowlist-set) — A Python package for managing sorted, fractionally indexed sets of COWList values over a given alphabet.
- [`text-to-identifier`](https://github.com/jifengwu2k/text-to-identifier) — A tool that converts arbitrary text into valid Python identifiers while preserving as much meaning as possible.
- [`threading-value-event`](https://github.com/jifengwu2k/threading-value-event) — A thread synchronization primitive like threading.Event that carries an arbitrary Python value instead of only a boolean flag.
- [`tinytrie`](https://github.com/jifengwu2k/tinytrie) — A minimal, type-safe trie implementation for Python 2+.
- [`tree-traversals`](https://github.com/jifengwu2k/tree-traversals) — Efficient, generic traversals for arbitrary Python tree structures with full ancestor paths.
- [`uniqdeque`](https://github.com/jifengwu2k/uniqdeque) — A hybrid deque-plus-set data structure that preserves order while enforcing uniqueness.

## C++ Utilities

### Libraries

- [`allocated-buffer-initialization-destruction`](https://github.com/jifengwu2k/allocated-buffer-initialization-destruction) — Header-only C++ utilities for initializing and destroying objects in pre-allocated buffers.
- [`bytepun`](https://github.com/jifengwu2k/bytepun) — A safe and portable C++ utility for reinterpreting objects as other types while handling padding and truncation carefully.
- [`forward-reverse-iterator-converter`](https://github.com/jifengwu2k/forward-reverse-iterator-converter) — A C++ utility for converting between forward and reverse iterators while preserving the referenced element.

## Python Runtime and Semantics

### Libraries

- [`determine-slice-assignment-action`](https://github.com/jifengwu2k/determine-slice-assignment-action) — A utility that determines what operation a sequence implementation should perform for a given slice assignment.
- [`ipython-kernel-executor`](https://github.com/jifengwu2k/ipython-kernel-executor) — A lightweight package for executing code in an isolated IPython kernel and capturing results, stdout, and stderr.
- [`python-api-wrapper`](https://github.com/jifengwu2k/python-api-wrapper) — A C++ wrapper around the Python C API that aims to reduce manual memory management and tedious error handling.
- [`python-code-builder`](https://github.com/jifengwu2k/python-code-builder) — A library for dynamically building Python code with explicit scoping and symbol tracking.
- [`python-runtime-entity-wrappers`](https://github.com/jifengwu2k/python-runtime-entity-wrappers) — A set of small wrapper classes for representing Python runtime entities such as modules, classes, functions, constants, and abstract instances.
- [`rawattr`](https://github.com/jifengwu2k/rawattr) — Low-level Python attribute access utilities that bypass the descriptor protocol.
- [`resolve-module-import`](https://github.com/jifengwu2k/resolve-module-import) — A utility that resolves possibly relative imports to fully qualified Python module names.
- [`simulate-argument-binding`](https://github.com/jifengwu2k/simulate-argument-binding) — A pure Python library that simulates Python’s internal argument binding from signature information, defaults, and supplied arguments.
- [`tuplehash`](https://github.com/jifengwu2k/tuplehash) — A pure Python reimplementation of CPython’s tuple hash function with exact overflow behavior.
- [`yield-module-names-and-python-file-paths`](https://github.com/jifengwu2k/yield-module-names-and-python-file-paths) — A utility that recursively yields Python module names together with the file paths that define them.

## Interfaces Between Python and the Environment

### Libraries

- [`ctypes-unicode-proclaunch`](https://github.com/jifengwu2k/ctypes-unicode-proclaunch) — A minimal, robust, Unicode-aware process-launching library built on ctypes.
- [`escape-nt-command-line-argument`](https://github.com/jifengwu2k/escape-nt-command-line-argument) — A readable, reviewable utility for escaping Windows NT command-line arguments with explicit single-pass logic.
- [`find-unicode-executable`](https://github.com/jifengwu2k/find-unicode-executable) — A cross-platform utility for resolving executable paths as Unicode strings.
- [`get-chrome-paths`](https://github.com/jifengwu2k/get-chrome-paths) — A cross-platform utility for locating Chromium-based browser executables on Windows, macOS, and Linux.
- [`get-unicode-arguments-to-launch-editor`](https://github.com/jifengwu2k/get-unicode-arguments-to-launch-editor) — A cross-platform utility for deriving Unicode-safe arguments to launch an editor.
- [`get-unicode-home`](https://github.com/jifengwu2k/get-unicode-home) — A cross-platform utility for retrieving the current HOME path as a Unicode string.
- [`get-unicode-multiline-input-with-editor`](https://github.com/jifengwu2k/get-unicode-multiline-input-with-editor) — A utility that opens $EDITOR and returns multi-line Unicode input similarly to git commit.
- [`get-unicode-shell`](https://github.com/jifengwu2k/get-unicode-shell) — A cross-platform utility for retrieving the current SHELL as a Unicode string.
- [`live-tee-and-capture`](https://github.com/jifengwu2k/live-tee-and-capture) — A utility that runs a command, streams stdout and stderr live to the terminal, and captures them at the same time.
- [`posix-or-nt`](https://github.com/jifengwu2k/posix-or-nt) — A utility that determines whether the current Python interpreter is running on a POSIX-like or Windows NT platform.
- [`read-unicode-environment-variables-dictionary`](https://github.com/jifengwu2k/read-unicode-environment-variables-dictionary) — A ctypes-based utility for reading Unicode environment variables directly from the operating system.
- [`split-command-line`](https://github.com/jifengwu2k/split-command-line) — A library for splitting command lines according to both Windows NT and POSIX rules.
- [`textcompat`](https://github.com/jifengwu2k/textcompat) — A library for converting Python text values to encodings and text-oriented formats such as UTF-8, URIs, and HTML.
- [`unicode-raw-input`](https://github.com/jifengwu2k/unicode-raw-input) — A cross-platform Unicode-aware replacement for raw_input()/input() that behaves consistently across Python versions and operating systems.

## Filesystem Abstractions

### Libraries

- [`build-filesystem-trie`](https://github.com/jifengwu2k/build-filesystem-trie) — A utility that builds a trie representation of part of the filesystem, similar to the UNIX tree command.
- [`directory-file-mapping`](https://github.com/jifengwu2k/directory-file-mapping) — A library that lets you treat a directory as a Python dict.
- [`fspathverbs`](https://github.com/jifengwu2k/fspathverbs) — A package for representing filesystem paths as sequences of verbs.
- [`simple-json-mapped-dict`](https://github.com/jifengwu2k/simple-json-mapped-dict) — A MutableMapping implementation that persists its contents transparently to a JSON file on disk.

## GUI, Multimedia, and Media-Format Utilities

### Libraries

- [`detect-qt-binding`](https://github.com/jifengwu2k/detect-qt-binding) — A lightweight utility that detects which Qt Python binding is available in the current environment.
- [`file-to-unicode-base64-data-uri`](https://github.com/jifengwu2k/file-to-unicode-base64-data-uri) — A utility for converting files into Unicode base64-encoded data URIs.
- [`guess-file-mime-type`](https://github.com/jifengwu2k/guess-file-mime-type) — A minimal cross-platform utility for safely guessing a file’s MIME type.
- [`hwc-bgrx-8888-ndarray-to-chw-rgb-0-1-tensor`](https://github.com/jifengwu2k/hwc-bgrx-8888-ndarray-to-chw-rgb-0-1-tensor) — A utility that converts HWC BGR/BGRX NumPy arrays into normalized CHW RGB PyTorch tensors.
- [`hwc-bgrx-8888-ndarray-to-pil-image`](https://github.com/jifengwu2k/hwc-bgrx-8888-ndarray-to-pil-image) — A utility that converts HWC BGR/BGRX NumPy arrays into RGB PIL images.
- [`hwc-chw-ndarray-conversion`](https://github.com/jifengwu2k/hwc-chw-ndarray-conversion) — A utility for explicit, contiguous conversion between HWC and CHW ndarray layouts.
- [`hwc-ndarray-letterbox`](https://github.com/jifengwu2k/hwc-ndarray-letterbox) — A utility that letterboxes HWC ndarray images to a target size while updating the homogeneous transformation matrix.
- [`pyqt-current-exception-message-box`](https://github.com/jifengwu2k/pyqt-current-exception-message-box) — A simple utility that displays the current exception in a PyQt message box.
- [`pyqt-screen-capture`](https://github.com/jifengwu2k/pyqt-screen-capture) — A screen capture utility that works across PyQt and PySide versions.
- [`qimage-hwc-bgrx-8888-ndarray-interop`](https://github.com/jifengwu2k/qimage-hwc-bgrx-8888-ndarray-interop) — A zero-copy bridge between Qt QImage objects and NumPy ndarrays in HWC BGRX 8888 format.
- [`trim-hwc-ndarray`](https://github.com/jifengwu2k/trim-hwc-ndarray) — A utility that trims uniform borders from HWC ndarray images using the color of a chosen corner as the background.

### CLI

- [`extract-pdf-highlighted-text`](https://github.com/jifengwu2k/extract-pdf-highlighted-text) — A CLI tool that extracts highlighted text from PDF documents.
- [`chromecodepdf`](https://github.com/jifengwu2k/chromecodepdf) — A script that converts code files into syntax-highlighted PDF documents using Chrome and Pygments.
- [`lrphotocopy`](https://github.com/jifengwu2k/lrphotocopy) — A CLI tool that organizes and copies photos by shooting date using Lightroom-style folders.

### GUI

- [`frameperfect`](https://github.com/jifengwu2k/frameperfect) — A lightweight GUI app for frame-by-frame video analysis and screenshot extraction using PySide/PyQt and OpenCV.

## Transport, Networking, and Web Technologies

### Libraries

- [`lxml-xpath-utils`](https://github.com/jifengwu2k/lxml-xpath-utils) — A collection of utility functions for working with lxml and XPath.
- [`send-recv-json`](https://github.com/jifengwu2k/send-recv-json) — A library for sending and receiving JSON values over byte streams using a universal length-prefixed binary framing scheme.

### CLI

- [`get-local-address`](https://github.com/jifengwu2k/get-local-address) — A utility that determines the local IP address that would be used to reach a specified remote UDP server.
- [`push-pull-port`](https://github.com/jifengwu2k/push-pull-port) — Shell scripts for exposing a local TCP port remotely or making a remote TCP port available locally.
- [`resumable-file-server`](https://github.com/jifengwu2k/resumable-file-server) — A multithreaded HTTP file server in pure Python that supports resumable downloads and file uploads.
- [`save-page-as-md`](https://github.com/jifengwu2k/save-page-as-md) — A tool that downloads webpages and saves them as Markdown while mirroring their domain and path structure on disk.
- [`simple-dav-client`](https://github.com/jifengwu2k/simple-dav-client) — A minimal command-line client for interacting with a WebDAV server over plain HTTP without authentication.
- [`ssheval`](https://github.com/jifengwu2k/ssheval) — A cross-platform pure Python script for executing remote commands over SSH and streaming raw stdout and stderr.

## AI Tooling

### Libraries

- [`chat-completions-conversation`](https://github.com/jifengwu2k/chat-completions-conversation) — A Python 2+ library for managing LLM conversations through an OpenAI Chat Completions-compatible API.
- [`retrieve-sentence-embeddings`](https://github.com/jifengwu2k/retrieve-sentence-embeddings) — A simple function for retrieving sentence embeddings from an OpenAI Embeddings-compatible API.

### CLI

- [`assemblyai-transcribe`](https://github.com/jifengwu2k/assemblyai-transcribe) — A small CLI that uploads a local audio file to AssemblyAI and prints the transcript.
- [`chatrepl`](https://github.com/jifengwu2k/chatrepl) — A Python REPL for chatting with LLMs through an OpenAI Chat Completions-compatible API.
- [`llmgcalparse`](https://github.com/jifengwu2k/llmgcalparse) — A CLI that turns natural-language event descriptions into Google Calendar event URLs with help from an LLM.
- [`safetensors-layer-grabber`](https://github.com/jifengwu2k/safetensors-layer-grabber) — A tool that extracts the weights for a specific layer or block from safetensors model files into a PyTorch-compatible state dict.

## Command-line and Development Flow Improvements

### Libraries

- [`coverage2sketch`](https://github.com/jifengwu2k/coverage2sketch) — A tool that extracts sketch views of Python source files from coverage data.
- [`managed-readline-sessions`](https://github.com/jifengwu2k/managed-readline-sessions) — A library for managing readline-based CLI sessions with persistent history, completions, and clean handling of global readline state.
- [`symbolpilot`](https://github.com/jifengwu2k/symbolpilot) — An interactive, human-in-the-loop object file symbol resolver.

### CLI

- [`interactive-dependency-resolver`](https://github.com/jifengwu2k/interactive-dependency-resolver) — A tool for interactively resolving Python wheel dependencies.
- [`run-with-coverage`](https://github.com/jifengwu2k/run-with-coverage) — A CLI that runs a Python script with coverage tracking while letting you specify the coverage data file.
- [`sdial`](https://github.com/jifengwu2k/sdial) — A speed-dial utility for frequent CLI commands.

