---
title: Important Locations on Jailbroken iOS
excerpt: Important Locations on Jailbroken iOS
date: 2026-04-26
updated: 2026-04-26
categories:
  - "Systems"
tags:
  - "reference"
  - "systems"
  - "c++"
---

This is a short reference note for a few useful filesystem locations on a jailbroken iOS system.

## C/C++ Runtime

- C runtime:
  - `/usr/lib/libSystem.B.dylib`
- C++ standard library:
  - `/usr/lib/libc++.1.dylib`
- C++ ABI library:
  - `/usr/lib/libc++abi.dylib`

## C/C++ SDK

A test C compile showed the driver linking with:

- `-syslibroot /var/jb/usr/share/SDKs/iPhoneOS.sdk`
- `-lSystem`

## Photo Storage

- **Image and video files:** `/var/mobile/Media/DCIM`
- **Photos library database and metadata:** `/var/mobile/Media/PhotoData`
- **Main Photos database:** `/var/mobile/Media/PhotoData/Photos.sqlite`
