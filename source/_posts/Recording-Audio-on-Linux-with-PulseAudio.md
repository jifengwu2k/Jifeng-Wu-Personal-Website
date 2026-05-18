---
title: "Recording Audio on Linux with PulseAudio"
date: 2026-05-17
updated: 2026-05-17
categories:
  - "Tools and Automation"
tags:
  - "reference"
  - "linux"
  - "audio"
excerpt: "A minimal, dependency-free recipe for capturing system output and microphone audio on Linux using only PulseAudio's built-in tools: pactl and parec."
---

Recording audio on Linux doesn't require Audacity, OBS, or any heavyweight GUI. PulseAudio (and its PipeWire-compatible replacement) ships with everything you need: **`pactl`** to inspect sources and **`parec`** to capture them.

## List available audio sources

```bash
pactl list sources short
```

Typical output on a laptop:

```
74   alsa_output.pci-0000_00_1f.3.analog-stereo.monitor   PipeWire   s32le 2ch 48000Hz   SUSPENDED
75   alsa_input.pci-0000_00_1f.3.analog-stereo             PipeWire   s32le 2ch 48000Hz   SUSPENDED
```

| Field | Index | Example | Meaning |
|-------|-------|---------|---------|
| Source index | 0 | `74` | Numeric ID used with `parec --device` |
| Name | 1 | `alsa_output...monitor` | If name ends in `.monitor` → system output; otherwise → microphone |

The `.monitor` suffix is the key distinction: **monitor sources** capture whatever is playing through your speakers, while plain sources are your microphone or line-in.

## Record with parec

```bash
parec --device <source-index> --file-format=wav <output-path>
```

| Argument | Value | Notes |
|----------|-------|-------|
| `--device` | `74`, `75`, etc. | The source index from `pactl list sources short` |
| `--file-format` | `wav` | Always WAV; `parec` only supports WAV and raw PCM |
| `<output-path>` | `~/Recordings/recording_20260517_120530_<name>.wav` | File written directly to disk |

## Record system output and mic simultaneously

Run two `parec` processes in parallel:

```bash
# Process 1: system output (monitor source)
parec --device 74 --file-format=wav \
  ~/Recordings/recording_20260517_120530_system.wav &

# Process 2: microphone
parec --device 75 --file-format=wav \
  ~/Recordings/recording_20260517_120530_mic.wav &
```

To stop both, send `SIGTERM` to the processes (e.g., `kill %1 %2`).

## Key behaviors

- **WAV files are written continuously** during recording — no buffered finalization step.
- **Files are immediately usable** after the process ends. No post-processing, transcoding, or header repair is needed.
- `parec` records in the source's native format (sample rate, channel count, bit depth) and writes it faithfully to the WAV container.
