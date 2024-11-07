---
sidebar_label: DesktopAgent
title: DesktopAgent
hide_title: true
---
# `DesktopAgent`

An FDC3 Desktop Agent is a desktop component (or aggregate of components) that serves as an orchestrator for applications in its domain.

A Desktop Agent can be connected to one or more App Directories and will use directories for application identity and discovery. Typically, a Desktop Agent will contain the proprietary logic of a given platform, handling functionality like explicit application interop workflows where security, consistency, and implementation requirements are proprietary.

It is expected that the `DesktopAgent` interface is made availabe via the [`window.fdc3`](Globals#windowfdc3-object) global object, and that the [`fdc3Ready`](Globals#fdc3ready-event) event fires when it is ready to be used.

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

  //implementation info
  getInfo(): Promise<ImplementationMetadata>;

  //Deprecated functions
  addContextListener(handler: ContextHandler): Promise<Listener>;
  getSystemChannels(): Promise<Array<Channel>>;
  joinChannel(channelId: string) : Promise<void>;
  open(name: String, context?: Context): Promise<AppIdentifier>;
  raiseIntent(intent: string, context: Context, name: String): Promise<IntentResolution>;
  raiseIntentForContext(context: Context, name: String): Promise<IntentResolution>;
}
```

## Functions

### `addContextListener`

```ts
addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener>;
```

Adds a listener for incoming context broadcasts from the Desktop Agent. If the consumer is only interested in a context of a particular type, they can specify that type. If the consumer is able to receive context of any type or will inspect types received, then they can pass `null` as the `contextType` parameter to receive all context types.

Context broadcasts are only received from apps that are joined to the same User Channel as the listening application, hence, if the application is not currently joined to a User Channel no broadcasts will be received. If this function is called after the app has already joined a channel and the channel already contains context that would be passed to the context listener, then it will be called immediately with that context.

Optional metadata about each context message received, including the app that originated the message, SHOULD be provided by the desktop agent implementation.

#### Examples

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

#### See also

* [`Listener`](Types#listener)
* [`Context`](Types#context)
* [`ContextHandler`](Types#contexthandler)

### `addIntentListener`

```ts
addIntentListener(intent: string, handler: IntentHandler): Promise<Listener>;
```

Adds a listener for incoming intents from the Desktop Agent. The handler function may return void or a promise that resolves to a [`IntentResult`](Types#intentresult), which is either a [`Context`](Types#context) object, representing any data that should be returned to the app that raised the intent, or a [`Channel`](Channel) or [`PrivateChannel`](PrivateChannel) over which data responses will be sent. The `IntentResult` will be returned to the app that raised the intent via the [`IntentResolution`](Metadata#intentresolution) and retrieved from it using the `getResult()` function.

The Desktop Agent MUST reject the promise returned by the `getResult()` function of `IntentResolution` if: (1) the intent handling function's returned promise rejects, (2) the intent handling function doesn't return a promise, or (3) the returned promise resolves to an invalid type.

The [`PrivateChannel`](PrivateChannel) type is provided to support synchronisation of data transmitted over returned channels, by allowing both parties to listen for events denoting subscription and unsubscription from the returned channel. `PrivateChannels` are only retrievable via raising an intent.

Optional metadata about each intent & context message received, including the app that originated the message, SHOULD be provided by the desktop agent implementation.

#### Examples

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
  const symbol = context.id.symbol;

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

#### See also

* [Register an Intent Handler](../spec#register-an-intent-handler)
* [`PrivateChannel`](PrivateChannel)
* [`Listener`](Types#listener)
* [`Context`](Types#context)
* [`IntentHandler`](Types#intenthandler)

### `broadcast`

```ts
broadcast(context: Context): Promise<void>;
```

Publishes context to other apps on the desktop.  Calling `broadcast` at the `DesktopAgent` scope will push the context to whatever _User Channel_ the app is joined to.  If the app is not currently joined to a channel, calling `fdc3.broadcast` will have no effect.  Apps can still directly broadcast and listen to context on any channel via the methods on the `Channel` class.

DesktopAgent implementations should ensure that context messages broadcast to a channel by an application joined to it are not delivered back to that same application.

If you are working with complex context types composed of other simpler types (as recommended by the [Context Data specification](../../context/spec#assumptions)) then you should broadcast each individual type (starting with the simpler types, followed by the complex type) that you want other apps to be able to respond to. Doing so allows applications to filter the context types they receive by adding listeners for specific context types.

#### Example

```js
const instrument = {
    type: 'fdc3.instrument',
    id: {
        ticker: 'AAPL'
    }
};

fdc3.broadcast(instrument);
```

#### See also

* [addContextListener](#addcontextlistener)

### `createPrivateChannel`

```ts
createPrivateChannel(): Promise<PrivateChannel>;
```

Returns a `Channel` with an auto-generated identity that is intended for private communication between applications. Primarily used to create channels that will be returned to other applications via an IntentResolution for a raised intent.

If the `PrivateChannel` cannot be created, the returned promise MUST be rejected with an `Error` object with a `message` chosen from the [`ChannelError`](Errors#channelerror) enumeration.

The `PrivateChannel` type is provided to support synchronisation of data transmitted over returned channels, by allowing both parties to listen for events denoting subscription and unsubscription from the returned channel. `PrivateChannels` are only retrievable via raising an intent.

It is intended that Desktop Agent implementations:

* SHOULD restrict external apps from listening or publishing on this channel.
* MUST prevent `PrivateChannels` from being retrieved via fdc3.getOrCreateChannel.
* MUST provide the `id` value for the channel as required by the `Channel` interface.

#### Example

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
  const unsubscriberListener = channel.onUnsubscribe((contextType) => {
    feed.stop(symbol);
  });

  // This gets called if the remote side closes
  const disconnectListener = channel.onDisconnect(() => {
    feed.stop(symbol);
  });

  return channel;
});
```

#### See also

* [`PrivateChannel`](PrivateChannel)
* [`raiseIntent`](#raiseintent)
* [`addIntentListener`](#addintentlistener)

### `findInstances`

```ts
findInstances(app: AppIdentifier): Promise<Array<AppIdentifier>>;
```

Find all the available instances for a particular application.

If there are no instances of the specified application the returned promise should resolve to an empty array.

If the request fails for another reason, the promise MUST be rejected with an `Error` Object with a `message` chosen from the `ResolveError` enumeration.

#### Example

```js
// Retrieve a list of instances of an application
let instances = await fdc3.findInstances({appId: "MyAppId"});

// Target a raised intent at a specific instance
let resolution = fdc3.raiseIntent("ViewInstrument", context, instances[0]);
```

### `findIntent`

```ts
findIntent(intent: string, context?: Context, resultType?: string): Promise<AppIntent>;
```

Find out more information about a particular intent by passing its name, and optionally its context and/or a desired result context type.

`findIntent` is effectively granting programmatic access to the Desktop Agent's resolver.
It returns a promise resolving to an `AppIntent` which provides details of the intent, its metadata and metadata about the apps and app instances that are registered to handle it. This can be used to raise the intent against a specific app or app instance.

If the resolution fails, the promise MUST be rejected with an `Error` Object with a `message` chosen from the [`ResolveError`](Errors#resolveerror) enumeration. This includes the case where no apps are found that resolve the intent, when the `ResolveError.NoAppsFound` message should be used.

Result types may be a type name, the string `"channel"` (which indicates that the app will return a channel) or a string indicating a channel that returns a specific type, e.g. `"channel<fdc3,instrument>"`. If intent resolution to an app returning a channel is requested, the desktop agent MUST include both apps that are registered as returning a channel and those registered as returning a channel with a specific type in the response.

#### Examples

I know 'StartChat' exists as a concept, and want to know which apps can resolve it:

```js
const appIntent = await fdc3.findIntent("StartChat");
// returns a single AppIntent:
// {
//   intent: { name: "StartChat", displayName: "Chat" },
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
//   intent: { name: "StartChat", displayName: "Chat" },
//   apps: [
//    { appId: "Skype" },
//    { appId: "Symphony" },
//    { appId: "Symphony", instanceId: "93d2fe3e-a66c-41e1-b80b-246b87120859" },
//    { appId: "Slack" }
//   ]
```

An optional input context object and/or `resultType` argument may be specified, which the resolver MUST use to filter the returned applications such that each supports the specified input and result types.

```js
const appIntent = await fdc3.findIntent("StartChat", contact);

// returns only apps that support the type of the specified input context:
// {
//     intent: { name: "StartChat", displayName: "Chat" },
//     apps: { name: "Symphony" }]
// }

const appIntent = await fdc3.findIntent("ViewContact", "fdc3.ContactList");
// returns only apps that return the specified result type:
// {
//     intent: { name: "ViewContact", displayName: "View Contact Details" },
//     apps: { appId: "MyCRM", resultType: "fdc3.ContactList"}]
// }

const appIntent = await fdc3.findIntent("QuoteStream", instrument, "channel<fdc3.Quote>");
// returns only apps that return a channel which will receive the specified input and result types:
// {
//     intent: { name: "QuoteStream", displayName: "Quotes stream" },
//     apps: { appId: "MyOMS", resultType: "channel<fdc3.Quote>"}]
// }
```

#### See also

* [`ResolveError`](Errors#resolveerror)

### `findIntentsByContext`

```ts
findIntentsByContext(context: Context, resultType?: string): Promise<Array<AppIntent>>;
```

Find all the available intents for a particular context, and optionally a desired result context type.

`findIntentsByContext` is effectively granting programmatic access to the Desktop Agent's resolver.
A promise resolving to all the intents, their metadata and metadata about the apps and app instances that registered as handlers is returned, based on the context types the intents have registered.

If the resolution fails, the promise MUST be rejected with an `Error` Object with a `message` chosen from the [`ResolveError`](Errors#resolveerror) enumeration. This includes the case where no intents with associated apps are found, when the `ResolveError.NoAppsFound` message should be used.

The optional `resultType` argument may be a type name, the string `"channel"` (which indicates that the app will return a channel) or a string indicating a channel that returns a specific type, e.g. `"channel<fdc3,instrument>"`. If intent resolution to an app returning a channel is requested without a specified context type, the desktop agent MUST include both apps that are registered as returning a channel and those registered as returning a channel with a specific type in the response.

#### Example

I have a context object, and I want to know what I can do with it, hence, I look for intents and apps to resolve them...

```js
const appIntents = await fdc3.findIntentsByContext(context);

// returns, for example:
// [
//   {
//     intent: { name: "StartCall", displayName: "Call" },
//     apps: [{ appId: "Skype" }]
//   },
//   {
//     intent: { name: "StartChat", displayName: "Chat" },
//     apps: [
//       { appId: "Skype" },
//       { appId: "Symphony" },
//       { appId: "Symphony", instanceId: "93d2fe3e-a66c-41e1-b80b-246b87120859" },
//       { appId: "Slack" }
//     ]
//   },
//   {
//     intent: { name: "ViewContact", displayName: "View Contact" },
//     apps: [{ appId: "Symphony" }, { appId: "MyCRM", resultType: "fdc3.ContactList"}]
//   }
// ];
```

or I look for only intents that are resolved by apps returning a particular result type

```js
const appIntentsForType = await fdc3.findIntentsByContext(context, "fdc3.ContactList");
// returns for example:
// [{
//     intent: { name: "ViewContact", displayName: "View Contact" },
//     apps: [{ appId: "Symphony" }, { appId: "MyCRM", resultType: "fdc3.ContactList"}]
// }];

// select a particular intent to raise
const startChat = appIntents[1];

// target a particular app or instance
const selectedApp = startChat.apps[2];

// raise the intent, passing the given context, targeting the app
await fdc3.raiseIntent(startChat.intent.name, context, selectedApp);
```

#### See also

* [`findIntent()`](#findintent)
* [`ResolveError`](Errors#resolveerror)

### `getAppMetadata`

```ts
getAppMetadata(app: AppIdentifier): Promise<AppMetadata>;
```

Retrieves the [`AppMetadata`](Metadata#appmetadata) for an [`AppIdentifier`](Types#appidentifier), which provides additional metadata (such as icons, a title and description) from the App Directory record for the application, that may be used for display purposes.

#### Examples

```js
let appIdentifier = { appId: "MyAppId@my.appd.com" }
let appMetadata = await fdc3.getAppMetadata(appIdentifier);
```

#### See also

* [`AppMetadata`](Metadata#appmetadata)
* [`AppIdentifier`](Types#appidentifier)

### `getCurrentChannel`

```ts
getCurrentChannel() : Promise<Channel | null>;
```

OPTIONAL function that returns the `Channel` object for the current User channel membership.  In most cases, an application's membership of channels SHOULD be managed via UX provided to the application by the desktop agent, rather than calling this function directly.

Returns `null` if the app is not joined to a channel.

#### Examples

```js
// get the current channel membership
let current = await fdc3.getCurrentChannel();
```

#### See also

* [`Channel`](Channel)

### `getInfo`

```ts
getInfo(): Promise<ImplementationMetadata>;
```

Retrieves information about the FDC3 Desktop Agent implementation, including the supported version of the FDC3 specification, the name of the provider of the implementation, its own version number, details of whether optional API features are implemented and the metadata of the calling application according to the desktop agent.

Returns an [`ImplementationMetadata`](Metadata#implementationmetadata) object.  This metadata object can be used to vary the behavior of an application based on the version supported by the Desktop Agent and for logging purposes.

#### Example

```js
import {compareVersionNumbers, versionIsAtLeast} from '@finos/fdc3';

if (fdc3.getInfo && versionIsAtLeast(await fdc3.getInfo(), "1.2")) {
  await fdc3.raiseIntentForContext(context);
} else {
  await fdc3.raiseIntent("ViewChart", context);
}
```

The `ImplementationMetadata` object returned also includes the metadata for the calling application, according to the Desktop Agent. This allows the application to retrieve its own `appId`, `instanceId` and other details, e.g.:

```js
let implementationMetadata = await fdc3.getInfo();
let {appId, instanceId} = implementationMetadata.appMetadata;
```

#### See also

* [`ImplementationMetadata`](Metadata#implementationmetadata)
* [`AppMetadata`](Metadata#appmetadata)

### `getOrCreateChannel`

```ts
getOrCreateChannel(channelId: string): Promise<Channel>;
```

Returns a `Channel` object for the specified channel, creating it (as an _App_ channel) if it does not exist.

If the Channel cannot be created or access was denied, the returned promise MUST be rejected with an `Error` Object with a `message` chosen from the `ChannelError` enumeration.

#### Example

```js
try {
  const myChannel = await fdc3.getOrCreateChannel("myChannel");
  myChannel.addContextListener(null, context => { /* do something with context */});
}
catch (err){
  //app could not register the channel
}
```

#### See also

* [`Channel`](Channel)

### `getUserChannels`

```ts
getUserChannels() : Promise<Array<Channel>>;
```

Retrieves a list of the User Channels available for the app to join.

#### Example

```js
const userChannels = await fdc3.getUserChannels();
const redChannel = userChannels.find(c => c.id === 'red');
```

#### See also

* [`Channel`](Channel)

### `joinUserChannel`

```ts
joinUserChannel(channelId: string) : Promise<void>;
```

OPTIONAL function that joins the app to the specified User channel. In most cases, applications SHOULD be joined to channels via UX provided to the application by the desktop agent, rather than calling this function directly.

If an app is joined to a channel, all `fdc3.broadcast` calls will go to the channel, and all listeners assigned via `fdc3.addContextListener` will listen on the channel.

If the channel already contains context that would be passed to context listeners added via `fdc3.addContextListener` then those listeners will be called immediately with that context.

An app can only be joined to one channel at a time.

If an error occurs (such as the channel is unavailable or the join request is denied) the promise MUST be rejected with an `Error` Object with a `message` chosen from the [`ChannelError`](Errors#channelerror) enumeration.

#### Examples

```js
// get all user channels
const channels = await fdc3.getUserChannels();

// create UI to pick from the User channels

// join the channel on selection
fdc3.joinUserChannel(selectedChannel.id);

```

#### See also

* [`getUserChannels`](#getuserchannels)

### `leaveCurrentChannel`

```ts
leaveCurrentChannel() : Promise<void>;
```

OPTIONAL function that removes the app from any User channel membership.  In most cases, an application's membership of channels SHOULD be managed via UX provided to the application by the desktop agent, rather than calling this function directly.

Context broadcast and listening through the top-level `fdc3.broadcast` and `fdc3.addContextListener` will be a no-op when the app is not joined to a User channel.

#### Examples

```js
//desktop-agent scope context listener
const fdc3Listener = fdc3.addContextListener(null, context => {});

await fdc3.leaveCurrentChannel();
//the fdc3Listener will now cease receiving context

//listening on a specific channel though, will continue to work
redChannel.addContextListener(null, channelListener);

```

### `open`

```ts
open(app: AppIdentifier, context?: Context): Promise<AppIdentifier>;
```

Launches an app, specified via an [`AppIdentifier`](Types#appidentifier) object.

The `open` method differs in use from [`raiseIntent`](#raiseintent).  Generally, it should be used when the target application is known but there is no specific intent.  For example, if an application is querying an App Directory, `open` would be used to open an app returned in the search results.

**Note**, if the intent, context and target app name are all known, it is recommended to instead use [`raiseIntent`](#raiseintent) with the `target` argument.

If a [`Context`](Types#context) object is passed in, this object will be provided to the opened application via a contextListener. The Context argument is functionally equivalent to opening the target app with no context and broadcasting the context directly to it.

Returns an [`AppIdentifier`](Types#appidentifier) object with the `instanceId` field set to identify the instance of the application opened by this call.

If an error occurs while opening the app, the promise MUST be rejected with an `Error` Object with a `message` chosen from the [`OpenError`](Errors#openerror) enumeration.

#### Example

 ```js
// Open an app without context, using an AppIdentifier object to specify the target
let appIdentifier = { appId: 'myApp-v1.0.1' };
let instanceIdentifier = await fdc3.open(appIdentifier);

// Open an app with context
let instanceIdentifier = await fdc3.open(appIdentifier, context);
```

#### See also

* [`Context`](Types#context)
* [`AppIdentifier`](Types#appidentifier)
* [`AppMetadata`](Metadata#appmetadata)
* [`OpenError`](Errors#openerror)

### `raiseIntent`

```ts
raiseIntent(intent: string, context: Context, app?: AppIdentifier): Promise<IntentResolution>;
```

Raises a specific intent for resolution against apps registered with the desktop agent.

The desktop agent MUST resolve the correct app to target based on the provided intent name and context data. If multiple matching apps are found, a method for resolving the intent to a target app, such as presenting the user with a resolver UI allowing them to pick an app, SHOULD be provided.
Alternatively, the specific app or app instance to target can also be provided. A list of valid target applications and instances can be retrieved via [`findIntent`](DesktopAgent#findintent).

If a target app for the intent cannot be found with the criteria provided or the user either closes the resolver UI or otherwise cancels resolution, the promise MUST be rejected with an `Error` object with a `message` chosen from the [`ResolveError`](Errors#resolveerror) enumeration. If a specific target `app` parameter was set, but either the app or app instance is not available, the promise MUST be rejected with an `Error` object with either the `ResolveError.TargetAppUnavailable` or `ResolveError.TargetInstanceUnavailable` string as its `message`.

If you wish to raise an intent without a context, use the `fdc3.nothing` context type. This type exists so that apps can explicitly declare support for raising an intent without context.

Returns an [`IntentResolution`](Metadata#intentresolution) object with details of the app instance that was selected (or started) to respond to the intent.

Issuing apps may optionally wait on the promise that is returned by the `getResult()` member of the IntentResolution. This promise will resolve when the _receiving app's_ intent handler function returns and resolves a promise. The Desktop Agent resolves the issuing app's promise with the Context object or Channel that is provided as resolution by the receiving app. The Desktop Agent MUST reject the issuing app's promise, with a string from the [`ResultError`](Errors#resulterror) enumeration, if: (1) the intent handling function's returned promise rejects, (2) the intent handling function doesn't return a promise, or (3) the returned promise resolves to an invalid type.

#### Example

```js
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
} catch(error) {
  console.error(`${resolution.source} returned a result error: ${error}`);
}
```

#### See also

* [Raising Intents](../spec#raising-intents)
* [`Context`](Types#context)
* [`AppIdentifier`](Types#AppIdentifier)
* [`IntentResult`](Types#intentresult)
* [`IntentResolution`](Metadata#intentresolution)
* [`ResolveError`](Errors#resolveerror)
* [`ResultError`](Errors#resulterror)

### `raiseIntentForContext`

```ts
raiseIntentForContext(context: Context, app?: AppIdentifier): Promise<IntentResolution>;
```

Finds and raises an intent against apps registered with the desktop agent based purely on the type of the context data.

The desktop agent SHOULD first resolve to a specific intent based on the provided context if more than one intent is available for the specified context. This MAY be achieved by displaying a resolver UI. It SHOULD then resolve to a specific app to handle the selected intent and specified context.
Alternatively, the specific app or app instance to target can also be provided, in which case any method of resolution SHOULD only consider intents supported by the specified application.

Using `raiseIntentForContext` is similar to calling `findIntentsByContext`, and then raising an intent against one of the returned apps, except in this case the desktop agent has the opportunity to provide the user with a richer selection interface where they can choose both the intent and target app.

Returns an `IntentResolution` object, see [`raiseIntent()`](#raiseintent) for details.

If a target intent and app cannot be found with the criteria provided or the user either closes the resolver UI or otherwise cancels resolution, the promise MUST be rejected with an `Error` object with a `message` chosen from the [`ResolveError`](Errors#resolveerror) enumeration. If a specific target `app` parameter was set, but either the app or app instance is not available, the promise MUST be rejected with an `Error` object with either the `ResolveError.TargetAppUnavailable` or `ResolveError.TargetInstanceUnavailable` string as its `message`.

#### Example

```js
// Display a resolver UI for the user to select an intent and application to resolve it
const intentResolution = await fdc3.raiseIntentForContext(context);

// Resolve against all intents registered by a specific target app for the specified context
await fdc3.raiseIntentForContext(context, targetAppIdentifier);
```

#### See also

* [Raising Intents](../spec#raising-intents)
* [`raiseIntent()`](#raiseintent)
* [`Context`](Types#context)
* [`AppIdentifier`](Types#appidentifier)
* [`IntentResolution`](Metadata#intentresolution)
* [`ResolveError`](Errors#resolveerror)

## Deprecated Functions

### `addContextListener` (deprecated)

```ts
addContextListener(handler: ContextHandler): Promise<Listener>;
```

Adds a listener for incoming context broadcasts from the Desktop Agent. Provided for backwards compatibility with versions FDC3 standard &lt;2.0.

#### See also

* [`addContextListener`](#addcontextlistener)

### `getSystemChannels` (deprecated)

```ts
getSystemChannels() : Promise<Array<Channel>>;
```

Alias to the [`getUserChannels`](#getuserchannels) function provided for backwards compatibility with version 1.1 & 1.2 of the FDC3 standard.
#### See also

* [`getUserChannels`](#getuserchannels)

### `joinChannel` (deprecated)

```ts
joinChannel(channelId: string) : Promise<void>;
```

Alias to the [`joinUserChannel`](#joinuserchannel) function provided for backwards compatibility with version 1.1 & 1.2 of the FDC3 standard.

#### See also
* [`joinUserChannel`](#joinuserchannel)

### `open` (deprecated)

```ts
open(name: String, context?: Context): Promise<AppIdentifier>;
```

Version of `open` that launches an app by name rather than `AppIdentifier`. Provided for backwards compatibility with versions of the FDC3 Standard &lt;2.0.

#### See also

* [`open`](#open)

### `raiseIntent` (deprecated)

```ts
raiseIntent(intent: string, context: Context, name: String): Promise<IntentResolution>;
```

Version of `raiseIntent` that targets an app by name rather than `AppIdentifier`. Provided for backwards compatibility with versions of the FDC3 Standard &lt;2.0.

#### See also

* [`raiseIntent`](#raiseintent)

### `raiseIntentForContext` (deprecated)

```ts
raiseIntentForContext(context: Context, name: String): Promise<IntentResolution>;;
```

Version of `raiseIntentForContext` that targets an app by name rather than `AppIdentifier`. Provided for backwards compatibility with versions of the FDC3 Standard &lt;2.0.

#### See also

* [`raiseIntentForContext`](#raiseintentforcontext)
