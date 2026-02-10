---
title: 'Paper Reading: Asynchronous Functional Reactive Programming for GUIs (The Elm Paper)'
date: 2024-01-24
categories:
- ["Research Inspiration"]
---

NOTE: This is a Paper Reading for the PL Reading Group. The original paper can be found [here](https://people.seas.harvard.edu/~chong/pubs/pldi13-elm.pdf).

# Introduction

-   Functional reactive programming (FRP) integrates pure functional programming with time-varying values (signals), useful for GUIs.
-   FRP allows modeling of complex, time-dependent relationships in a declarative style.
-   Previous FRP languages faced inefficiencies, including unnecessary recomputation and global delays.
-   Most FRP languages treat signals as continuously changing, leading to excessive sampling and recomputation.
-   Elm, an FRP language, treats all signals as discrete, reducing unnecessary recomputation by detecting unchanged signals.
-   In Elm, signals change only with discrete events (like user inputs), necessitating program recomputation.
-   Traditional FRP systems process events synchronously, causing delays if event processing is time-consuming.
-   Synchronous processing in GUIs can lead to unresponsiveness during long computations.
-   Elm introduces an abstraction for specifying asynchronous computations within FRP.
-   This feature in Elm allows concurrent execution of long-running computations and other events, maintaining GUI responsiveness.
-   Elm's approach to asynchronous computation in FRP is novel and is formalized in its language semantics.
-   Elm restricts signal use for efficient implementation, similar to previous efficient FRP systems.

# Core Language

-   The core language of Elm, termed "FElm" (Featherweight Elm), is introduced, outlining Elm's key abstractions.
-   FElm is a simply-typed functional language with a set of reactive primitives.
-   It differentiates between simple types (like unit and int, and functions from simple types to simple types) and signal types (like `Signal[T]` and functions producing signal types).
-   Signals are conceptualized as streams of values, and input signals are required to have a default value.
-   Signal transformations and combinations are achieved using `lift_n` primitives, which apply functions to the current values of signals.
-   The `foldp` primitive performs computations on both current and previous signal values, acting like a fold operation on a signal.
-   An example of `foldp` is counting key presses using a signal that indicates the latest key pressed.
-   FElm's type system prohibits signals of signals to avoid potential computational inefficiencies and inconsistencies.
-   FElm programs evaluate in two stages: functional constructs are first evaluated, resulting in an intermediate term showing signal connections; then signals are evaluated in a push-based manner as new input values arrive.
-   Signal terms are represented as directed acyclic graphs, where nodes represent source nodes, `liftn` terms, and `foldp` terms.
-   An event occurs when a source node produces a new value, with a global event dispatcher ensuring total order and non-simultaneity of events.
- Whenever an event occurs, all source nodes are notified by the global event dispatcher: the one source node relevant to the event produces the new value, and all other source nodes generate a special value noChange v, where v is the current (unchanged) value of the signal.
-   Nodes perform computations on signal values, with synchronous conceptual computation but pipelined execution for efficiency.
-   The `async` primitive allows for specifying asynchronous computations, enabling separation of long-running computations and maintaining GUI responsiveness. An `async` node creates a new source node. When an `async` node produces a value, it is treated like an event from the external environment associated from that new source node.
-   `async` effectively divides the synchronous graph into a primary subgraph and multiple secondary subgraphs, maintaining event order within each subgraph but not globally, enhancing responsiveness without strict global event ordering.

# Building GUIs with Elm

-   Elm encourages separation between reactive code and GUI layout code, using a purely functional and declarative approach for graphical layout.
-   Elm supports various base values, including strings, numbers, time, tuples, and graphical values like Elements and Forms.
-   Libraries in Elm offer data structures like options, lists, sets, and dictionaries.
-   Elm provides input support from devices like mouse, keyboard, touch, and also handles window attributes and network communication via HTTP.
-   It supports JSON, Markdown for text creation, let-polymorphism, recursive simple types, type inference, extensible records, and a module system.
-   Elm has two major graphical primitives: elements and forms.
    -   Elements are rectangles that can contain text, images, or videos.
    -   Forms allow for non-rectangular shapes and text, including arbitrary 2D shapes with texture and color enhancements.
-   Reactive GUIs in Elm interact with user input and environmental events using primitive signals.
-   Elm's signal identifiers include Mouse.position, Mouse.clicks, Window.dimensions, Time.every, Time.fps, Touch.touches, Touch.taps, Keyboard.keysDown, Keyboard.arrows, and Keyboard.shift.
-   Input components like text boxes, buttons, and sliders are represented as pairs of signals: an element for the graphical component and a value for the input.
-   The `Input.text` function in Elm allows for the creation of text input components, returning a pair of signals for the graphical input field and the current user input.

# Other Links

- [Understanding the Automaton](https://package.elm-lang.org/packages/evancz/automaton/latest/Automaton)
- Time-Travel Debugging (when Elm was still based on FRP)
    - [Interactive Programming](https://web.archive.org/web/20160206080252/http://elm-lang.org/blog/interactive-programming)
    - [Elm’s Time Traveling Debugger](https://web.archive.org/web/20160503091931/http://debug.elm-lang.org/)
    - https://web.archive.org/web/20160504183927/http://elm-lang.org/
    - [Bret Victor style reactive debugging ‒ Laszlo Pandy](https://www.youtube.com/watch?v=lK0vph1zR8s)
    - [Bret Victor - Inventing on Principle](https://www.youtube.com/watch?v=PUv66718DII)
- [Reason for a farewell to FRP: learning curve as Elm went mainstream](https://www.youtube.com/live/vHI7XlgmYCg?si=wWyHsFa6P6FHOZbw&t=2324)
