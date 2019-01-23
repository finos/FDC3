---
id: Listener
sidebar_label: Listener
title: Listener
hide_title: true
---
# `Listener`

```typescript
interface Listener {
  /**
   * Unsubscribe the listener object.
   */
  unsubscribe();
}
```

A Listener object is returned when an application subscribes to intents or context broadcasts via the [`addIntentListener`](DesktopAgent#addintentlistener) or [`addContextListener`](DesktopAgent#addcontextlistener) methods on the [DesktopAgent](DesktopAgent) object.
The `unsubscribe` method on the listener object allows the application to cancel the subscription.

## See also
* [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
* [`DesktopAgent.addContextListener`](DesktopAgent#addcontextlistener)