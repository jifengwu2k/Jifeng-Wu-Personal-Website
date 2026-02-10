---
title: Using DevTools Console for Web Scraping
date: 2025-08-12
categories:
- ["Data Science, Multimedia, and Process Automation"]
---

## Convert an HTML Table to a Pandas-compatible JSON

If you want to convert an HTML table to a Pandas-compatible JSON:

```
{
    "column1": [value1, value2, ...],
    "column2": [value1, value2, ...]
}
```

you can do this in a browser using DOM manipulation:

- **Extract headers**: Get the header text from the `<th>` elements.
- **Build the output object**: Each header is a key pointing to an array.
- **Fill columns**: Loop over the rows, pushing cell values to the appropriate key/array.

```javascript
function tableToPandasJson(table) {
  // Get the headers from the first row of the table head
  var thead = table.getElementsByTagName('thead')[0];
  var headerCells = thead.getElementsByTagName('th');
  var headers = [];
  for (var i = 0; i < headerCells.length; i++) {
    headers.push(headerCells[i].innerText);
  }

  // Initialize the result object, one array per header
  var result = {};
  for (var j = 0; j < headers.length; j++) {
    result[headers[j]] = [];
  }

  // Go through each row in tbody
  var tbody = table.getElementsByTagName('tbody')[0];
  var rows = tbody.getElementsByTagName('tr');
  for (var r = 0; r < rows.length; r++) {
    var cells = rows[r].getElementsByTagName('td');
    for (var c = 0; c < headers.length; c++) {
      // Always treat as text
      var cellText = cells[c].innerText;
      result[headers[c]].push(cellText);
    }
  }

  return result;
}
```

### Example

#### Example HTML table

```html
<table id="myTable">
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>25</td>
    </tr>
    <tr>
      <td>Bob</td>
      <td>30</td>
    </tr>
  </tbody>
</table>
```

#### JavaScript code

```javascript
var table = document.getElementById('myTable');
var pandasJson = tableToPandasJson(table);
console.log(JSON.stringify(pandasJson));
// Output: {"Name":["Alice","Bob"],"Age":["25","30"]}
```
