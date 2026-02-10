---
title: Building an OCaml Project with Dependencies in a Conda Environment Using Dune
date: 2026-01-17
categories:
- [Environments]
---

This workflow shows how to create and build an OCaml project with dependencies inside a Conda environment using Dune.

## Key Benefits

- **No Opam needed:**
    - Dune handles dependency resolution and build steps.
    - No use of a global `~/.opam`.
    - All dependencies and builds stay *inside your project directory*.
- **Portable:** Easy to reproduce and use in shell scripts, CI, or Docker.

Make sure you have a Conda environment with OCaml and Dune. To build OCaml and Dune in a Conda environment, follow the instructions [here](/2025/12/06/Building-C-C-Open-Source-Applications-in-a-Conda-Environment/).

## Steps

### Create a New OCaml Project

Use dune to initialize your project:

```sh
dune init proj my_project
cd my_project
```

This sets up:

```
my_project/
├── dune-project
├── bin/
│   ├── dune
│   └── main.ml
└── lib/
    └── dune
```

### Write Your Code

#### Executable Code (`bin/main.ml`)

```ocaml
open Hardcaml;;

let circuit = 
        let a = Signal.input "a" 8 in
        let b = Signal.input "b" 8 in
        let c = Signal.output "c" (Signal.(a +: b)) in
        Circuit.create_exn ~name:"adder" [ c ]
;;

Rtl.print Verilog circuit;;

let sim = Cyclesim.create circuit;;

let a = Cyclesim.in_port sim "a";;
let b = Cyclesim.in_port sim "b";;
let c = Cyclesim.out_port sim "c";;

a := Bits.of_int ~width:8 10;;
b := Bits.of_int ~width:8 20;;

Printf.printf "a: %d\n" (Bits.to_int !a);;
Printf.printf "b: %d\n" (Bits.to_int !b);;

Cyclesim.cycle sim;;

Printf.printf "c: %d\n" (Bits.to_int !c);;
```

Edit your `bin/dune` file to include used libraries:

```lisp
(executable
 (public_name my_project)
 (name main)
 (libraries my_project hardcaml) ; Add space-separated libraries
 (preprocess (pps ppx_jane ppx_hardcaml))) ; Add other directives based on library READMEs
```

### Declare Project Dependencies

Edit `dune-project`:

```lisp
(lang dune 3.22)
(name my_project)
(generate_opam_files true)

(package
 (name my_project)
 (synopsis "A short synopsis")
 (description "A longer description")
 (depends ocaml hardcaml hardcaml_waveterm ppx_hardcaml)) ; Add dependencies based on libraries in `bin/dune`, refer to library READMEs
```

### Lock Dependencies

Run:

```sh
dune pkg lock
```

- This will generate a lock directory.
- Dune will resolve, fetch, and build compatible versions for your declared dependencies.

### Build the Project

```sh
dune build
```

> This will download, build, and install all your locked dependencies and then use those to
build your project.
> This means that the first time building it will take longer than usual, as the
dependencies need to be built first.
> Subsequent builds where all dependencies have been built before will be fast.

### Run the Executable

```sh
dune exec my_project
```

or

```sh
./_build/default/bin/main.exe
```

You should see:

```
module adder (
    b,
    a,
    c
);

    input [7:0] b;
    input [7:0] a;
    output [7:0] c;

    wire [7:0] _4;
    assign _4 = a + b;
    assign c = _4;

endmodule
a: 10
b: 20
c: 30
```