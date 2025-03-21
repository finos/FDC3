---
sidebar_label: DesktopAgent
title: DesktopAgent
hide_title: true
original_id: DesktopAgent
---
# `DesktopAgent`

```ts
interface DesktopAgent {
  // apps
  open(name: string, context?: Context): Promise<void>;
  
  // context
  broadcast(context: Context): void;
  addContextListener(handler: ContextHandler): Listener;
  addContextListener(contextType: string, handler: ContextHandler): Listener;

  // intents
  findIntent(intent: string, context?: Context): Promise<AppIntent>;
  findIntentsByContext(context: Context): Promise<Array<AppIntent>>;
  raiseIntent(intent: string, context: Context, target?: string): Promise<IntentResolution>;
  addIntentListener(intent: string, handler: ContextHandler): Listener;
  
  // channels
  getOrCreateChannel(channelId: string): Promise<Channel>;
  getSystemChannels(): Promise<Array<Channel>>;
  joinChannel(channelId: string) : Promise<void>;
  getCurrentChannel() : Promise<Channel>;
  leaveCurrentChannel() : Promise<void>;
}
```

A Desktop Agent is a desktop component (or aggregate of components) that serves as a launcher and message router (broker) for applications in its domain.

A Desktop Agent can be connected to one or more App Directories and will use directories for application identity and discovery. Typically, a Desktop Agent will contain the proprietary logic of a given platform, handling functionality like explicit application interop workflows where security, consistency, and implementation requirements are proprietary.

## Methods

### `addContextListener`

```ts
addContextListener(handler: ContextHandler): Listener;
addContextListener(contextType: string, handler: ContextHandler): Listener;
```

Adds a listener for incoming context broadcast from the Desktop Agent. If the consumer is only interested in
a context of a particular type, they can use the relevant overload that allows the type to be specified.

#### Examples

```js
// any context
const listener = fdc3.addContextListener(context => { ... });

// listener for a specific type
const contactListener = fdc3.addContextListener('fdc3.contact', contact => { ... });
```

#### See also
* [`Listener`](Listener)
* [`Context`](Context)

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

* [`Listener`](Listener)
* [`Context`](Context)

### `broadcast`

```ts
broadcast(context: Context): void;
```

Publishes context to other apps on the desktop.  Calling `broadcast` at the `DesktopAgent` scope will push the context to whatever `Channel` the app is joined to.  If the app is not currently joined to a channel, calling `fdc3.broadcast` will have no effect.  Apps can still directly broadcast and listen to context on any channel via the methods on the `Channel` class.

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

 If the resolution fails, the promise will return an `Error` with a string from the [`ResolveError`](ResolveError) enumeration.

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

* [`ResolveError`](ResolveError)

### `findIntentsByContext`

```ts
findIntentsByContext(context: Context): Promise<Array<AppIntent>>;
```

Find all the available intents for a particular context.
_findIntentsByContext_ is effectively granting programmatic access to the Desktop Agent's resolver. 
A promise resolving to all the intents, their metadata and metadata about the apps that registered as handlers is returned, based on the context types the intents have registered.

If the resolution fails, the promise will return an `Error` with a string from the [`ResolveError`](ResolveError) enumeration.

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

* [`ResolveError`](ResolveError)

### `getCurrentChannel`

```ts
getCurrentChannel() : Promise<Channel>;
```

Returns the `Channel` object for the current channel membership.  Returns `null` if the app is not joined to a channel. 

#### Examples

```js
//get the current channel membership
let current = await fdc3.getCurrentChannel();
```

#### See also

* [`Channel`](Channel)

### `getOrCreateChannel`

```ts
getOrCreateChannel(channelId: string): Promise<Channel>;
```

Returns a Channel object for the specified channel, creating it (as an _App_ channel) - if it does not exist.
`Error` with a string from the [`ChannelError`](ChannelError) enumeration if channel could not be created or access was denied.

#### Example

```js
try {
  const myChannel = await fdc3.getOrCreateChannel("myChannel");
  const myChannel.addContextListener(context => {});
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
 `Error` with a string from the [`ChannelError`](ChannelError) enumeration.

#### Examples

```js
// get all system channels
const channels = await fdc3.getSystemChannels();

// create UI to pick from the system channels

// join the channel on selection
fdc3.joinChannel(selectedChannel.id);

```

#### See also

* [`getSystemChannels`](#getsystemchannels)

### `leaveCurrentChannel`

```ts
leaveCurrentChannel() : Promise<void>;
```

Removes the app from any channel membership.  Context broadcast and listening through the top-level `fdc3.broadcast` and `fdc3.addContextListener` will be in a no-op when the app is not on a channel.

#### Examples

```js
//desktop-agent scope context listener
const fdc3Listener = fdc3.addContextListener(context => {});

await fdc3.leaveCurrentChannel();
//the fdc3Listener will now cease receiving context

//listening on a specific channel though, will continue to work
redChannel.addContextListener(channelListener);

```

### `open`

```ts
open(name: string, context?: Context): Promise<void>;
```

Launches/links to an app by name.

If a [`Context`](Context) object is passed in, this object will be provided to the opened application via a contextListener.
The Context argument is functionally equivalent to opening the target app with no context and broadcasting the context directly to it.
If opening errors, it returns an `Error` with a string from the [`OpenError`](OpenError) enumeration.

#### Example

```js
// no context
await fdc3.open('myApp');

// with context
await fdc3.open('myApp', context);
```

#### See also

* [`Context`](Context)
* [`OpenError`](OpenError)

### `raiseIntent`

```ts
raiseIntent(intent: string, context: Context, target?: string): Promise<IntentResolution>;
```

Raises an intent to the desktop agent to resolve.

#### Example

```js
//raise an intent to start a chat with a given contact
const intentResolution = await fdc3.findIntents("StartChat", context);
//use the IntentResolution object to target the same chat app with a new context
await fdc3.raiseIntent("StartChat", newContext, intentResolution.source);
```

#### See also

* [`IntentResolution`](IntentResolution)
