---
id: version-next-Channel
sidebar_label: Channel
title: Channel
hide_title: true
original_id: Channel
---
# `Channel`

```ts
interface Channel {
  // properties
  id: string;
  type: string;
  displayMetadata?: DisplayMetadata;

  // methods
  broadcast(context: Context): void;
  getCurrentContext(contextType?: string): Promise<Context|null>;
  addContextListener(handler: ContextHandler): Listener;
  addContextListener(contextType: string, handler: ContextHandler): Listener;
}
```

Represents a context channel that applications can join to share context data. 

A channel can be either a well-known "system" channel (retrieved with [`getSystemChannels`](DesktopAgent#getsystemchannels)) or a custom "app" channel (obtained through [`getOrCreateChannel`](DesktopAgent#getorcreatechannel)).

Channels each have a unique identifier, some display metadata and operations for broadcasting context to other applications, or receiving context from other applications.

#### See also

* [`Context`](Context)
* [`DesktopAgent.getSystemChannels`](DesktopAgent#getsystemchannels)
* [`DesktopAgent.getOrCreateChannel`](DesktopAgent#getorcreatechannel)
* [`DesktopAgent.joinChannel`](DesktopAgent#joinchannel)

## Properties

### `id`

```ts
public readonly id: string;
```

Uniquely identifies the channel. It is either assigned by the desktop agent (system channel) or defined by an application (app channel).

### `type`

```ts
public readonly type: string;
```

Can be _system_ or _app_.

### `displayMetadata`

```ts
public readonly displayMetadata?: DisplayMetadata;
```

DisplayMetadata can be used to provide display hints for channels intended to be visualized and selectable by end users.

#### See also
* [`DisplayMetadata`](DisplayMetadata)

## Methods


### `addContextListener`

```ts
public addContextListener(handler: ContextHandler): Listener;
```

Adds a listener for incoming contexts whenever a broadcast happens on the channel.

```ts
public addContextListener(contextType: string, handler: ContextHandler): Listener;
```

Adds a listener for incoming contexts of the specified _context type_ whenever a broadcast happens on this channel.

#### Examples

Add a listener for any context that is broadcast on the channel:

```ts
const listener = channel.addContextListener(context => {
    if (context.type === 'fdc3.contact') {
        // handle the contact
    } else if (context.type === 'fdc3.instrument') => {
        // handle the instrument
    }
});

// later
listener.unsubscribe();
```

Adding listeners for specific types of context that is broadcast on the channel:

```ts
const contactListener = channel.addContextListener('fdc3.contact', contact => {
    // handle the contact
});

const instrumentListener = channel.addContextListener('fdc3.instrument', instrument => {
    // handle the instrument
});

// later
contactListener.unsubscribe();
instrumentListener.unsubscribe();
```

#### See also
* [`Listener`](Listener)
* [`ContextHandler`](ContextHandler)
* [`broadcast`](#broadcast)
* [`getCurrentContext`](#addcontextlistener)

### `broadcast`

```typescript
public broadcast(context: Context): void;
```

Broadcasts a context on the channel. This function can be used without first joining the channel, allowing applications to broadcast on channels that they aren't a member of.

If the broadcast is denied by the channel or the channel is not available, the method will return an `Error` with a string from the [`ChannelError`](ChannelError) enumeration.

Channel implementations should ensure that context messages broadcast by an application on a channel should not be delivered back to that same application if they are joined to the channel.

#### Example

```javascript
const instrument = {
    type: 'fdc3.instrument',
    id: {
        ticker: 'AAPL'
    }
};

try {
    channel.broadcast(instrument);
} catch (err: ChannelError) {
    // handler errror
}
```

#### See also
* [`ChannelError`](ChannelError)
* [`getCurrentContext`](#getcurrentcontext)
* [`addContextListener`](#addcontextlistener)

### `getCurrentContext`

```ts
public getCurrentContext(contextType?: string): Promise<Context|null>;
```

When a _context type_ is provided, the most recent context matching the type will be returned, or `null` if no matching context is found.

If no _context type_ is provided, the most recent context that was broadcast on the channel - regardless of type - will be returned.  If no context has been set on the channel, it will return `null`.

It is up to the specific Desktop Agent implementation whether and how recent contexts are stored. For example, an implementation could store context history for a channel in a single array and search through the array for the last context matching a provided type, or context could be maintained as a dictionary keyed by context types. An implementation could also choose not to support context history, in which case this method will return `null` for any context type not matching the type of the most recent context.


If getting the current context fails, the promise will return an `Error` with a string from the [`ChannelError`](ChannelError) enumeration.

#### Examples

Without specifying a context type:

```ts
try {
    const context = await channel.getCurrentContext();
} catch (err: ChannelError) {
    // handler errror
}
```

Specifying a context type:

```ts
try {
    const contact = await channel.getCurrentContext('fdc3.contact');
} catch (err: ChannelError) {
    // handler errror
}
```

#### See also
* [`ChannelError`](ChannelError)
* [`broadcast`](#broadcast)
* [`addContextListener`](#addcontextlistener)

