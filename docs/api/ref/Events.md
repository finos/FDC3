---
title: Events
---

In addition to intent and context events, the FDC3 API and PrivateChannel API may be used to listen for other types of events via their `addEventListener()` functions.

## `EventHandler`

```ts
type EventHandler = (event: FDC3Event | PrivateChannelEvent) => void;
```

Describes a callback that handles non-context and non-intent events. Provides the details of the event.

Used when attaching listeners to events.

**See also:**

- [`DesktopAgent.addEventListener`](DesktopAgent#addEventListener)
- [`FDC3Event`](#fdc3event)

## `FDC3EventType`

```ts
enum FDC3EventType {
  USER_CHANNEL_CHANGED = "USER_CHANNEL_CHANGED"
}
```

Enumeration defining the types of (non-context and non-intent) events that may be received via the FDC3 API's `addEventListener` function.

**See also:**

- [`DesktopAgent.addEventListener`](DesktopAgent#addEventListener)

## `FDC3Event`

```ts
interface FDC3Event {
  readonly type: FDC3EventType;
  readonly details: any;
}
```

Type representing the format of event objects that may be received via the FDC3 API's `addEventListener` function.

Events will always include both `type` and `details` properties, which describe the type of the event and any additional details respectively.

**See also:**

- [`DesktopAgent.addEventListener`](DesktopAgent#addEventListener)
- [`FDC3EventType`](#fdc3eventtype)

### `FDC3ChannelChangedEvent`

```ts
interface FDC3ChannelChangedEvent extends FDC3Event {
  readonly type: FDC3EventType.USER_CHANNEL_CHANGED;
  readonly details: {
    currentChannelId: string | null
  };
}
```

Type representing the format of USER_CHANNEL_CHANGED events.

The identity of the channel joined is provided as `details.currentChannelId`, which will be `null` if the app is no longer joined to any channel.

## `PrivateChannelEventType`

```ts
enum PrivateChannelEventType {
  ADD_CONTEXT_LISTENER = "addContextListener",
  UNSUBSCRIBE = "unsubscribe",
  DISCONNECT = "disconnect"
}
```

Enumeration defining the types of (non-context and non-intent) events that may be received via a PrivateChannel's `addEventListener` function.

**See also:**

- [`PrivateChannel.addEventListener`](PrivateChannel#addEventListener)

## `PrivateChannelEvent`

```ts
interface PrivateChannelEvent {
  readonly type: PrivateChannelEventType;
  readonly details: any;
}
```

Type defining the format of event objects that may be received via a PrivateChannel's `addEventListener` function.

**See also:**

- [`PrivateChannel.addEventListener`](PrivateChannel#addEventListener)
- [`PrivateChannelEventType`](#privatechanneleventtype)

### `PrivateChannelAddContextListenerEvent`

```ts
interface PrivateChannelAddContextListenerEvent extends PrivateChannelEvent {
  readonly type: PrivateChannelEventType.ADD_CONTEXT_LISTENER;
  readonly details: {
    contextType: string | null
  };
}
```

Type defining the format of events representing a context listener being added to the channel (`addContextListener`). Desktop Agents MUST fire this event for each invocation of `addContextListener` on the channel, including those that occurred before this handler was registered (to prevent race conditions).

The context type of the listener added is provided as `details.contextType`, which will be `null` if all event types are being listened to.

### `PrivateChannelUnsubscribeEvent`

```ts
interface PrivateChannelUnsubscribeEvent extends PrivateChannelEvent {
  readonly type: PrivateChannelEventType.UNSUBSCRIBE;
  readonly details: {
    contextType: string | null
  };
}
```

Type defining the format of events representing a context listener removed from the channel (`Listener.unsubscribe()`). Desktop Agents MUST call this when `disconnect()` is called by the other party, for each listener that they had added.

The context type of the  listener removed is provided as `details.contextType`, which will be `null` if all event types were being listened to.

### `PrivateChannelDisconnectEvent`

```ts
export interface PrivateChannelDisconnectEvent extends PrivateChannelEvent {
  readonly type: PrivateChannelEventType.DISCONNECT;
  readonly details: null | undefined;
}
```

Type defining the format of events representing a remote app being terminated or is otherwise disconnecting from the PrivateChannel. This event is fired in addition to unsubscribe events that will also be fired for any context listeners the disconnecting app had added.

No details are provided.
