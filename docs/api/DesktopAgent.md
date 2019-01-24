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
### `open`

```typescript
  open(name: string, context?: Context): Promise<void>;
```

Launches/links to an app by name.

If a [`Context`](Context) object is passed in, this object will be provided to the opened application via a contextListener.
The Context argument is functionally equivalent to opening the target app with no context and broadcasting the context directly to it.
If opening errors, it returns an `Error` with a string from the [`OpenError`](OpenError) enumeration.

#### Examples
 ```javascript
    //no context
    agent.open('myApp');
    //with context
    agent.open('myApp', context);
```

#### See also
* [`Context`](Context)
* [`OpenError`](OpenError)

### `findIntent`

```typescript
findIntent(intent: string, context?: Context): Promise<AppIntent>;
```

Find out more information about a particular intent by passing its name, and optionally its context.

_findIntent_ is effectively granting programmatic access to the Desktop Agent's resolver. 
A promise resolving to the intent, its metadata and metadata about the apps that registered it is returned.
This can be used to raise the intent against a specific app.
 
 
 If the resolution fails, the promise will return an `Error` with a string from the [`ResolveError`](ResolveError) enumeration.

#### Examples
  ```javascript
   // I know 'StartChat' exists as a concept, and want to know more about it ...
   const appIntent = await agent.findIntent("StartChat");
   // returns a single AppIntent:
   // {
   //     intent: { name: "StartChat", displayName: "Chat" },
   //     apps: [{ name: "Skype" }, { name: "Symphony" }, { name: "Slack" }]
   // }
 
   // raise the intent against a particular app
   await agent.raiseIntent(appIntent.intent.name, context, appIntent.apps[0].name);
   ```
   #### See also
   * [`ResolveError`](ResolveError)

### `findIntentsByContext`

```typescript
  findIntentsByContext(context: Context): Promise<Array<AppIntent>>;
```

Find all the avalable intents for a particular context.
_findIntentsByContext_ is effectively granting programmatic access to the Desktop Agent's resolver. 
A promise resolving to all the intents, their metadata and metadata about the apps that registered it is returned, based on the context types the intents have registered.
 
 If the resolution fails, the promise will return an `Error` with a string from the [`ResolveError`](ResolveError) enumeration.
 
 #### Examples
 ```javascript
 // I have a context object, and I want to know what I can do with it, hence, I look for for intents...
 const appIntents = await agent.findIntentsForContext(context);
 
 // returns for example:
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
 await agent.raiseIntent(startChat.intent.name, context, selectedApp.name);
 ```

#### See also
   * [`ResolveError`](ResolveError)

### `broadcast`
```typescript
broadcast(context: Context): void;
```

Publishes context to other apps on the desktop.

#### Examples
```javascript
 agent.broadcast(context);
```
#### See also
* [addContextListener](#addcontextlistener)

### `raiseIntent`

```typescript
  raiseIntent(intent: string, context: Context, target?: string): Promise<IntentResolution>;
```
Raises an intent to the desktop agent to resolve.
#### Examples
```javascript
//raise an intent to start a chat with a given contact
const intentR = await agent.findIntents("StartChat", context);
//use the IntentResolution object to target the same chat app with a new context
agent.raiseIntent("StartChat", newContext, intentR.source);
```
#### See also
* [`IntentMetadata`](IntentMetadata)

### `addIntentListener`
```typescript
  addIntentListener(intent: string, handler: (context: Context) => void): Listener;
```
 Adds a listener for incoming Intents from the Agent.
#### See also
* [`Listener`](Listener)
* [`Context`](Context)

### `addContextListener`
```typescript
  addContextListener(handler: (context: Context) => void): Listener;
```
Adds a listener for incoming context broadcast from the Desktop Agent.

#### See also
* [`Listener`](Listener)
* [`Context`](Context)