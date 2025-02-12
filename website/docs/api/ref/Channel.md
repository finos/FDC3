---
id: Channel
sidebar_label: Channel
title: Channel
hide_title: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `Channel`

Represents a context channel that applications can join to share context data and provides functions for interacting with it.

A channel can be either a ["User" channel](../spec#joining-user-channels) (retrieved with [`getUserChannels`](DesktopAgent#getuserchannels)), a custom ["App" channel](../spec#app-channels) (obtained through [`getOrCreateChannel`](DesktopAgent#getorcreatechannel)) or a ["Private" channel](../spec#private-channels) (obtained via an intent result).

:::note

There are differences in behavior when you interact with a User channel via the Desktop Agent interface and the Channel interface. Specifically, when 'joining' a User channel or adding a context listener when already joined to a channel via the `DesktopAgent` interface, existing context (matching the type of the context listener) on the channel is received by the context listener immediately. Whereas, when add a context listener via the Channel interface, context is not received automatically, but may be retrieved manually via the [`getCurrentContext()`](#getcurrentcontext) function.

:::

Channels each have a unique identifier, some display metadata and operations for broadcasting context to other applications, or receiving context from other applications.

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface Channel {
  // properties
  id: string;
  type: "user" | "app" | "private";
  displayMetadata?: DisplayMetadata;

  // functions
  broadcast(context: Context): Promise<void>;
  getCurrentContext(contextType?: string): Promise<Context|null>;
  addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener>;
  
  //deprecated functions
  /**
   * @deprecated Use `addContextListener(null, handler)` instead of `addContextListener(handler)`
   */
  addContextListener(handler: ContextHandler): Promise<Listener>;
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IChannel: IIntentResult
{
    string Id { get; }
    ChannelType Type { get; }
    IDisplayMetadata? DisplayMetadata { get; }
    Task Broadcast(IContext context);
    Task<IContext?> GetCurrentContext(string? contextType);
    Task<IListener> AddContextListener<T>(string? contextType, ContextHandler<T> handler) where T : IContext;
}
```

</TabItem>
</Tabs>

**See also:**

- [`Context`](Types#context)
- [`Listener`](Types#listener)
- [`DesktopAgent.getUserChannels`](DesktopAgent#getuserchannels)
- [`DesktopAgent.getOrCreateChannel`](DesktopAgent#getorcreatechannel)
- [`DesktopAgent.joinUserChannel`](DesktopAgent#joinuserchannel)

## Properties

### `id`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
public readonly id: string;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
string Id { get; }
```

</TabItem>
</Tabs>

Uniquely identifies the channel. It is either assigned by the desktop agent (User Channel) or defined by an application (App Channel).

### `type`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
public readonly type: "user" | "app" | "private";
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
ChannelType Type { get; }

public enum ChannelType
{
    User = 1,
    App = 2,
    Private = 3
}
```

</TabItem>
</Tabs>

Can be _user_,  _app_ or _private_.

### `displayMetadata`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
public readonly displayMetadata?: DisplayMetadata;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
IDisplayMetadata? DisplayMetadata { get; }
```

</TabItem>
</Tabs>

DisplayMetadata can be used to provide display hints for User Channels intended to be visualized and selectable by end users.

**See also:**

- [`DisplayMetadata`](Metadata#displaymetadata)

## Functions

### `addContextListener`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
public addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IListener> AddContextListener<T>(string? contextType, ContextHandler<T> handler) where T : IContext;
```

</TabItem>
</Tabs>

Adds a listener for incoming contexts of the specified _context type_ whenever a broadcast happens on this channel.

If, when this function is called, the channel already contains context that would be passed to the listener it is NOT called or passed this context automatically (this behavior differs from that of the [`fdc3.addContextListener`](DesktopAgent#addcontextlistener) function). Apps wishing to access to the current context of the channel should instead call the [`getCurrentContext(contextType)`](#getcurrentcontext) function.

Optional metadata about each context message received, including the app that originated the message, SHOULD be provided by the desktop agent implementation.

**Examples:**

Add a listener for any context that is broadcast on the channel:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
const listener = await channel.addContextListener(null, context => {
    if (context.type === 'fdc3.contact') {
        // handle the contact
    } else if (context.type === 'fdc3.instrument') => {
        // handle the instrument
    }
});

// later
listener.unsubscribe();
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
IChannel channel;
var listener = await channel.AddContextListener<IContext>(null, (context, metadata) => {
    if (context.Type == ContextTypes.Contact)
    {
        // handle the contact
    }
    else if (context.Type == ContextTypes.Instrument) {
        // handle the instrument
    }
});

// later
listener.Unsubscribe();
```

</TabItem>
</Tabs>

Adding listeners for specific types of context that is broadcast on the channel:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
const contactListener = await channel.addContextListener('fdc3.contact', contact => {
    // handle the contact
});

const instrumentListener = await channel.addContextListener('fdc3.instrument', instrument => {
    // handle the instrument
});

// later
contactListener.unsubscribe();
instrumentListener.unsubscribe();
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var contactListener = await channel.AddContextListener<Contact>("fdc3.contact", (contact, metadata) => {
    // handle the contact
});

var instrumentListener = await channel.AddContextListener<Instrument>("fdc3.instrument", (instrument, metadata) => {
    // handle the instrument
});

// later
contactListener.unsubscribe();
instrumentListener.unsubscribe();
```

</TabItem>
</Tabs>

**See also:**

- [`Listener`](Types#listener)
- [`ContextHandler`](Types#contexthandler)
- [`broadcast`](#broadcast)
- [`getCurrentContext`](#getcurrentcontext)

### `broadcast`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
public broadcast(context: Context): Promise<void>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task Broadcast(IContext context);
```

</TabItem>
</Tabs>

Broadcasts a context on the channel. This function can be used without first joining the channel, allowing applications to broadcast on both App Channels and User Channels that they aren't a member of.

If the broadcast is denied by the channel or the channel is not available, the promise will be rejected with an `Error` with a `message` string from the [`ChannelError`](Errors#channelerror) enumeration.

Channel implementations should ensure that context messages broadcast by an application on a channel should not be delivered back to that same application if they are joined to the channel.

If you are working with complex context types composed of other simpler types (as recommended by the [FDC3 Context Data specification](../../context/spec#assumptions)) then you should broadcast each individual type (starting with the simpler types, followed by the complex type) that you want other apps to be able to respond to. Doing so allows applications to filter the context types they receive by adding listeners for specific context types.

If an application attempts to broadcast an invalid context argument the Promise returned by this function should reject with the [`ChannelError.MalformedContext` error](Errors#channelerror).

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
const instrument = {
    type: 'fdc3.instrument',
    id: {
        ticker: 'AAPL'
    }
};

try {
    channel.broadcast(instrument);
} catch (err: ChannelError) {
    // handle error
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var instrument = new Instrument(new InstrumentID() { Ticker = "AAPL" });

try
{
    channel.Broadcast(instrument);
}
catch (Exception ex)
{
    // handle error
}
```

</TabItem>
</Tabs>

**See also:**

- [`ChannelError`](Errors#channelerror)
- [`getCurrentContext`](#getcurrentcontext)
- [`addContextListener`](#addcontextlistener)

### `getCurrentContext`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
public getCurrentContext(contextType?: string): Promise<Context|null>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IContext?> GetCurrentContext(string? contextType);
```

</TabItem>
</Tabs>

When a _context type_ is provided, the most recent context matching the type will be returned, or `null` if no matching context is found.

If no _context type_ is provided, the most recent context that was broadcast on the channel - regardless of type - will be returned.  If no context has been set on the channel, it will return `null`.

It is up to the specific Desktop Agent implementation whether and how recent contexts are stored. For example, an implementation could store context history for a channel in a single array and search through the array for the last context matching a provided type, or context could be maintained as a dictionary keyed by context types. An implementation could also choose not to support context history, in which case this method will return `null` for any context type not matching the type of the most recent context.

If getting the current context fails, the promise will be rejected with an `Error` with a `message` string from the [`ChannelError`](Errors#channelerror) enumeration.

**Examples:**

Without specifying a context type:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
try {
    const context = await channel.getCurrentContext();
} catch (err: ChannelError) {
    // handle error
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
try
{
    var context = await channel.GetCurrentContext();
}
catch (Exception ex)
{
    // handle error
}
```

</TabItem>
</Tabs>

Specifying a context type:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
try {
    const contact = await channel.getCurrentContext('fdc3.contact');
} catch (err: ChannelError) {
    // handler error
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
try
{
    var context = await channel.GetCurrentContext("fdc3.contact");
}
catch (Exception ex)
{
    // handle error
}
```

</TabItem>
</Tabs>

**See also:**

- [`ChannelError`](Errors#channelerror)
- [`broadcast`](#broadcast)
- [`addContextListener`](#addcontextlistener)

## Deprecated Functions

### `addContextListener` (deprecated)

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
/**
 * @deprecated Use `addContextListener(null, handler)` instead of `addContextListener(handler)`
 */
public addContextListener(handler: ContextHandler): Promise<Listener>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```
Not implemented
```

</TabItem>

</Tabs>

Adds a listener for incoming contexts whenever a broadcast happens on the channel.

**See also:**

- [`addContextListener`](#addcontextlistener)
