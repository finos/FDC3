---
id: PrivateChannel
sidebar_label: PrivateChannel
title: PrivateChannel
hide_title: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `PrivateChannel`

Object representing a private context channel, which is intended to support secure communication between applications, and extends the `Channel` interface with event handlers which provide information on the connection state of both parties, ensuring that desktop agents do not need to queue or retain messages that are broadcast before a context listener is added and that applications are able to stop broadcasting messages when the other party has disconnected.

It is intended that Desktop Agent implementations:

- SHOULD restrict external apps from listening or publishing on this channel.
- MUST prevent `PrivateChannels` from being retrieved via fdc3.getOrCreateChannel.
- MUST provide the `id` value for the channel as required by the `Channel` interface.

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface  PrivateChannel extends Channel {
  // methods
  onAddContextListener(handler: (contextType?: string) => void): Listener;
  onUnsubscribe(handler: (contextType?: string) => void): Listener;
  onDisconnect(handler: () => void): Listener;
  disconnect(): void;
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IPrivateChannel : IChannel, IIntentResult
{
    IListener OnAddContextListener(Action<string?> handler);
    IListener OnUnsubscribe(Action<string?> handler);
    IListener OnDisconnect(Action handler);
    void Disconnect();
}
```

</TabItem>
</Tabs>

**See also:**

- [`Channel`](Channel)
- [`Listener`](Types#listener)
- [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
- [`DesktopAgent.createPrivateChannel`](DesktopAgent#createPrivateChannel)
- [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)

## Examples

### 'Server-side' example

The intent app establishes and returns a `PrivateChannel` to the client (who is awaiting `getResult()`). When the client calls `addContextlistener()` on that channel, the intent app receives notice via the handler added with `onAddContextListener()` and knows that the client is ready to start receiving quotes.

The Desktop Agent knows that a channel is being returned by inspecting the object returned from the handler (e.g. check constructor or look for private member).

Although this interaction occurs entirely in frontend code, we refer to it as the 'server-side' interaction as it receives a request and initiates a stream of responses.

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
fdc3.addIntentListener("QuoteStream", async (context) => {
    const channel: PrivateChannel = await fdc3.createPrivateChannel();
    const symbol = context.id.ticker;

    // This gets called when the remote side adds a context listener
    const addContextListener = channel.onAddContextListener((contextType) => {
        // broadcast price quotes as they come in from our quote feed
        feed.onQuote(symbol, (price) => {
            channel.broadcast({ type: "price", price});
        });
    });

    // This gets called when the remote side calls Listener.unsubscribe()
    const unsubscribeListener = channel.onUnsubscribe((contextType) => {
        feed.stop(symbol);
    });

    // This gets called if the remote side closes
    const disconnectListener = channel.onDisconnect(() => {
        feed.stop(symbol);
    });

    return channel;
});
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
_desktopAgent.AddIntentListener<Instrument>("QuoteStream", async (context, metadata) => {
  var channel = await _desktopAgent.CreatePrivateChannel();
  var symbol = context?.ID?.Ticker;

  // This gets called when the remote side adds a context listener
  var addContextListener = channel.OnAddContextListener((contextType) => {
      // broadcast price quotes as they come in from our quote feed
      _feed.OnQuote(symbol, (price) => {
          channel.Broadcast(new Price(price));
      });
  });

  // This gets called when the remote side calls Listener.unsubscribe()
  var unsubscribeListener = channel.OnUnsubscribe((contextType) => {
      _feed.Stop(symbol);
  });

  // This gets called if the remote side closes
  var disconnectListener = channel.OnDisconnect(() => {
      _feed.stop(symbol);
  });
  
  return channel;
});
```

</TabItem>
</Tabs>

### 'Client-side' example

The 'client' application retrieves a `Channel` by raising an intent with context and awaiting the result. It adds a `ContextListener` so that it can receive messages from it. If a `PrivateChannel` was returned this may in turn trigger a handler added on the 'server-side' with `onAddContextListener()` and start the stream. A listener may also be to clear up if the 'server-side' disconnects from the stream.

Although this interaction occurs entirely in frontend code, we refer to it as the 'client-side' interaction as it requests and receives a stream of responses.

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
try {
    const resolution3 = await fdc3.raiseIntent("QuoteStream", { type: "fdc3.instrument", id : { symbol: "AAPL" } });
    try {
           const result = await resolution3.getResult();
         //check that we got a result and that it's a channel
         if (result && result.addContextListener) {
             const listener = result.addContextListener("price", (quote) => console.log(quote));
               
               //if it's a PrivateChannel
               if (result.onDisconnect) {
                   result.onDisconnect(() => {
                         console.warn("Quote feed went down");
                   });

                   // Sometime later...
                   listener.unsubscribe();
               }
        } else {
            console.warn(`${resolution3.source} did not return a channel`);
        }
    } catch(resultError: ResultError) {
          console.log(`Error: ${resolution3.source} returned an error: ${resultError}`);
    }
} catch (resolverError: ResolveError) {
    console.error(`Error: Intent was not resolved: ${resolverError}`);
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var resolution = await _desktopAgent.RaiseIntent("QuoteStream", new Instrument(new InstrumentID() { Ticker = "AAPL" }));
try
{
    var result = await resolution.GetResult();

    //check that we got a result and that it's a channel
    if (result is IChannel channel)
    {
        var listener = await channel.AddContextListener<IContext>("price", (quote, metadata) => System.Diagnostics.Debug.WriteLine(quote));

        //if it's a PrivateChannel
        if (channel is IPrivateChannel privateChannel)
        {
            privateChannel.OnDisconnect(() => {
                System.Diagnostics.Debug.WriteLine("Quote feed went down");
            });

            // Sometime later...
            listener.Unsubscribe();
        }
    }
    else
    {
        System.Diagnostics.Debug.WriteLine($" {resolution.Source} did not return a channel");
    }
}
catch (Exception ex)
{
    // Handle exception
}
```

</TabItem>
</Tabs>

## Methods

### `onAddContextListener`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
onAddContextListener(handler: (contextType?: string) => void): Listener;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
IListener OnAddContextListener(Action<string?> handler);
```

</TabItem>
</Tabs>
Adds a listener that will be called each time that the remote app invokes addContextListener on this channel.

Desktop Agents MUST call this for each invocation of addContextListener on this channel, including those that occurred before this handler was registered (to prevent race conditions).

**See also:**

- [`Channel.addContextListener`](Channel#addcontextlistener)

### `onUnsubscribe`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
onUnsubscribe(handler: (contextType?: string) => void): Listener;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
IListener OnUnsubscribe(Action<string?> handler);
```

</TabItem>
</Tabs>
Adds a listener that will be called whenever the remote app invokes `Listener.unsubscribe()` on a context listener that it previously added.

Desktop Agents MUST call this when disconnect() is called by the other party, for each listener that they had added.

**See also:**

- [`Listener`](Types#listener)

### `onDisconnect`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
onDisconnect(handler: () => void): Listener;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
IListener OnDisconnect(Action handler);
```

</TabItem>
</Tabs>
Adds a listener that will be called when the remote app terminates, for example when its window is closed or because disconnect was called. This is in addition to calls that will be made to onUnsubscribe listeners.

**See also:**

- [`disconnect`](#disconnect)

### `disconnect`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
disconnect(): void;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
void Disconnect();
```

</TabItem>
</Tabs>
May be called to indicate that a participant will no longer interact with this channel.

After this function has been called, Desktop Agents SHOULD prevent apps from broadcasting on this channel and MUST automatically call Listener.unsubscribe() for each listener that they've added (causing any `onUnsubscribe` handler added by the other party to be called) before triggering any onDisconnect handler added by the other party.

**See also:**

- [`onUnsubscribe`](#onunsubscribe)
- [`Listener`](Types#listener)
