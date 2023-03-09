---
sidebar_label: ContextHandler
title: ContextHandler
hide_title: true
original_id: ContextHandler
---
# `ContextHandler`

```typescript
type ContextHandler = (context: Context) => void;
```

Describes a callback that handles a context event.

Used when attaching listeners for context broadcasts and raised intents.

#### See also
* [`Context`](Context)
* [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
* [`DesktopAgent.addContextListener`](DesktopAgent#addcontextlistener)
* [`Channel.addContextListener`](Channel#addcontextlistener)