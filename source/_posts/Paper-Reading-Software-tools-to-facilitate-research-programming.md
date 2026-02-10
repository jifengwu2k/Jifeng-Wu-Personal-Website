---
layout: blog
title: 'Paper Reading: Software tools to facilitate research programming'
date: 2022-10-18
categories:
- ["Research Inspiration"]
---

This is a paper recommended to me [by Margo Seltzer during a conversation](/2023/10/10/Conversation-with-Prof-Margo-Seltzer/). The original paper can be found [here](http://users.csc.calpoly.edu/~dekhtyar/401-Fall2016/papers/guo_phd_dissertation.pdf).

# Definition and Ubiquity of Research Programming

Research programming is a unique form of programming where the primary objective is to derive insights from data. It's a widespread activity. Not only is it crucial for academic advancements across various disciplines including natural sciences, engineering, and social sciences, but it also extends beyond academia. By some estimations, the number of individuals engaged in research programming dwarfs the number of professional software developers, suggesting its vast scale and significance. Moreover, even professionals in fields like science, engineering, business, finance, public policy, and journalism engage in research programming.

# Challenges in Research Programming

## Data Management and Provenance.

- Keeping track of where each piece of data originates and ensuring it remains up-to-date is crucial. This process can be tedious and difficult, especially when large amounts of data are involved.
- Organizing, naming, and managing various versions of data files present challenges.

## Data Preparation:

- A significant portion of time is spent on data cleaning and reformatting. This task can often be labor-intensive and not directly contribute to deriving insights, yet it's unavoidable.
- The process is more than just computational number crunching. It often involves transferring data between different tools, converting data formats, and managing extensive datasets.

## Analysis Phase

- The core activity involves writing and refining programs to analyze data.
- Challenges arise from scripts that take excessive time to run, especially after incremental edits, and from scripts crashing due to various errors.
- Managing output files, including keeping track of metadata, presents additional challenges.

## Reflection Phase

- Researchers analyze outputs, take notes, hold meetings, and make comparisons. Graphs play a significant role in visualizing and interpreting results. Managing and comparing these graphical outputs is vital.

## Dissemination Phase

- Once the research is complete, results need to be consolidated and communicated, often in the form of reports or academic publications.
- Reproducing results becomes challenging with time, especially with evolving software environments.
- Sharing code and data in collaborative settings introduces its own set of challenges.

# Distinct Nature of Research Programming Compared to Traditional Software Engineering

- Purpose: Unlike software engineering, which focuses on creating robust software, research programming prioritizes insights.
- Environment: Research programmers work in a diverse environment using various languages and tools, making it inherently heterogeneous.
- Specifications: The research programming process is more fluid and iterative, with changing specifications based on new discoveries.
- Priorities: The emphasis is on quick iteration for faster discoveries rather than perfecting the code.
- Expertise: A broad range of individuals, not just professional programmers, engage in research programming.

# The Role of Modern-Day Tools

Modern tools designed for general programming can be beneficial for research programmers. However, these tools are often not optimized for the unique characteristics of research programming. A balance needs to be struck between the robustness of software engineering tools and the flexibility required for research programming.

# Evolution of Documentation in Research

Historically, scientific research was documented meticulously in handwritten lab notebooks. But with the rapid pace of computational research, such traditional methods are no longer sufficient. While many research programmers use digital note-taking methods, an ideal solution would seamlessly integrate notes with source code and data files.

# Closing Thought

Recognizing and understanding these challenges are the first steps. It then becomes possible to leverage techniques from various domains, such as dynamic program analysis and recommendation systems, to enhance the productivity of research programmers.

------

# High-level Comments

I am very interested in investigating existing formalizations and crystallized best practices for specific tasks in Research Programming, such as "The Grammar of Graphics" for visualization tasks, and how functional programming can synergize with them. A clean-sheet functional design has the potential to open new windows in addressing many of these challenges, especially those that lack adequate tool support. Ideally, while embracing a functional cleaniness, it should follow several aspects of the UNIX and C++ philosophies.

- It must be driven by actual problems and its features should be immediately useful in real world programs.
- It should support and encourage the user to design and build software, even large-scale ones such as operating systems, to be tried early.
- It should provide facilities for organising programs into separate, well-defined parts, and provide facilities for combining separately developed parts. It should make it easy to make the output of every parts become the input to another, as yet unknown, parts.
- Allowing a useful feature is more important than preventing every possible misuse.
- It should work alongside other existing programming languages, rather than fostering its own separate and incompatible programming environment.
- If the programmer's intent is unknown, it should allow the programmer to specify it by providing manual control.
