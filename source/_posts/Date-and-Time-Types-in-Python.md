---
title: Date and Time Types in Python
date: 2022-12-31
categories:
- ["Design Patterns"]
---

There are many types in Python which can store date and time information. These types can be broadly divided into two categories:

# JSON Serializable Formats

- UNIX Timestamp (e.g. `0`)
- ISO 8601 String (e.g. `'1970-01-01T00:00:00'`)

UNIX Timestamp has its roots in the system time of Unix operating systems. It is now widely used in databases, programming languages, file systems, and other computer operating systems. It counts the number of seconds that have passed since the Unix epoch began on January 1, 1970 at 00:00:00 UTC, minus any modifications made for leap seconds.

ISO 8601 is an international standard for the transmission and interchange of time- and date-related information on a global scale. Dates in the Gregorian calendar, hours based on the 24-hour timekeeping system, with an optional UTC offset, time intervals, and combinations of these are covered by ISO 8601. The standard offers a clear, unambiguous manner of expressing calendar dates and times in international communications, notably to prevent numeric dates and times from being misinterpreted when such data is sent between nations.

As the categorization suggests, these formats can be used in JSON serialization, and are widely adopted in data exchange formats and APIs. For example, Stripe APIs use UNIX Timestamps, while Twitter and Dropbox APIs use ISO 8601 Strings. UNIX Timestamps are easier and more efficient to handle, while ISO 8601 Strings have the virtue of being human-readable.

# Widely Used In-memory Data Structures

- `datetime.datetime` (e.g. `datetime.datetime(1970, 1, 1, 0, 0)`)
- `datetime.date` (e.g. `datetime.date(1970, 1, 1)`)
- `pandas.Timestamp` (e.g. `Timestamp('1970-01-01 00:00:00')`)

As the categorization suggests, these formats are in-memory, structured representations of date and time information.

`datetime.datetime` and `datetime.date` are types implemented (and widely used) in the Python Standard Library. `datetime.date` represents a date (year, month, day) in an idealized calendar, which is the existing Gregorian calendar infinitely stretched in both directions, while `datetime.datetime` also combines the data from a time object (hour, minute, second, microsecond).

`pandas.Timestamp` is implemented in `pandas`. It is the `pandas` replacement for `datetime.datetime`, and is the type used for the entries that make up a `pandas.DatetimeIndex`, and other time series-oriented data structures in `pandas`. Furthermore, it is also widely used across the Python Ecosystem for Data Science, such as being used by `matplotlib` as the `xticks` for plotting a `pandas.Series` with a `pandas.DatetimeIndex`, as shown below.

References:

- https://en.wikipedia.org/wiki/Unix_time
- https://en.wikipedia.org/wiki/ISO_8601
- https://dev.to/xngwng/do-you-prefer-unix-epoch-a-number-or-iso-8601-a-string-for-timestamps--28ll
- https://stackoverflow.com/questions/15554586/timestamps-iso8601-vs-unix-timestamp
- https://www.dataquest.io/blog/tutorial-time-series-analysis-with-pandas/
- https://www.programiz.com/python-programming/datetime/timestamp-datetime
- https://stackoverflow.com/questions/3743222/how-do-i-convert-a-datetime-to-date
- https://stackoverflow.com/questions/969285/how-do-i-translate-an-iso-8601-datetime-string-into-a-python-datetime-object
- https://www.programiz.com/python-programming/datetime/timestamp-datetime
- https://pynative.com/python-iso-8601-datetime/
- https://docs.python.org/3/library/datetime.html
- https://stackoverflow.com/questions/1937622/convert-date-to-datetime-in-python
- https://pandas.pydata.org/docs/reference/api/pandas.Timestamp.html
- https://stackoverflow.com/questions/993358/creating-a-range-of-dates-in-python
- https://stackoverflow.com/questions/41046630/set-time-formatting-on-a-datetime-index-when-plotting-pandas-series
