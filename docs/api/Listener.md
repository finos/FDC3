---
id: Listener
sidebar_label: Listener
title: Listener
hide_title: true
---
# `Listener`
A Listener object is returned when an application subscribes to intents or context broadcasts via the [`addIntentListener`](addIntentListener) or [`addContextListener`](addContextListener) methods.
The `unsubscribe` method on the listener object allows the application to cancel the subscription.
```
interface Listener {
  /**
   * Unsubscribe the listener object.
   */
  unsubscribe();
}
```
## See also
* [`addIntentListener`](addIntentListener)
* [`addContextListener`](addContextListener)