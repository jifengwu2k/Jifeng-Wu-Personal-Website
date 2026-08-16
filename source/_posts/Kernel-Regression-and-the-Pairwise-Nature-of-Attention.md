---
title: "Kernel Regression and the Pairwise Nature of Attention"
date: 2026-08-16
updated: 2026-08-16
categories:
  - "Mathematics"
tags:
  - "essay"
  - "machine-learning"
  - "transformers"
excerpt: "This post introduces Nadaraya-Watson kernel regression from a localized squared-error objective, then connects it to the normalized, similarity-weighted averaging performed by attention."
---

You have probably heard of the 2017 paper [*Attention Is All You Need*](https://arxiv.org/abs/1706.03762). You may also know its headline result: the Transformer replaced recurrence with attention and went on to become the foundation of modern large language models.

But what, exactly, is attention doing—and what made it such a consequential design?

A useful answer begins with a seemingly unrelated classical method: **kernel regression**. If you have not encountered it before, kernel regression predicts a value by taking a similarity-weighted average of observations. Starting from a localized squared-error objective, we can derive this estimator from first principles.

Then we will return to attention. Once the matrix operations are expanded, one row of attention has almost the same normalized, similarity-weighted averaging form as kernel regression.

The common thread is **pairwise interaction**. Kernel regression compares a query location with each observed location. Attention compares each query vector with every visible key vector. This connection provides a simple mathematical lens through which to understand the essence of attention.

## Kernel regression

[Ordinary least squares and ridge regression](/2023/12/24/Linear-Regression-Ridge-Regression-Lasso-Regression-and-Kernel-Ridge-Regression/) optimize a global loss: they search for one set of parameters that minimizes error across all $n$ observations. Consequently, a point at one extreme of the input domain can affect the prediction at the other extreme.

That behavior can be undesirable when the relationship is strongly local. Kernel ridge regression can represent nonlinear global functions, but its standard exact solution also requires solving a system involving an $n \times n$ kernel matrix, with up to $O(n^3)$ time complexity.

The Nadaraya-Watson estimator takes a different approach. Instead of fitting a global parametric function, it makes a prediction at a query location from a weighted average of nearby observations.

### The baseline: a global constant

First consider fitting a single constant $c$ to the responses $y_1,\ldots,y_n$. The squared-error objective is

$$L(c)=(y_1-c)^2+\dots+(y_n-c)^2$$

Differentiating and setting the result to zero gives

$$\frac{dL(c)}{dc}=2(c-y_1)+\dots+2(c-y_n)=0$$

so the optimal constant is the arithmetic mean:

$$c^*=\frac{y_1+\dots+y_n}{n}$$

A global mean cannot capture a relationship that changes with $x$. We therefore want the fitted constant to depend on the query location.

### From a global constant to a local constant

For a query $x$, assign each observation $(x_i,y_i)$ a nonnegative weight using a kernel function $k(x,x_i)$. In a typical local kernel, this weight is largest near $x$ and decreases as $x_i$ becomes less similar to $x$.

We can then define the localized objective

$$L_x(c)=k(x,x_1)(y_1-c)^2+\dots+k(x,x_n)(y_n-c)^2$$

Nearby errors now matter more than distant errors. Differentiating gives

$$\frac{dL_x(c)}{dc}=2[k(x,x_1)+\dots+k(x,x_n)]c-2[k(x,x_1)y_1+\dots+k(x,x_n)y_n]$$

and

$$\frac{d^2L_x(c)}{dc^2}=2[k(x,x_1)+\dots+k(x,x_n)]>0$$

provided at least one observation has positive weight. Setting the first derivative to zero yields

$$\hat{y}(x)=\underset{c}{\arg\min}\;L_x(c)=\frac{k(x,x_1)y_1+\dots+k(x,x_n)y_n}{k(x,x_1)+\dots+k(x,x_n)}$$

This is the **Nadaraya-Watson kernel regression estimator**. It has no global coefficient-fitting step: at prediction time, it compares the query with the observations and returns their normalized, similarity-weighted average. The kernel function determines how similarity between the query and each observation is translated into weight.

## The pairwise nature of attention

Scaled dot-product attention is

$$\text{Attention}(Q, K, V) = \text{row_softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

Let the rows of $Q$, $K$, and $V$ be query vectors $\vec{q}_i$, key vectors $\vec{k}_j$, and value vectors $\vec{v}_j$. Expanding the matrix multiplication makes the pairwise structure explicit:

$$\text{row_softmax} \left( \frac{1}{\sqrt{d_k}} \begin{pmatrix} \vec{q}_1 \\\\ \vdots \\\\ \vec{q}_n \end{pmatrix} \begin{pmatrix} \vec{k}_1^T & \dots & \vec{k}_n^T \end{pmatrix} \right) \begin{pmatrix} \vec{v}_1 \\\\ \vdots \\\\ \vec{v}_n \end{pmatrix}$$

$$\text{row_softmax} \left( \begin{matrix} \frac{\vec{q}_1 \vec{k}_1^T}{\sqrt{d_k}} & \dots & \frac{\vec{q}_1 \vec{k}_n^T}{\sqrt{d_k}} \\\\ \vdots & \ddots & \vdots \\\\ \frac{\vec{q}_n \vec{k}_1^T}{\sqrt{d_k}} & \dots & \frac{\vec{q}_n \vec{k}_n^T}{\sqrt{d_k}} \end{matrix} \right) \begin{pmatrix} \vec{v}_1 \\\\ \vdots \\\\ \vec{v}_n \end{pmatrix}$$

Every entry in the $n \times n$ score matrix is a direct comparison between one query and one key:

$$s_{ij}=\frac{\vec{q}_i \vec{k}_j^T}{\sqrt{d_k}}$$

For causal or otherwise masked attention, some of these pairwise comparisons are excluded before the row-wise softmax is applied.

This pairwise design has several important consequences.

### Direct content-based access

A token can compare its query directly with the key of every visible token. For example, a pronoun can assign high attention weight to an earlier noun whose representation is relevant to resolving its reference.

Unlike an RNN, which repeatedly compresses the prefix into a recurrent state, self-attention keeps the source-token representations individually addressable within the layer. This does not guarantee perfect memory—the representations and attention weights still have finite capacity—but it provides a direct lookup-like mechanism.

### Short paths between positions

In an RNN, information from the first token must pass through many recurrent transitions before reaching a much later token. In a full self-attention layer, any visible pair of positions is connected by one attention edge. These shorter paths make long-range interactions easier to represent and can improve gradient flow.

### Dynamic information routing

A convolution uses a receptive field determined primarily by its architecture. Attention instead selects relevant positions from their content: its effective connectivity changes with the input. Multiple layers and heads can learn different routing patterns, such as syntactic, positional, or semantic relationships.

### Parallel execution—and quadratic cost

All pairwise scores are computed by the dense matrix multiplication $QK^\top$. GPUs and TPUs are particularly effective at this operation, allowing the comparisons for a layer to run in parallel rather than recurrently.

This compatibility with accelerator hardware is a major practical advantage, but it comes with the familiar cost of standard attention: for a sequence of length $N$, the score matrix contains $N^2$ entries. Computing and storing it therefore requires quadratic work and, in a straightforward implementation, quadratic memory.

## Attention as kernel regression

Attention has an intricate relationship with kernel methods, where pairwise-ness also arises from a similarity function.

Let's break down exactly how we get from the matrix multiplication to the kernel equation:

$$\text{row_softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

Applying the row-wise softmax to the pairwise score matrix from the previous section gives

$$\begin{pmatrix} \frac{\exp\left(\frac{\vec{q}_1 \vec{k}_1^T}{\sqrt{d_k}}\right)}{\exp\left(\frac{\vec{q}_1 \vec{k}_1^T}{\sqrt{d_k}}\right) + \dots + \exp\left(\frac{\vec{q}_1 \vec{k}_n^T}{\sqrt{d_k}}\right)} & \dots \\\\ \vdots & \ddots \\\\ \frac{\exp\left(\frac{\vec{q}_n \vec{k}_1^T}{\sqrt{d_k}}\right)}{\exp\left(\frac{\vec{q}_n \vec{k}_1^T}{\sqrt{d_k}}\right) + \dots + \exp\left(\frac{\vec{q}_n \vec{k}_n^T}{\sqrt{d_k}}\right)} & \dots \end{pmatrix} \begin{pmatrix} \vec{v}_1 \\\\ \vdots \\\\ \vec{v}_n \end{pmatrix}$$

The $i$-th row of the output is

$$\vec{o}_i = \frac{\exp\left(\frac{\vec{q}_i \vec{k}_1^T}{\sqrt{d_k}}\right) \vec{v}_1 + \dots + \exp\left(\frac{\vec{q}_i \vec{k}_n^T}{\sqrt{d_k}}\right) \vec{v}_n}{\exp\left(\frac{\vec{q}_i \vec{k}_1^T}{\sqrt{d_k}}\right) + \dots + \exp\left(\frac{\vec{q}_i \vec{k}_n^T}{\sqrt{d_k}}\right)}$$

This has the same normalized weighted-average form as the Nadaraya-Watson estimator,

$$\hat{y}(x)=\frac{k(x,x_1)y_1+\dots+k(x,x_n)y_n}{k(x,x_1)+\dots+k(x,x_n)}$$

The correspondence is

| Kernel regression | Attention |
| --- | --- |
| query location $x$ | query vector $\vec{q}_i$ |
| observed location $x_j$ | key vector $\vec{k}_j$ |
| observed response $y_j$ | value vector $\vec{v}_j$ |
| weight $k(x,x_j)$ | $\exp(\vec{q}_i \vec{k}_j^T/\sqrt{d_k})$ |
| prediction $\hat{y}(x)$ | attention output $\vec{o}_i$ |

Thus, an attention head can be viewed as a vector-valued kernel smoother using the exponentiated, scaled dot-product kernel

$$k_{\mathrm{att}}(\vec{q},\vec{k})=\exp\left(\frac{\vec{q}\vec{k}^T}{\sqrt{d_k}}\right)$$

There are, however, important differences from classical kernel regression. The most important is the shift from estimation to message passing.

### From estimation to message passing

Classical kernel regression is often introduced as a way to estimate an unknown response at a new location. The weighted average is the prediction itself.

A Transformer has a different system-level purpose. Every token already has a representation. Attention uses kernel-regression-like mathematics to decide how information should flow among those existing representations. The result is projected, combined across heads, passed through a residual connection, and followed by other transformations.

This gives another useful interpretation: self-attention is **message passing on a dynamically weighted graph**.

- Each token is a node.
- Each query-key score determines the weight of a directed edge.
- Each value vector is a message sent along that edge.
- The weighted aggregate $\vec{o}_i$ contains the messages received by node $i$.
- The residual stream combines the aggregate with the node's current state.

Unlike a graph with fixed edges, this graph is reconstructed from the token representations at every attention layer. Pairwise attention is therefore both a similarity-weighted estimator and a dynamic routing mechanism. This shift—from producing a final estimate to updating existing representations—is the central difference between classical kernel regression and attention.

Several additional technical differences follow:

1. **The similarity space is learned.** In self-attention, queries and keys are usually projections of token representations, such as $\vec{q}_i=\vec{x}_iW_Q$ and $\vec{k}_j=\vec{x}_jW_K$. Similarity is measured in learned feature spaces rather than by a fixed distance in the original input space.
2. **Queries and keys can use different projections.** Attention is not necessarily a symmetric notion of similarity at the token level, even though the underlying exponentiated dot-product function is a valid kernel when both arguments inhabit the same feature space.
3. **The responses are vectors.** Values $\vec{v}_j$ carry learned features rather than scalar observations.
4. **The support set changes with the input.** In self-attention, the observations being averaged are the tokens in the current sequence. A mask may further restrict which observations are available.

Attention is therefore not merely kernel regression applied to tokens: it repurposes the same normalized weighted-average structure as a learned message-routing operation inside a deep network.

## References

- Vaswani et al., [*Attention Is All You Need*](https://arxiv.org/abs/1706.03762), 2017.
- Elizbar A. Nadaraya, [*On Estimating Regression*](https://doi.org/10.1137/1109020), 1964.
- Geoffrey S. Watson, *Smooth Regression Analysis*, 1964.
- Sara Hooker, [*The Hardware Lottery*](https://arxiv.org/abs/2009.06489), 2020.
