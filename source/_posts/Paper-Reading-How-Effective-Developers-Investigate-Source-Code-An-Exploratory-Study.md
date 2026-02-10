---
title: >-
  Paper Reading: How Effective Developers Investigate Source Code: An Exploratory
  Study
date: 2022-09-19
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Advanced Software Engineering](https://github.com/ubccpsc/507/tree/2022sept). The original paper can be found [here](https://doi.org/10.1109/TSE.2004.101).

# What were the primary contributions of the paper as the author sees it? How does this work move the research forward?

1. The paper provides a set of detailed observations about the characteristics of effective program investigation. These observations are accompanies by hypotheses that can be validated by additional research and practical experience.
2. The paper's results support the intuitive notion that developers should follow a general plan, perform focused searches in the context of this plan, and keep some form of record of their findings when investigating a program.
3. The paper describes a methodology and analysis technique for studying the behavior of software developers.

# How was the work validated?

The authors conducted a study of five developers undertaking an identical software change task on a medium-sized system, where understanding the existing software is a precursor to modification and validation.

They did a detailed qualitative analysis of a few replicated cases, rather than a statistical analysis of causality between dependent variables. Many previous studies were based on heavily abstracted characterizations of both developer behavior and success level. It involved a detailed study of the examined code, the methods used to navigate between different locations in the code, and the modified source code.

They contrasted the program investigation behavior of successful and unsuccessful developers, and isolated the factors associated with the behavior of a developer, rather than external factors (such as the influence of the workplace, the programming environment, etc.)

# How could this research be applied in practice?

Ensuring that developers in charge of modifying software systems investigate the code of the system effectively can yield important benefits such as decreasing the cost of performing software changes and increasing the quality of the change.

Understanding the nature of program investigation behavior that is associated with successful software modification tasks can help us improve the tool support and training programs offered to software developers.

# How could this research be extended?

Researchers can reuse the authors' strategy (stated in "How was the work validated?") to help validate the hypotheses the authors' proposed, or to study other aspects of programmer behavior.

# What were the main contributions of the paper as you (the reader) see it? How does the work apply to you?

In my opinion, the main contributions of the paper include the primary contributions of the paper as the author sees it, how the work was validated, and how this research could be applied in practice. However, what is most meaningful for me is how the work was validated. Such methodology is of great reference value for conducting studies on other aspects of programmer behavior. There are many technical details within that have left a deep impression on me.

1. Each phase was described entirely through written instructions, and the subjects were given an Eclipse training phase and an investigation phase before the modification phrase.
2. To record the actions of a developer in the investigation and modification phases, they recorded the developers' screens, and transcribed the recordings into a structured list of events. Each event contains the properties time, method, navigation, and modification. 
3. To analyze the quality of change, the authors analyzed the source code to determine the characteristics of an ideal solution, and divided the task into five subtasks. The authors examined how each subject had implemented each subtask, and characterized its quality.

