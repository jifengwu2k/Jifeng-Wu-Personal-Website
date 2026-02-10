---
title: Understanding What Instructions Your Old x86 CPU Supports
date: 2025-11-29
categories:
- [Environments]
---

If you're experimenting with running software on an old x86 CPU, it helps to know precisely which instructions are available. This blog post walks through inspecting CPU instructions with a C utility, explains their significance, and clarifies which compiler flags to use so your software runs reliably.

## Why CPU Instructions Matter

Modern software and operating systems increasingly rely on CPU instructions that didn't exist on older chips. For example:

- **SSE/SSE2** instructions are quietly assumed by many Linux distributions and applications.
- Features like **CMPXCHG8B** and **RDTSC** are outright required by kernels and some programs.
- Missing SIMD or specific instructions can make multimedia or even standard code painfully slow.

By checking what instructions your processor supports, you avoid mysterious crashes, performance issues, or software that refuses to run.

## Checking CPU Instructions with C Code

The following C program queries x86 feature bits using the CPUID instruction. It works on Linux and Windows, with either gcc or MSVC. Save it as `i386cpufeatures.c`:

```c
#include <stdio.h>
#include <stdint.h>

#if defined(_MSC_VER)
#include <intrin.h>
#else
#include <cpuid.h>
#endif

// Helper functions for cpuid
void cpuid(uint32_t leaf, uint32_t *eax, uint32_t *ebx, uint32_t *ecx, uint32_t *edx)
{
#if defined(_MSC_VER)
    int regs[4];
    __cpuidex(regs, leaf, 0);
    *eax = regs[0];
    *ebx = regs[1];
    *ecx = regs[2];
    *edx = regs[3];
#else
    __cpuid_count(leaf, 0, *eax, *ebx, *ecx, *edx);
#endif
}

void cpuidex(uint32_t leaf, uint32_t subleaf, uint32_t *eax, uint32_t *ebx, uint32_t *ecx, uint32_t *edx)
{
#if defined(_MSC_VER)
    int regs[4];
    __cpuidex(regs, leaf, subleaf);
    *eax = regs[0];
    *ebx = regs[1];
    *ecx = regs[2];
    *edx = regs[3];
#else
    __cpuid_count(leaf, subleaf, *eax, *ebx, *ecx, *edx);
#endif
}

int main()
{
    uint32_t eax, ebx, ecx, edx;
    uint32_t max_basic;
    uint32_t max_extended;

    cpuid(0, &max_basic, &ebx, &ecx, &edx);
    cpuid(0x80000000, &max_extended, &ebx, &ecx, &edx);

    printf("Max supported cpuid leaf: 0x%X\n", max_basic);
    printf("Max extended cpuid leaf: 0x%X\n", max_extended);

    // Feature leaf
    cpuid(1, &eax, &ebx, &ecx, &edx);

    // EDX
    printf("MMX..............: %s\n",    (edx & (1 << 23)) ? "YES" : "NO");
    printf("SSE..............: %s\n",    (edx & (1 << 25)) ? "YES" : "NO");
    printf("SSE2.............: %s\n",    (edx & (1 << 26)) ? "YES" : "NO");
    printf("CMOV.............: %s\n",    (edx & (1 << 15)) ? "YES" : "NO");
    printf("CMPXCHG8B........: %s\n",    (edx & (1 << 8))  ? "YES" : "NO");
    printf("RDTSC............: %s\n",    (edx & (1 << 4))  ? "YES" : "NO");

    // ECX
    printf("SSE3.............: %s\n",    (ecx & (1 << 0))  ? "YES" : "NO");
    printf("SSSE3............: %s\n",    (ecx & (1 << 9))  ? "YES" : "NO");
    printf("SSE4.1...........: %s\n",    (ecx & (1 << 19)) ? "YES" : "NO");
    printf("SSE4.2...........: %s\n",    (ecx & (1 << 20)) ? "YES" : "NO");
    printf("POPCNT...........: %s\n",    (ecx & (1 << 23)) ? "YES" : "NO");
    printf("AES-NI...........: %s\n",    (ecx & (1 << 25)) ? "YES" : "NO");
    printf("AVX..............: %s\n",    (ecx & (1 << 28)) ? "YES" : "NO");

    // AVX2, BMI1, BMI2: CPUID function 7
    if (max_basic >= 7) {
        cpuidex(7, 0, &eax, &ebx, &ecx, &edx);
        printf("AVX2.............: %s\n",  (ebx & (1 << 5)) ? "YES" : "NO");
        printf("BMI1.............: %s\n",  (ebx & (1 << 3)) ? "YES" : "NO");
        printf("BMI2.............: %s\n",  (ebx & (1 << 8)) ? "YES" : "NO");
    }
    // LZCNT: Extended leaves
    if (max_extended >= 0x80000001) {
        cpuid(0x80000001, &eax, &ebx, &ecx, &edx);
        printf("LZCNT............: %s\n", (ecx & (1 << 5)) ? "YES" : "NO");
    }

    return 0;
}
```

## Example Output & What It Means

Here's output from an ancient x86 CPU:

```
Max supported cpuid leaf: 0x1
Max extended cpuid leaf: 0x0
MMX..............: YES
SSE..............: NO
SSE2.............: NO
CMOV.............: YES
CMPXCHG8B........: NO
RDTSC............: NO
SSE3.............: NO
SSSE3............: NO
SSE4.1...........: NO
SSE4.2...........: NO
POPCNT...........: NO
AES-NI...........: NO
AVX..............: NO
```

Let's break down the important bits:

- **MMX: YES** - Your CPU supports the earliest SIMD x86 instructions (late 1990s).
- **SSE, SSE2: NO** - Many modern Linux distros/apps require these, you don't have them.
- **CMOV: YES** - Essential for some security features and compilers.
- **CMPXCHG8B: NO** - Most 32-bit OSes (Win98/XP, modern Linux 32-bit) will *not* boot on this CPU.
- **RDTSC: NO** - Performance counters and some benchmarks will fail.
- **No modern SIMD (SSE2/AVX/etc):** Any modern multimedia code (audio, video, graphics) will be *extremely* slow.
- **No POPCNT, AES-NI, AVX:** No acceleration for cryptography, bit-counting, or modern scientific code.

## Safe Compiler Flags for Your CPU

When building C/C++ code, choosing the right `CFLAGS` for your hardware prevents illegal instruction crashes. Here's a guide:

### 1. **Minimal Safe CFLAGS**

```sh
CFLAGS="-march=pentium2"
```
- Targets CPUs with **MMX** and **CMOV**, but NOT SSE or SSE2.

### 2. **Common Alternative Flags**

- `-march=i686` - Implies **CMOV**, but not MMX, SSE or SSE2.
- `-march=pentium2` - Safest for your old CPU: Only MMX and CMOV.
- `-march=pentium3` - Adds SSE (**not supported on your CPU!**)
- `-march=pentium4` - Requires SSE2 and SSE (**not supported on your CPU!**)

**Important:**  
If you mistakenly use `-march=pentium3` or newer, your binaries may crash with `illegal instruction` errors.
