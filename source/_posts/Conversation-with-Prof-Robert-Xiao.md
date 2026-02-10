---
title: Conversation with Prof. Robert Xiao
date: 2023-10-23
categories:
- ["Research Inspiration"]
---

# Abstract

The following is a polished version of a conversation with [Prof. Robert Xiao](https://www.robertxiao.ca/) on the confluence of Programming Languages, Software Engineering, and Human-Computer Interaction (HCI) for research programming. The main points mentioned by Prof. Robert Xiao are as follows.

- Determining which aspects of research programming are amenable to systematization is a challenge.
- Advancements in code tracing, like PyTorch 2's bytecode analysis, which, while not addressing verifiability directly, allows for in-depth program behavior analysis.
- Understanding the influence of input data on outputs is central to the challenge of explainable AI (XAI). However, pinpointing specific model features or layers leading to an output is perhaps more accessible and useful for debugging.
- The concept of 'radioactively' tagging data to trace its influence through a model is an intriguing one, akin to tracking the uptake of a tagged substance in a biological system.
- There are many scenarios with extensive object interactions in programming. Game programming provides a more structured context to study these complexities, with ample open-source resources for research. The difficulty in game programming arises from the myriad interactions between diverse object systems - like physics, collision, and interaction logic. Coding these interactions is a lot of work. It would be enlightening to study how game developers handle this complexity and whether there are ways to simplify it. Game studios, being the behemoths they are, would undoubtedly embrace methods to alleviate the strenuous nature of their programming efforts.

# Polished Transcript

Robert Xiao: [00:00] Could you share the focus of your research and how it's pertinent to this project? Also, what do you aim to achieve with it? There seem to be several components you've touched upon, such as visualization, pipeline development, and programming processes. These represent different approaches you could potentially adopt or consider integrating into a comprehensive pipeline. I believe the ultimate goal here is to aid research programmers in accelerating system development while minimizing errors, correct?

Jifeng Wu: [00:43] Yes, precisely.

Robert Xiao: [00:45] Let's delve into your research focus. How does your current work align with this?

Jifeng Wu: [00:52] My ongoing research isn't directly related, as this is a path I'm contemplating for a future Ph.D. project, which I still need to commit to. I'm currently working on my master's thesis titled 'Type Inference for Python.' It aims to infer types in Python code, which often lacks annotations. This lack can lead to IDEs providing less accurate suggestions. With type information, predictions become more reliable, enhancing the coding and code interaction experience.

Robert Xiao: [01:54] So, to clarify, your project is about developing a system for automatic type inference that assists IDEs, not just creating a type annotation database. Existing tools do offer preliminary type extraction, but I'm interested in the novel contribution your research makes.

Jifeng Wu: [02:31] Exactly. I'm not just extracting types; I'm inferring them in unannotated code bases to enhance IDE functionality.

Robert Xiao: [02:45] Understood. There are incremental typing tools available, but we can explore that later. For now, it's great that you're well-versed in Python, especially since it's prevalent in LLM research. An interesting aspect of your direction could be mitigating bugs, which often derail projects. Implementing automated checks could be invaluable. However, the challenge lies in determining which aspects of research programming are amenable to systematization.

Jifeng Wu: [06:17] My vision is to support researchers engaged in data analysis or custom model design in an environment akin to Jupyter notebooks. And touching on debugging, I see a potential to harness functional programming due to its purity and ease of debugging.

Robert Xiao: [07:22] The question, however, is the application of functional programming to research code, which often depends on pre-existing libraries. While functional design has its merits, the practicality of integrating it into the current ecosystem is worth discussing.

Jifeng Wu: [07:55] I concede the point; many codebases are indeed messy. I'm contemplating a clean slate design, potentially developing a new language or library to demonstrate the concept.

Robert Xiao: [08:21] It's noteworthy that there have been advancements in code tracing, like PyTorch 2's bytecode analysis, which, while not addressing verifiability directly, allows for in-depth program behavior analysis.

Jifeng Wu: [11:09]
Certainly. There are facets of current notebook technologies that pique my interest, primarily due to their inadequate support, with debugging being a prime example. Debugging encompasses two key aspects: the logic of the program, as previously mentioned, and data provenance. Sometimes, despite the sound logic, I need to delve into the origins of an unexpected output data point by tracing the implicit calculations that led to it.

[11:58]
This necessity for data provenance tracking is something I find critically important in my daily research, and I understand it's known as the data provenance problem.

Robert Xiao: [12:09]
Indeed, if you've ever discussed this with Margo, you're likely well-versed in the topic, given her research focuses precisely on provenance. Many of her colleagues are exploring this area, which is complex, particularly in the context of outputs from extensive machine learning models. While it would be beneficial to trace data points back to their origins, integrating such a mechanism into a model is a formidable challenge.

[12:55]
As a developer, I'm keen on understanding the influence of input data on outputs, which is central to the challenge of explainable AI (XAI). Resolving this would mark a significant milestone. However, pinpointing specific model features or layers leading to an output is perhaps more accessible and useful for debugging.

[13:53]
For instance, identifying a misconfigured layer responsible for input-related issues would be invaluable. Although considering the interconnected nature of model layers, this remains a complex task.

[14:57]
The concept of 'radioactively' tagging data to trace its influence through a model is an intriguing one, akin to tracking the uptake of a tagged substance in a biological system. Yet, translating this to a machine learning environment presents a unique set of challenges.

[16:57]
While I'm not deeply familiar with the latest advancements in this field, it's clear that XAI could significantly benefit HCI applications. The goal is to incrementally address these challenges by developing models that acknowledge tagged inputs throughout the data processing pipeline.

[17:58]
These are some thoughts on the subject. I'd like to know which aspects you find most relevant or valuable for your future endeavors.

Jifeng Wu: [18:15]
The examples and pointers you've provided are insightful. As someone with a software engineering background, I believe that adapting certain constructs, like functional programming and traditional program analysis, could offer potential solutions. These are directions I'm considering for my Ph.D. research.

Robert Xiao: [18:58]
Exploring program tracing for optimization could prove fruitful, given the untapped potential in that area. The philosophy I subscribe to favors solutions that minimize user effort, exemplified by the tracing compiler feature in PyTorch 2.0. Unlike TensorFlow model, which requires upfront operation declarations, PyTorch's immediate mode operation presents a more straightforward approach for users, facilitating a clearer understanding of variable flow during execution.

Jifeng Wu: [ 24:12 ]
Incidentally, as a researcher in HCI, have you ever engaged in work that marries aspects of software engineering, specifically functional programming, with HCI?

Robert Xiao: [ 24:28 ]
My experience with functional programming in a research capacity is virtually nonexistent. My computer science education covered the basics of functional programming - I dabbled in Scheme and Racket - but in terms of research, functional programming hasn't been part of my repertoire. Our work typically involves Python, C#, and various visual programming tools, none of which adhere to a functional programming paradigm.

[ 24:56 ]
Game programming, which encompasses many of our VR/AR programming, is about as far removed from functional programming as possible. It's heavily state-driven, with an ever-changing state environment. A functional approach could be applied to VR/AR development. It could offer advantages over current methods. I'm aware of actor model programming being used for VR/AR experiences, though it's not functional programming per se, and I have yet to adopt it in my work personally. Conversely, when it comes to software engineering, we do integrate its methodologies into our software creation process. This includes best practices like code structuring for reusability, modularization, refactoring, and especially source control, which I find is grossly underutilized in research programming, among other things.

Jifeng Wu: [ 26:33 ]
Understood, yes.

My vision, when I speak of integrating functional programming, isn't confined to conventional languages like Scheme or Racket that you mentioned earlier.

My thoughts were more aligned with programming paradigms like the actor model you described, as well as visual programming. I'm interested in approaches that are more formalized, easier to reason about, and offer a clearer path to verifying properties and facilitating debugging.

Robert Xiao: [ 27:18 ]
With general-purpose imperative coding, the debugging process is, frankly, a nightmare. Although my personal experience in developing large-scale games is limited, our research typically involves creating specific VR/AR experiences. These are smaller in scale, utilizing existing libraries to build a finite number of interactive elements within a controlled environment. This contrasts with the vast complexity of full-scale game development, where the difficulty arises from the myriad interactions between diverse object systems - like physics, collision, and interaction logic.

[ 28:55 ]
Take collision logic as an instance; the multitude of possible outcomes from a single collision event can be incredibly intricate to code. If we consider bullet dynamics in games, the behavior of these projectiles upon impact with walls, enemies, or objects varies dramatically, leading to a cascade of different effects. Coding these interactions is a lot of work. It would be enlightening to study how game developers handle this complexity and whether there are ways to simplify the process. The Entity Component System (ECS) attempts to mitigate this by adopting an actor-like model, but even then, complexity escalates rapidly as interactions increase.

[ 30:56 ]
Despite efforts to manage these interactions, there comes a point where local decisions require some form of higher-level orchestration. When a bullet is fired, for instance, numerous actions must be coordinated, from ammo count adjustments to triggering animations. All this complexity makes game programming something I would not want to revisit except in the context of my research. However, there lies a vast potential for impactful research in understanding and easing the complexities of game development. Game studios, being the behemoths they are, would undoubtedly embrace methods to alleviate the strenuous nature of their programming efforts. Yes, indeed.

Jifeng Wu: [32:00]
Indeed, that aligns with my central interests. My master's thesis on Python type inference encountered similar challenges to those you've highlighted. In analyzing types, one must grapple with substantial propagation throughout the program. This is precisely the issue at hand, and it serves as a prime motivator in my quest to develop formalizations that simplify the process for programmers, particularly in areas like game development, where complex interactions are commonplace.

Robert Xiao: [32:45]
You've sparked a thought here - this may be a digression - but I'm curious. Has there been research into the amount of typing necessary for untyped code to converge? You made an excellent point about the recursive search required in untyped code to determine types, which resembles an intricate graph search. However, it's more than that because the connections in the 'type graph' are not always apparent. This raises an intriguing theoretical question: At what point in a code base's typing does the cost shift from an exponential to a linear time complexity? It's a highly theoretical question, indeed, and one that surely must have been examined in terms of computational complexity.

[34:58]
It's fascinating because most research focuses on strong typing systems and type inference within defined parameters. But the dynamics change with untyped constructs. Apologies for the tangent - it's just a curious question.

Jifeng Wu: [35:32]
Your point is very interesting, and it is pertinent to my future research endeavors.

Robert Xiao: [35:39]
There ought to be studies on this - how computationally complex is a type system? The PL community has likely delved into this. However, the issue becomes significantly more compelling when considering untyped languages. Sorry for the tangent, but it's a topic worth exploring.

Jifeng Wu: [36:15]
Returning to our discussion, my work in type inference for Python resonates with your mention of interaction-heavy domains like game programming.

Robert Xiao: [36:27]
Certainly. Game programming exemplifies a scenario with extensive object interactions, which is atypical in most systems where such interactions are minimized. For instance, hiring a student triggers a cascade of bureaucratic actions, illustrating how a single decision can activate multiple layers of complexity. Managing these interactions presents a formidable challenge in software engineering - taming the complexity is a substantial part of the job. However, game programming provides a more structured context to study these complexities, with ample open-source resources for research.

Jifeng Wu: [38:55]
Your insights on game programming are quite valuable.

[38:59]
I hadn't realized the prominence of such problems in that field. Your points offer an excellent foundation for my research into these issues.

Robert Xiao: [39:16]
There are indeed intriguing research opportunities at the intersection of AI, software, programming languages, and HCI. Although my HCI pursuits are broad, one key HCI interest is explainable AI. As language models advance, the ability to explain AI operations lags, posing a risk of increasing reliance on inscrutable systems. Advancing explainable AI methodologies will be critical in HCI, particularly in the coming years.

Jifeng Wu: [42:10]
Yes, indeed. What captivates my interest more than the empirical approach to software engineering - like automated bug detection and performance optimization - is the human-computer interaction aspect, particularly making developers' lives easier. This is crucial, especially for rapid prototyping.

Robert Xiao: [42:42]
Right, your IDE example aligns perfectly with that. It's a tool that enhances usability for people - expanding how they interact with typing. It could very well be something for publication. So, you're drawing connections here. When do you expect to graduate?

Jifeng Wu: [43:05]
If all goes according to my advisor's plan, I should graduate in May 2024.

Robert Xiao: [43:13]
Okay. And your advisor is?

Jifeng Wu: [43:16]
Caroline Lemieux from the Software Practices Lab.

Robert Xiao: [43:20]
Oh, yes, she's a recent addition. So, she's guiding you toward a May graduation. And regarding your Ph.D., are you considering continuing in the Software Practices Lab or exploring other areas?

Jifeng Wu: [43:38]
Well, our lab's focus is split between user studies and the technical side, like bug detection or software fuzzing, and, on the other hand, theoretical topics like formal semantics. There isn't much overlap with HCI and usability, so I'm uncertain about where I'll pursue a Ph.D., if at all, but likely not within our Software Practices Lab.

Robert Xiao: [44:21]
That's something to ponder, especially as you approach graduation in May. Are you already applying to Ph.D. programs?

Jifeng Wu: [44:34]
I am still deciding. I'm still considering my options.

Robert Xiao: [44:38]
Sure, it's a big decision. My focus is on VR/AR-related projects, where my funding comes from. It's trickier to shift to developing support tools for developers without an established portfolio. However, I'm open to discussing co-advisory opportunities or committee collaborations if you pursue a Ph.D. here at UBC.

Jifeng Wu: [45:44]
That's encouraging to hear.

Robert Xiao: [45:45]
To clarify, I'm not sure I could supervise a Ph.D., but I'm open to discussing future possibilities.

Jifeng Wu: [45:59]
That aligns with my thoughts as well.

Robert Xiao: [46:01]
Engaging in research discussions can help refine your interests, which is beneficial for crafting a strong research statement for Ph.D. applications. These conversations can guide your initial research direction, even though your focus may evolve.

Jifeng Wu: [47:10]
Thank you for the insights and advice today. They've been very helpful, and I'll reflect on them further.

Robert Xiao: [47:24]
I'm glad to assist. You should have my email address.

Jifeng Wu: [47:30]
Is it listed on your website?

Robert Xiao: [47:32]
It should be - unless my website isn't updated with my current email, which would be a blunder. Let me check.

Jifeng Wu: [47:36]
I'll look it up.

Robert Xiao: [47:37]
If it's on there, then it's correct.

Jifeng Wu: [47:45]
Yes, it's on your site.

Robert Xiao: [47:47]
Great, feel free to reach out anytime.

Robert Xiao: [47:56]
I'm impressed by your work and would be happy to attend your thesis presentation when the time comes.

Jifeng Wu: [48:15]
I appreciate that. Our conversation today has been very enjoyable.

Robert Xiao: [48:21]
It was an enlightening chat, indeed. If you have further questions or topics, don't hesitate to email me.

Jifeng Wu: [48:34]
For now, that's all I have. If something else comes up, I'll send you an email. Thank you.
