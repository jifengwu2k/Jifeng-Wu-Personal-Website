---
title: Conversation with Prof. Tapomayukh Bhattacharjee on Human-Robot Interaction and Research Fit
date: 2026-04-01
categories:
  - "Research Notes"
tags:
  - "conversation"
  - "researcher-profile"
  - "career"
  - "hci"
  - "machine-learning"
excerpt: "A summary of my discussion with Prof. Tapomayukh \"Tapo\" Bhattacharjee about physical human-robot interaction, real-world robot deployment, and why my current interests may align better with other faculty."
---

# Introduction

I recently had a very helpful conversation with [Prof. Tapomayukh "Tapo" Bhattacharjee](https://www.cs.cornell.edu/~tapomayukh/), Assistant Professor of Computer Science at Cornell University and director of the EmPRISE Lab.

From his website, his work is centered on enabling robots to assist people with mobility limitations in activities of daily living. His research especially emphasizes physical and social interaction in unstructured human environments, along with building real robotic systems, deploying them in the real world, and evaluating them with real users.

That framing matched the conversation very closely: his lab is deeply committed to real robots, real environments, and real human-centered deployment.

# Main Focus of His Lab

The main focus of Prof. Bhattacharjee's lab is **physical human-robot interaction**.

The goal is not merely to make robots perform benchmark tasks in isolation, but to build robots that can operate **very close to humans** and help with **day-to-day tasks**, especially in messy and realistic human environments.

A point he emphasized clearly is that his lab is a **full-stack robotics lab**. That means the lab:

- develops algorithms,
- builds systems,
- deploys them on **real robots**,
- and often evaluates them with **real people**.

A core expectation in the lab is that **every project should involve real robots**. Even if a project begins with learning methods, representations, or data, it is expected to connect back to robot capability in the real world.

# The Central Research Challenge

Prof. Bhattacharjee described the biggest bottleneck in robotics as the fact that most robots are still effectively **separated from humans**.

Even when robots are shown in "home" settings, they are often not truly integrated into the complexity of real human environments. His lab is trying to address exactly this gap: **how to bring robots into real human environments in a meaningful way**.

This is what made his perspective especially concrete. The challenge is not just improving robot performance in an abstract sense. It is about making robots useful, safe, and effective in settings where people actually live and where assistance would genuinely matter.

# Technical Directions and Open Problems

He sees this challenge as requiring progress across multiple technical fronts at once, including:

- **policy learning**,
- **representation learning**,
- and understanding **real-world context**.

One especially important direction for his lab is **representation learning of humans**. For example, he discussed the importance of learning useful representations of:

- human mobility,
- human behavior,
- and other aspects of how people move and act in everyday environments.

Those representations are not an end in themselves. The key idea is to use them in downstream robot control policies so that robots can act more intelligently around people.

This was a recurring theme in the conversation: in his lab, methods research still has to connect back to **deployment**. A representation is valuable if it ultimately helps a robot do a better job assisting people in the real world.

# My Proposed Interests and His Response

I asked whether directions such as the following would be useful in his lab:

- inspecting robot learning pipelines,
- understanding policy structure,
- debugging or validating models,
- and related work on interpretability or analysis.

His answer was essentially **yes, these can be valuable directions**, but with an important condition: they need to lead to **meaningful improvements in robot capability and deployment in real human settings**.

In other words, he did not reject those topics at all. Rather, he framed them through the lab's main objective. Even work on representations, learning methods, or model analysis must eventually help **policy learning on real robots**.

I found this clarification useful because it showed that the issue is not whether a direction is intellectually interesting; the issue is whether it advances the lab's core mission of real-world human-facing robotics.

# Data Collection and Experimentation Culture

He confirmed that his lab does substantial work in:

- **dataset collection**,
- **reinforcement learning / robot learning**,
- and **user studies**.

He mentioned projects such as:

- **OpenRoboCare**,
- and **CLAMP**.

For **CLAMP**, he noted that the lab collected **multimodal household data from 41 homes**, which gives a good sense of how seriously the group takes real-world data and deployment-oriented experimentation.

This also reinforced the overall picture of the lab: it is not just theory-driven or simulation-driven. It is strongly grounded in actually gathering data from real environments and evaluating systems with real users.

# Fit and Recruiting Situation

Prof. Bhattacharjee asked about my background, including whether I had worked with robots before.

After learning that I am a **first-year Ph.D. student**, that I do not yet have a settled advisor, and that I **have not worked with robots yet**, he was very candid about the situation.

He said that:

- he **does not have funding for a new Ph.D. student this year**,
- and his lab typically looks for students who already have **hands-on experience with real robots**.

So he was clear that he is **not planning to hire someone new this year**, especially someone without prior robotics experience.

I appreciated the directness. It made the discussion much more useful, because it avoided ambiguity and gave me a realistic picture of both the lab's expectations and the current recruiting situation.

# On My Formal Methods and Program Analysis Interests

I also asked what kinds of guarantees, verification, or analysis are useful for robots operating in messy, human-centered environments.

He said this is a **very good and important topic**, but also that it is **not especially well aligned with his lab's main direction**.

He suggested several faculty members who may be a better fit for my interests:

- **Hadas Kress-Gazit** for **formal methods / verifiable robotics**,
- **Kevin Ellis** for **program analysis**,
- and **Owolabi Legunsen** for **software engineering**, though not mainly robotics-focused.

This was one of the most valuable parts of the conversation. Even though his lab is likely not the best fit for me right now, he gave helpful guidance about where my background and interests might connect more naturally.

# Overall Takeaway

My main takeaway is that Prof. Bhattacharjee's lab is strongly centered on:

- **real robots**,
- **real environments**,
- and **human-facing deployment**.

His view of robotics is deeply practical in the best sense: representation learning, policy learning, datasets, and user studies all matter, but they matter because they improve a robot's ability to help people in the real world.

At the same time, the conversation clarified that my current interests in **formal methods**, **program analysis**, and **interpretability / validation** may be more aligned with other faculty than with his lab specifically.

So the conclusion was not merely that this lab is "not a fit." More precisely:

- it is probably **not the right fit right now**,
- both because of **funding**,
- and because the lab generally expects **prior hands-on robotics experience**,
- while my own background currently points more naturally toward other research directions.

Overall, I found the conversation extremely helpful. Prof. Bhattacharjee gave a clear picture of his lab's research philosophy, explained the real constraints honestly, and pointed me toward faculty who may better match my background.