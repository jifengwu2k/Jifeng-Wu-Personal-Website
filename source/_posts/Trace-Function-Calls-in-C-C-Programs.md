---
title: Trace Function Calls in C/C++ Programs
excerpt: Trace Function Calls in C/C++ Programs
date: 2026-02-28
updated: 2026-02-28
categories:
  - Theory, Data Structures, Algorithms, Programming Languages, Design Patterns
tags:
- Reference
---

Sometimes, it's helpful to trace function calls in your program. Fortunately, GCC and Clang provide a built-in feature for this: **function instrumentation** via the `-finstrument-functions` flag. Here's a hands-on tutorial.

## Step 1: Create a Simple Program

Let's start with a straightforward C++ program (`main.cpp`):

```cpp
#include <stdio.h>

void foo() {
    printf("foo\n");
}

int main() {
    foo();
    return 0;
}
```

## Step 2: Write the Instrumentation Hooks

With `-finstrument-functions`, the compiler injects calls to two special functions at the entry and exit of every function:

- `__cyg_profile_func_enter(void *func, void *caller)` (on entry)
- `__cyg_profile_func_exit(void *func, void *caller)` (on exit)

Here's an implementation that prints the function names using `dladdr` (POSIX):

```cpp
#include <dlfcn.h>
#include <stdio.h>

extern "C" {
// Prevent self-instrumentation of hook functions
__attribute__((no_instrument_function))
void __cyg_profile_func_enter(void *func, void *caller) {
    Dl_info info;
    if (dladdr(func, &info)) {
        printf("enter %s\n", info.dli_sname);
    }
}

__attribute__((no_instrument_function))
void __cyg_profile_func_exit(void *func, void *caller) {
    Dl_info info;
    if (dladdr(func, &info)) {
        printf("exit %s\n", info.dli_sname);
    }
}
}
```

Note: The attribute `no_instrument_function` is crucial! Otherwise, the instrumented hooks would recursively call themselves and likely crash.

## Step 3: Compile the Program

Compile with function instrumentation enabled, and ensure symbols are exported for name resolution:

```sh
clang++ -finstrument-functions main.cpp -c
clang++ hooks.cpp -c
clang++ main.o hooks.o -o main -ldl -rdynamic
```

- `-finstrument-functions`: injects calls on entry/exit.
- `-ldl`: links the dynamic loader library, needed for `dladdr`.
- `-rdynamic`: exports all symbols for `dladdr` to resolve names.

## Step 4: Run the Program

Run the binary:

```sh
./main
enter main
enter _Z3foov
foo
exit _Z3foov
exit main
```

- You see the entry/exit for `main` and for `foo` (mangled name: `_Z3foov` in this case).
- The hooks print function names as you enter/exit them, allowing you to trace the call flow.
