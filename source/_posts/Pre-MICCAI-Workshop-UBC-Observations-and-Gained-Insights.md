---
title: Pre-MICCAI Workshop@UBC Observations and Gained Insights
date: 2023-10-08
categories:
- ["Research Inspiration"]
---

From the [Pre-MICCAI Workshop@UBC](https://sites.google.com/view/pre-miccai-ubc/home) website:

> The Pre-MICCAI Workshop is a dynamic and innovative platform that unites machine learning and medical computer vision. As a prelude to the prestigious MICCAI (Medical Image Computing and Computer-Assisted Intervention) conference, this workshop serves as a vital nexus where experts, researchers, and enthusiasts converge to explore cutting-edge advancements, exchange knowledge, and foster collaborative partnerships in the field of medical image analysis.

# Shaoting Zhang (Shanghai AI Lab) - Keynote Talk 2 - Foundation Models in Medicine: Generalist vs Specialist

- Advantages of Large Models:
    - Emergent abilities.
    - Long-tail problems (only a small amount of fine-tuning is required for downstream tasks and does not require a tremendous amount of data collection and labeling).
    - Model sharing strengthens data security.
- Shanghai AI Lab presents [OpenMEDLab (open-source medical image and language foundation models)](https://github.com/openmedlab).
- Utilizing a single model with varied prompts for diverse tasks.
- Large language model training encompasses:
    - Self-supervised pre-training.
    - Instruction tuning.
    - RLHF.
    - Plugins for accessing updated information without retraining.
- Computer vision researchers lean towards generalist models due to the technical challenges.
- Clinicians prefer specialist models to solve day-to-day work.

Question: Will medical foundation models support more modalities in the future besides vision and language?

Answer:

- People will still focus on one modality for one model with high accuracy to address practical business demands.
- Multiple models can be used on demand to handle multimodal data.

# Briefings

## Sana Ayromlou - Continual Class-Specific Impression for Data-free Class Incremental Learning

- Focuses on training models over newly introduced classes, termed [incremental learning](https://en.wikipedia.org/wiki/Incremental_learning).
- Challenges include the loss of old data, resulting in catastrophic forgetting.
- Proposed Solution: Generate synthetic medical data from prior classes using [model inversion](https://arxiv.org/abs/2201.10787) (extracting training data from the model) and employing [cosine-normalized cross-entropy loss](https://arxiv.org/abs/2102.09517).

## Hooman Vaseli - ProtoASNet

- Emphasizes the importance of interpretability in AI solutions, especially in healthcare.
- Core Technology: [Prototypical neural networks](https://proceedings.neurips.cc/paper_files/paper/2017/hash/cb8da6767461f2812ae4290eac7cbc42-Abstract.html), which "learn a metric space in which classification can be performed by computing distances to prototype representations of each class."


# Ruogu Fang (University of Florida) - Keynote Talk 4 - A Tale of Two Frontiers: When Brain Meets AI 

Research Vision:

- Integrate domain knowledge over mere data-driven approaches.
- Harness neuroscience principles for next-gen AI designs.
- Leverage AI in testing neural science hypotheses and promoting brain health.


[Deep Evolutionary Networks with Expedited Genetic Algorithms for Medical Image Denoising](https://www.sciencedirect.com/science/article/pii/S1361841518307734)

- Auto feature extraction and hyperparameter search are major pain points in deep learning research (compared with traditional machine learning research) faced by deep learning researchers.
- Fine gene transfer learning to optimize on a larger dataset - c.f. [portfolio balance](https://www.investopedia.com/financial-edge/0412/the-best-portfolio-balance.aspx) in finance
- Question: Is it possible to combine the genetic algorithm that maintains a gene pool of neural networks with ensemble learning?
    - Answer: Different objective.

[Emergence of Emotion Selectivity in A Deep Neural Network Trained to Recognize Visual Objects](https://www.biorxiv.org/content/10.1101/2023.04.16.537079v2.abstract)

- Simple, interpretable neural network architecture based on biology.
- Representation similarity between the DNN model and brain amygdala.
- $1M NSF funding.

[Modular machine learning for Alzheimer's disease classification from retinal vasculature](https://www.nature.com/articles/s41598-020-80312-2)

- Retina data is easy to collect.
- A lot of information (gender, body mass index) can be seen from the retina.
- The results are interpretable.

# Hervé Lombaert (ETS Montreal) - Keynote Talk 3 - Geometric Deep Learning - Examples on Brain Surfaces

Research directions:

- Geometry and Machine Learning.
- Correspondences and variability existent in the brain.

Motivation:

- Traditional algorithms frequently rely on an image grid (pixels). However, in neuroimaging, data is often on 3D surfaces. Two neighboring points may be neighbors but may lie very far away on such a surface.
- How to learn on such surfaces? How do we transfer convolution and pooling on images to such surfaces?

Solution:

- Represent surfaces as graphs.
- Project problem into spectral space ([spectral shape analysis](https://en.wikipedia.org/wiki/Spectral_shape_analysis)).
    - An object's vibration pattern is governed by shape - spectral space captures a unique intrinsic shape signature.
    - Extract spectral signature via spectral decomposition and exploit to find correspondences.
    - Enables transforming convolutions on surfaces to convolutions on spectral embeddings, enabling classical architectures on brain surfaces.

Ongoing work:

- [Active learning](https://en.wikipedia.org/wiki/Active_learning_(machine_learning)) to reduce annotation effort - focus on sample-level uncertainty and find the most uncertain images.
    - Goals: Informative and diverse samples.
    - Works:
        - [TAAL: Test-time augmentation for active learning in medical image segmentation](https://link.springer.com/chapter/10.1007/978-3-031-17027-0_5)
        - [Active learning for medical image segmentation with stochastic batches](https://arxiv.org/abs/2301.07670)

# Ali Bashashati/Ruogu Fang/Shaoting Zhang/Hervé Lombaer/Jun Ma - Panel Discussion

## The influence of Large Language Models is growing significantly. What changes do you think LLMs will bring about in medical imaging (from both positive and negative sides)?

- Language contributes to improved performance.
- Still need a diversity of models to investigate different modalities and tasks.
- Large language models help in day-to-day routine tasks. They are a copilot which facilitates the processing of huge amounts of information in pathology and brain research.
- Reduces cost and boosts accessibility for patients.
- Multimodal data integration.
- LLMs face data privacy and trustworthiness.
- When to use LLMs and when to use human abilities requires careful thinking.

## What other recent medical image analysis advancements excite you the most?

- Classic problems like segmentations and how to capture geometry remain unsolved.
- More comprehensive and dynamic brain-inspired, biologically-inspired AI.
- Understanding the biology behind the data will help you design more applicable models. Those models can better make a difference
- Prior knowledge is important in addition to big data. Foundational models will explore all non-synthetic data in the next few years; no new data will exist.
- Montreal is a major hub for neuroscience and AI.

## For the many students here, what technical skills and knowledge should the next generation of medical image analysis researchers prepare for?

- Know the neglected basics, e.g., solid mathematical background and proficiency in programming
- Understand the data
- Ability to explain the results and ask the question of why and how
- Visualization is very important for both exploratory data analysis and publishing
- Learning from mistakes - find out why a model doesn't work instead of throwing in different models
- Ask yourself: Who will care about an increase in accuracy? Is it significant? Will it have tradeoffs in robustness, explainability, etc.?
- Quickly take up new skills (mathematics, programming, etc.)
- Research paradigms have changed in the foundation model era - how to leverage foundation models for your field to stand on the shoulders of giants?
- Low-level implementation details such as preprocessing, multiprocessing in coding for large-scale data, model development, multi-node distributed training, efficient fine-tuning, and model deployment on constrained environments are also critical skills.
- Work and have fun at the same time.
- Perseverance in the face of failure is one of the most essential qualities for Ph.D. students.

## Question: The future of models for specific tasks (e.g., segmentation) vs end-to-end models.

- New models for specific tasks make lovely reads.
- Methodology will change, but specific tasks will stay there. However, improving specific tasks will gradually shift towards industry. Universities will focus on publishing the first paper in a domain, while industry will focus on publishing the last paper in a domain.
- In the end, we care about helping patients.

