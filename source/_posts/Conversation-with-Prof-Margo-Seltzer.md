---
title: Conversation with Prof. Margo Seltzer
date: 2023-10-10
categories:
- ["Research Inspiration"]
---

# Introduction to Prof. Margo Seltzer (quoted from Wikipedia)

"**Margo Ilene Seltzer** is a professor and researcher in computer systems. She is currently the Canada 150 Research Chair in Computer Systems and the Cheriton Family Chair in Computer Science at the [University of British Columbia](https://en.wikipedia.org/wiki/University_of_British_Columbia "University of British Columbia"). Previously, Seltzer was the Herchel Smith Professor of Computer Science at Harvard University's [John A. Paulson School of Engineering and Applied Sciences](https://en.wikipedia.org/wiki/John_A._Paulson_School_of_Engineering_and_Applied_Sciences "John A. Paulson School of Engineering and Applied Sciences") and director at the [Center for Research on Computation and Society](https://en.wikipedia.org/wiki/Center_for_Research_on_Computation_and_Society "Center for Research on Computation and Society")."

# Question: How did you conduct research across a variety of domains, from operating systems to machine learning systems?

Prof. Seltzer: I've always been intellectually curious and I find almost all research problems fascinating. Engaging in discussions with diverse people has also fueled my passion. When I was a junior faculty member, I focused on tenure and focused on core systems research, but that was miserable. However, I still explored different areas.

My deep interest lies in software architecture, even though my Ph.D. was in storage. I was fortunate when another lab decided to support my research. This shift allowed me to progress from storage to core systems.

I also got interested into data provenance, especially realizing that we could do a lot more at the systems level.

Transitioning to machine learning was a natural progression, driven mainly by collaborations with graduate students and other partners.

# Question: Why did you pursue a Ph.D. in storage if you were more interested in core systems?

Prof. Seltzer: Before pursuing my Ph.D., I was primarily involved with databases. However, as I delved deeper, my curiosity veered towards system issues.

# Question: How do you manage evolving interests during a Ph.D.?

Prof. Seltzer: It's uncommon for Ph.D. students to plot a lifetime research agenda. Instead, it's about producing one miracle per paper and developing the skills to do research for your whole life. The key is to focus on accomplishing your first piece of independent research during your Ph.D.

Choosing a supervisor you get along well with is most important. It's essential to be involved in an interesting area and join a lab that aligns with your interests. However, a perfect match isn't always necessary. Looking at co-supervised students can give insights into potential co-supervision opportunities.

As a Ph.D. student, your primary goal should be to define your research problem. Although you shouldn't jump between entirely different areas, it's crucial to select a project that genuinely interests you in the first year. Other interests can be pursued as side projects.

To maintain engagement, pick a broad domain that offers a plethora of projects you find captivating.

Before starting a Ph.D., actively seek out research papers that intrigue you and identify the labs behind them.

# Question: What's your vision for the future of Computer Systems?

Prof. Seltzer: A pressing concern is that people are not very good at writing software that works. We need to develop strategies to create software with minimal bugs from the ground up. Embracing modularity can be a solution, and the solution is about software architecture.

Researchers focus on verifying existing software products because the publication cycle is way too short. Moreover, we lack good metrics for evaluating software architecture, and there is no equivalent of a debugger for software architecture. Software architecture, in its current state, remains an art more than a well-defined discipline. Often, professionals in the field rely heavily on mentors, and they don't see the growth of a new generation of software architects.

# Personal Comments and Recommendations:

I'm pleased to note your inspiration derived from challenges in the 'Type Inference for Python' project, including the importance of formalizations and specifications both for the design goal and for implementation, the tedious and fault-prone task of setting up an evaluation pipeline, etc.

Deep learning thrives in domains with a clear ground truth. In other scenarios, basic probabilistic methods might offer better results.

Your task of combining AST traversal with introspection of live objects reminds me of the work I did in "StarFlow: A Script-Centric Data Analysis Environment" and Arpan Gujarati's tracing infrastructure efforts in Python.

Should you wish to delve deeper into software architecture for data science and machine learning, I recommend focusing on constructing intricate software like operating systems instead of shorter data wrangling scripts. Or you can explore the challenges in experimental frameworks. For insights on this, consider discussing with Joe Wonsil. Additionally, Philip Guo at UCSD has an intriguing Ph.D. thesis about tools for research programmers that might be of interest to you.

