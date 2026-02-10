---
layout: blog
title: 'Metaclass Fundamentals'
date: 2025-07-25
categories:
- ["Design Patterns"]
---

Metaclasses are one of Python's most powerful yet least understood features. They enable patterns that would be difficult or impossible with regular class definitions. In this post, we'll explore metaclass fundamentals through simple examples.

## What are Metaclasses?

- A **class C's metaclass** is basically `type(C)`. **If you define `class Class(metaclass=ClassMeta)` in Python, then `type(Class) is ClassMeta`.**
- If we don't explicitly set a metaclass for a class, then its metaclass is `type` by default. **Thus, `ClassMeta` should inherit from `type`.**
- Just like given `o = Class(...)`, and that `Class` defines a method `def f(self, ...)`, `o.f(...)` would result in calling `Class.f(o, ...)`, **if `ClassMeta` defines a method `def g(self, ...)`, `Class.g(...)` would result in calling `ClassMeta.g(...)`**.

We'll present a concrete example below.

```python
class ClassMeta(type):
    def __call__(self, *args, **kwargs):
        instance = type.__call__(self, *args, **kwargs)  
        return instance


class Class(object, metaclass=ClassMeta):
    def __new__(cls, *args, **kwargs):
        instance = object.__new__(cls)
        return instance
    
    def __init__(self, *args, **kwargs):
        object.__init__(self)
```

What happens when we run:

```python
c = Class(0, 1, 2, message='Hello World')
```

`Class(0, 1, 2, message='Hello World')` is syntactic sugar for `Class.__call__(0, 1, 2, message='Hello World')`.

If we haven't set a metaclass for `Class`, then this in turn invokes `type.__call__(Class, 0, 1, 2, message='Hello World')`.

However, we have set `Class`'s metaclass to `ClassMeta`, whose `ClassMeta.__call__` overrides `type.__call__`. Thus, `Class.__call__(0, 1, 2, message='Hello World')` would invoke **`ClassMeta.__call__(Class, 0, 1, 2, message='Hello World')`** instead.

With a few `print` statements added, we can see the function calls:

```
in ClassMeta.__call__(self, *args, **kwargs), self = <class '__main__.Class'>, args = (0, 1, 2), kwargs = {'message': 'Hello World'}, calling type.__call__(self, *args, **kwargs)...
in Class.__new__(cls, *args, **kwargs), cls = <class '__main__.Class'>, args = (0, 1, 2), kwargs = {'message': 'Hello World'}, calling object.__new__(cls)...
in Class.__new__(cls, *args, **kwargs), after calling object.__new__(cls), instance: <__main__.Class object at 0x7ea1253346e0>
in Class.__init__(self, *args, **kwargs), self = <__main__.Class object at 0x7ea1253346e0>, args = (0, 1, 2), kwargs = {'message': 'Hello World'}, calling object.__init__(self)...
in Class.__init__(self, *args, **kwargs), after calling object.__init__(self)
in ClassMeta.__call__(self, *args, **kwargs), after calling type.__call__(self, *args, **kwargs), instance: <__main__.Class object at 0x7ea1253346e0>
```

## Metaclass Inheritance

Metaclasses are "contagious" - when you inherit from a class with a metaclass, the child class gets the same metaclass:

```python
class ParentMeta(type):
    def __call__(self, *args, **kwargs):
        instance = type.__call__(self, *args, **kwargs)
        return instance


class Parent(object, metaclass=ParentMeta):
    def __new__(cls, *args, **kwargs):
        instance = object.__new__(cls)
        return instance

    def __init__(self, *args, **kwargs):
        object.__init__(self)


class Child(Parent):
    def __new__(cls, *args, **kwargs):
        instance = Parent.__new__(cls, *args, **kwargs)
        return instance

    def __init__(self, *args, **kwargs):
        Parent.__init__(self, *args, **kwargs)
```

In this case,

```python
c = Child(0, 1, 2, message='Hello World')
```

would still result in invoking **`ParentMeta.__call__(Child, 0, 1, 2, message='Hello World')`**.

## Practical Application 1: Singleton Pattern

Metaclasses provide an elegant way to implement the Singleton pattern:

```python
class SingletonMeta(type):
    _instances = {}
    
    def __call__(self, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

# SingletonBase(...) gets rerouted to SingletonMeta(SingletonBase, ...)
class SingletonBase(metaclass=SingletonMeta):
    pass

# SingletonChild(...) also gets rerouted to SingletonMeta(SingletonChild, ...)
class SingletonChild(SingletonBase):
    pass

a = SingletonBase()
b = SingletonBase()
print(a is b)  # True

x = SingletonChild()
y = SingletonChild()
print(x is y)  # True
```

## Practical Application 2: Template Metaprogramming

We can simulate C++-style templates using metaclasses:

In C++:

```c++
templace <V VALUE = default> class C {
    // Use `VALUE` here
};

C<v> *c = new C<v>(...);
```

In Python:

```python
class ClassMeta(type):
    _values_to_instantiations = {}
    value = None

    def __getitem__(self, value):
        if value in self._values_to_instantiations:
            instantiation = self._values_to_instantiations[value]
        else:
            # Dynamically create `self[value]` containing the class variable VALUE as a subclass of `self`
            instantiation = type(
                '%s[%s]' % (self.__name__, value),
                (self,),
                { 'VALUE': value }
            )
            self._values_to_instantiations[value] = instantiation

        return instantiation

class Class(object, metaclass=ClassMeta):
    # Use `self.VALUE` or `cls.VALUE` here
    pass
```

Then, after we run:

```python
# Dynamically create `Class[True]`
class_true = Class[True]
# Create an instance of `Class[True]`
c1 = class_true()
# Dynamically create `Class[False]`
class_false = Class[False]
# Create an instance of `Class[False]`
c2 = class_false()
```

we can get something like:

```
>>> c1
>>> <__main__.Class[True] at 0x796bbb89d3a0>
>>> c2
>>> <__main__.Class[False] at 0x796bbc53fb60>
```
