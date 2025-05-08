---
id: DesktopAgent
sidebar_label: DesktopAgent
title: DesktopAgent
hide_title: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `DesktopAgent`

An FDC3 Desktop Agent is a desktop component (or aggregate of components) that serves as an orchestrator for applications in its domain.

A Desktop Agent can be connected to one or more App Directories and will use directories for application identity and discovery. Typically, a Desktop Agent will contain the proprietary logic of a given platform, handling functionality like explicit application interop workflows where security, consistency, and implementation requirements are proprietary.

For details of how implementations of the `DesktopAgent` are made available to applications please see [Supported Platforms](../supported-platforms).

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
interface DesktopAgent {
  // apps
  open(app: AppIdentifier, context?: Context): Promise<AppIdentifier>;
  findInstances(app: AppIdentifier): Promise<Array<AppIdentifier>>;
  getAppMetadata(app: AppIdentifier): Promise<AppMetadata>;

  // context
  broadcast(context: Context): Promise<void>;
  addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener>;

  // intents
  findIntent(intent: string, context?: Context, resultType?: string): Promise<AppIntent>;
  findIntentsByContext(context: Context, resultType?: string): Promise<Array<AppIntent>>;
  raiseIntent(intent: string, context: Context, app?: AppIdentifier): Promise<IntentResolution>;
  raiseIntentForContext(context: Context, app?: AppIdentifier): Promise<IntentResolution>;
  addIntentListener(intent: string, handler: IntentHandler): Promise<Listener>;

  // channels
  getOrCreateChannel(channelId: string): Promise<Channel>;
  createPrivateChannel(): Promise<PrivateChannel>;
  getUserChannels(): Promise<Array<Channel>>;

  // OPTIONAL channel management functions
  joinUserChannel(channelId: string) : Promise<void>;
  getCurrentChannel() : Promise<Channel | null>;
  leaveCurrentChannel() : Promise<void>;

  // non-context events
  addEventListener(type: FDC3EventTypes  | null, handler: EventHandler): Promise<Listener>;

  //implementation info
  getInfo(): Promise<ImplementationMetadata>;

  //Deprecated functions
  addContextListener(handler: ContextHandler): Promise<Listener>;
  getSystemChannels(): Promise<Array<Channel>>;
  joinChannel(channelId: string) : Promise<void>;
  open(name: string, context?: Context): Promise<AppIdentifier>;
  raiseIntent(intent: string, context: Context, name: string): Promise<IntentResolution>;
  raiseIntentForContext(context: Context, name: string): Promise<IntentResolution>;
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
interface IDesktopAgent
{
    // Apps
    Task<IAppIdentifier> Open(IAppIdentifier app, IContext? context = null);
    Task<IEnumerable<IAppIdentifier>> FindInstances(IAppIdentifier app);
    Task<IAppMetadata> GetAppMetadata(IAppIdentifier app);

    // Context
    Task Broadcast(IContext context);
    Task<IListener> AddContextListener<T>(string? contextType, ContextHandler<T> handler) where T : IContext;

    // Intents
    Task<IAppIntent> FindIntent(string intent, IContext? context = null, string? resultType = null);
    Task<IEnumerable<IAppIntent>> FindIntentsByContext(IContext context, string? resultType = null);
    Task<IIntentResolution> RaiseIntent(string intent, IContext context, IAppIdentifier? app = null);
    Task<IIntentResolution> RaiseIntentForContext(IContext context, IAppIdentifier? app = null);
    Task<IListener> AddIntentListener<T>(string intent, IntentHandler<T> handler) where T : IContext;

    // Channels
    Task<IChannel> GetOrCreateChannel(string channelId);
    Task<IPrivateChannel> CreatePrivateChannel();
    Task<IEnumerable<IChannel>> GetUserChannels();

    // non-context events
    Task<IListener> AddEventListener(string? eventType, Fdc3EventHandler handler);

    // OPTIONAL channel management functions
    Task JoinUserChannel(string channelId);
    Task<IChannel?> GetCurrentChannel();
    Task LeaveCurrentChannel();

    // Implementation Information
    Task<IImplementationMetadata> GetInfo();
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
@experimental
type Result[T any] struct {
	Value *T
	Err   error
}
@experimental
type DesktopAgent struct {}

@experimental
type IDesktopAgent interface {
    // Apps
    Open(appIdentifier AppIdentifier, context *IContext) <-chan Result[AppIdentifier]
    FindInstances(appIdentifier AppIdentifier) <-chan Result[[]AppIdentifier]
    GetAppMetadata(appIdentifier AppIdentifier) <-chan Result[AppIdentifier]

    // Context
    Broadcast(context IContext) <-chan Result[any]
    AddContextListener(contextType string, handler ContextHandler) <-chan Result[Listener]

    // Intents
    FindIntent(intent string, context *IContext, resultType *string) <-chan Result[AppIntent]
    FindIntentsByContext(context IContext, resultType *string) <-chan Result[[]AppIntent]
    RaiseIntent(intent string, context IContext, appIdentifier *AppIdentifier) <-chan Result[IntentResolution]
    RaiseIntentForContext(context IContext, appIdentifier *AppIdentifier) <-chan Result[IntentResolution]
    AddIntentListener(intent string, handler IntentHandler) <-chan Result[Listener]

    // Channels
    GetOrCreateChannel(channelId string) <-chan Result[Channel]
    CreatePrivateChannel() <-chan Result[PrivateChannel]
    GetUserChannels() <-chan Result[[]Channel]

    // OPTIONAL channel management functions
    JoinUserChannel(channelId string) <-chan Result[any]
    GetCurrentChannel() <-chan Result[Channel]
    LeaveCurrentChannel() <-chan Result[any]

    // non-context events 
    AddEventListener(type *FDC3EventTypes, handler EventHandler) <-Result[Listener];

    //implementation info
    GetInfo() <-chan Result[ImplementationMetadata]
}
```

</TabItem>
</Tabs>

## Functions

### `addContextListener`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IListener> AddContextListener<T>(string? contextType, ContextHandler<T> handler) where T : IContext;
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) AddContextListener(contextType string, handler ContextHandler) <-chan Result[Listener] { 
  // Implementation here
}
```

</TabItem>
</Tabs>

Adds a listener for incoming context broadcasts from the Desktop Agent (via a User channel or [`fdc3.open`](#open) API call). If the consumer is only interested in a context of a particular type, they can specify that type. If the consumer is able to receive context of any type or will inspect types received, then they can pass `null` as the `contextType` parameter to receive all context types.

Context broadcasts are primarily received from apps that are joined to the same User Channel as the listening application, hence, if the application is not currently joined to a User Channel no broadcasts will be received from User channels. If this function is called after the app has already joined a channel and the channel already contains context that matches the type of the context listener, then it will be called immediately and the context passed to the handler function. If `null` was passed as the context type for the listener and the channel contains context, then the handler function will be called immediately with the most recent context - regardless of type.

Context may also be received via this listener if the application was launched via a call to  [`fdc3.open`](#open), where context was passed as an argument. In order to receive this, applications SHOULD add their context listener as quickly as possible after launch, or an error MAY be returned to the caller and the context may not be delivered. The exact timeout used is set by the Desktop Agent implementation, but MUST be at least 15 seconds.

Optional metadata about each context message received, including the app that originated the message, SHOULD be provided by the Desktop Agent implementation.

**Examples:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
// any context
const listener = await fdc3.addContextListener(null, context => { ... });

// listener for a specific type
const contactListener = await fdc3.addContextListener('fdc3.contact', contact => { ... });

// listener that logs metadata for the message a specific type
const contactListener = await fdc3.addContextListener('fdc3.contact', (contact, metadata) => {
  console.log(`Received context message\nContext: ${contact}\nOriginating app: ${metadata?.source}`);
  //do something else with the context
});
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
// any context
var listener = await _desktopAgent.AddContextListener<IContext>(null, (context, meatadata) => { ... });

// listener for a specific type
var listener = await _desktopAgent.AddContextListener<Instrument>("fdc3.contact", (contact, metadata) => { ... });

// listener that logs metadata for the message of a specific type
var contactListener = await _desktopAgent.AddContextListener<Contact>("fdc3.contact", (contact, metadata) => {
  System.Diagnostics.Debug.WriteLine($"Received context message\nContext: {contact}\nOriginating app: {metadata?.Source}");
  // do something else with the context
});
```

</TabItem>
<TabItem value="golang" label="Go">

```go
// any context
listenerResult := <-desktopAgent.AddContextListener("", func(context IContext, contextMetadata *ContextMetadata) { ... })

// listener for a specific type
listenerResult := <-desktopAgent.AddContextListener("fdc3.contact", func(context IContext, contextMetadata *ContextMetadata) { ... })

// listener that logs metadata for the message of a specific type
listenerResult := <-desktopAgent.AddContextListener("fdc3.contact", func(context IContext, contextMetadata *ContextMetadata) {
  if contextMetadata != nil {
    log.Printf("Received context message\nContext: %v\nOriginating app: %v", context, contextMetadata.Source)
} else {
    log.Printf("Received context message\nContext: %v", context)
}
})
```

</TabItem>
</Tabs>

**See also:**

- [`Listener`](Types#listener)
- [`Context`](Types#context)
- [`ContextHandler`](Types#contexthandler)

### `addEventListener`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
addEventListener(type: FDC3EventTypes  | null, handler: EventHandler): Promise<Listener>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IListener> AddEventListener(string? eventType, Fdc3EventHandler handler);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) AddEventListener(type *FDC3EventTypes, handler EventHandler) <-Result[Listener]  { 
  // Implmentation here
}
```

</TabItem>
</Tabs>

Registers a handler for non-context and non-intent events from the Desktop Agent. If the consumer is only interested in an event of a particular type, they can specify that type. If the consumer is able to receive events of any type or will inspect types received, then they can pass `null` as the `type` parameter to receive all event types.

Whenever the handler function is called it will be passed an event object with details related to the event.

**Examples:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
// any event type
const listener = await fdc3.addEventListener(null, event => { ... });

// listener for a specific event type that logs its details
const userChannelChangedListener = await fdc3.addEventListener("userChannelChanged", event => { 
  console.log(`Received event ${event.type}\n\tDetails: ${event.details}`);
  //do something else with the event
});
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var listener = await _desktopAgent.AddEventListener(null, (event) => { ... });

var userChannelChangedListener = await _desktopAgent.AddEventListener("userChannelChanged", (event) => {
  System.Diagnostics.Debug.Write($"Received event ${event.Type}\n\tDetails: ${event.Details}");
});
```

</TabItem>
</Tabs>

**See also:**

- [`FDC3EventTypes`](./Events#fdc3eventtypes)
- [`FDC3Event`](./Events#fdc3event)
- [`EventHandler`](./Events#eventhandler)

### `addIntentListener`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
addIntentListener(intent: string, handler: IntentHandler): Promise<Listener>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IListener> AddIntentListener<T>(string intent, IntentHandler<T> handler) where T : IContext;
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) AddIntentListener(intent string, handler IntentHandler) <-chan Result[Listener]  { 
  // Implementation here
}
```

</TabItem>
</Tabs>

Adds a listener for incoming intents raised by other applications, via calls to [`fdc3.raiseIntent`](#raiseintent) or [`fdc3.raiseIntentForContext`](#raiseintentforcontext). If the application is intended to be launched to resolve raised intents, it SHOULD add its intent listeners as quickly as possible after launch or an error MAY be returned to the caller and the intent and context may not be delivered. The exact timeout used is set by the Desktop Agent implementation, but MUST be at least 15 seconds.

The handler function may return void or a promise that resolves to a [`IntentResult`](Types#intentresult), which is either a [`Context`](Types#context) object, representing any data that should be returned to the app that raised the intent, or a [`Channel`](Channel), a [`PrivateChannel`](PrivateChannel) over which data responses will be sent, or `void`. The `IntentResult` will be returned to the app that raised the intent via the [`IntentResolution`](Metadata#intentresolution) and retrieved from it using the `getResult()` function.

The Desktop Agent MUST reject the promise returned by the `getResult()` function of `IntentResolution` if any of the following is true:

1. The intent handling function's returned promise rejects.
2. The intent handling function returns something other than a promise.
3. The returned promise resolves to an invalid type.

The [`PrivateChannel`](PrivateChannel) type is provided to support synchronization of data transmitted over returned channels, by allowing both parties to listen for events denoting subscription and unsubscription from the returned channel. `PrivateChannels` are only retrievable via raising an intent.

Optional metadata about each intent & context message received, including the app that originated the message, SHOULD be provided by the desktop agent implementation.

**Examples:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
//Handle a raised intent
const listener = fdc3.addIntentListener('StartChat', context => {
  // start chat has been requested by another application
  return;
});

//Handle a raised intent and log the originating app metadata
const listener = fdc3.addIntentListener('StartChat', (contact, metadata) => {
  console.log(`Received intent StartChat\nContext: ${contact}\nOriginating app: ${metadata?.source}`);
    return;
});

//Handle a raised intent and return Context data via a promise
fdc3.addIntentListener("CreateOrder", (context) => {
  return new Promise<Context>((resolve) => {
    // go create the order
    resolve({type: "fdc3.order", id: { "orderId": 1234}});
  });
});

//Handle a raised intent and return a PrivateChannel over which response will be sent
fdc3.addIntentListener("QuoteStream", async (context) => {
  const channel: PrivateChannel = await fdc3.createPrivateChannel();
  const symbol = context.id.ticker;

  // Called when the remote side adds a context listener
  const addContextListener = channel.onAddContextListener((contextType) => {
    // broadcast price quotes as they come in from our quote feed
    feed.onQuote(symbol, (price) => {
      channel.broadcast({ type: "price", price});
    });
  });

  // Stop the feed if the remote side closes
  const disconnectListener = channel.onDisconnect(() => {
    feed.stop(symbol);
  });

  return channel;
});
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
//Handle a raised intent
var listener = await _desktopAgent.AddIntentListener<IContext>("StartChat", (context, metadata) => {
    // start chat has been requested by another application
    // return IIntentResult;
});

//Handle a raised intent and log the originating app metadata
var listener = await _desktopAgent.AddIntentListener<IContext>("StartChat", (contact, metadata) => {
    System.Diagnostics.Debug.Write($"Received intent StartChat\nContext: {contact}\nOriginating app: {metadata?.Source}");
    // return IIntentResult;
});
```

</TabItem>
<TabItem value="golang" label="Go">

```go
//Handle a raised intent
listenerResult := <-desktopAgent.AddIntentListener("StartChat", func(context IContext, contextMetadata *ContextMetadata) { 
  // start chat has been requested by another application
})

//Handle a raised intent and log the originating app metadata
listenerResult := <-desktopAgent.AddIntentListener("StartChat", func(context IContext, contextMetadata *ContextMetadata) { 
  if contextMetadata != nil {
    log.Printf("Received intent StartChat\nContext: %v\nOriginating app: %v", context, contextMetadata.Source)
  } else {
    log.Printf("Received intent StartChat\nContext: %v", context)
}
})

// listener that logs metadata for the message of a specific type
listenerResult := <-desktopAgent.AddIntentListener("fdc3.contact", func(context IContext, contextMetadata *ContextMetadata) {
  if contextMetadata != nil {
    log.Printf("Received context message\nContext: %v\nOriginating app: %v", context, contextMetadata.Source)
} else {
    log.Printf("Received context message\nContext: %v", context)
}
})
```

</TabItem>
</Tabs>

**See also:**

- [Register an Intent Handler](../spec#register-an-intent-handler)
- [`PrivateChannel`](PrivateChannel)
- [`Listener`](Types#listener)
- [`Context`](Types#context)
- [`IntentHandler`](Types#intenthandler)

### `broadcast`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
broadcast(context: Context): Promise<void>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task Broadcast(IContext context);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) Broadcast(context IContext) <-chan Result[any]  { 
  // Implmentation here
}
```

</TabItem>
</Tabs>

Publishes context to other apps on the desktop.  Calling `broadcast` at the `DesktopAgent` scope will push the context to whatever _User Channel_ the app is joined to.  If the app is not currently joined to a channel, calling `fdc3.broadcast` will have no effect.  Apps can still directly broadcast and listen to context on any channel via the methods on the `Channel` class.

DesktopAgent implementations SHOULD ensure that context messages broadcast to a channel by an application joined to it are not delivered back to that same application.

If you are working with complex context types composed of other simpler types (as recommended by the [Context Data specification](../../context/spec#assumptions)) then you should broadcast each individual type (starting with the simpler types, followed by the complex type) that you want other apps to be able to respond to. Doing so allows applications to filter the context types they receive by adding listeners for specific context types.

If an application attempts to broadcast an invalid context argument the Promise returned by this function should reject with the [`ChannelError.MalformedContext` error](Errors#channelerror).

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
const instrument = {
    type: 'fdc3.instrument',
    id: {
        ticker: 'AAPL'
    }
};

fdc3.broadcast(instrument);
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Instrument instrument = new Instrument(
    new InstrumentID()
    {
        Ticker = "AAPL"
    }
);

_desktopAgent.Broadcast(instrument);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
context := types.Context{
    Type: "fdc3.instrument",
    Id: map[string]string{
      "ticker": "AAPL",
    },
  }
desktopAgent.Broadcast(context)
```

</TabItem>
</Tabs>

**See also:**

- [addContextListener](#addcontextlistener)

### `createPrivateChannel`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
createPrivateChannel(): Promise<PrivateChannel>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IPrivateChannel> CreatePrivateChannel();
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) CreatePrivateChannel() <-chan Result[PrivateChannel] {
  // Implementation here
}
```

</TabItem>
</Tabs>

Returns a `Channel` with an auto-generated identity that is intended for private communication between applications. Primarily used to create channels that will be returned to other applications via an IntentResolution for a raised intent.

If the `PrivateChannel` cannot be created, the returned promise MUST be rejected with an `Error` object with a `message` chosen from the [`ChannelError`](Errors#channelerror) enumeration.

The `PrivateChannel` type is provided to support synchronization of data transmitted over returned channels, by allowing both parties to listen for events denoting subscription and unsubscription from the returned channel. `PrivateChannels` are only retrievable via raising an intent.

It is intended that Desktop Agent implementations:

- SHOULD restrict external apps from listening or publishing on this channel.
- MUST prevent `PrivateChannels` from being retrieved via fdc3.getOrCreateChannel.
- MUST provide the `id` value for the channel as required by the `Channel` interface.

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
fdc3.addIntentListener("QuoteStream", async (context) => {
  const channel = await fdc3.createPrivateChannel();
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
<TabItem value="golang" label="Go">

```go
desktopAgent.AddIntentListener("fdc3.contact", func(context IContext, contextMetadata *ContextMetadata) {
  channelResult := <-desktopAgent.CreatePrivateChannel()
  symbol := context.Id["ticker"]

  if channelResult.Err != nil {
    return 
  }
  channel := channelResult.Value
  channel.OnAddContextListener
})

```

</TabItem>
</Tabs>

**See also:**

- [`PrivateChannel`](PrivateChannel)
- [`raiseIntent`](#raiseintent)
- [`addIntentListener`](#addintentlistener)

### `findInstances`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
findInstances(app: AppIdentifier): Promise<Array<AppIdentifier>>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IEnumerable<IAppIdentifier>> FindInstances(IAppIdentifier app);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) FindInstances(appIdentifier AppIdentifier) <-chan Result[[]AppIdentifier] {
  // Implementation here
}

```

</TabItem>
</Tabs>

Find all the available instances for a particular application.

If the application is not known to the agent, the returned promise should be rejected with the `ResolverError.NoAppsFound` error message. However, if the application is known but there are no instances of the specified app the returned promise should resolve to an empty array.

If the request fails for another reason, the promise MUST be rejected with an `Error` Object with a `message` chosen from the [`ResolveError`](Errors#resolveerror) enumeration, or (if connected to a Desktop Agent Bridge) the [`BridgingError`](Errors#bridgingerror) enumeration.

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
// Retrieve a list of instances of an application
let instances = await fdc3.findInstances({appId: "MyAppId"});

// Target a raised intent at a specific instance
let resolution = fdc3.raiseIntent("ViewInstrument", context, instances[0]);
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
// Retrieve a list of instances of an application
var instances = await _desktopAgent.FindInstances(new AppIdentifier("MyAppId"));

// Target a raised intent at a specific instance
var resolution = await _desktopAgent.RaiseIntent("ViewInstrument", context, instances.First());
```

</TabItem>
<TabItem value="golang" label="Go">

```go
// Retrieve a list of instances of an application
findInstancesResult := <-desktopAgent.FindInstances(AppIdentifier{AppId: "MyAppId"})
if findInstancesResult.Err != nil || len(findInstancesResult.Value) == 0 {
  // handle error
}

// Target a raised intent at a specific instance
resolutionResult := <-desktopAgent.RaiseIntent("ViewInstrument", context, findInstancesResult.Value[0])
```

</TabItem>
</Tabs>

### `findIntent`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
findIntent(intent: string, context?: Context, resultType?: string): Promise<AppIntent>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IAppIntent> FindIntent(string intent, IContext? context = null, string? resultType = null);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) FindIntent(intent string, context *IContext, resultType *string) <-chan Result[AppIntent] {
  // Implmentation here
}

```

</TabItem>
</Tabs>

Find out more information about a particular intent by passing its name, and optionally its context and/or a desired result context type.

`findIntent` is effectively granting programmatic access to the Desktop Agent's resolver.
It returns a promise resolving to an `AppIntent` which provides details of the intent, its metadata and metadata about the apps and app instances that are registered to handle it. This can be used to raise the intent against a specific app or app instance.

If the resolution fails, the promise MUST be rejected with an `Error` Object with a `message` chosen from the [`ResolveError`](Errors#resolveerror) enumeration, or (if connected to a Desktop Agent Bridge) the [`BridgingError`](Errors#bridgingerror) enumeration. This includes the case where no apps are found that resolve the intent, when the [`ResolveError.NoAppsFound`](Errors#resolveerror) message should be used, and when an invalid context object is passed as an argument, when the [`ResolveError.MalformedContext`](Errors#resolveerror) message should be used.

Result types may be a type name, the string `"channel"` (which indicates that the app will return a channel) or a string indicating a channel that returns a specific type, e.g. `"channel<fdc3.instrument>"`. If intent resolution to an app returning a channel is requested, the desktop agent MUST include both apps that are registered as returning a channel and those registered as returning a channel with a specific type in the response.

**Examples:**

I know 'StartChat' exists as a concept, and want to know which apps can resolve it:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
const appIntent = await fdc3.findIntent("StartChat");
// returns a single AppIntent:
// {
//   intent: { name: "StartChat" },
//   apps: [
//    { appId: "Skype" },
//    { appId: "Symphony" },
//    { appId: "Slack" }
//   ]
// }

// raise the intent against a particular app
await fdc3.raiseIntent(appIntent.intent.name, context, appIntent.apps[0]);

//later, we want to raise 'StartChat' intent again
const appIntent = await fdc3.findIntent("StartChat");
// returns an AppIntent, but with multiple options for resolution,
// which includes an existing instance of an application:
// {
//   intent: { name: "StartChat" },
//   apps: [
//    { appId: "Skype" },
//    { appId: "Symphony" },
//    { appId: "Symphony", instanceId: "93d2fe3e-a66c-41e1-b80b-246b87120859" },
//    { appId: "Slack" }
//   ]
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var appIntent = await _desktopAgent.FindIntent("StartChat");

// raise the intent against a particular app
await _desktopAgent.RaiseIntent(appIntent.Intent.Name, context, appIntent.Apps.First());
```

</TabItem>
<TabItem value="golang" label="Go">

```go
findIntentResult := <-desktopAgent.FindIntent("StartChat", nil, nil)
if findIntentResult.Err != nil {
  // handle error
}

// raise the intent against a particular app
<-desktopAgent.RaiseIntent(findIntentResult.Value.Intent.Name, context, findInstancesResult.Value.Apps[0])
```

</TabItem>
</Tabs>

An optional input context object and/or `resultType` argument may be specified, which the resolver MUST use to filter the returned applications such that each supports the specified input and result types.

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
const appIntent = await fdc3.findIntent("StartChat", contact);

// returns only apps that support the type of the specified input context:
// {
//     intent: { name: "StartChat" },
//     apps: { name: "Symphony" }]
// }

const appIntent = await fdc3.findIntent("ViewContact", "fdc3.ContactList");
// returns only apps that return the specified result type:
// {
//     intent: { name: "ViewContact" },
//     apps: { appId: "MyCRM", resultType: "fdc3.ContactList"}]
// }

const appIntent = await fdc3.findIntent("QuoteStream", instrument, "channel<fdc3.Quote>");
// returns only apps that return a channel which will receive the specified input and result types:
// {
//     intent: { name: "QuoteStream" },
//     apps: { appId: "MyOMS", resultType: "channel<fdc3.Quote>"}]
// }
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var appIntent = await _desktopAgent.FindIntent("StartChat", contact);
// returns only apps that support the type of the specified input context:
// {
//     Intent: { Name: "StartChat" },
//     Apps: { Name: "Symphony" }]
// }

var appIntent = await _desktopAgent.FindIntent("ViewContact", "fdc3.ContactList");
// returns only apps that return the specified result type:
// {
//     Intent: { Name: "ViewContact" },
//     Apps: { AppId: "MyCRM", ResultType: "fdc3.ContactList"}]
// }

var appIntent = await _desktopAgent.FindIntent("QuoteStream", instrument, "channel<fdc3.Quote>");
// returns only apps that return a channel which will receive the specified input and result types:
// {
//     Intent: { Name: "QuoteStream" },
//     Apps: { AppId: "MyOMS", ResultType: "channel<fdc3.Quote>"}]
// }
```

</TabItem>
<TabItem value="golang" label="Go">

```go
findIntentResult := <-desktopAgent.FindIntent("StartChat", &contact, nil)
// returns only apps that support the type of the specified input context:
// {
//     Intent: { Name: "StartChat" },
//     Apps: { Name: "Symphony" }]
// }

resultType := "fdc3.ContactList"
findIntentResult := <-desktopAgent.FindIntent("ViewContact", &nil, &resultType)
// returns only apps that return the specified result type:
// {
//     Intent: { Name: "ViewContact" },
//     Apps: { AppId: "MyCRM", ResultType: "fdc3.ContactList"}]
// }

findIntentResult := <-desktopAgent.FindIntent("QuoteStream", &instrument, "channel<fdc3.Quote>");
// returns only apps that return a channel which will receive the specified input and result types:
// {
//     Intent: { Name: "QuoteStream" },
//     Apps: { AppId: "MyOMS", ResultType: "channel<fdc3.Quote>"}]
// }
```

</TabItem>
</Tabs>

**See also:**

- [`ResolveError`](Errors#resolveerror)

### `findIntentsByContext`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
findIntentsByContext(context: Context, resultType?: string): Promise<Array<AppIntent>>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IEnumerable<IAppIntent>> FindIntentsByContext(IContext context, string? resultType = null);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) FindIntentsByContext(context IContext, resultType *string) <-chan Result[[]AppIntent] {
  // Implmentation here
}

```

</TabItem>
</Tabs>

Find all the available intents for a particular context, and optionally a desired result context type.

`findIntentsByContext` is effectively granting programmatic access to the Desktop Agent's resolver.
A promise resolving to all the intents, their metadata and metadata about the apps and app instances that registered as handlers is returned, based on the context types the intents have registered.

If the resolution fails, the promise MUST be rejected with an `Error` Object with a `message` chosen from the [`ResolveError`](Errors#resolveerror) enumeration, or (if connected to a Desktop Agent Bridge) the [`BridgingError`](Errors#bridgingerror) enumeration. This includes the case where no intents with associated apps are found, when the `ResolveError.NoAppsFound` message should be used, and when an invalid context object is passed as an argument, when the [`ResolveError.MalformedContext`](Errors#resolveerror) message should be used.

The optional `resultType` argument may be a type name, the string `"channel"` (which indicates that the app will return a channel) or a string indicating a channel that returns a specific type, e.g. `"channel<fdc3,instrument>"`. If intent resolution to an app returning a channel is requested without a specified context type, the desktop agent MUST include both apps that are registered as returning a channel and those registered as returning a channel with a specific type in the response.

**Example:**

I have a context object, and I want to know what I can do with it, hence, I look for intents and apps to resolve them...

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
const appIntents = await fdc3.findIntentsByContext(context);

// returns, for example:
// [
//   {
//     intent: { name: "StartCall" },
//     apps: [{ appId: "Skype" }]
//   },
//   {
//     intent: { name: "StartChat" },
//     apps: [
//       { appId: "Skype" },
//       { appId: "Symphony" },
//       { appId: "Symphony", instanceId: "93d2fe3e-a66c-41e1-b80b-246b87120859" },
//       { appId: "Slack" }
//     ]
//   },
//   {
//     intent: { name: "ViewContact" },
//     apps: [{ appId: "Symphony" }, { appId: "MyCRM", resultType: "fdc3.ContactList"}]
//   }
// ];
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var appIntents = await _desktopAgent.FindIntentsByContext(context);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
findIntentResult := <-desktopAgent.FindIntentsByContext(context, nil)
```

</TabItem>
</Tabs>

or I look for only intents that are resolved by apps returning a particular result type

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
const appIntentsForType = await fdc3.findIntentsByContext(context, "fdc3.ContactList");
// returns for example:
// [{
//     intent: { name: "ViewContact" },
//     apps: [{ appId: "Symphony" }, { appId: "MyCRM", resultType: "fdc3.ContactList"}]
// }];

// select a particular intent to raise
const startChat = appIntents[1];

// target a particular app or instance
const selectedApp = startChat.apps[2];

// raise the intent, passing the given context, targeting the app
await fdc3.raiseIntent(startChat.intent.name, context, selectedApp);
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var appIntentsForType = await _desktopAgent.FindIntentsByContext(context, "fdc3.ContactList");
// returns for example:
// [{
//     Intent: { Name: "ViewContact" },
//     Apps: [{ AppId: "Symphony" }, { AppId: "MyCRM", ResultType: "fdc3.ContactList"}]
// }];

// select a particular intent to raise
var startChat = appIntentsForType.First();

// target a particular app or instance
var selectedApp = startChat.Apps.First();

// raise the intent, passing the given context, targeting the app
await _desktopAgent.RaiseIntent(startChat.Intent.Name, context, selectedApp);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
resultType := "fdc3.ContactList"
findIntentResult := <-desktopAgent.FindIntentsByContext(context, &resultType)
// returns for example:
// [{
//     Intent: { Name: "ViewContact" },
//     Apps: [{ AppId: "Symphony" }, { AppId: "MyCRM", ResultType: "fdc3.ContactList"}]
// }];
if findIntentResult.Err != nil || len(findIntentResult.Value) == 0 {
  // handle error or no results
}
// select a particular intent to raise
startChat := findIntentResult.Value[0]

// target a particular app or instance
selectedApp := startChat.Apps[0]

// raise the intent, passing the given context, targeting the app
<-desktopAgent.RaiseIntent(startChat.Intent.Name, context, selectedApp)
```

</TabItem>
</Tabs>

**See also:**

- [`findIntent()`](#findintent)
- [`ResolveError`](Errors#resolveerror)

### `getAppMetadata`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
getAppMetadata(app: AppIdentifier): Promise<AppMetadata>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IAppMetadata> GetAppMetadata(IAppIdentifier app);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) GetAppMetadata(appIdentifier AppIdentifier) <-chan Result[AppIdentifier] {
  // Implementation here
}

```

</TabItem>
</Tabs>

Retrieves the [`AppMetadata`](Metadata#appmetadata) for an [`AppIdentifier`](Types#appidentifier), which provides additional metadata (such as icons, a title and description) from the App Directory record for the application, that may be used for display purposes.

If the app is not found, the promise MUST be rejected with an `Error` Object with the `message` given by [`ResolveError.TargetAppUnavailable`](Errors#resolveerror), or (if connected to a Desktop Agent Bridge) an error from the [`BridgingError`](Errors#bridgingerror) enumeration.

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
let appIdentifier = { appId: "MyAppId@my.appd.com" }
let appMetadata = await fdc3.getAppMetadata(appIdentifier);
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var appIdentifier = new AppIdentifier("MyAppId@my.appd.com");
var appMetadata = await _desktopAgent.GetAppMetadata(appIdentifier);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
appIdentifier := AppIdentifier{AppId: "MyAppId@my.appd.com"}
appMetadataResult := <-desktopAgent.GetAppMetadata(appIdentifier)
```

</TabItem>
</Tabs>

**See also:**

- [`AppMetadata`](Metadata#appmetadata)
- [`AppIdentifier`](Types#appidentifier)

### `getCurrentChannel`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
getCurrentChannel() : Promise<Channel | null>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IChannel?> GetCurrentChannel();
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) GetCurrentChannel() <-chan Result[Channel] {
  // Implementation here
}

```

</TabItem>
</Tabs>

OPTIONAL function that returns the `Channel` object for the current User channel membership.  In most cases, an application's membership of channels SHOULD be managed via UX provided to the application by the desktop agent, rather than calling this function directly.

Returns `null` if the app is not joined to a channel.

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
// get the current channel membership
let current = await fdc3.getCurrentChannel();
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
// get the current channel membership
var current = await _desktopAgent.GetCurrentChannel();
```

</TabItem>
<TabItem value="golang" label="Go">

```go
currentResult := <-desktopAgent.GetCurrentChannel()
```

</TabItem>
</Tabs>

**See also:**

- [`Channel`](Channel)

### `getInfo`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
getInfo(): Promise<ImplementationMetadata>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IImplementationMetadata> GetInfo();
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) GetInfo() <-chan Result[ImplementationMetadata] {
  // Implementation here
}

```

</TabItem>
</Tabs>

Retrieves information about the FDC3 Desktop Agent implementation, including the supported version of the FDC3 specification, the name of the provider of the implementation, its own version number, details of whether optional API features are implemented and the metadata of the calling application according to the desktop agent.

Returns an [`ImplementationMetadata`](Metadata#implementationmetadata) object.  This metadata object can be used to vary the behavior of an application based on the version supported by the Desktop Agent and for logging purposes.

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
import {compareVersionNumbers, versionIsAtLeast} from '@finos/fdc3';

if (fdc3.getInfo && versionIsAtLeast(await fdc3.getInfo(), "1.2")) {
  await fdc3.raiseIntentForContext(context);
} else {
  await fdc3.raiseIntent("ViewChart", context);
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var version = (await _desktopAgent.GetInfo()).Fdc3Version;
```

</TabItem>
<TabItem value="golang" label="Go">

```go
infoResult := <-desktopAgent.GetInfo()
if infoResult.Value != nil {
  version := infoResult.Fdc3Version
}
```

</TabItem>
</Tabs>

The `ImplementationMetadata` object returned also includes the metadata for the calling application, according to the Desktop Agent. This allows the application to retrieve its own `appId`, `instanceId` and other details, e.g.:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
let implementationMetadata = await fdc3.getInfo();
let {appId, instanceId} = implementationMetadata.appMetadata;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var implementationMetadata = await _desktopAgent.GetInfo();
var appId = implementationMetadata.AppMetadata.AppId;
var instanceId = implementationMetadata.AppMetadata.InstanceId;
```

</TabItem>
<TabItem value="golang" label="Go">

```go
implementationMetadataResult := <-desktopAgent.GetInfo()
if implementationMetadataResult.Value != nil {
  appId := implementationMetadataResult.AppMetadata.AppId
  instanceId := implementationMetadataResult.AppMetadata.InstanceId
}
```

</TabItem>
</Tabs>

**See also:**

- [`ImplementationMetadata`](Metadata#implementationmetadata)
- [`AppMetadata`](Metadata#appmetadata)

### `getOrCreateChannel`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
getOrCreateChannel(channelId: string): Promise<Channel>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IChannel> GetOrCreateChannel(string channelId);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) GetOrCreateChannel(channelId string) <-chan Result[Channel] {
  // Implementation here
}

```

</TabItem>
</Tabs>

Returns a `Channel` object for the specified channel, creating it (as an _App_ channel) if it does not exist.

If the Channel cannot be created or access was denied, the returned promise MUST be rejected with an `Error` Object with a `message` chosen from the `ChannelError` enumeration.

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
try {
  const myChannel = await fdc3.getOrCreateChannel("myChannel");
  myChannel.addContextListener(null, context => { /* do something with context */});
}
catch (err: ChannelError) {
  //app could not register the channel
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
try
{
    var myChannel = await _desktopAgent.GetOrCreateChannel("myChannel");
    await myChannel.AddContextListener<IContext>(null, (context, metadata) => { /* do something with context */});
}
catch (Exception ex)
{
    //app could not register the channel
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
myChannelResult := <-desktopAgent.GetOrCreateChannel("myChannel")
if myChannelResult.Err != nil {
    //app could not register the channel
}
myChannel := myChannelResult.Value
<-myChannel.AddContextListener("", func(context IContext, metadata *ContextMetadata) {
    // do something with context
})


```

</TabItem>
</Tabs>

**See also:**

- [`Channel`](Channel)

### `getUserChannels`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
getUserChannels() : Promise<Array<Channel>>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IEnumerable<IChannel>> GetUserChannels();
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) GetUserChannels() <-chan Result[[]Channel] {
  // Implementation here
}

```

</TabItem>
</Tabs>

Retrieves a list of the User Channels available for the app to join.

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
const userChannels = await fdc3.getUserChannels();
const redChannel = userChannels.find(c => c.id === 'red');
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var userChannels = await _desktopAgent.GetUserChannels();
var redChannel = userChannels.First(c => c.Id == "red");
```

</TabItem>
<TabItem value="golang" label="Go">

```go
import "slices" // This is for go 1.21+, before that use `golang.org/x/exp/slices` library
userChannelsResult := <-desktopAgent.GetUserChannels()
if userChannelsResult.Err != nil {
  // handle error
}
redChannel := slices.IndexFunc(userChannelsResult.Value, func(c Channel) bool { return c.Id == "red" })
```

</TabItem>
</Tabs>

**See also:**

- [`Channel`](Channel)

### `joinUserChannel`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
joinUserChannel(channelId: string) : Promise<void>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task JoinUserChannel(string channelId);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) JoinUserChannel(channelId string) <-chan Result[any] {
  // Implementation here
}

```

</TabItem>
</Tabs>

OPTIONAL function that joins the app to the specified User channel. In most cases, applications SHOULD be joined to channels via UX provided to the application by the desktop agent, rather than calling this function directly.

If an app is joined to a channel, all `fdc3.broadcast` calls will go to the channel, and all listeners assigned via `fdc3.addContextListener` will listen on the channel.

If the channel already contains context that would be passed to context listeners added via `fdc3.addContextListener` then those listeners will be called immediately with that context.

An app can only be joined to one channel at a time.

If an error occurs (such as the channel is unavailable or the join request is denied) the promise MUST be rejected with an `Error` Object with a `message` chosen from the [`ChannelError`](Errors#channelerror) enumeration.

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
// get all user channels
const channels = await fdc3.getUserChannels();

// create UI to pick from the User channels

// join the channel on selection
fdc3.joinUserChannel(selectedChannel.id);
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
// get all user channels
var channels = await _desktopAgent.GetUserChannels();

// create UI to pick from the User channels

// join the channel on selection
_desktopAgent.JoinUserChannel(selectedChannel.Id);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
userChannelsResult := <-desktopAgent.GetUserChannels()
if userChannelsResult.Err != nil {
  // handle error
}
<-desktopAgent.JoinUserChannel(userChannelsResult.Value.Id)

```

</TabItem>
</Tabs>

**See also:**

- [`getUserChannels`](#getuserchannels)

### `leaveCurrentChannel`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
leaveCurrentChannel() : Promise<void>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task LeaveCurrentChannel();
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) LeaveCurrentChannel() <-chan Result[any] {
  // Implementation here
}
```

</TabItem>
</Tabs>

OPTIONAL function that removes the app from any User channel membership.  In most cases, an application's membership of channels SHOULD be managed via UX provided to the application by the desktop agent, rather than calling this function directly.

Context broadcast and listening through the top-level `fdc3.broadcast` and `fdc3.addContextListener` will be a no-op when the app is not joined to a User channel.

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
//desktop-agent scope context listener
const fdc3Listener = fdc3.addContextListener(null, context => {});

await fdc3.leaveCurrentChannel();
//the fdc3Listener will now cease receiving context

//listening on a specific channel though, will continue to work
redChannel.addContextListener(null, channelListener);

```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
//desktop-agent scope context listener
var fdc3Listener = await _desktopAgent.AddContextListener<IContext>(null, (context, metadata) => { });

await _desktopAgent.LeaveCurrentChannel();
//the fdc3Listener will now cease receiving context

//listening on a specific channel though, will continue to work
redChannel.AddContextListener(null, channelListener);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
//desktop-agent scope context listener
listenerResult := <-desktopAgent.AddContextListener("", func(context IContext, contextMetadata *ContextMetadata) { ... })


<-desktopAgent.LeaveCurrentChannel()
//the fdc3Listener will now cease receiving context

//listening on a specific channel though, will continue to work
<-redChannel.AddContextListener("", channelListener);
```

</TabItem>
</Tabs>

### `open`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
open(app: AppIdentifier, context?: Context): Promise<AppIdentifier>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IAppIdentifier> Open(IAppIdentifier app, IContext? context = null);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) Open(appIdentifier AppIdentifier, context *IContext) <-chan Result[AppIdentifier] {
  // Implementation here
}
```

</TabItem>
</Tabs>

Launches an app, specified via an [`AppIdentifier`](Types#appidentifier) object.

The `open` method differs in use from [`raiseIntent`](#raiseintent).  Generally, it should be used when the target application is known but there is no specific intent.  For example, if an application is querying an App Directory, `open` would be used to open an app returned in the search results.

**Note**, if the intent, context and target app name are all known, it is recommended to instead use [`raiseIntent`](#raiseintent) with the `target` argument.

If a [`Context`](Types#context) object is passed in, this object will be provided to the opened application via a contextListener. The Context argument is functionally equivalent to opening the target app with no context and broadcasting the context directly to it.

Returns an [`AppIdentifier`](Types#appidentifier) object with the `instanceId` field set to identify the instance of the application opened by this call.

If an error occurs while opening the app, the promise MUST be rejected with an `Error` Object with a `message` chosen from the [`OpenError`](Errors#openerror) enumeration, or (if connected to a Desktop Agent Bridge) the [`BridgingError`](Errors#bridgingerror) enumeration.

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

 ```js
// Open an app without context, using an AppIdentifier object to specify the target
let appIdentifier = { appId: 'myApp-v1.0.1' };
let instanceIdentifier = await fdc3.open(appIdentifier);

// Open an app with context
let instanceIdentifier = await fdc3.open(appIdentifier, context);
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
// Open an app without context, using an AppIdentifier object to specify the target
var appIdentifier = new AppIdentifier("myApp-v1.0.1");
var instanceIdentifier = await _desktopAgent.Open(appIdentifier);

// Open an app with context
var instanceIdentifier = await _desktopAgent.Open(appIdentifier, context);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
// Open an app without context, using an AppIdentifier object to specify the target
appIdentifier := AppIdentifier{AppId: "myApp-v1.0.1"}
instanceIdentifierResult := <-desktopAgent.Open(appIdentifier, nil)

// Open an app with context 
instanceIdentifierResult := <-desktopAgent.Open(appIdentifier, &context)
```

</TabItem>
</Tabs>

**See also:**

- [`Context`](Types#context)
- [`AppIdentifier`](Types#appidentifier)
- [`AppMetadata`](Metadata#appmetadata)
- [`OpenError`](Errors#openerror)

### `raiseIntent`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
raiseIntent(intent: string, context: Context, app?: AppIdentifier): Promise<IntentResolution>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IIntentResolution> RaiseIntent(string intent, IContext context, IAppIdentifier? app = null);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) RaiseIntent(intent string, context IContext, appIdentifier *AppIdentifier) <-chan Result[IntentResolution] {
  // Implementation here
}
```

</TabItem>
</Tabs>

Raises a specific intent for resolution against apps registered with the desktop agent.

The desktop agent MUST resolve the correct app to target based on the provided intent name and context data. If multiple matching apps are found, a method for resolving the intent to a target app, such as presenting the user with a resolver UI allowing them to pick an app, SHOULD be provided.
Alternatively, the specific app or app instance to target can also be provided. A list of valid target applications and instances can be retrieved via [`findIntent`](DesktopAgent#findintent).

If a target app for the intent cannot be found with the criteria provided or the user either closes the resolver UI or otherwise cancels resolution, the promise MUST be rejected with an `Error` object with a `message` chosen from the [`ResolveError`](Errors#resolveerror) enumeration, or (if connected to a Desktop Agent Bridge) the [`BridgingError`](Errors#bridgingerror) enumeration. If a specific target `app` parameter was set, but either the app or app instance is not available, the promise MUST be rejected with an `Error` object with either the `ResolveError.TargetAppUnavailable` or `ResolveError.TargetInstanceUnavailable` string as its `message`. If an invalid context object is passed as an argument the promise MUST be rejected with an `Error` object with the [`ResolveError.MalformedContext`](Errors#resolveerror) string as its `message`.

If you wish to raise an intent without a context, use the `fdc3.nothing` context type. This type exists so that apps can explicitly declare support for raising an intent without context.

Returns an [`IntentResolution`](Metadata#intentresolution) object with details of the app instance that was selected (or started) to respond to the intent.

Issuing apps may optionally wait on the promise that is returned by the `getResult()` member of the `IntentResolution`. This promise will resolve when the _receiving app's_ intent handler function returns and resolves a promise. The Desktop Agent resolves the issuing app's promise with the Context object, Channel object or void that is provided as resolution within the receiving app. The Desktop Agent MUST reject the issuing app's promise, with a string from the [`ResultError`](Errors#resulterror) enumeration, if: (1) the intent handling function's returned promise rejects, (2) the intent handling function doesn't return a valid response (a promise or void), or (3) the returned promise resolves to an invalid type.

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
// raise an intent for resolution by the desktop agent
// a resolver UI may be displayed, or another method of resolving the intent to a
// target applied, if more than one application can resolve the intent
await fdc3.raiseIntent("StartChat", context);

// or find apps to resolve an intent to start a chat with a given contact
const appIntent = await fdc3.findIntent("StartChat", context);

// use the metadata of an app or app instance to describe the target app for the intent
await fdc3.raiseIntent("StartChat", context, appIntent.apps[0]);

//Raise an intent without a context by using the null context type
await fdc3.raiseIntent("StartChat", {type: "fdc3.nothing"});

//Raise an intent and retrieve a result from the IntentResolution
let resolution = await agent.raiseIntent("intentName", context);
try {
  const result = await resolution.getResult();
  if (result && result.broadcast) { //detect whether the result is Context or a Channel
    console.log(`${resolution.source} returned a channel with id ${result.id}`);
  } else if (result){
    console.log(`${resolution.source} returned data: ${JSON.stringify(result)}`);
  } else {
    console.error(`${resolution.source} didn't return anything`
  }
}
catch (error: ResultError) {
  console.error(`${resolution.source} returned a result error: ${error}`);
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
// raise an intent for resolution by the desktop agent
// a resolver UI may be displayed, or another method of resolving the intent to a
// target applied, if more than one application can resolve the intent
await _desktopAgent.RaiseIntent("StartChat", context);

// or find apps to resolve an intent to start a chat with a given contact
var appIntent = await _desktopAgent.FindIntent("StartChat", context);

// use the metadata of an app or app instance to describe the target app for the intent
await _desktopAgent.RaiseIntent("StartChat", context, appIntent.Apps.First());

//Raise an intent without a context by using the null context type
await _desktopAgent.RaiseIntent("StartChat", ContextType.Nothing);

//Raise an intent and retrieve a result from the IntentResolution
IIntentResolution resolution = await _desktopAgent.RaiseIntent("intentName", context);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
// raise an intent for resolution by the desktop agent
// a resolver UI may be displayed, or another method of resolving the intent to a
// target applied, if more than one application can resolve the intent
<-desktopAgent.RaiseIntent("StartChat", context, nil)

// or find apps to resolve an intent to start a chat with a given contact
appIntentResult := <-desktopAgent.FindIntent("StartChat", &context, nil);
if appIntentResult.Err != nil || len(appIntentResult.Vlaue.Apps) == 0 {
  // handle error or no apps returned
}

// use the metadata of an app or app instance to describe the target app for the intent
<-desktopAgent.RaiseIntent("StartChat", context, appIntentResult.Vlaue.Apps[0])

//Raise an intent without a context by using the null context type
<-desktopAgent.RaiseIntent("StartChat", Context{Type: "fdc3.nothing"}, nil)

//Raise an intent and retrieve a result from the IntentResolution
resolutionResult := <-desktopAgent.RaiseIntent("intentName", context, nil);
```

</TabItem>
</Tabs>

**See also:**

- [Raising Intents](../spec#raising-intents)
- [`Context`](Types#context)
- [`AppIdentifier`](Types#appidentifier)
- [`IntentResult`](Types#intentresult)
- [`IntentResolution`](Metadata#intentresolution)
- [`ResolveError`](Errors#resolveerror)
- [`ResultError`](Errors#resulterror)

### `raiseIntentForContext`

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
raiseIntentForContext(context: Context, app?: AppIdentifier): Promise<IntentResolution>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Task<IIntentResolution> RaiseIntentForContext(IContext context, IAppIdentifier? app = null);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
func (desktopAgent *DesktopAgent) RaiseIntentForContext(context IContext, appIdentifier *AppIdentifier) <-chan Result[IntentResolution] {
  // Implementation here
}
```

</TabItem>
</Tabs>

Finds and raises an intent against apps registered with the desktop agent based purely on the type of the context data.

The desktop agent SHOULD first resolve to a specific intent based on the provided context if more than one intent is available for the specified context. This MAY be achieved by displaying a resolver UI. It SHOULD then resolve to a specific app to handle the selected intent and specified context.
Alternatively, the specific app or app instance to target can also be provided, in which case any method of resolution SHOULD only consider intents supported by the specified application.

Using `raiseIntentForContext` is similar to calling `findIntentsByContext`, and then raising an intent against one of the returned apps, except in this case the desktop agent has the opportunity to provide the user with a richer selection interface where they can choose both the intent and target app.

Returns an `IntentResolution` object, see [`raiseIntent()`](#raiseintent) for details.

If a target intent and app cannot be found with the criteria provided or the user either closes the resolver UI or otherwise cancels resolution, the promise MUST be rejected with an `Error` object with a `message` chosen from the [`ResolveError`](Errors#resolveerror) enumeration, or (if connected to a Desktop Agent Bridge) the [`BridgingError`](Errors#bridgingerror) enumeration. If a specific target `app` parameter was set, but either the app or app instance is not available, the promise MUST be rejected with an `Error` object with either the `ResolveError.TargetAppUnavailable` or `ResolveError.TargetInstanceUnavailable` string as its `message`. If an invalid context object is passed as an argument the promise MUST be rejected with an `Error` object with the [`ResolveError.MalformedContext`](Errors#resolveerror) string as its `message`.

**Example:**

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```js
// Display a resolver UI for the user to select an intent and application to resolve it
const intentResolution = await fdc3.raiseIntentForContext(context);

// Resolve against all intents registered by a specific target app for the specified context
await fdc3.raiseIntentForContext(context, targetAppIdentifier);
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
// Display a resolver UI for the user to select an intent and application to resolve it
var intentResolution = await _desktopAgent.RaiseIntentForContext(context);

// Resolve against all intents registered by a specific target app for the specified context
await _desktopAgent.RaiseIntentForContext(context, targetAppIdentifier);
```

</TabItem>
<TabItem value="golang" label="Go">

```go
// Display a resolver UI for the user to select an intent and application to resolve it
intentResolutionResult := <-desktopAgent.RaiseIntentForContext(context, nil)

// Resolve against all intents registered by a specific target app for the specified context
intentResolutionResult := <-desktopAgent.RaiseIntentForContext(context, &targetAppIdentifier)
```

</TabItem>
</Tabs>

**See also:**

- [Raising Intents](../spec#raising-intents)
- [`raiseIntent()`](#raiseintent)
- [`Context`](Types#context)
- [`AppIdentifier`](Types#appidentifier)
- [`IntentResolution`](Metadata#intentresolution)
- [`ResolveError`](Errors#resolveerror)

## Deprecated Functions

### `addContextListener` (deprecated)

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
addContextListener(handler: ContextHandler): Promise<Listener>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Not implemented
```

</TabItem>
<TabItem value="golang" label="Go">

```
Not implemented
```

</TabItem>
</Tabs>

Adds a listener for incoming context broadcasts from the Desktop Agent. Provided for backwards compatibility with versions FDC3 standard &lt;2.0.

**See also:**

- [`addContextListener`](#addcontextlistener)

### `getSystemChannels` (deprecated)

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
getSystemChannels() : Promise<Array<Channel>>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Not implemented
```

</TabItem>
<TabItem value="golang" label="Go">

```
Not implemented
```

</TabItem>
</Tabs>

Alias to the [`getUserChannels`](#getuserchannels) function provided for backwards compatibility with version 1.1 & 1.2 of the FDC3 standard.
**See also:**

- [`getUserChannels`](#getuserchannels)

### `joinChannel` (deprecated)

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
joinChannel(channelId: string) : Promise<void>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Not implemented
```

</TabItem>
<TabItem value="golang" label="Go">

```
Not implemented
```

</TabItem>
</Tabs>

Alias to the [`joinUserChannel`](#joinuserchannel) function provided for backwards compatibility with version 1.1 & 1.2 of the FDC3 standard.

**See also:**

- [`joinUserChannel`](#joinuserchannel)

### `open` (deprecated)

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
open(name: string, context?: Context): Promise<AppIdentifier>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Not implemented
```

</TabItem>
<TabItem value="golang" label="Go">

```
Not implemented
```

</TabItem>
</Tabs>

Version of `open` that launches an app by name rather than `AppIdentifier`. Provided for backwards compatibility with versions of the FDC3 Standard &lt;2.0.

**See also:**

- [`open`](#open)

### `raiseIntent` (deprecated)

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
raiseIntent(intent: string, context: Context, name: string): Promise<IntentResolution>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Not implemented
```

</TabItem>
<TabItem value="golang" label="Go">

```
Not implemented
```

</TabItem>
</Tabs>

Version of `raiseIntent` that targets an app by name rather than `AppIdentifier`. Provided for backwards compatibility with versions of the FDC3 Standard &lt;2.0.

**See also:**

- [`raiseIntent`](#raiseintent)

### `raiseIntentForContext` (deprecated)

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
raiseIntentForContext(context: Context, name: string): Promise<IntentResolution>;
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
Not implemented
```

</TabItem>
<TabItem value="golang" label="Go">

```
Not implemented
```

</TabItem>
</Tabs>

Version of `raiseIntentForContext` that targets an app by name rather than `AppIdentifier`. Provided for backwards compatibility with versions of the FDC3 Standard &lt;2.0.

**See also:**

- [`raiseIntentForContext`](#raiseintentforcontext)
