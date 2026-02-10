---
title: Manipulating `DataFrame`s Using `pandas`
date: 2025-08-12
categories:
- ["Data Science, Multimedia, and Process Automation"]
---

## One `DataFrame` has the columns `A`, `B` and another has the columns `A`, `C`. How to merge into one `DataFrame` with columns `A`, `B`, and `C`?

You can achieve this using `pd.merge()` in `pandas` with the `how='outer'` argument. This will merge on the common column `A` and include all rows from both DataFrames, filling in missing values (as `NaN`) where the data does not exist.

Here's an example:

```python
import pandas as pd

# Example data
df1 = pd.DataFrame({
    'A': [1, 2, 3],
    'B': ['X', 'Y', 'Z']
})

df2 = pd.DataFrame({
    'A': [2, 3, 4],
    'C': ['P', 'Q', 'R']
})

# Merge on column 'A'
merged = pd.merge(df1, df2, on='A', how='outer')

print(merged)
```

Result:

```
   A    B    C
0  1    X  NaN
1  2    Y    P
2  3    Z    Q
3  4  NaN    R
```

## Iterate over rows and access columns in a `DataFrame`

If the column names are valid Python identifiers, using `itertuples()` to yield `namedtuple`s is fastest:

```python
for row in df.itertuples():
    print(row.Index, row.A, row.B)   # Access columns with dot notation
```

If not all column names are valid Python identifiers (e.g., some column names contain spaces), use `iterrows()` to yield an index and a `Series` for each row:

```python
for index, row in df.iterrows():
    print(index, row['A'], row['B'])   # Access columns via indexing
```