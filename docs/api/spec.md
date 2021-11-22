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

Intents provide a way for an app to request functionality from another app and defer the discovery and launching of the destination app to the Desktop Agent.  There are multiple models for interop that Intents can support.

- **Chain**:  In this case the workflow is completely handed off from one app to another (similar to linking).  Currently, this is the primary focus in FDC3.
- **Client-Service**: A Client invokes a Service via the Intent, the Service performs some function, then passes the workflow back to the Client. Typically, there is a data payload type associated with this intent that is published as the standard contract for the intent.
- **Remote API**: An app wants to remote an entire API that it owns to another App.  In this case, the API for the App cannot be standardized.  However, the FDC3 API can address how an App connects to another App in order to get access to a proprietary API.

#### Intents and Context
When raising an Intent a specific context may be provided as input. The type of the provided context may determine which applications can resolve the Intent.

A Context type may also be associated with multiple Intents. For example, an `fdc3.instrument` could be associated with `ViewChart`, `ViewNews`, `ViewAnalysis` or other Intents. In addition to raising a specific intent, you can raise an Intent for a specific Context allowing the Desktop Agent or the user (if the Intent is ambiguous) to select the appropriate Intent for the selected Context and then to raise that Intent for resolution.

To raise an Intent without a context, use the [`fdc3.nothing`](../context/ref/Nothing) context type. This type exists so that applications can explicitly declare that they support raising an intent without a context (when registering an Intent listener or in an App Directory).

An optional context object may also be returned as a result by an application handling an intent. For example, an application handling a `CreateOrder` intent might return a context representing the order and including an ID, allowing the application that raised the intent to make further calls using that ID.

An optional result context type is also supported when programmatically resolving an intent via [`findIntent`](ref/DesktopAgent#findintent) or [`findIntentByContext`](ref/DesktopAgent#findintentbycontext).

#### Intent Resolution
Raising an Intent will return a Promise-type object that will resolve/reject based on a number of factors.

##### Resolve
- Intent was resolved unambiguously and the receiving app was launched successfully.
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
   * The application that resolved the intent.
   */
  readonly source: TargetApp;
  /**
   * The version number of the Intents schema being used.
   */
  readonly version?: string;
  /**
   * Retrieves a promise that will resolve to data returned by the
   * application that resolves the raised intent. The promise will 
   * reject if an error is thrown by the intent handler or the promise
   * returned by the intent handler is reject. If the intent handler 
   * does not return a promise this function will return null.
   */
  getResult(): Promise<Context> | null;
}
```

For example, to raise a specific Intent:

```js
try {
    const result = await fdc3.raiseIntent('StageOrder', context);
}
catch (er){
    console.log(er.message);
}
```

or to raise an unspecified Intent for a specific context, where the user may select an intent from a resolver dialog:
```js
try {
    const result = await fdc3.raiseIntentForContext(context);
    if (result.data) {
        const orderId = result.data.id;
    }
}
catch (er){
    console.log(er.message);
}
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
Successful delivery of an intent depends first upon the Desktop Agent's ability to "resolve the intent" (i.e. map the intent to a specific App instance). Desktop Agents may resolve intents by any methodology. A common methodology is to display a UI that allows the user to pick the desired App for a given intent. Alternatively, the intent issuing app may proactively handle resolution by calling [`findIntent`](ref/DesktopAgent#findintent) or [`findIntentByContext`](ref/DesktopAgent#findintentbycontext) and then raising the Intent with a specific target application, e.g.:

```js
//Find apps to resolve an intent to start a chat with a given contact
const appIntent = await fdc3.findIntent("StartChat", context);
//use the returned AppIntent object to target one of the returned chat apps by name
await fdc3.raiseIntent("StartChat", context, appIntent.apps[0].name);
//or by using the full AppMetadata object
await fdc3.raiseIntent("StartChat", context, appIntent.apps[0]);

//Find apps to resolve an intent and return a specified context type
const appIntent = await fdc3.findIntent("ViewContact", context, "fdc3.contact");
try {
  const resolution = await fdc3.raiseIntent(appIntent.intent, context, appIntent.apps[0].name);
  const result = await resolution.getResult();
  console.log(`${resolution.source} returned ${JSON.stringify(result)}`);
} catch(error) {
    console.error(`${resolution.source} returned a data error: ${error}`);
}

//Find apps that can perform any intent with the specified context
const appIntents = await fdc3.findIntentByContext(context);
//use the returned AppIntent array to target one of the returned apps
await fdc3.raiseIntent(appIntent[0].intent, context, appIntent[0].apps[0]);
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
Applications need to let the system know the Intents they can support.  Typically, this is done via registration with the App Directory.  It is also possible for Intents to be registered at the application level as well to support ad-hoc registration which may be helpful at development time.  While, dynamic registration is not part of this specification, a Desktop Agent agent may choose to support any number of registration paths.

#### Compliance with Intent Standards
Intents represent a contract with expected behavior if an app asserts that it supports the intent.  Where this contract is enforceable by schema (for example, return object types), the FDC3 API implementation should enforce compliance and return an error if the interface is not met.

It is expected that App Directories will also curate listed apps and ensure that they are complying with declared intents.

### Send/broadcast Context
On the financial desktop, applications often want to broadcast context to any number of applications.  Context sharing needs to support concepts of different groupings of applications as well as data privacy concerns.  Each Desktop Agent will have its own rules for supporting these features. However, a Desktop Agent should ensure that context messages broadcast to a channel by an application joined to it should not be delivered back to that same application.

### Retrieve Metadata about the Desktop Agent implementation
From version 1.2 of the FDC3 specification, it is possible to retrieve information about the  version of the FDC3 specification supported by a Desktop Agent implementation and the name of the implementation provider. This metadata can be used to vary the behavior of an application based on the version supported by the Desktop Agent, e.g.:

```js
import {compareVersionNumbers, versionIsAtLeast} from '@finos/fdc3';

if (fdc3.getInfo && versionIsAtLeast(fdc3.getInfo(), '1.2')) {
  await fdc3.raiseIntentForContext(context);
} else {
  await fdc3.raiseIntent('ViewChart', context);
}
```

## Context Channels

Context channels allows a set of apps to share a stateful piece of data between them, and be alerted when it changes.  Use cases for channels include color linking between applications to automate the sharing of context and topic based pub/sub such as theme.

There are two types of channels, which are functionally identical, but have different visibility and discoverability semantics.

1. The 'system' channels, which have a well understood identity.

    > **Deprecation notice:** Earlier versions of FDC3 include the concept of a 'global' system channel
    for backwards compatibility with FDC3 1.0. In future, there won't be a 'global' channel
    (see [below](#the-global-channel) for more detail).

2. The 'app' channels, which have a transient identity and need to be revealed


### Joining Channels
Apps can join channels.  An app can only be joined to one channel at a time.  

When an app is joined to a channel, calls to `fdc3.broadcast` will be routed to that channel and listeners added through `fdc3.addContextListener` will receive context broadcasts from other apps also joined to that channel. If an app is not joined to a channel `fdc3.broadcast` will be a no-op and handler functions added with `fdc3.addContextListener` will not receive any broadcasts. However, apps can still choose to listen and broadcast to specific channels via the methods on the `Channel` class.

When an app joins a channel, or adds a context listener when already joined to a channel, it will automatically receive the current context for that channel.

It is possible that a call to join a channel could be rejected.  If for example, the desktop agent wanted to implement controls around what data apps can access.

Joining channels in FDC3 is intended to be a behavior initiated by the end user. For example: by color linking or apps being grouped in the same workspace.  Most of the time, it is expected that apps will be joined to a channel by mechanisms outside of the app.  Always, there SHOULD be a clear UX indicator of what channel an app is joined to.

### The 'global' Channel

> **Deprecation notice**
>
> The global channel, which exists only for backward compatibility with FDC3 1.0,
will be removed in a future version of the FDC3 API Specification.
>
> Instead of relying on being joined to a 'default' channel by the desktop agent on startup,
an app or system channel should be joined explicitly through the relevant APIs,
or through a channel selection UI.

The 'system' channels include a 'global' channel which serves as the backwards compatible layer with the 'send/broadcast context' behavior in FDC3 1.0.  A desktop agent MAY choose to make membership in the 'global' channel the default state for apps on start up.

The 'global' channel should be returned as part of the response from the `fdc3.getSystemChannels` call.  Desktop Agents may want to filter out the 'global' option in their UI for system channel pickers.


### Examples

An app queries the current context of the `red` channel.

```js
const redChannel = await fdc3.getOrCreateChannel('red');
const context = await redChannel.getCurrentContext('fdc3.instrument');
```

An app can still explicitly receive context events on any channel, regardless of the channel it is currently joined to.

```js
// check for current fdc3 channel
let joinedChannel = await fdc3.getCurrentChannel()
//current channel is null, as the app is not currently joined to a channel

const redChannel = await fdc3.getSystemChannels.filter(c => c.id === 'red')
const context = await redChannel.getCurrentContext('fdc3.instrument')
// context is instrument AAPL on the global channel

fdc3.joinChannel('blue')
joinedChannel = await fdc3.getCurrentChannel()
//current channel is now the 'blue' channel

```

### Direct Listening and Broadcast on Channels
While joining channels automates a lot of the channel behavior for an app, it has the limitation in that an app can belong to only one channel at a time.  Listening and Broadcasting to channels using the _Channel.addBroadcastListener_ and the _Channel.broadcast_ APIs provides an app with fine-grained controls for specific channels.  This is especially useful for working with dynamic _App Channels_.

### Broadcasting and listening for multiple context types
The [Context specification](../../context/spec#assumptions) recommends that complex context objects are defined using simpler context types for particular fields. For example, a `Position` is composed of an `Instrument` and a holding amount. This leads to situations where an application may be able to receive or respond to context objects that are embedded in a more complex type, but not the more complex type itself. For example, a pricing chart might respond to an `Instrument` but doesn't know how to handle a `Position`. 

To facilitate context linking in such situations it is recommended that applications `broadcast` each context type that other apps (listening on a System channel or App channel) may wish to process, starting with the simpler types, followed by the complex type. Doing so allows applications to filter the context types they receive by adding listeners for specific context types - but requires that the application broadcasting context make multiple broadcast calls in quick succession when sharing its context.



### Examples
To find a system channel, one calls

```js
// returns an array of channels
const allChannels = await fdc3.getSystemChannels();
const redChannel = allChannels.find(c => c.id === 'red');
```
#### Joining channels

To join a system channel. one calls

```js
fdc3.joinChannel(redChannel.id);
```

Calling _fdc3.broadcast_ will now route context to the joined channel.

Channel implementations should ensure that context messages broadcast by an application on a channel should not be delivered back to that same application if they are joined to the channel.

#### App Channels

App channels are topics dynamically created by applications connected via FDC3. For example, an app may create a channel to broadcast to others data or status specific to that app.

To get (or create) a channel reference, then interact with it

```js
const appChannel = await fdc3.getOrCreateChannel('my_custom_channel');
// get the current context of the channel
const current = await appChannel.getCurrentContext();
// add a listener
appChannel.addContextListener(null, context => {...});
// broadcast to the channel
appChannel.broadcast(context);

```

## APIs
The APIs are defined in TypeScript in [src], with documentation generated in the [docs] folder.

[src]: https://github.com/finos/FDC3/tree/master/src/api
[docs]: https://github.com/finos/FDC3/tree/master/docs/api
