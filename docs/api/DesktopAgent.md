---
id: DesktopAgent
sidebar_label: DesktopAgent
title: DesktopAgent
hide_title: true
---
# `DesktopAgent`

A Desktop Agent is a desktop component (or aggregate of components) that serves as a launcher and message router (broker) for applications in its domain.

A Desktop Agent can be connected to one or more App Directories and will use directories for application identity and discovery. Typically, a Desktop Agent will contain the proprietary logic of a given platform, handling functionality like explicit application interop workflows where security, consistency, and implementation requirements are proprietary.

## Methods

### `broadcast`

```ts
broadcast(context: Context): void;
```

Publishes context to other apps on the desktop.  Calling `broadcast` at the `DesktopAgent` scope will push the context to whatever `Channel` the app is joined to.  If the app has not explicitly joined a channel, it will implicitly be a member of the `default` channel.  The context routing behavior for the `default` channel is different from other channels, and apps that are not explicitly listening to `default` will not automaticaly recieve broadcasts.  See full details [here](/api-spec#default-channel-behavior).

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


### `open`

```ts
open(name: string, context?: Context): Promise<void>;
```

Launches/links to an app by name.

If a [`Context`](Context) object is passed in, this object will be provided to the opened application via a contextListener.
The Context argument is functionally equivalent to opening the target app with no context and broadcasting the context directly to it.
If opening errors, it returns an `Error` with a string from the [`OpenError`](Errors#openerror) enumeration.

#### Example
 ```js
// no context
await fdc3.open('myApp');

// with context
await fdc3.open('myApp', context);
```

#### See also
* [`Context`](Context)
* [`OpenError`](Errors#openerror)

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

Find all the avalable intents for a particular context.
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
* [`IntentResolution`](#intentresolution)

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
  const myChannel.addContextListener(context => {});
}
catch (err){
  //app could not register the channel
}

```

#### See also
*  [`Channel`](#channel)

### `getSystemChannels`
```ts
getSystemChannels() : Promise<Array<Channel>>;
```
Retrieves a list of the System channels available for the app to join.

#### Example

```js
const systemChannels = await fdc3.getSystemChannels(); 
const redChannel = systemChannels.find(c => c.id === 'red');
```

#### See also
* [`Channel`](#channel)

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
* [`getSystemChannels`](#getSystemChannels)

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

### `addContextListener`

```ts
addContextListener(handler: ContextHandler): Listener;
```
Adds a listener for incoming context broadcast from the Desktop Agent.

#### Examples
```js
const listener = fdc3.addContextListener(context => {
  // context received
});
```

```ts
addContextListener(contextType: string, handler: ContextHandler): Listener;
```

Adds a listener for incoming contexts of the specified type from the Desktop Agent.

#### Example

```js
const listener = fdc3.addContextListener('fdc3.contact', contact => {
  // contact received
});
```

#### See also
* [`Listener`](Listener)
* [`Context`](Context)

## Return Types

### `AppIntent`

```ts
interface AppIntent {
  intent: IntentMetadata;
  apps: Array<AppMetadata>;
}
```
An interface that represents the binding of an intent to apps

#### See also
* [`IntentMetadata`](#intentmetadata)
* [`AppMetadata`](#appmetadata)

### `IntentMetadata`

```ts
interface IntentMetadata {
  name: string;
  displayName: string;
}
```

The Interface used to describe an Intent within the platform.

### `AppMetadata`

```ts
interface AppMetadata {
  name: string;
  title?: string;
  tooltip?: string;
  description?: string;
  icons?: Array<string>;
  images?: Array<string>;
}
```

App metadata is provided by the FDC3 App Directory that the desktop agent connects to. 

It always includes at least a `name` property, which can be used with [`open`](#open) and [`raiseIntent`](#raiseIntent).

Optionally, extra information from the app directory can be returned, to aid in rendering UI elements, e.g. a context menu.
This includes a title, description, tooltip and icon and image URLs.

### `IntentResolution`

```ts
interface IntentResolution {
  source: string;
  data?: object;
  version: string;
}
```

IntentResolution provides a standard format for data returned upon resolving an intent.
 
#### Example
```js
//resolve a "Chain" type intent
const intentResolution = await fdc3.raiseIntent("intentName", context);
```

#### See also
* [`DesktopAgent.raiseIntent`](#raiseintent)