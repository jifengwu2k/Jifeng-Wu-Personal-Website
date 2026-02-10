---
title: Manipulating Graphs with NetworkX
date: 2026-01-31
updated: 2026-01-31
categories:
  - Theory, Data Structures, Algorithms, Programming Languages, Design Patterns
tags:
  - Reference
---

NetworkX is a powerful pure-Python library for creating, manipulating, and analyzing graphs. This guide covers essential tasks using NetworkX.

## Inspecting Directed Graphs: In-Edges and Out-Edges

For directed graphs (`nx.DiGraph`), you may want to know which edges point **into** or **out of** a node.

**Example:**

```python
import networkx as nx

# Create a directed graph
G = nx.DiGraph()

# Add some edges
G.add_edges_from([(1, 2), (2, 1), (2, 3), (3, 1)])

node = 1

# In-edges: edges ending at this node
in_edges = G.in_edges(node)
print("In-edges:", list(in_edges))    # Output: [(2, 1), (3, 1)]

# Out-edges: edges starting from this node
out_edges = G.out_edges(node)
print("Out-edges:", list(out_edges))  # Output: [(1, 2)]
```

- `G.in_edges(node)` returns edges directed *into* `node`
- `G.out_edges(node)` returns edges directed *out of* `node`

## Serializing and Deserializing Graphs

When working with graphs, you may want to save (serialize) them to a file and load (deserialize) them later. There are two common approaches in NetworkX:

### A. Using JSON (Node-Link Data)

**Why?**  
- Human-readable  
- Cross-language interoperability

#### Serialize to JSON:
```python
import networkx as nx
import json

G = nx.path_graph(4)
data = nx.node_link_data(G)

with open("graph.json", "w") as f:
    json.dump(data, f)
```

#### Deserialize from JSON:
```python
with open("graph.json", "r") as f:
    data = json.load(f)

G = nx.node_link_graph(data)
```

> **Tip:** JSON is a popular serialization format and can be easily used with web apps or other languages.

### B. Using Pickle

**Why?**  
- Fastest method in Python  
- Carries all Python-specific information  
- **Warning:** Not safe for untrusted data, and not interoperable with other languages.

#### Serialize using Pickle:
```python
import networkx as nx
import pickle

G = nx.cycle_graph(5)

with open("graph.gpickle", "wb") as f:
    pickle.dump(G, f)
```

#### Deserialize using Pickle:
```python
with open("graph.gpickle", "rb") as f:
    G = pickle.load(f)
```
