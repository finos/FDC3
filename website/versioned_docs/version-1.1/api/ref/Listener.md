---
sidebar_label: Listener
title: Listener
hide_title: true
original_id: Listener
---
# `Listener`

```typescript
interface Listener {
  unsubscribe(): void;
}
```

A Listener object is returned when an application subscribes to intents or context broadcasts via the [`addIntentListener`](DesktopAgent#addintentlistener) or [`addContextListener`](DesktopAgent#addcontextlistener) methods on the [DesktopAgent](DesktopAgent) object.

## Methods

### `unsubscribe`

```ts
unsubscribe(): void;
```

Allows an application to unsubscribe from listening to intents or context broadcasts.

#### See also

* [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
* [`DesktopAgent.addContextListener`](DesktopAgent#addcontextlistener)
* [`Channel.addContextListener`](Channel#addcontextlistener)
* [`ContextHandler`](ContextHandler)
