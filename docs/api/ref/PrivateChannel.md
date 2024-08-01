---
id: PrivateChannel
sidebar_label: PrivateChannel
title: PrivateChannel
hide_title: true
---
# `PrivateChannel`

Object representing a private context channel, which is intended to support secure communication between applications, and extends the `Channel` interface with event handlers which provide information on the connection state of both parties, ensuring that desktop agents do not need to queue or retain messages that are broadcast before a context listener is added and that applications are able to stop broadcasting messages when the other party has disconnected.

It is intended that Desktop Agent implementations:

- SHOULD restrict external apps from listening or publishing on this channel.
- MUST prevent `PrivateChannels` from being retrieved via `fdc3.getOrCreateChannel`.
- MUST provide the `id` value for the channel as required by the `Channel` interface.

```ts
interface  PrivateChannel extends Channel {
  // functions
  addEventListener(type: PrivateChannelEventType  | null, handler: EventHandler): Promise<Listener>;
  disconnect(): Promise<void>;

  //deprecated functions
  onAddContextListener(handler: (contextType?: string) => void): Listener;
  onUnsubscribe(handler: (contextType?: string) => void): Listener;
  onDisconnect(handler: () => void): Listener;
}
```

**See also:**

- [`Channel`](Channel)
- [`Listener`](Types#listener)
- [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
- [`DesktopAgent.createPrivateChannel`](DesktopAgent#createPrivateChannel)
- [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)

## Examples

### 'Server-side' example

The intent app establishes and returns a `PrivateChannel` to the client (who is awaiting `getResult()`). When the client calls `addContextlistener()` on that channel, the intent app receives notice via the handler added with `addEventListener()` and knows that the client is ready to start receiving quotes.

The Desktop Agent knows that a channel is being returned by inspecting the object returned from the handler (e.g. check constructor or look for private member).

Although this interaction occurs entirely in frontend code, we refer to it as the 'server-side' interaction as it receives a request and initiates a stream of responses.

```ts
fdc3.addIntentListener("QuoteStream", async (context) => {
    const channel: PrivateChannel = await fdc3.createPrivateChannel();
    const symbol = context.id.ticker;

    // This gets called when the remote side adds a context listener
    const addContextListener = channel.addEventListener("addContextListener",
        (event: PrivateChannelAddContextListenerEvent) => {
            console.log(`remote side added a listener for ${event.contextType}`);
            // broadcast price quotes as they come in from our quote feed
            feed.onQuote(symbol, (price) => {
                channel.broadcast({ type: "price", price});
            });
        }
    );

    // This gets called when the remote side calls Listener.unsubscribe()
    const unsubscribeListener = channel.addEventListener("unsubscribe",
        (event: PrivateChannelUnsubscribeEvent) => {
            console.log(`remote side unsubscribed a listener for ${event.contextType}`);
            feed.stop(symbol);
        }
    );

    // This gets called if the remote side closes
    const disconnectListener = channel.addEventListener("disconnect", 
        () => {
            console.log(`remote side disconnected`);
            feed.stop(symbol);
        }
    );

    return channel;
});
```

### 'Client-side' example

The 'client' application retrieves a `Channel` by raising an intent with context and awaiting the result. It adds a `ContextListener` so that it can receive messages from it. If a `PrivateChannel` was returned this may in turn trigger a handler added on the 'server-side' with `onAddContextListener()` and start the stream. A listener may also be to clear up if the 'server-side' disconnects from the stream.

Although this interaction occurs entirely in frontend code, we refer to it as the 'client-side' interaction as it requests and receives a stream of responses.

```ts
try {
    const resolution3 = await fdc3.raiseIntent("QuoteStream", { type: "fdc3.instrument", id : { symbol: "AAPL" } });
    try {
        const result = await resolution3.getResult();
        //check that we got a result and that it's a channel
        if (result && result.addContextListener) {
            const listener = result.addContextListener("price", (quote) => console.log(quote));
                //if it's a PrivateChannel
                if (result.type == "private") {
                    result.addEventListener("disconnect", () => {
                        console.warn("Quote feed went down");
                    });

                   // Sometime later...
                   await listener.unsubscribe();
                }
        } else {
            console.warn(`${resolution3.source} did not return a channel`);
        }
    } catch(channelError) {
        console.log(`Error: ${resolution3.source} returned an error: ${channelError}`);
    }
} catch (resolverError) {
    console.error(`Error: Intent was not resolved: ${resolverError}`);
}
```

## Functions

### `addEventListener`

```ts
addEventListener(type: PrivateChannelEventType  | null, handler: EventHandler): Promise<Listener>;
```

Register a handler for events from the PrivateChannel. Whenever the handler function is called it will be passed an event object with details related to the event.

```ts
// any event type
const listener: Listener = await myPrivateChannel.addEventListener(null, 
    (event: PrivateChannelEvent) => {
        console.log(`Received event ${event.type}\n\tDetails: ${event.details}`);
    }
);

// listener for a specific event type 
const channelChangedListener: Listener = await myPrivateChannel.addEventListener(
    PrivateChannelEventType.ADD_CONTEXT_LISTENER, 
    (event: PrivateChannelAddContextListenerEvent) => { ... }
);
```

**See also:**

- [`PrivateChannelEventType`](./Events#privatechanneleventtype)
- [`EventHandler`](./Events#eventhandler)

### `disconnect`

```ts
disconnect(): Promise<void>;
```

May be called to indicate that a participant will no longer interact with this channel.

After this function has been called, Desktop Agents SHOULD prevent apps from broadcasting on this channel and MUST automatically call Listener.unsubscribe() for each listener that they've added (causing any event handler for `unsubscribe` events added by the other party to be called) before triggering any handlers for `disconnect` events added by the other party.

**See also:**

- [`Listener`](Types#listener)

## Deprecated Functions

### `onAddContextListener`

```ts
onAddContextListener(handler: (contextType?: string) => void): Listener;
```

Deprecated in favour of the async `addEventListener("addContextListener", handler)` function.

Adds a listener that will be called each time that the remote app invokes addContextListener on this channel.

### `onUnsubscribe`

```ts
onUnsubscribe(handler: (contextType?: string) => void): Listener;
```

Deprecated in favour of the async `addEventListener("unsubscribe", handler)` function.

Adds a listener that will be called whenever the remote app invokes `Listener.unsubscribe()` on a context listener that it previously added.

### `onDisconnect`

```ts
onDisconnect(handler: () => void): Listener;
```

Deprecated in favour of the aysnc `addEventListener("disconnect", handler)` function.

Adds a listener that will be called when the remote app terminates, for example when its window is closed or because disconnect was called.
