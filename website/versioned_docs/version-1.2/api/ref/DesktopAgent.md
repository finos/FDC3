---
sidebar_label: DesktopAgent
title: DesktopAgent
hide_title: true
original_id: DesktopAgent
---
# `DesktopAgent`

An FDC3 Desktop Agent is a desktop component (or aggregate of components) that serves as an orchestrator for applications in its domain.

A Desktop Agent can be connected to one or more App Directories and will use directories for application identity and discovery. Typically, a Desktop Agent will contain the proprietary logic of a given platform, handling functionality like explicit application interop workflows where security, consistency, and implementation requirements are proprietary.

It is expected that the `DesktopAgent` interface is made available via the [`window.fdc3`](Globals#windowfdc3-object) global object, and that the [`fdc3Ready`](Globals#fdc3ready-event) event fires when it is ready to be used.

```ts
interface DesktopAgent {
  // apps
  open(app: TargetApp, context?: Context): Promise<void>;

  // context
  broadcast(context: Context): void;
  addContextListener(contextType: string | null, handler: ContextHandler): Listener;
  /**
   * @deprecated 'Use `addContextListener(null, handler)` instead of `addContextListener(handler)`
   */
  addContextListener(handler: ContextHandler): Listener;

  // intents
  findIntent(intent: string, context?: Context): Promise<AppIntent>;
  findIntentsByContext(context: Context): Promise<Array<AppIntent>>;
  raiseIntent(intent: string, context: Context, app?: TargetApp): Promise<IntentResolution>;
  raiseIntentForContext(context: Context, app?: TargetApp): Promise<IntentResolution>;
  addIntentListener(intent: string, handler: ContextHandler): Listener;

  // channels
  getOrCreateChannel(channelId: string): Promise<Channel>;
  getSystemChannels(): Promise<Array<Channel>>;
  joinChannel(channelId: string) : Promise<void>;
  getCurrentChannel() : Promise<Channel | null>;
  leaveCurrentChannel() : Promise<void>;

  //implementation info
  getInfo(): ImplementationMetadata;
}
```

## Methods

### `addContextListener`

```ts
addContextListener(contextType: string | null, handler: ContextHandler): Listener;
/**
 * @deprecated 'Use `addContextListener(null, handler)` instead of `addContextListener(handler)`
 */
addContextListener(handler: ContextHandler): Listener;
```

Adds a listener for incoming context broadcast from the Desktop Agent on the current System Channel. If the consumer is only interested in
a context of a particular type, they can use the relevant overload that allows the type to be specified.

#### Examples

```js
// any context
const listener = fdc3.addContextListener(null, context => { ... });

// listener for a specific type
const contactListener = fdc3.addContextListener('fdc3.contact', contact => { ... });
```

#### See also

* [`Listener`](Types#listener)
* [`Context`](Types#context)

### `addIntentListener`

```ts
addIntentListener(intent: string, handler: ContextHandler): Listener;
```

 Adds a listener for incoming Intents from the Agent.

#### Examples

```js
const listener = fdc3.addIntentListener('StartChat', context => {
  // start chat has been requested by another application
});
```

#### See also

* [`Listener`](Types#listener)
* [`Context`](Types#context)

### `broadcast`

```ts
broadcast(context: Context): void;
```

Publishes context to other apps on the desktop.  Calling `broadcast` at the `DesktopAgent` scope will push the context to whatever `Channel` the app is joined to.  If the app is not currently joined to a channel, calling `fdc3.broadcast` will have no effect.  Apps can still directly broadcast and listen to context on any channel via the methods on the `Channel` class.

DesktopAgent implementations should ensure that context messages broadcast to a channel by an application joined to it should not be delivered back to that same application.

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

### `findIntent`

```ts
findIntent(intent: string, context?: Context): Promise<AppIntent>;
```

Find out more information about a particular intent by passing its name, and optionally its context.

_findIntent_ is effectively granting programmatic access to the Desktop Agent's resolver.
It returns a promise resolving to the intent, its metadata and metadata about the apps that are registered to handle it.
This can be used to raise the intent against a specific app.

If the resolution fails, the promise will return an `Error` with a string from the [`ResolveError`](Errors#resolveerror) enumeration.

#### Examples

```js
// I know 'StartChat' exists as a concept, and want to know more about it ...
const appIntent = await fdc3.findIntent("StartChat");
// returns a single AppIntent:
// {
//     intent: { name: "StartChat", displayName: "Chat" },
//     apps: [{ name: "Skype" }, { name: "Symphony" }, { name: "Slack" }]
// }

// raise the intent against a particular app
await fdc3.raiseIntent(appIntent.intent.name, context, appIntent.apps[0].name);
```

#### See also

* [`ResolveError`](Errors#resolveerror)

### `findIntentsByContext`

```ts
findIntentsByContext(context: Context): Promise<Array<AppIntent>>;
```

Find all the available intents for a particular context.
_findIntentsByContext_ is effectively granting programmatic access to the Desktop Agent's resolver.
A promise resolving to all the intents, their metadata and metadata about the apps that registered as handlers is returned, based on the context types the intents have registered.

 If the resolution fails, the promise will return an `Error` with a string from the [`ResolveError`](Errors#resolveerror) enumeration.

#### Example

```js
// I have a context object, and I want to know what I can do with it, hence, I look for intents...
const appIntents = await fdc3.findIntentsByContext(context);

// returns, for example:
// [{
//     intent: { name: "StartCall", displayName: "Call" },
//     apps: [{ name: "Skype" }]
// },
// {
//     intent: { name: "StartChat", displayName: "Chat" },
//     apps: [{ name: "Skype" }, { name: "Symphony" }, { name: "Slack" }]
// }];

// select a particular intent to raise
const startChat = appIntents[1];

// target a particular app
const selectedApp = startChat.apps[0];

// raise the intent, passing the given context, targeting the app
await fdc3.raiseIntent(startChat.intent.name, context, selectedApp.name);
```

#### See also

* [`ResolveError`](Errors#resolveerror)

### `getCurrentChannel`

```ts
getCurrentChannel() : Promise<Channel | null>;
```

Returns the `Channel` object for the current channel membership.  Returns `null` if the app is not joined to a channel.

#### Examples

```js
// get the current channel membership
let current = await fdc3.getCurrentChannel();
```

#### See also

* [`Channel`](Channel)

### `getInfo`

```ts
getInfo(): ImplementationMetadata;
```

Retrieves information about the FDC3 Desktop Agent implementation, such as the implemented version of the FDC3 specification and the name of the implementation provider.

Returns an [`ImplementationMetadata`](Metadata#implementationmetadata) object.  This metadata object can be used to vary the behavior of an application based on the version supported by the Desktop Agent and for logging purposes.

#### Example

```js
import {compareVersionNumbers, versionIsAtLeast} from '@finos/fdc3';

if (fdc3.getInfo && versionIsAtLeast(fdc3.getInfo(), "1.2")) {
  await fdc3.raiseIntentForContext(context);
} else {
  await fdc3.raiseIntent("ViewChart", context);
}
```

#### See also

* [`ImplementationMetadata`](Metadata#implementationmetadata)

### `getOrCreateChannel`

```ts
getOrCreateChannel(channelId: string): Promise<Channel>;
```

Returns a Channel object for the specified channel, creating it (as an _App_ channel) - if it does not exist.
`Error` with a string from the [`ChannelError`](Errors#channelerror) enumeration if channel could not be created or access was denied.

#### Example

```js
try {
  const myChannel = await fdc3.getOrCreateChannel("myChannel");
  const myChannel.addContextListener(null, context => {});
}
catch (err){
  //app could not register the channel
}

```

#### See also

*  [`Channel`](Channel)

### `getSystemChannels`

```ts
getSystemChannels() : Promise<Array<Channel>>;
```

Retrieves a list of the System channels available for the app to join.  This should include the 'global' channel.

#### Example

```js
const systemChannels = await fdc3.getSystemChannels();
const redChannel = systemChannels.find(c => c.id === 'red');
```

#### See also

* [`Channel`](Channel)

### `joinChannel`

```ts
joinChannel(channelId: string) : Promise<void>;
```

Joins the app to the specified channel.
If an app is joined to a channel, all _fdc3.broadcast_ calls will go to the channel, and all listeners assigned via _fdc3.addContextListener_ will listen on the channel.
An app can only be joined to one channel at a time.
Rejects with error if the channel is unavailable or the join request is denied.
 `Error` with a string from the [`ChannelError`](Errors#channelerror) enumeration.

#### Examples

```js
// get all system channels
const channels = await fdc3.getSystemChannels();

// create UI to pick from the system channels

// join the channel on selection
fdc3.joinChannel(selectedChannel.id);

```

#### See also

* [`getSystemChannels`](DesktopAgent#getsystemchannels)

### `leaveCurrentChannel`

```ts
leaveCurrentChannel() : Promise<void>;
```

Removes the app from any channel membership.  Context broadcast and listening through the top-level `fdc3.broadcast` and `fdc3.addContextListener` will be in a no-op when the app is not on a channel.

#### Examples

```js
//desktop-agent scope context listener
const fdc3Listener = fdc3.addContextListener(null, context => {});

await fdc3.leaveCurrentChannel();
//the fdc3Listener will now cease recieving context

//listening on a specific channel though, will continue to work
redChannel.addContextListener(null, channelListener);

```

### `open`

```ts
open(app: TargetApp, context?: Context): Promise<void>;
```

Launches an app with target information, which can be either be a string like a name, or an [`AppMetadata`](Metadata#appmetadata) object.

The `open` method differs in use from [`raiseIntent`](DesktopAgent#raiseintent).  Generally, it should be used when the target application is known but there is no specific intent.  For example, if an application is querying the App Directory, `open` would be used to an app returned in the search results.

**Note**, if both the intent and target app name are known, it is recommended to instead use [`raiseIntent`](DesktopAgent#raiseintent) with the `app` argument.

If a [`Context`](Types#context) object is passed in, this object will be provided to the opened application via a contextListener.
The Context argument is functionally equivalent to opening the target app with no context and broadcasting the context directly to it.

If opening errors, it returns an `Error` with a string from the [`OpenError`](Errors#openerror) enumeration.

#### Example

```js
// no context
await fdc3.open('myApp');

// no context, with AppMetadata object as target
await fdc3.open({
  name: 'myApp',
  title: 'The title for the application myApp.',
  description: '...'
});

// with context
await fdc3.open('myApp', context);
```

#### See also

* [`Context`](Types#context)
* [`OpenError`](Errors#openerror)

### `raiseIntent`

```ts
raiseIntent(intent: string, context: Context, app?: TargetApp): Promise<IntentResolution>;
```

Raises a specific intent against a target app.

The desktop agent will resolve the correct app to target based on the provided intent name and context data.

If multiple matching apps are found, the user may be presented with an app picker.
Alternatively, the specific app to target can also be provided (if known).

Returns an `IntentResolution` object with a handle to the app that responded to the intent.

If a target app for the intent cannot be found with the criteria provided, an `Error` with a string from the [`ResolveError`](Errors#resolveerror) enumeration is returned.

#### Example

```js
// find apps to resolve an intent to start a chat with a given contact
const appIntent = await fdc3.findIntent("StartChat", context);

// use the name of one of the associated apps returned by findIntent as the specific intent target
await fdc3.raiseIntent("StartChat", context, appIntent.apps[0].name);

// or use the metadata of the app to fully describe the target app for the intent
await fdc3.raiseIntent("StartChat", context, appIntent.apps[0]);
```

#### See also

* [`Context`](Types#context)
* [`TargetApp`](Types#targetapp)
* [`IntentResolution`](Metadata#intentresolution)
* [`ResolveError`](Errors#resolveerror)

### `raiseIntentForContext`

```ts
raiseIntentForContext(context: Context, app?: TargetApp): Promise<IntentResolution>;
```

Finds and raises an intent against a target app based purely on context data.

The desktop agent will resolve the correct app to target based on the provided context.

This is similar to calling `findIntentsByContext`, and then raising an intent against one of the returned apps, except in this case the desktop agent has the opportunity to provide the user with a richer selection interface where they can choose the intent and target app.

Returns an `IntentResolution` object with a handle to the app that responded to the selected intent.

If a target app for the intent cannot be found with the criteria provided, an `Error` with a string from the [`ResolveError`](Errors#resolveerror) enumeration is returned.

#### Example

```js
const intentResolution = await fdc3.raiseIntentForContext(context);
```

#### See also

* [`Context`](Types#context)
* [`TargetApp`](Types#targetapp)
* [`IntentResolution`](Metadata#intentresolution)
* [`ResolveError`](Errors#resolveerror)
