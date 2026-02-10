---
title: 'Paper Reading: How to make ad-hoc polymorphism less ad-hoc'
date: 2023-03-06
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for [Topics in Programming Languages: Type Systems](https://williamjbowman.com/teaching/2022/w2/cpsc539b/). The original paper can be found [here](https://doi.org/10.1145/75277.75283).

# Summary

The paper first defines and compares [parametric and ad-hoc polymorphism](https://abbaswu.github.io/2023/02/10/Paper-Review-Types-and-Programming-Languages-Chapter-15-and-Chapter-16/#Polymorphism) and points out the limitations of existing implementations of ad-hoc polymorphism. It then presents type classes that extend the Hindley/Milner type system to support ad-hoc polymorphism as a remedy to these limitations and explains how to translate a program using type classes into an equivalent program without them at compile-time. Furthermore, it showcases the power of type classes and the translation mechanism using the example of a polymorphic equality operation. Finally, it explores subclassing of type classes.

# Critique

The paper is easy to follow as it is written in a lucid manner and gives an informal introduction to type classes and its translation rules. Furthermore, the motivation for type classes and how it connects to object-oriented programming languages is explicitly stated in the paper. I have further looked up some material following these lines. I will summarize them before presenting some questions and comments.

## My Takeaways

### Different Types of Polymorphism

See [my Paper Reading for "Types and Programming Languages" Chapter 15 and Chapter 16](https://abbaswu.github.io/2023/02/10/Paper-Review-Types-and-Programming-Languages-Chapter-15-and-Chapter-16/#Polymorphism).

### Type Classes and Protocols/Interfaces in Smalltalk/Objective-C/Java/C#

An interface is an abstract type used to provide a collection of methods compliant classes must implement in the Java (and C#) programming languages.

Java is mostly influenced by Objective-C, and Java's interfaces are adaptations of the protocols in Objective-C and Smalltalk, which in turn is based on protocols in networking, notably the ARPANet.

Although Type Classes and Interfaces do not share a common lineage, it is straightforward to implement Type Classes with *Generic Interfaces* whose Generic Parameters should be Classes that comply with the Interface.

For instance, the Type Class below specifies the equal (==) operations for Type Constructors that are its instances:

```haskell
class Eq a where
  (==) :: a -> a -> Bool
```

This can be implemented in Java using the following Generic Interface:

```java
interface Eq<T> {
    boolean isEqual(T other);
}
```

### Type Classes and Concepts in C++

Although Java's syntax resembles C++'s, its semantics of late-binding, single inheritance, class objects, and an extensive runtime system are in the lineage of Smalltalk and Objective-C, far away from that of C++'s. However, in C++'s Template Metaprogramming world, Concepts, added in C++20, resembles Type Classes.

Template Metaprogramming in C++ had been untyped, with template parameters being generic type variables substituted at template instantiation.

In C++20, a type system has been added to this untyped template language through concepts. They are Boolean predicates on template parameters evaluated at the point of, not after, template instantiation. The compiler will produce a clear error immediately if a programmer tries to use a template parameter that doesn't meet the requirements of a concept.

This starkly contrasts the challenging-to-grasp errors reported after an invalid type substitutes a generic type variable emanating from the implementation context rather than the template instantiation itself.

For instance, the first two arguments to `std::sort` must be random-access iterators. If an argument is not a random-access iterator, an error will occur when `std::sort` attempts to use it as a bidirectional iterator.


```c++
std::list<int> l = {2, 1, 3};
std::sort(l.begin(), l.end());
```

Without concepts, compilers may produce large amounts of error information, starting with an equation that failed to compile when it tried to subtract two non-random-access iterators:

```
In instantiation of 'void std::__sort(_RandomAccessIterator, _RandomAccessIterator, _Compare) [with _RandomAccessIterator = std::_List_iterator<int>; _Compare = __gnu_cxx::__ops::_Iter_less_iter]':
 error: no match for 'operator-' (operand types are 'std::_List_iterator<int>' and 'std::_List_iterator<int>')
 std::__lg(__last - __first) * 2,
```

However, if concepts are used, the problem can be found and reported at template instantiation:

```
error: cannot call function 'void std::sort(_RAIter, _RAIter) [with _RAIter = std::_List_iterator<int>]'
note:   concept 'RandomAccessIterator()' was not satisfied
```

It is straightforward to implement Type Classes with concepts. For instance, the Type Class below specifies the equal (==) operations for Type Constructors that are its instances: 

```haskell
class Eq a where
  (==) :: a -> a -> Bool
```

This can be implemented using the following C++ concept:

```c++
#include <concepts>


// Declaration of the concept "Eq", which is satisfied by any type 'T'
// such that for values 't' of type 'T', the expression t == t compiles
// and its type satisfies the concept std::same_as<bool>
template <typename T> concept Eq = requires (T t) {
    { t == t } -> std::same_as<bool>;
};
```

Afterwards, such a concept can be specified when template parameters are being introduced in a template definition, to indicate that the corresponding template parameter must satisfy the concept.

```c++
template<Eq T> void f(const T& t) {
    // ...
}
```

### References

- https://stackoverflow.com/questions/6948166/javas-interface-and-haskells-type-class-differences-and-similarities
- https://cs.gmu.edu/~sean/stuff/java-objc.html
- https://functionalcpp.wordpress.com/2013/08/16/type-classes/
- https://stackoverflow.com/questions/32124627/how-are-c-concepts-different-to-haskell-typeclasses
- https://wiki.haskell.org/OOP_vs_type_classes
- https://doi.org/10.1145/1411318.1411324
- https://www.foonathan.net/2021/07/concepts-structural-nominal/
- https://www.reddit.com/r/haskell/comments/1e9f49/concepts_in_c_template_programming_and_type/

## Questions and Comments

- The translation mechanism (pre-processor) proposed in this paper translates a program using type classes into an equivalent program without them at compile-time so that an existing Hindley/Milner type system can be used afterward instead of having to develop a new, complex type system to support type classes. This is indeed a very clever mechanism. Can this be viewed as an example of [desugaring](https://abbaswu.github.io/2023/01/25/Paper-Review-Types-and-Programming-Languages-Chapter-9-and-Chapter-11/#Derived-Forms)?
