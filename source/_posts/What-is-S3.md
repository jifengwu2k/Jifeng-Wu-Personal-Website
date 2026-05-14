---
title: "What is S3?"
date: 2026-05-13
updated: 2026-05-13
categories:
  - "Systems"
tags:
  - "reference"
  - "systems"
  - "software-engineering"
excerpt: "S3 is a giant distributed hashmap exposed as both a public HTTP server and an authenticated REST API."
---

S3 is a giant distributed hashmap where:

- keys are strings
- values are arbitrary bytes (up to 5 TB)
- anyone with the URL can download a value over plain HTTP

| Concept | What it really is |
|---|---|
| **Bucket** | A namespace for keys. Name must be globally unique. |
| **Object** | One key-value pair. The value is raw bytes + metadata |
| **Key** | A string like `models/llama/weights.safetensors`. The `/` has no special meaning — it's just a naming convention. |
| **Region** | Where the data physically lives (us-east-1, eu-west-1, etc.) |

## The two faces of S3

S3 presents as two completely different things depending on who's accessing it:

### Face 1: Public HTTP server (for downloaders)

- No credentials needed (if the object is set to `public-read`)
- No special tools — `curl`, `wget`, browser, Python `requests`, all work
- Supports HTTP `Range` headers → resumable downloads for free

### Face 2: Authenticated REST API (for you, the owner)

- All writes are authenticated (AWS access key + secret, signed with SigV4)
- Uploads over 5 GB automatically use multipart (split, upload chunks in parallel, reassemble)
- Multipart uploads are resumable if interrupted

## Presigned URLs: the third face

Presigned URLs let you grant temporary access to a specific key.

You (owner) generate an upload URL, valid 1 hour. Now anyone can upload to that exact key for 1 hour.

This is how services like YouTube, Dropbox, and Slack accept large user uploads — their backend generates a presigned S3 URL, hands it to the client, and the client uploads directly to S3. The service never sees the bytes.

## When to use S3

- You're already in the AWS ecosystem
- Your download volume is low enough that egress costs don't dominate
- You want to store data once and never think about backups, RAID, or disk failures again

## When not to use S3

- You expect high download volume — egress costs will punish you
- You want a live filesystem that maps directly to URLs
- You need atomic operations across multiple objects
