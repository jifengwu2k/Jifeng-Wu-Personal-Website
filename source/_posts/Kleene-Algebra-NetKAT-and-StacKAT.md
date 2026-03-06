---
title: Kleene Algebra, NetKAT, StacKAT, GKAT, CF-GKAT
date: 2026-04-15
updated: 2026-04-15
categories:
  - "Research Notes"
tags:
  - "reference"
  - "programming-languages"
  - "computer-science"
  - "systems"
excerpt: A short overview of Kleene algebra and how NetKAT and StacKAT use it to model network behavior.
---

## Kleene Algebra

Kleene algebra is a neat way to describe and reason about **regular patterns of behavior** as **regular expressions** built from:

- `0` (impossible behavior, always fails, etc.)
- `1` (do nothing, succeed immediately, etc.)
- `a` (one basic action, one input symbol, etc.)
- `e + f` (union, choice, etc.)
- `e · f` (concatenation, sequencing, etc.)
- `e*` (Kleene star, looping, etc.)

When applied to different domains, **different interpretations for `0`, `1`, `a`, `e + f`, `e · f`, `e*`, etc. exist**, so long as they satisfy certain **algebraic laws**. These laws let us simplify expressions and prove that two expressions describe the same behavior. For example:

- `1` does nothing  
  (`1·e = e = e·1`)
- `0` contributes no possible behavior
- choice is associative, commutative, and idempotent  
  (`e + f = f + e`, `e + e = e`)
- sequencing is associative  
  (`(e·f)·g = e·(f·g)`)
- sequencing distributes over choice

## NetKAT

NetKAT is a domain-specific language for specifying and verifying network behavior. Formally, a NetKAT program is the following Kleene algebra:

$$
e ::= 0 \mid 1 \mid e_1 + e_2 \mid e_1 \cdot e_2 \mid e^{*} \mid f = v \mid f \leftarrow v
$$

where:

- $0$: Drop all packets
- $1$: Forward all packets
- $e_1 + e_2$: Send packet through $e_1$ and $e_2$
- $e_1 \cdot e_2$: Send packet through $e_1$ then $e_2$
- $e^{*}$: Perform $e$ any number of times
- $f = v$: Forward packets with field $f = v$
- $f \leftarrow v$: Set packets' field $f$ to $v$

NetKAT represents packets as **finite records** from fields to values. It is too simple to model general-purpose imperative programs written in languages like Python or C. But it turns out to be an ideal model for the kind of computation that arises in **high-speed network data planes**. Network devices like routers, switches, firewalls, etc., process packets using efficient pipelines that classify packets using predicates formulated in terms of constant values ($f = v$) and modify packets using actions that assign packet headers to possibly new constant values ($f \leftarrow v$).

## StacKAT

NetKAT's restriction to finite records precludes modeling a variety of behaviors that arise in practice. First, on real-world devices, packets are not represented as finite records, but as sequences of bytes. When a packet enters a switch it must be parsed to "extract" the relevant headers into local variables. Likewise, when a packet exits a switch, the local variables must be serialized back into bytes. By convention, the unparsed portion of the packet is carried along as the payload. To **faithfully model packet parsing and serialization in all the various forms used on different devices**, NetKAT's finite records are insufficient.

Second, **certain network protocols are not finite state**. In source routing schemes, the packet not only stores its IPv4 destination address, but encodes the entire forwarding path in a stack. Each router pops an element off the stack and forwards the packet to the corresponding next hop. As paths can in principle be arbitrarily long, the stack cannot be encoded using a finite record. Dually, protocols that collect telemetry push records onto a stack to log observations about how the packet was processed at each hop on the end-to-end path. In similar fashion, tunneling protocols prepend a new set of headers to the packet, encapsulating the original headers in the payload, and use the newly added headers to route through a subnetwork. When the packet ultimately leaves the subnetwork, the new headers are removed and the original headers are restored from the payload.

StacKAT extends NetKAT:

- It models packets as comprising both a finite record mapping fields to values as well as a **stack of values** $s$ representing the unparsed portion of the packet.
- It adds the following constructs to NetKAT's Kleene algebra:
  - $\operatorname{push}(v)$: Push $v$ onto stack
  - $\operatorname{pop}(v)$: Test and pop top of stack if it equals $v$
  
## GKAT and CF-GKAT

Guarded Kleene Algebra with Tests (GKAT) is a Kleene algebra which has been widely applied for **modeling and verification** in different domains. The syntax of GKAT largely mimics that of the imperative programs, except it abstracts away the meaning of the **primitive actions and tests** of the program to enable a rich variety of semantics. Formally, GKAT expressions over a finite set of primitive tests $T$ and a finite set of primitive actions $\Sigma$ is defined as follows:

$$
\mathrm{GKAT} \ni e,f,g ::= b \in  \mathrm{BExp} \mid p \in \Sigma \mid e ; f \mid e +_b f \mid e^{(b)}
$$

$$
\mathrm{BExp} \ni b,c ::= 0 \mid 1 \mid t \in T \mid b \land c \mid b \lor c \mid \bar{b}
$$

where:

- $b \in \mathrm{BExp}$: Assertion
  - $0$: false
  - $1$: true
  - $t \in T$: Primitive
  - $b \land c$: Conjunction
  - $b \lor c$: Disjunction
  - $\bar{b}$: Negation
- $p \in \Sigma$: Primitive
- $e ; f$: Sequencing
- $e +_b f$: If-statement
- $e^{(b)}$ (or `while b do e`): While-loop

**Control-flow GKAT (CF-GKAT)** augments GKAT with **non-local control-flow structures**, like goto and break, and indicator variables; providing a comprehensive framework to validate control-flow transformations.

Similar to GKAT, the syntax of CF-GKAT is also two sorted, with the addition of common control-flow structures like indicator variable, break, continue, return, and goto's. Formally, CF-GKAT expressions are defined over a finite set of **indicator variables** $x \in X$, a finite set of **indicator values** $i \in I$, and a finite set of **labels** $l \in L$:

$$
\mathrm{CF\text{-}GKAT} \ni e,f ::= b \in \mathrm{BExp}^I \mid p \in \Sigma \mid x := i \mid e \triangleleft f \mid e ; f \mid e +_b f \mid e^{(b)} \mid \texttt{break} \mid \texttt{continue} \mid \texttt{return} \mid \texttt{goto } l \mid \texttt{label } l
$$

$$
\mathrm{BExp}_T^I \ni b,c ::= 0 \mid 1 \mid t \in T \mid x = i \mid b \lor c \mid b \land c \mid \bar{b}
$$



The **unfolding operator** $e \triangleleft f$ is an expression for **loop unfolding**. In GCAT, it is common to assume that the loop $e^{(b)}$ can be unfolded into an if-statement: $e^{(b)} \equiv e ; e^{(b)} +_{b} 1$.

However, **this identity no longer holds in CF-GKAT with the addition of `break` and `continue`**. Therefore, we introduce the unfolding operator $\triangleleft$, which satisfies the equality $e^{(b)} \equiv e \triangleleft e^{(b)} +_{b} 1$ by properly handling the `break` and `continue` within $e$.

For a CF-GKAT expression $e$ to be a CF-GKAT program (or well-formed expressions), we enforce the following constraint:

- Each `label l` appears at most once in the program $e$.
- If `goto l` appears in $e$, then so does `label l`.
- `break` or `continue` can only appear in loop, or the left side of the unfolding operator $\triangleleft$.
- All programs end with return, i.e. a program must be either `return` or of the form $f ; \texttt{return}$.

