---
title: 'Paper Reading: Asking and Answering Questions during a Programming Change Task'
date: 2022-09-14
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Advanced Software Engineering](https://github.com/ubccpsc/507/tree/2022sept). The original paper can be found [here](https://doi.org/10.1109/TSE.2008.26).

# What were the primary contributions of the paper as the author sees it?

1. A catalog of 44 types of questions programmers ask during software evaluation tasks, organized into four categories based on the kind and scope of information needed to answer a question.
  - Finding a focus point
  - Expanding a focus point
  - Understanding a subgraph
  - Over groups of subgraphs
2. A description of the observed behavior around answering these questions.
3. A description of how existing deployed and proposed tools do, and do not, support answering programmers' questions.

# How was the work validated?

The author interviewed participants in two studies.

1. 9 participants in academia worked on a code base that was new to them.
2. 16 participants in industry worked on a code base for which they had responsibility.

The two studies have allowed us to observe programmers in situations that vary along several dimensions:
- the programming tools
- the type of change task
- the system
- paired versus individual programming
- prior knowledge of the code base

The differences have increased the authors' ability to generate an extensive set of questions programmers ask.

They build rather than test theory and the specific result of this process is a theoretical understanding of the situation of interest grounded in the data collected.

# What were the main contributions of the paper as you (the reader) see it? How does the work apply to you?

In my opinion, aside from the final results, three important considerations learned from this paper are:

1. Interviewing participants in two very different groups.
2. Developing generic versions of the questions participants asked, which slightly abstract from the specifics of a particular situation and code base. 
3. Compared the generic questions and categorized those questions into four categories based on the kind and scope of information needed to answer a question.

This is an example of extracting generalized knowledge from specific case studies, which makes it a great example to study for conducting empirical studies.

# How could this research be extended? How could this research be applied in practice?

The research identified clear gaps of tool support in answering programmers' questions. 

1. Support for more refined or precise questions.
  - Some questions can he seen as more refined versions of other questions.
  - A programmer's questions also often have an explicit or implicit scope.
  - Due to limited tool support, programmers end up asking questions more globally than they intend, and, the result sets will include many irrelevant items.
2. Support for maintaining context.
  - A particular question is often part of a larger process involving multiple questions.
  - There are missed opportunities for tools to make use of the larger context to help programmers more efficiently scope their questions and to determine what is relevant to their higher level questions.
3. Support for piecing information together.
  - Many questions require considering multiple entities and relationships.
  - In these situations, the burden is on the programmer to assemble the information needed to answer their intended question.
  - Tool support is missing for bringing information together and building toward an answer.

Improved tools and an assessment of these tools in answering these questions present directions for future research.
