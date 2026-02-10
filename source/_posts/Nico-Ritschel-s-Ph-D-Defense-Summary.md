---
title: Nico Ritschel's Ph.D. Defense Summary
date: 2023-10-13
categories:
- ["Research Inspiration"]
---

[Nico Ritschel](https://www.cs.ubc.ca/~ritschel/)'s research focuses on refining block-based programming by integrating elements from visual programming to make it more accessible and effective for end-users, especially in the robotics domain.

# Problem Statement

- Block-based programming is mainly used for computer science education. Can they target other tasks, such as end-user programming?
- The challenge: end-users often need to write larger, real-world programs, contrasting with the simple toy examples students typically handle.
- Traditional block-based programming struggles with scalability, especially in terms of readability.
- While visual end-user programming tools like Excel and Simulink support bigger programs through domain-specific visual abstractions, creating new visual languages is difficult and costly.
- Solution Approach: Merge design features from visual programming into block-based programming languages.

# Target Domain: Robotics

1. **Current Scenario:**
    - Professional tools exist, but they're challenging to use.
    - There needs to be more effective block-based tools in the domain.
2.  **Robot Arms for Factory Floors:**
    - Task: Coordinate and synchronize two robot arms.
    - Issues: Current block-based languages require complex solutions like nontrivial mutexes.
    - **Solution & Studies:**
        - Proposed two design ideas:
            1. Represent programs for each arm vertically and side-by-side. Synchronized actions appear as shared nodes between the arms.
            2. A left-to-right flow resembling video editing.
        - The 'side-by-side' design was selected.
        - A study found that end-users using this design outperformed those using a commercial, text-based tool.
3.  **Mobile Robots for Warehouses & Labs:**
    - Task: Handle large tasks across multiple workstations.
    - Issues:
        - Difficulty decomposing long programs and locating where to make changes.
        - 
    - **Solutions & Features:**
        - Introduced block-based language that supports functional decomposition.
        -   Provided two separate canvases: one for task composition/movement and the other for low-level task definitions.
        -   Included triggers as dataflow graphs to improve the visibility of nested expressions and enhance user freedom in structuring programs.

# Questions Addressed During the Practice Session

1.  **Why focus on the two robotics scenarios?**
    -   They are important and relevant in the robotics domain.
    -   These scenarios present challenges for end-users learning to program.
    -   They represent a complex form of programming that's worth refining.
2.  **Would functional programming principles enhance end-user visual programming, given the imperative nature of block-based programming?**
    -   The inherent complexity in robotics means many elements can't be simplified.
    -   Introducing functional programming might not necessarily boost user productivity.
3.  **What was the environment for user studies?**
    -   Engaged actual end-users for genuine feedback.
    -   Also recruited students from non-computer science departments for a broader perspective.

# Questions Asked During the Ph.D. Defense

- How were the visions and observations formulated?
    -  Separate users into traditional versus new environments and then compare.
    - Gain knowledge of their needs and patterns.
    - Test on a small pool of users to refine the design.
- How do you account for the spectrum of end-users regarding programming experience, domain-specific task time, and tool experience?
- Which results were the most and least robust?
- What factors made the tool easy to learn?
    - The "blocks" concept is already well-known.
    - The tool matches the users' previous domain-specific knowledge (e.g., separate columns for two arms).
- How realistic is the decomposition at scale? Any evidence from related work?
    - More of a "lower bound," limited by the time of the user study.
- Why was the comparison made between block-based methods and graph-based methods?
    - Graph-based methods are already used in end-user programming, such as game programming.
- What is the importance and implication of the determined p-value?
    - We have a null hypothesis - there is no difference between the performance of the two groups.
- What improvements (e.g., 5%) are worthwhile?
- What are the advantages of block-based approaches over dataflow, and how can this be further investigated?
    - Different aspects, e.g., reading vs writing
    - Different domains, e.g., robotics vs game
    - Different styles of programs
    - Different representations of graphs
- How are potential accessibility challenges addressed?
    - Already addressed to a degree in the normal block-based domain.
    - Domain-specific challenges are directions for future work.
- How does the new tool compare with LLMs?
    - Can work together.
    - Have advantages in evolution and understanding vs. writing something that would work the first time.
        - Debugging.
        - Reliability.
        - No training required.
- What follow-up studies are anticipated for real-world usage? How do you anticipate the tool's usability in practical scenarios? Follow-up studies based on real-world usage in the wild may encounter unanticipated, really specific problems. Is your tool something someone wants to use in practice?
- Would featuring a table of reactive values a la Excel be beneficial?
- How do different domains within computer science influence the tool's design and analysis? What interdisciplinary expertise would be beneficial?
    - Information visualization.
    - Designing design drafts with an expert in visualization would be beneficial.
- What about your tool's applicability to expert programmers instead of end users?
    - Different design goals.
