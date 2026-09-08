---
title: "sortedcontainers: The Balanced Tree Python Was Missing"
date: 2026-09-07
categories:
  - "Programming"
tags:
  - "reference"
  - "python"
  - "data-structures"
---

> A sorted list, a sorted set, and a sorted dict - with `O(log n)` insert, delete, k-th element, and count queries.

Python's standard library gives you a hash map (`dict`), a hash set (`set`), a binary heap (`heapq`), binary search over sorted lists (`bisect`), and a double-ended queue (`collections.deque`). What it does **not** give you is a balanced binary search tree - a container that stays sorted while you add and remove elements, and that can answer ordered queries (k-th element, rank, and counts) in `O(log n)`.

That container is **[`sortedcontainers`](https://grantjenks.com/docs/sortedcontainers/)** - a pure-Python library that is **pre-installed on LeetCode's Python judge**, so you can import it in a submission without a second thought.

```bash
pip install sortedcontainers   # for everything outside LeetCode
```

## What `sortedcontainers` provides

The library ships three classes, and each one answers the same three questions: *k-th smallest*, *insert / delete*, and *how many elements are less than `v`*. The only differences are whether duplicates are kept and whether you store bare values or key-value pairs.

### `SortedList` - a sorted multiset (duplicates kept)

```python
from sortedcontainers import SortedList
S = SortedList([2, 5, 5, 8, 11])
```

**k-th smallest - just index it.** `S[k]` is the (k+1)-th smallest element, and duplicates each occupy a position:

```python
S[0]  # 2
S[1]  # 5
S[2]  # 5
S[3]  # 8
S[4]  # 11
```

**add / remove / pop - order is preserved.** `add` slots an element in for you; `remove` deletes a single occurrence; `pop(k)` removes and returns the element at index `k`:

```python
S.add(7)      # [2, 5, 5, 7, 8, 11]
S.remove(5)   # [2, 5, 7, 8, 11]     (one 5 gone)
S.pop(0)      # 2   -> [5, 7, 8, 11]   (remove and return the smallest)
S.pop(-1)     # 11  -> [5, 7, 8]       (remove and return the largest)
```

**bisect - how many elements are less than `v`?** `bisect_left(v)` and `bisect_right(v)` both return a count:

- `bisect_left(v)`: number of elements strictly less than v
- `bisect_right(v)`: number of elements less than or equal to v

```python
S = SortedList([2, 5, 5, 8, 11])     # back to the original
S.bisect_left(5)   # 1    (just the 2)
S.bisect_right(5)  # 3    (2, 5, and 5)
S.bisect_left(7)   # 3    (2, 5, 5)
S.bisect_right(7)  # 3    (same - 7 isn't present)
```

### `SortedSet` - a sorted set (duplicates collapsed)

Same three operations, but duplicates collapse into one, so `[2, 5, 5, 8, 11]` becomes `[2, 5, 8, 11]`:

```python
from sortedcontainers import SortedSet
T = SortedSet([2, 5, 5, 8, 11])   # -> [2, 5, 8, 11]

T[0]  # 2
T[1]  # 5
T[2]  # 8
T[3]  # 11

T.add(7)      # [2, 5, 7, 8, 11]
T.remove(5)   # [2, 7, 8, 11]
T.pop(0)      # 2   -> [7, 8, 11]   (remove and return the smallest)
T.pop(-1)     # 11  -> [7, 8]       (remove and return the largest)

T = SortedSet([2, 5, 8, 11])      # reset
T.bisect_left(5)   # 1    (elements < 5: just 2)
T.bisect_right(5)  # 2    (elements <= 5: 2 and 5)
T.bisect_left(7)   # 2    (elements < 7: 2 and 5)
T.bisect_right(7)  # 2    (same - 7 isn't present)
```

### `SortedDict` - sorted keys mapped to values

A map stores key-value pairs, not bare values, so you build it from pairs. The same three operations answer questions about **keys**:

```python
from sortedcontainers import SortedDict
D = SortedDict({2: 'two', 5: 'five', 8: 'eight', 11: 'eleven'})

# smallest / largest - peekitem returns the (key, value) pair without removing it
D.peekitem(0)    # (2, 'two')      smallest
D.peekitem(-1)   # (11, 'eleven')  largest

# how many keys are less than k?
D.bisect_left(5)   # 1    (keys < 5: just 2)
D.bisect_right(5)  # 2    (keys <= 5: 2 and 5)
D.bisect_left(7)   # 2    (keys < 7: 2 and 5)

# insert / delete - keys stay sorted
D[7] = 'seven'   # -> 2, 5, 7, 8, 11
del D[5]         # -> 2, 7, 8, 11

# remove smallest / largest - popitem removes and returns the (key, value) pair
D.popitem(0)     # (2, 'two')      -> 7, 8, 11
D.popitem(-1)    # (11, 'eleven')  -> 7, 8
```
