---
title: Displaying Information for Thrown and Caught Exceptions to the User in Python
date: 2023-02-20
categories:
- ["Design Patterns"]
---

## Exception Semantics in Python

Exception handling refers to how a program reacts when unexpected events, known as exceptions, occur throughout the program's execution.

Exception semantics varies considerably among programming languages. Based on this, we can divide programming languages into [two groups](https://doi.org/10.1007%2F11818502_16):

- Programming languages that only employ exceptions to address exceptional, unforeseen, or incorrect circumstances, such as C++, Java, and C#.
- Programming languages that use exceptions as standard flow control structures, such as Ada, ML, OCaml, Python, and Ruby. For example, in Python, when an iterator has exhausted its output, and no more items can be generated, an exception of type StopIteration is thrown.

As a result, exceptions are pervasive in Python, and exception catching and handling is a must for writing robust Python code.

## Displaying Information for Thrown and Caught Exceptions to the User

In many situations, it is beneficial to handle the exception and give a user a "loud and clear" message of what has happened as feedback. This is also particularly useful in investigating the root cause of the exception and whether it is the tip of the iceberg of a more significant latent bug.

This can be simplified by the fact that exceptions thrown by built-in functions, standard library functions, and functions in many well-tested third-party libraries all contain rich semantics in:

- The class of the exception. Given an exception `e`, it is accessible via `type(e)`, and `type(e).__name__` gives a `str` representation.
- The message of the exception. Given an exception `e`, `str(e)` generates a representation of the argument(s) to the instance.

In command-line programs, we can write both of them to `stderr`, as shown in the example below:

```python
from sys import stderr


try:
    # Do some potentially erroneous operation
except Exception as e:
    # Write the class of the exception and the message of the exception to stderr
    print(type(e).__name__, str(e), file=stderr)
```

In GUI programs, we can display them in a message box, with the class of the exception being the title of the message box and the message of the exception being the message of the message box, as shown in the example below:

```python
from PySide6.QtCore import Slot
from PySide6.QtWidgets import QDialog, QMessageBox

from .ui import Ui_ConnectToServerDialog


class ConnectToServerDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)

        self.ui=Ui_ConnectToServerDialog()
        self.ui.setupUi(self)
        self.ui.connectPushButton.clicked.connect(self.accept)
        
        self.server=None

    @Slot()
    def accept(self):
        try:
            # Do some operation that involves potentially erroneous user input
        except Exception as e:
            # Display the exception thrown in a QMessageBox
            # The type of the exception is the title of the QMessageBox
            # The message of the exception is the message of the QMessageBox
            QMessageBox.about(self, type(e).__name__, str(e))
            return
        
        super().accept()
```

## References

- https://en.wikipedia.org/wiki/Exception_handling#Exception_support_in_programming_languages
- https://docs.python.org/3/library/exceptions.html#bltin-exceptions
