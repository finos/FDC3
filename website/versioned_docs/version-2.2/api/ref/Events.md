---
title: Events
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

In addition to intent and context events, the FDC3 API and PrivateChannel API may be used to listen for other types of events via their `addEventListener()` functions.

## `ApiEvent`

Type defining a basic event object that may be emitted by an FDC3 API interface such as DesktopAgent or PrivateChannel. There are more specific event types defined for each interface.


<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface ApiEvent {
  readonly type: string;
  readonly details: any;
}
```
</TabItem>
<TabItem value="dotnet" label=".NET">

```
Not implemented, as ApiEvent and Fdc3Event definitions are the same, given .NET can not restrict on a string enum. Use IFdc3Event instead
```

</TabItem>
</Tabs>

**See also:**

- [`FDC3Event`](#fdc3event)
- [`PrivateChannelEvent`](#privatechannelevent)

## `EventHandler`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
type EventHandler = (event: ApiEvent) => void;
```
</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
public delegate void Fdc3EventHandler(IFdc3Event fdc3Event);
```

</TabItem>
</Tabs>

Describes a callback that handles non-context and non-intent events. Provides the details of the event.

Used when attaching listeners to events.

**See also:**

- [`DesktopAgent.addEventListener`](DesktopAgent#addeventlistener)
- [`PrivateChannel.addEventListener`](PrivateChannel#addeventlistener)
- [`ApiEvent`](#apievent)

## `FDC3EventTypes`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
type FDC3EventTypes = "userChannelChanged";
```
</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
public static class Fdc3EventType
{
    public const string UserChannelChanged = "userChannelChanged";
}
```

</TabItem>
</Tabs>

Type defining valid type strings for DesktopAgent interface events.

**See also:**

- [`DesktopAgent.addEventListener`](DesktopAgent#addeventlistener)

## `FDC3Event`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface FDC3Event extends ApiEvent{
  readonly type: FDC3EventTypes;
  readonly details: any;
}
```
</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
public interface IFdc3Event
{
    public string Type { get; }
    public object? Details { get; }
}

public class Fdc3Event : IFdc3Event
{
    public string Type { get; }
    public object? Details { get; }

    public Fdc3Event(string type, object? details = null)
    {
        this.Type = type ?? throw new ArgumentNullException(nameof(type));
        this.Details = details;
    }
}
```

</TabItem>
</Tabs>

Type representing the format of event objects that may be received via the FDC3 API's `addEventListener` function.

Events will always include both `type` and `details` properties, which describe the type of the event and any additional details respectively.

**See also:**

- [`DesktopAgent.addEventListener`](DesktopAgent#addeventlistener)
- [`FDC3EventTypes`](#fdc3eventtypes)

### `FDC3ChannelChangedEvent`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface FDC3ChannelChangedEvent extends FDC3Event {
  readonly type: "userChannelChanged";
  readonly details: {
    currentChannelId: string | null
  };
}
```
</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
public interface IFdc3ChannelChangedEventDetails
{
    string? CurrentChannelId { get; }
}
public class Fdc3ChannelChangedEventDetails : IFdc3ChannelChangedEventDetails
{
    public string? CurrentChannelId { get; }

    public Fdc3ChannelChangedEventDetails(string? channelId)
    {
        this.CurrentChannelId = channelId;
    }
}

public class Fdc3ChannelChangedEvent : Fdc3Event
{
    public Fdc3ChannelChangedEvent(string? channelId)
        : base(Fdc3EventType.UserChannelChanged, new Fdc3ChannelChangedEventDetails(channelId))
    {
    }
}
```

</TabItem>
</Tabs>


Type representing the format of `userChannelChanged`  events.

The identity of the channel joined is provided as `details.currentChannelId`, which will be `null` if the app is no longer joined to any channel.

## `PrivateChannelEventTypes`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
type PrivateChannelEventTypes = "addContextListener" | "unsubscribe" | "disconnect";
```
</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
public static class Fdc3PrivateChannelEventType
{
    public const string AddContextListener = "addContextListener";
    public const string Unsubscribe = "unsubscribe";
    public const string Disconnect = "disconnect";
}
```

</TabItem>
</Tabs>

Type defining valid type strings for Private Channel events.

**See also:**

- [`PrivateChannel.addEventListener`](PrivateChannel#addeventlistener)

## `PrivateChannelEvent`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface PrivateChannelEvent extends ApiEvent {
  readonly type: PrivateChannelEventTypes;
  readonly details: any;
}
```
</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
public interface IFdc3PrivateChannelEventDetails
{
    string? ContextType { get; }
}
public class Fdc3PrivateChannelEventDetails : IFdc3PrivateChannelEventDetails
{
    public string? ContextType { get; }

    public Fdc3PrivateChannelEventDetails(string? contextType)
    {
        this.ContextType = contextType;
    }
}
```

</TabItem>
</Tabs>


Type defining the format of event objects that may be received via a PrivateChannel's `addEventListener` function.

**See also:**

- [`PrivateChannel.addEventListener`](PrivateChannel#addeventlistener)
- [`PrivateChannelEventTypes`](#privatechanneleventtypes)

### `PrivateChannelAddContextListenerEvent`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface PrivateChannelAddContextListenerEvent extends PrivateChannelEvent {
  readonly type: "addContextListener";
  readonly details: {
    contextType: string | null
  };
}
```
</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
public class Fdc3PrivateChannelAddContextListenerEvent : Fdc3Event
{
    public Fdc3PrivateChannelAddContextListenerEvent(string? contextType)
        : base(Fdc3PrivateChannelEventType.AddContextListener, new Fdc3PrivateChannelEventDetails(contextType))
  {
  }
}
```

</TabItem>
</Tabs>

Type defining the format of events representing a context listener being added to the channel (`addContextListener`). Desktop Agents MUST fire this event for each invocation of `addContextListener` on the channel, including those that occurred before this handler was registered (to prevent race conditions).

The context type of the listener added is provided as `details.contextType`, which will be `null` if all event types are being listened to.

### `PrivateChannelUnsubscribeEvent`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface PrivateChannelUnsubscribeEvent extends PrivateChannelEvent {
  readonly type: "unsubscribe";
  readonly details: {
    contextType: string | null
  };
}
```
</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
public class Fdc3PrivateChannelUnsubscribeListenerEvent : Fdc3Event
{
    public Fdc3PrivateChannelUnsubscribeListenerEvent(string? contextType)
            : base(Fdc3PrivateChannelEventType.Unsubscribe, new Fdc3PrivateChannelEventDetails(contextType))
    {
    }
}
```

</TabItem>
</Tabs>

Type defining the format of events representing a context listener removed from the channel (`Listener.unsubscribe()`). Desktop Agents MUST call this when `disconnect()` is called by the other party, for each listener that they had added.

The context type of the  listener removed is provided as `details.contextType`, which will be `null` if all event types were being listened to.

### `PrivateChannelDisconnectEvent`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
export interface PrivateChannelDisconnectEvent extends PrivateChannelEvent {
  readonly type: "disconnect";
  readonly details: null | undefined;
}
```
</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
public class Fdc3PrivateChanneDisconnectEvent : Fdc3Event
{
    public Fdc3PrivateChanneDisconnectEvent()
        : base(Fdc3PrivateChannelEventType.Disconnect)
    {
    }
}
```

</TabItem>
</Tabs>

Type defining the format of events representing a remote app being terminated or is otherwise disconnecting from the PrivateChannel. This event is fired in addition to unsubscribe events that will also be fired for any context listeners the disconnecting app had added.

No details are provided.
