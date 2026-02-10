---
title: >-
  Paper Reading: Breaking the Barriers to Successful Refactoring: Observations
  and Tools for Extract Method
date: 2022-10-13
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Advanced Software Engineering](https://github.com/ubccpsc/507/tree/2022sept). The original paper can be found [here](https://doi.org/10.1145/1368088.1368146).

Refactoring is important to software development. Performing a refactoring is not trivial, for which refactoring tools have been developed. Nevertheless, programmers do not use refactoring tools as often as they could.

To investigate this problem, the authors focus on one type of refactoring and one specific tool - the Extract Method tool in the Eclipse IDE.

- Fowler reports that Extract Method is "one of the most common refactorings", "a key refactoring" which if successful, means "you can go on [to do] more refactorings".
- The Extract Method tool in the Eclipse IDE it is a mature, non-trivial refactoring tool.
- Most refactoring tool user interfaces are very similar.

The authors first conject tools are non-specific and unhelpful in diagnosing problems, and undertake a formative study observing 11 programmers perform a number of Extract Method refactorings on several large, open-source projects, which suggest that programmers fairly frequently encounter a variety of errors arising from violated refactoring preconditions.

The authors further conjecture error messages were conflated, insufficiently descriptive, and discouraged programmers from refactoring, and built three visualization tools within the Eclipse IDE as solutions. Then, they conducted a study to assess whether or not the new tools overcome these usability problems by comparing the accuracy and time to complete refactoring tasks with and without the new tools, and administered a post-test questionnaire for the subjects to express their preferences. The results of the study were very positive, and subjects found the new tools superior and helpful outside of the context of the study.

Finally, the authors provide recommendations for future tools.

- Code Selection: A selection tool should be lightweight, task-specific, and help the programmer overcome unfamiliar/unusual code formatting.
- Displaying Violated Preconditions: quickly comprehensible, indicate location, easily distinguishable from warnings and advisories, display amount of work required, display relations between precondition violations, distinguish different types of violations.

The experimental study is very concise, and there are many aspects that can be borrowed.

- Undertaking a formative study to verify conjections about problems within current tools, before building new tools based on the verified conjections, and evaluating them.
- The visualization comparing the the accuracy and time of **each participant** to complete refactoring tasks with and without the new tools is accurate and straightforward.
- Using a questionnaire to acquire subjective feedback complimentary to an objective evaluation.

However, there are still some flaws.

- Only one type of refactoring (Extract Method) and one specific tool was considered. The takeaways may not apply to other types of refactoring.
- Several key variates were not controlled in the formative study, such as participants were free to refactor whatever code they thought necessary.

Future directions of work include:

- Replicating the study for other types of refactoring.
- Build and assess new refactoring tools with increased usability.

