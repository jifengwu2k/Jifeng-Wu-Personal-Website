---
title: "pyssa: An Executable, Source-Oriented, Stable Intermediate Representation for Python"
date: 2026-04-16
updated: 2026-04-16
categories:
  - "Programming"
tags:
  - "records"
  - "python"
  - "programming-languages"
  - "software-engineering"
excerpt: I published pyssa on Zenodo, a software documentation record for an executable, source-oriented, stable intermediate representation for Python.
---

I have published **pyssa** on Zenodo:

- Zenodo record: https://zenodo.org/records/19601901
- DOI: https://doi.org/10.5281/zenodo.19601901
- All-versions DOI: https://doi.org/10.5281/zenodo.19601900
- GitHub repository: https://github.com/jifengwu2k/pyssa

**pyssa** is an experiment in designing an intermediate representation for Python that tries to avoid a common tradeoff in Python tooling.

Today, Python analysis and transformation workflows are often pushed toward one of two input formats:

- **Python AST**, which preserves source structure well and is relatively stable, but does not directly present executable control flow.
- **Python bytecode**, which is executable, but does not preserve source in the way many source-oriented tools want and also inherits implementation details that are not always desirable as the basis for analysis and transformation.

pyssa takes a different path. It lowers Python source into a **region-based, explicit control-flow IR** that remains close to the source program while also being directly executable.

## What the current prototype already does

The current prototype already supports:

- lowering from Python source;
- execution through an interpreter; and
- validation against CPython for a substantial subset of Python.

My goal is to explore whether this kind of IR can become a more stable substrate for future Python program analysis and transformation workflows.

## Why I find this direction interesting

For Python tooling, source fidelity and executability are both useful, but they are often available only in separate representations. I am interested in the space between them:

- something more executable than ASTs,
- more source-oriented than bytecode,
- and more stable than representations tied too closely to changing interpreter internals.

That is the design space pyssa is trying to explore.

This Zenodo record archives a concise documentation snapshot of the project. The actively developed prototype remains on GitHub.

## Citation

```bibtex
@misc{wu_2026_19601901,
  author       = {Wu, Jifeng},
  title        = {pyssa: An Executable, Source-Oriented, Stable
                   Intermediate Representation for Python
                  },
  month        = apr,
  year         = 2026,
  publisher    = {Zenodo},
  doi          = {10.5281/zenodo.19601901},
  url          = {https://doi.org/10.5281/zenodo.19601901},
}
```