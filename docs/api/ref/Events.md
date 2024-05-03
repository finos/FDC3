---
title: Events
---

FDC3 API operations may trigger non-context and non-intent events.

## `EventHandler`

```ts
type EventHandler = (event: FDC3Event) => void;
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
````

Type representing the format of event objects that may be received via the FDC3 API's `addEventListener` function. Will always include both `type` and `details`, which describe type of the event and any additional details respectively. 

**See also:**
- [`DesktopAgent.addEventListener`](DesktopAgent#addEventListener)
- [`FDC3EventType`](#fdc3eventtype)


### `FDC3ChannelChangedEvent`
````ts
interface FDC3ChannelChangedEvent extends FDC3Event {
  readonly type: FDC3EventType.USER_CHANNEL_CHANGED;
  readonly details: {
    currentChannelId: string | null
  };
}
````

Type representing the format of event USER_CHANNEL_CHANGED objects. Will always include both `type` USER_CHANNEL_CHANGED and `details`, with `currentChannelId` specified as `string` or `null`.