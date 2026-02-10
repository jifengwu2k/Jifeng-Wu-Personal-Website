---
title: Manipulating Videos Using `ffmpeg`
date: 2025-08-23
categories:
- ["Data Science, Multimedia, and Process Automation"]
---

## Extract a Portion of the Video

```bash
ffmpeg -ss "$start_time_in_seconds" -i "$input" -to "$end_time_in_seconds" -c copy "$output"
```

## Reduce a Video's Resolution by Half

```bash
ffmpeg -i "$input" -vf "scale=iw/2:ih/2" -c:a copy "$output"
```

- Use the `scale` filter with expressions to halve the width and height:
  - `iw` = input width, `ih` = input height.
- `-c:a copy` copies the audio stream without re-encoding.

