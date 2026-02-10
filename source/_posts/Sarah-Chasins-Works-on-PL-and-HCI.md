---
layout: blog
title: Sarah Chasins' Works on PL and HCI
date: 2023-11-05
categories:
- ["Research Inspiration"]
---

# [Co-Designing for Transparency: Lessons from Building a Document Organization Tool in the Criminal Justice Domain](https://dl.acm.org/doi/10.1145/3593013.3594093)

Investigative journalists and public defenders are crucial in scrutinizing and litigating significant matters concerning police violence and misconduct. However, they often need help navigating through vast, unordered heaps of data, which adds strain to their resource-constrained teams.

In partnership with U.S. public defenders and investigative journalists, we developed an AI-enhanced tool through a joint design effort to aid in working with such data. This process offered us valuable insights into the requirements of resource-constrained teams dealing with large data sets, including how some experts became self-taught programmers to streamline their workflows.

We pinpointed three primary data needs throughout our collaborative design journey and established five design objectives.

## Three Primary Data Needs

Data Cleaning, particularly the process of de-duplication. That involves identifying identical (images of pages are pixel-for-pixel copies of each other) or nearly identical data (images are not pixel-for-pixel identical but capture the same physical document) within a dataset.

Data Extraction. The professionals also struggled in extracting relevant information such as names, dates, locations, and case numbers from case files due to their disparate formats and layouts, necessitating extensive, hands-on work.

Data Organization. There was a need to systematically organize PDF documents by specific cases, complicated by the fact that cases may be spread across numerous documents and folders, or conversely, several cases might be compiled into one extensive PDF.

## Five Fundamental Design Principles

Human Control and Intervention. The design must prioritize aiding users over complete automation of the process.

Non-Interference with Existing Practices. The design should integrate seamlessly with existing workflows and practices.

Adaptability to Data Diversity.

High-level Abstractions. General-purpose languages like Python or R demand extensive technical expertise. Pre-built software, on the other hand, offers limited flexibility.

Cost-Sensitive Solutions.

## Results

Participants in our sessions became adept in all three programming paradigms (visual, PBE, and text-based interfaces).

- This contradicts the common misconception that non-technical experts need formal coding training to handle text-based programming; if the tools are appropriately supportive, they can.
- Rather than creating new code, participants preferred to modify what was already there. Particularly with text-based coding, almost all chose to adapt sample code instead of originating their own, aligning with previous research on the blank-page syndrome.

------

# [A Need-Finding Study with Users of Geospatial Data](https://dl.acm.org/doi/abs/10.1145/3544548.3581370)

Current geospatial analysis and visualization tools present significant learning curves and usability challenges.

- Finding and transforming geospatial data to specific spatiotemporal constraints.
- Grasping the behavior of geospatial operators.
- Tracking the provenance of geospatial data, including cross-system provenance.
- Exploring the cartographic design space.

## Grasping the behavior of geospatial operators

Users had to run operators and manually check outputs to understand operator semantics.

Live programming, which offers users immediate visual feedback on program behavior using concrete inputs, could align with users' existing debugging patterns of using small collections of geographic features or pixels as test cases to infer operator behavior.

## Tracking the provenance of geospatial data, including cross-system provenance

The GIS tools used by participants did not track the steps leading to final outputs, complicating the replication of previous analyses. 

Modifying maps or adapting them to new datasets often meant laboriously reverse engineering the initial analysis steps.

Creating repeatable and communicable geospatial workflows was a struggle for GIS users. Limitations in current history features made it difficult to recover information on the current analysis state or revisit past analysis decisions.

The problem of tracking provenance across different systems was also prominent.

Users often kept informal records of the steps taken in data acquisition, cleaning, analysis, and visualization, which spanned several applications. For instance, one user used macOS Notes to detail a process involving data transfer between Sentinel Hub, QGIS, Illustrator, and Photoshop, documenting everything from selecting a Sentinel-2 image to reassembling raster segments in Illustrator. This kind of multi-tool orchestration was typical among our subjects, yet none had automated systems to log data lineage across these platforms.

## Exploring the cartographic design space

Many participants used direct manipulation tools for geospatial data visualization, which discarded all geographical metadata, posing challenges to revising the analysis after starting the visualization. This uncovers a potential for development in tools that (1) unify geospatial analysis with cartographic design and (2) preserve the geospatial data aspects of visual elements while supporting direct manipulation.

Existing research suggests that combining scripting with direct manipulation for visually oriented tasks is feasible. The Sketch-n-sketch application is a testament to the successful merger of these methods for SVG graphics.

Such a combined approach could also remedy the fundamental issue participants faced when using direct manipulation tools for cartography: the need to recreate map designs in code after finishing a design.

------

# [How Statically-Typed Functional Programmers Write Code](https://dl.acm.org/doi/10.1145/3485532)

A deeper comprehension of the coding methods of statically-typed functional programmers could lead to the creation of more practical tools, more user-friendly programming languages, and better gateways into programming communities.

These programmers utilize their compilers for more than just producing an executable; they also use compilers as corrective and directive aids.

- Compilers as corrective tools. Compiler error messages were useful not just to fix their programs but also to correct their mental models of the problem domain.
- Compilers as directive tools. Many developers treat compiler errors as to-do lists, guiding their subsequent coding actions. A typical process includes beginning a program change with a minor alteration and compiling to receive error-driven sub-tasks - essentially turning error messages into a step-by-step guide for coding.

It's not uncommon for programmers to compile their code with the expectation of errors, using the compiler to validate the direction of their development.

Statically-typed functional programmers often seek feedback from automated tools even when their code isn't yet operational, suggesting that such tools should strive to extract as much information as possible from non-compilable code.

When comparing pattern matching with combinators, statically-typed functional programmers report less cognitive and time pressure with the former. This could be due to pattern matching's explicit textual representation of tasks, explicit handling of recursion, or consistent interface across various data structures. Nonetheless, some programmers prefer to rewrite their code using combinators eventually. Ideally, a tool would assist in this process, starting with a data type and guiding the programmer through case completion, subsequently offering a series of combinators as a refined alternative.

It is beneficial to recognize which language constructs allow for low-workload or opportunistic construction and how these constructs are valued within the programming community.

There's a demand for tools that minimize the difficulty of altering types during development. Furthermore, these tools should facilitate the natural cyclic changes of a developer's focus between modifying types and modifying expressions, possibly by employing program repair techniques to predict how changes in one will affect the other.

Program sketches provide a wealth of information about undefined functions, like inferred types and potential uses. Since statically-typed functional programmers regularly employ this method of drafting and refining code, there's a clear opportunity for tools that could enhance or even automate parts of this practice.
