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

## Visualizing Graphs with PyGraphviz and Graphviz

NetworkX can interface directly with PyGraphviz and Graphviz, popular software packages for graph visualization.

### Installing Graphviz and PyGraphviz

Before you can use these visualization features, you need to install both PyGraphviz and Graphviz. On most systems, the easiest way is:

```bash
conda install -c conda-forge graphviz pygraphviz
```

### Rendering Graphs as Images

Once you have everything installed, you can easily convert a NetworkX graph into a Graphviz object and save it directly as an image (`PNG`, `PDF`, etc.):

```python
import networkx as nx

# Create or load a graph
G = nx.DiGraph()
G.add_edges_from([(1, 2), (2, 1), (2, 3), (3, 1)])

# Convert to a pygraphviz AGraph
A = nx.nx_agraph.to_agraph(G)

# Write to DOT format (optional, for inspection/sharing)
A.write("G.dot")

# Render and save as a PNG image
A.draw("G.png", prog="dot")
```

- `nx.nx_agraph.to_agraph(G)` converts your NetworkX graph to a PyGraphviz (Graphviz) AGraph object.
- `.write("G.dot")` saves the graph in DOT format (plain text for Graphviz).
- `.draw("G.png", prog="dot")` renders the image using the Graphviz "dot" layout engine.

You can open `G.png` in any image viewer to see the visualization.

> **Tip:** Try changing the `prog` argument to other Graphviz layout engines like `"neato"` or `"fdp"` for different layouts.

### Further Customization

You can customize node shapes, colors, and more using AGraph's methods or by passing attributes on creation; see [the pygraphviz documentation](https://pygraphviz.github.io/) for more details.

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
