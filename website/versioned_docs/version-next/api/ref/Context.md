---
id: version-next-Context
sidebar_label: Context
title: Context
hide_title: true
original_id: Context
---
# `Context`

```typescript
type Context = object;
```

The base object that all contexts should extend.

The API specification allows this to be any object, but typically this is supposed to be a context data object adhering to the [Context Data Specification](../context-spec).

This means that it must at least have a `type` property that indicates what type of data it represents, e.g. `'fdc3.contact'`.

The `type` property of context objects is important for certain FDC3 operations, like [`Channel.getCurrentContext`](Channel#getCurrentContext) and [`DesktopAgent.addContextListener`](DesktopAgent#addContextListener), which allows you to filter contexts by their type.

#### See also
* [`ContextHandler`](ContextHandler)
* [`DesktopAgent.open`](DesktopAgent#open)
* [`DesktopAgent.broadcast`](DesktopAgent#broadcast)
* [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
* [`DesktopAgent.addContextListener`](DesktopAgent#addcontextlistener)
* [`DesktopAgent.findIntent`](DesktopAgent#findintent)
* [`DesktopAgent.findIntentsByContext`](DesktopAgent#findintentsbycontext)
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
* [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseIntentForContext)
* [`Channel.broadcast`](Channel#broadcast)
* [`Channel.getCurrentContext`](Cahnnel#getCurrentContext)
* [`Channel.addContextListener`](Cahnnel#addContextListener)
