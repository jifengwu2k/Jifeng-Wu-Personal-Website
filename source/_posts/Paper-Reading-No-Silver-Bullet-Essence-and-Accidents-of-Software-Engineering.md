---
title: 'Paper Reading: No Silver Bullet Essence and Accidents of Software Engineering'
date: 2022-09-12
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Advanced Software Engineering](https://github.com/ubccpsc/507/tree/2022sept). The original paper can be found [here](https://doi.org/10.1109/MC.1987.1663532).

# How does this work move the research forward?

## What were the primary contributions of the paper as the author sees it?

The author concludes that there is no elixir or "silver bullet" to the problems software engineering is facing. Furthermore, the author also examines encouraging innovations, and shows that a disciplined, consistent effort to develop, propagate, and exploit them should alleviate the problem.

## What were the main contributions of the paper as you (the reader) see it?

In my opinion, what the paper is most remarkable at is shedding light upon the nature of the software problem and its implications.

1. The essence of a software entity is a construct of interlocking concepts that cannot be accurately visualized. The complexity of software is an essential property, and it increases non-linearly with size. This has many implications.
  - Difficulty of design.
  - Hindrance of communication among team members, which leads to product flaws, cost overruns, schedule delays.
  - Hard to use programs.
  - Difficulty of extending to new functions without creating side effects.
  - Security trapdoors.
  - Personnel turnover incurs tremendous learning and understanding burden.
2. Software is constantly subject to pressure for change.

The aforementioned points clarified by the paper illuminates research directions in software engineering aimed at ameliorating the software problem.

## How could this research be extended?

In the last section of the paper, the author examines promising attacks on the essence of the software problem.

- Buying off-the-shelf software instead of building in-house software.
- Rapid prototyping and iterative specification of requirements with client feedback.
- Incremental development of software from a simple and incomplete, yet running, system.
- Growing great designers who are the core of the development team.

The effectiveness of these and other approaches in mitigating the software problem could be assessed in subsequent works.

# How was the work validated?

1. First, the author examines the nature of the software problem and its implications.
2. Further on, the author recalls the three steps in software technology that have been most fruitful in the past - high-level languages, time-sharing, and unified programming environments, concluding that they have their limits and the difficulties that they attacked are accidental, not essential.
3. The author continues to consider the technical developments that are most often advanced as potential silver bullets - high-level language advances, object-oriented programming, artificial intelligence, automatic programming, graphical programming, program verification, environments and tools, workstations - analyzing the problems they assess, their advantages, and their disadvantages.
4. Finally, the author presents promising attacks on the conceptual essence, explaining why they would be useful.

# How could this research be applied in practice?

The lessons learned from this research are of great practical value.

1. In shedding light upon the nature of the software problem and its implications, the author provides criteria for organizations to assess the effectiveness of their development practices.
2. In considering the technical developments that are most often advanced as potential silver bullets, the author examines their advantages, and their disadvantages, and provide insights into whether to, and how to adequately use them.
3. In presenting promising attacks on the conceptual essence, the author provides meaningful suggestions for organizations to improve their software development processes, and provides convincing rationale for doing so.

As this is a classic paper, many promising attacks on the conceptual essence have already materialized and become mainstream.

- Rapid prototyping and incremental development have been manifested as "agile development" and have been widely adopted.
- With the advent of the open-source revolution and code-hosting platforms such as GitHub, reusing off-the-shelf software instead of building in-house software has become ubiquitous.

However, the call for organizations to "grow great designers who are the core of the development team" incurs significant requirements on corporate management competency, and sadly, hasn't fully become reality.

# How does the work apply to you?

It sheds light upon the nature of the software problem and its implications, illuminates research directions in software engineering aimed at ameliorating the software problem, and provides a reference research methodology for problems within software engineering.

