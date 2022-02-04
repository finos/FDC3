---
id: spec
sidebar_label: API Specification
title: API Specification (next)
---

## Components
### Desktop Agent
A Desktop Agent is a desktop component (or aggregate of components) that serves as a launcher and message router (broker) for applications in its domain.  A Desktop Agent can be connected to one or more App Directories and will use directories for application identity and discovery. Typically, a Desktop Agent will contain the proprietary logic of a given platform, handling functionality like explicit application interop workflows where security, consistency, and implementation requirements are proprietary.

Examples of Desktop Agents include:

- Autobahn
- Cosaic's Finsemble
- Glue42
- OpenFin
- Refinitiv Eikon

Desktop Agents expose an FDC3 standard API to applications they have launched.  When an App is launched by a Desktop Agent and is given access to the Agent's API to interoperate, it is running in that Desktop Agent's *context*.

#### Desktop Agent Implementation
The FDC3 API specification consists of interfaces.  It is expected that each Desktop Agent will implement these interfaces.  A typical implemention would provide instantiable classes for the following interfaces:

- `DesktopAgent`
- `Channel`
- `Listener`

Other interfaces defined in the spec are not critical to define as concrete types.  Rather, the Desktop Agent should expect to have objects of the interface shape passed into or out of their library.  These interfaces include:

- `Context`
- `AppIntent`
- `IntentResolution`
- `AppMetadata`
- `IntentMetadata`
- `DisplayMetadata`


#### API Access
The FDC3 API can be made available to an application through a number of different methods.  In the case of web applications, a Desktop Agent MUST provide the FDC3 API via a global accessible as `window.fdc3`. Implementors MAY additionally make the API available through modules, imports, or other means.

The global `window.fdc3` must only be available after the API is ready to use. To enable applications to avoid using the API before it is ready, implementors MUST provide a global `fdc3Ready` event. Here is code demonstrating the use of the FDC3 API and the ready event:

```js
function fdc3Stuff() {
  // Make fdc3 API calls here
}

if (window.fdc3) {
  fdc3Stuff();
} else {
  window.addEventListener('fdc3Ready', fdc3Stuff);
}
```

#### Standards vs. Implementation
![Desktop Agent - Standards Schematic](assets/api-1.png)

The surface area of FDC3 standardization (shown in *white* above) itself is quite small in comparison to the extent of a typical desktop agent implementation (in *grey*).

For example:
- workspace management
- user identity and SSO
- entitlements
- UX of application resolution

Are all areas of functionality that any feature complete desktop agent would implement, but are not currently areas considered for standardization under FDC3.

#### Inter-Agent Communication
A goal of FDC3 standards is that applications running in different Desktop Agent contexts on the same desktop would be able to interoperate.  And that one Desktop Agent context would be able to discover and launch an application in another Desktop Application context.

![Desktop Agent - Interop](assets/api-2.png)

Desktop Agent interop is supported by common standards for APIs for App discovery and launching.  So, an App in one Desktop Agent context would not need to know a different syntax to call an App in another Desktop Agent context.

The actual connection protocol between Desktop Agents is not currently in scope for FDC3 standards.  Given that there are a relatively small number of Desktop Agents, and that any given desktop will have a finite and relatively static number of Desktop Agents installed at any given time, the connectivity between different Agents can be adequetly handled for the time being on a case-by-case basis.

### Application
An application is any endpoint on the desktop that is:
- Registered with/known by a Desktop Agent
- Launchable by a Desktop Agent
- Addressable by a Desktop Agent

Examples of End Points include:
- Native Applications
- PWA/Web Applications
- Headless “services” running on the desktop

## Functional Use Cases
### Open an Application by Name
Linking from one application to another is a critical basic workflow that the web revolutionized via the hyperlink.  Supporting semantic addressing of applications across different technologies and platform domains greatly reduces friction in linking different applications into a single workflow.

### Raising Intents
Often, we want to link from one app to another to dynamically create a workflow.  Enabling this without requiring prior knowledge between apps is a key goal of FDC3.

Intents provide a way for an app to request functionality from another app and defer the discovery and launching of the destination app to the Desktop Agent.  There are multiple models for interop that intents can support.

- **Chain**:  In this case the workflow is completely handed off from one app to another (similar to linking).  Currently, this is the primary focus in FDC3.
- **Client-Service**: A Client invokes a Service via the Intent, the Service performs some function, then passes the workflow back to the Client. Typically, there is a data payload type associated with this intent that is published as the standard contract for the intent.
- **Remote API**: An app wants to remote an entire API that it owns to another App.  In this case, the API for the App cannot be standardized.  However, the FDC3 API can address how an App connects to another App in order to get access to a proprietary API.

#### Intents and Context
When raising an intent a specific context may be provided as input. The type of the provided context may determine which applications can resolve the Intent.

A context type may also be associated with multiple intents. For example, an `fdc3.instrument` could be associated with `ViewChart`, `ViewNews`, `ViewAnalysis` or other intents. In addition to raising a specific intent, you can raise an intent for a specific context allowing the Desktop Agent or the user (if the intent is ambiguous) to select the appropriate intent for the selected context and then to raise that intent for resolution.

To raise an intent without a context, use the `fdc3.nothing` context type. This type exists so that applications can explicitly declare that they support raising an intent without a context (when registering an intent listener or in an App Directory).

An optional context object may also be returned as output by an application resolving an intent. For example, an application resolving a `CreateOrder` intent might return a context representing the order and including an ID, allowing the application that raised the intent to make further calls using that ID.  

#### Intent Resolution
Raising an intent will return a Promise-type object that will resolve/reject based on a number of factors.

##### Resolve
- Intent was resolved unambiguously and the receiving app was launched successfully (if necessary).
- Intent was ambiguous, a resolution was chosen by the end user, and the chosen application was launched successfully.

##### Reject
- No app matching the intent and context (if specified) was found.
- A match was found, but the receiving app failed to launch.
- The intent was ambiguous and the resolver experienced an error.

##### Resolution Object

If the raising of the intent resolves (or rejects), a standard object will be passed into the resolver function with the following format:

```ts
interface IntentResolution {
  /** 
   * Metadata about the app instance that was selected (or started) to resolve the intent.
   * `source.instanceId` MUST be set, indicating the specific app instance that 
   * received the intent.
   */
  readonly source: AppMetadata;
  /**
   * The intent that was raised. May be used to determine which intent the user
   * chose in response to `fdc3.raiseIntentForContext()`.
   */
  readonly intent: string;
  /**
   * The version number of the Intents schema being used.
   */
  readonly version?: string;
  /**
   * Retrieves a promise that will resolve to data returned by the
   * application that resolves the raised intent. If an error is thrown by the handler function, 
   * the promise returned is rejected, or no promise is returned then the Desktop Agent 
   * MUST reject the promise returned by the `getResult()` function of the `IntentResolution` 
   * with a string from the `DataError` enumeration.
   */
  getResult(): Promise<Context>;
}
```

For example, to raise a specific intent:

```js
try {
  const resolution = await fdc3.raiseIntent('StageOrder', context);
}
catch (err){ ... }
```

or to raise an unspecified intent for a specific context, where the user may select an intent from a resolver dialog:

```js
try {
  const resolution = await fdc3.raiseIntentForContext(context);
  if (resolution.data) {
    const orderId = resolution.data.id;
  }
}
catch (err){ ... }
```

Use metadata about the resolving app instance to target a further intent
```js
try {
  const resolution = await fdc3.raiseIntent('StageOrder', context);
  ...

  //some time later
  await agent.raiseIntent("UpdateOrder", context, resolution.source);
}
catch (err) { ... }
```

Raise an intent and retrieve data from the IntentResolution:
```js
let resolution = await agent.raiseIntent("intentName", context);
try {
    const result = await resolution.getResult();
    console.log(`${resolution.source} returned ${JSON.stringify(result)}`);
} catch(error) {
    console.error(`${resolution.source} returned a data error: ${error}`);
}
```

#### Resolvers
Intents functionality is dependent on resolver functionality to map the intent to a specific App.  This will often require end-user input.  Resolution can either be performed by the Desktop Agent (for example, by displaying a resolver UI allowing the user to pick the desired app or app instance for the intent) or by the app handling the resolution itself (by using the `findIntents` API and specifying a target app or app instance when invoking the Intent), e.g.:

```js
// Find apps to resolve an intent to start a chat with a given contact
const appIntent = await fdc3.findIntent("StartChat", context);
// use the returned AppIntent object to target one of the returned 
// chat apps or app instances using the AppMetadata object
await fdc3.raiseIntent("StartChat", context, appIntent.apps[0]);
```

#### Upgrading to a Remote API Connection
There are a wide range of workflows where decoupled intents and/or context passing do not provide rich enough interactivity and applications are better off exposing proprietary APIs.  In these cases, an App can use the *source* property on the resolution of an intent to connect directly to another App and from there, call remote APIs using the methods available in the Desktop Agent context for the App.  For example:

```js
const chart = await fdc3.raiseIntent('ViewChart');
// construct a vendor wrapper for the App
const chartApp = fin.Application.wrap(chart.source);
// do some vendor-specific stuff
```
![Upgrading Connection to Remote API](assets/api-3.png)

### Register an Intent
Applications need to let the system know the intents they can support.  Typically, this is done via registration with the App Directory.  It is also possible for intents to be registered at the application level as well to support ad-hoc registration which may be helpful at development time.  While dynamic registration is not part of this specification, a Desktop Agent agent may choose to support any number of registration paths.

#### Compliance with Intent Standards
Intents represent a contract with expected behavior if an app asserts that it supports the intent.  Where this contract is enforceable by schema (for example, return object types), the FDC3 API implementation should enforce compliance and return an error if the interface is not met.

It is expected that App Directories will also curate listed apps and ensure that they are complying with declared intents.

### Send/broadcast Context
On the financial desktop, applications often want to broadcast context to any number of applications.  Context sharing needs to support concepts of different groupings of applications as well as data privacy concerns.  Each Desktop Agent will have its own rules for supporting these features. However, a Desktop Agent should ensure that context messages broadcast to a channel by an application joined to it should not be delivered back to that same application.

### Retrieve Metadata about the Desktop Agent implementation
From version 1.2 of the FDC3 specification, Desktop Agent implementations MUST provide a `fdc3.getInfo()` function to allow apps to retrieve information about the version of the FDC3 specification supported by a Desktop Agent implementation and the name of the implementation provider. This metadata can be used to vary the behavior of an application based on the version supported by the Desktop Agent, e.g.:

```js
import {compareVersionNumbers, versionIsAtLeast} from '@finos/fdc3';

if (fdc3.getInfo && versionIsAtLeast(await fdc3.getInfo(), '1.2')) {
  await fdc3.raiseIntentForContext(context);
} else {
  await fdc3.raiseIntent('ViewChart', context);
}
```

## Context Channels

Context channels allows a set of apps to share a stateful piece of data between them, and be alerted when it changes.  Use cases for channels include color linking between applications to automate the sharing of context and topic based pub/sub such as theme.

There are two types of channels, which are functionally identical, but have different visibility and discoverability semantics:

1. **_System channels_**, which: 
    * facilitate the creation of user-controlled context links between applications (often via the selection of a color channel),
    * are created and named by the desktop agent,
    * are discoverable (via the [`getSystemChannels()`](ref/DesktopAgent#getsystemchannels) API call),
    * can be 'joined' (via the [`joinChannel()`](ref/DesktopAgent#joinchannel) API call).

    > **Note:** Earlier versions of FDC3 included the concept of a 'global' system channel
    which was deprecated in FDC3 1.2 and removed in FDC 2.0.

2. **_App channels_**, which: 
    * facilitate developer controlled messaging between applications,
    * are created and named by applications (via the [`getOrCreateChannel()`](ref/DesktopAgent#getorcreatechannel) API call),
    * are not discoverable,
    * are interacted with via the [Channel API](ref/Channel) (accessed via the desktop agent [`getOrCreateChannel`](ref/DesktopAgent#getorcreatechannel) API call)


Channels are interacted with via `broadcast` and `addContextListener` functions, allowing an application to send and receive Context objects via the channel. For System channels, these functions are provided on the Desktop Agent, e.g. [`fdc3.broadcast(context)`](ref/DesktopAgent#broadcast), and apply to channels joined via [`fdc3.joinChannel`](ref/DesktopAgent#joinchannel). For App channels, a channel object must be retrieved, via [`fdc3.getOrCreateChannel(channelName)`](ref/DesktopAgent#getorcreatechannel), which provides the functions, e.g. [`myChannel.broadcast(context)`](ref/Channel#broadcast).

Channel implementations should ensure that context messages broadcast by an application on a channel are not  delivered back to that same application if they are also listening on the channel.

### Joining System Channels
Apps can join _System channels_.  An app can only be joined to one channel at a time.  

When an app is joined to a channel, calls to [`fdc3.broadcast`](ref/DesktopAgent#broadcast) will be routed to that channel and listeners added through [`fdc3.addContextListener`](ref/DesktopAgent#addcontextlistener) will receive context broadcasts from other apps also joined to that channel. If an app is not joined to a channel [`fdc3.broadcast`](ref/DesktopAgent#broadcast) will be a no-op and handler functions added with [`fdc3.addContextListener`](ref/DesktopAgent#addcontextlistener) will not receive any broadcasts. However, apps can still choose to listen and broadcast to specific channels via the methods on the [`Channel`](ref/Channel) class.

When an app joins a channel, or adds a context listener when already joined to a channel, it will automatically receive the current context for that channel.

It is possible that a call to join a channel could be rejected.  If for example, the desktop agent wanted to implement controls around what data apps can access.

Joining channels in FDC3 is intended to be a behavior initiated by the end user. For example: by color linking or apps being grouped in the same workspace.  Most of the time, it is expected that apps will be joined to a channel by mechanisms outside of the app. To support programmatic management of joined channels and the implementation of channel selector UIs other than those provided outside of the app, Desktop Agent implementations MAY provide [`fdc3.joinChannel()`](ref/DesktopAgent#joinchannel), [`fdc3.getCurrentChannel()](ref/DesktopAgent#getcurrentchannel) and [`fdc3.leaveCurrentChannel()`](ref/DesktopAgent#leavecurrentchannel) functions and if they do, MUST do so as defined in the [Desktop Agent API reference](ref/DesktopAgent). 

There SHOULD always be a clear UX indicator of what channel an app is joined to.

#### Examples

An app joins a system channel by name and can send and receive context:

```js
//retrieve a list of system channels
const systemChannels = await fdc3.getSystemChannels();

//join a channel from the list returned
await fdc3.joinChannel(systemChannels[0].id);

//add a Context listener, which will receive the current context immediately
const instrumentListener = fdc3.addContextListener('fdc3.instrument', (context) => {
    //do something with context
});

//broadcast your context
fdc3.broadcast({type: 'fdc3.instrument', id: {ticker: 'MSFT'}});

//some time later
instrumentListener.unsubscribe();
```

Many Desktop Agents will provide a user interface for joining applications to channels, hence, it is not necessary to explicitly join the channel:

```js
//add a Context listener without joining a channel first, 
//The listener will receive the current context when the user joins the app to a channel
const instrumentListener = fdc3.addContextListener('fdc3.instrument', (context) => {
    //do something with context
});

//broadcast your context to the channel the user has joined you to
//If not currently joined to a channel this will be ignored
fdc3.broadcast({type: 'fdc3.instrument', id: {ticker: 'MSFT'}});
```

### Direct Listening and Broadcast on App Channels
While joining system channels automates a lot of the channel behavior for an app, it has the limitation in that an app can belong to only one channel at a time.  Listening and Broadcasting to channels using the [`Channel.addContextListener`](ref/Channel#addcontextlistener) and the [`Channel.broadcast`](ref/Channel#broadcast) APIs provides an app with fine-grained controls for specific channels and is used for working with dynamic _App Channels_. 

App channels are topics dynamically created by applications connected via FDC3. For example, an app may create a channel to broadcast to others data or status specific to that app.

The current context of a System Channel is automatically received when the channel is joined or a context listener added (when already joined to a channel, however, when working with the Channel API, the current context of the Channel is retrieved manually via [`Channel.getCurrentContext`](ref/Channel#getcurrentcontext) (returning either the last context broadcast or the last context of a specified type).

#### Examples

An app can send and receive context events on any number of channels, without joining them, by retrieving their `Channel` objects:

```js
const myChannel = await fdc3.getOrCreateChannel('myChannel');

//broadcast your context
myChannel.broadcast({type: 'fdc3.instrument', id: {ticker: 'MSFT'}});

//listen for broadcasts
const instrumentListener = myChannel.addContextListener('fdc3.instrument', (context) => {
    //do something with context
});
//some time later
instrumentListener.unsubscribe();
```

An app queries the current context of an App channel (as current context is not automatically received on adding the listener):

```js
const appChannel = await fdc3.getOrCreateChannel('my_custom_channel');
// get the current context of the channel
const current = await appChannel.getCurrentContext();
// add a listener
await appChannel.addContextListener(null, context => {...});
// broadcast to the channel
await appChannel.broadcast(context);
```

An app can still explicitly receive context events on any channel, regardless of the channel it is currently joined to.

```js
// check for current fdc3 channel
let joinedChannel = await fdc3.getCurrentChannel()
//current channel is null, as the app is not currently joined to a channel

//add a context listener for channels we join
const listener = await fdc3.addContextListener(null, context => { ... });

//retrieve an App channel and add a listener that is specific to that channel
const myChannel = await fdc3.getOrCreateChannel('my_custom_channel');
const myChannelListener = await myChannel.addContextListener(null, context => { ... });

fdc3.joinChannel('blue')
joinedChannel = await fdc3.getCurrentChannel()
//current channel is now the 'blue' channel
```

if another application broadcasts to "my_custom_channel" (by retrieving it and broadcasting to it via `myChannel.broadcast()`) then the broadcast will be received by the specific listener (`myChannelListener`) but NOT by the listener for joined channels (`listener`).

### Broadcasting and listening for multiple context types
The [Context specification](../../context/spec#assumptions) recommends that complex context objects are defined using simpler context types for particular fields. For example, a `Position` is composed of an `Instrument` and a holding amount. This leads to situations where an application may be able to receive or respond to context objects that are embedded in a more complex type, but not the more complex type itself. For example, a pricing chart might respond to an `Instrument` but doesn't know how to handle a `Position`. 

To facilitate context linking in such situations it is recommended that applications `broadcast` each context type that other apps (listening on a System channel or App channel) may wish to process, starting with the simpler types, followed by the complex type. Doing so allows applications to filter the context types they receive by adding listeners for specific context types - but requires that the application broadcasting context make multiple broadcast calls in quick succession when sharing its context.

## APIs
The APIs are defined in TypeScript in [src], with documentation generated in the [docs] folder.

[src]: https://github.com/finos/FDC3/tree/master/src/api
[docs]: https://github.com/finos/FDC3/tree/master/docs/api
