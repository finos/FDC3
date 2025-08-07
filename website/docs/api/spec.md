---
id: spec
sidebar_label: Overview
title: API Overview (next)
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The role of FDC3 API is to establish a baseline interface for interoperability between applications. Because FDC3 is largely an agreement between existing platforms and applications, standards should be optimized for ease of adoption rather than functional completeness. Functionality absent from a FDC3 specification is in no way a commentary on its importance.

The following sections examine the API's use-cases and core concepts. The API is fully defined in both subsequent pages of this Part and a full set of TypeScript definitions in the [src](https://github.com/finos/FDC3/tree/main/src/api) directory of the [FDC3 GitHub repository](https://github.com/finos/FDC3/).

## Components

### Desktop Agent

A Desktop Agent is a desktop component (or aggregate of components) that serves as a launcher and message router (broker) for applications in its domain.  A Desktop Agent can be connected to one or more App Directories and will use directories for application identity and discovery. Typically, a Desktop Agent will contain the proprietary logic of a given platform, handling functionality like explicit application interop workflows where security, consistency, and implementation requirements are proprietary.

Examples of Desktop Agents include:

- Autobahn
- io.Connect
- OpenFin
- Refinitiv Eikon

An FDC3-compliant Desktop Agent exposes an FDC3 Standard API to applications they have launched.  When an App is launched by a Desktop Agent and is given access to the Agent's API to interoperate, it is running in that Desktop Agent's *context*.

### Application

An application is any endpoint on the desktop that is:

- Registered with/known by a Desktop Agent
- Launchable by a Desktop Agent
- Addressable by a Desktop Agent

Examples of endpoints include:

- Native Applications
- Web Applications
- Headless “services” running on the desktop

## Desktop Agent Implementation

The FDC3 API specification consists of interfaces.  It is expected that each Desktop Agent will implement these interfaces.  A Desktop Agent MUST provide implementations for the following interfaces:

- [`DesktopAgent`](ref/DesktopAgent)
- [`Channel`](ref/Channel)
- [`PrivateChannel`](ref/PrivateChannel)
- [`Listener`](ref/Types#listener)
- [Utility types](ref/Types) and [Metadata Objects](ref/Metadata).

The means to access the main FDC3 API interface (a `DesktopAgent` implementation) is defined separately for each language in which FDC3 is implemented. These definitions are important as they affect whether applications can be written in a vendor agnostic format so that they run under any Standards-conformant implementation.

### Implementation language

FDC3 and the Desktop Agent API it defines are intended to be independent of particular programming languages and platforms and hence the original definitions, produced in TypeScript, may be translated into other languages. However, this also places limitations on the API definitions as they need to be widely implementable in other languages.

Specifically, the use of ['unions'](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) of primitive values in API type and metadata objects, or function parameters SHOULD be avoided as they often cannot be replicated in other languages. Unions of more complex types (such as specific [Context](../context/spec#the-context-interface) Types) may be used where a suitable interface is available or can be created to allow the required polymorphism in languages other than TypeScript.

For implementation details relating to particular languages, and how to access the API in those languages, please see [Supported Platforms](./supported-platforms).

### Standards vs. Implementation

![Desktop Agent - Standards Schematic](/assets/api-1.png)

The surface area of FDC3 standardization (shown in *white* above) itself is quite small in comparison to the extent of a typical desktop agent implementation (in *grey*).

For example:

- Workspace management
- User identity and SSO
- Entitlements
- UX of application resolution

Are all areas of functionality that any feature-complete desktop agent would implement, but are not currently areas considered for standardization under FDC3.

### Inter-Agent Communication

A goal of the FDC3 Standard is that applications running in different Desktop Agent contexts on the same desktop, or operated by the same user, would be able to interoperate and that one Desktop Agent context would be able to discover and launch an application in another Desktop Application context. As Desktop Agent interop is supported by common standards for APIs an app in one Desktop Agent context would not need to know a different syntax to launch or interact with an app in another Desktop Agent context.

Inter-agent communication at the API layer may be achieved via the [Desktop Agent Bridging Part of the FDC3 Standard](../agent-bridging/spec) ([@experimental](../fdc3-compliance#experimental-features)), which defines an independent service that Desktop Agents may connect to (via the Bridge Connection Protocol or BCP), and a protocol for the exchange of messages relating to FDC3 API calls (the Bridge Messaging Protocol or BMP). Hence, by implementing support for Desktop Agent Bridging, a platform may extend interop across applications running in multiple Desktop Agent contexts.

Desktop Agent Bridging provides message exchanges and a workflow for performing intent resolution across multiple agents. Hence, app discovery is supported across the agents connected to the bridge for intent-based workflows. Further, as channels are also supported by bridging, context sharing also works across multiple agents.

There is currently no method of discovering all the apps supported by a Desktop Agent in the FDC3 API nor bridging. Hence, to support launching, via `fdc3.open` across the connected Desktop Agents, application details must be known in advance. This may be achieved by connecting Desktop Agents to the same App Directories.

![Desktop Agent - Interop](/assets/api-2.png)

### Desktop Agent API Standard Compliance

An FDC3 Standard compliant Desktop Agent implementation **MUST**:

- Be able to provide the FDC3 API to applications in accordance with with any requirements defined for that platform, as defined in [Supported Platforms](supported-platforms) and linked specifications:
  - For web applications this includes:
    - Implementing the [Browser-Resident Desktop Agent spec](specs/browserResidentDesktopAgents) if it is intended to support apps running in a standard web browser.
    - Implementing the [Preload Desktop Agent spec](specs/preloadDesktopAgents) if it is intended to support apps running in a container or other environment that supports injecting a global `fdc3` object.
- Accept as input and return as output data structures that are compatible with the interfaces defined in this Standard.
- Include implementations of the following [Desktop Agent](ref/DesktopAgent) API functions, as defined in this Standard:
  - [`addContextListener`](ref/DesktopAgent#addcontextlistener)
  - [`addIntentListener`](ref/DesktopAgent#addintentlistener)
  - [`addEventListener`](ref/DesktopAgent#addeventlistener)
  - [`broadcast`](ref/DesktopAgent#broadcast)
  - [`createPrivateChannel`](ref/DesktopAgent#createprivatechannel)
  - [`findInstances`](ref/DesktopAgent#findinstances)
  - [`findIntent`](ref/DesktopAgent#findintent)
  - [`findIntentsByContext`](ref/DesktopAgent#findintentsbycontext)
  - [`getCurrentChannel`](ref/DesktopAgent#getcurrentchannel)
  - [`getInfo`](ref/DesktopAgent#getinfo)
  - [`getOrCreateChannel`](ref/DesktopAgent#getorcreatechannel)
  - [`getUserChannels`](ref/DesktopAgent#getuserchannels)
  - [`open`](ref/DesktopAgent#open)
  - [`raiseIntent`](ref/DesktopAgent#raiseintent)
  - [`raiseIntentForContext`](ref/DesktopAgent#raiseintentforcontext)
- Provide a method of resolving ambiguous intents (i.e. those that might be resolved by multiple applications) or unspecified intents (calls to `raiseIntentForContext` that return multiple options), such as a resolver UI.
  - Intent resolution MUST take into account any specified input or return context types
  - Requests for resolution to apps returning a channel MUST include any apps that are registered as returning a channel with a specific type.
- Attempt to [resolve both fully-qualified and unqualified `appId` values](#fully-qualified-appids) received in `AppIdentifier` Objects as parameters to API functions against known fully-qualified or unqualified `appId` values, with results returned indicating the `appId` that was matched against the parameter value.
- Return (JavaScript or platform appropriate) Error Objects with messages from the [`ChannelError`](ref/Errors#channelerror), [`OpenError`](ref/Errors#openerror), [`ResolveError`](ref/Errors#resolveerror) and [`ResultError`](ref/Errors#resulterror) enumerations as appropriate.
- Provide an ID for each [`PrivateChannel`](ref/PrivateChannel) created via [`createPrivateChannel`](ref/DesktopAgent#createprivatechannel) and prevent them from being retrieved via [`getOrCreateChannel`](ref/DesktopAgent#getorcreatechannel) by ID.
- Only require app directories that they connect to to have implemented only the minimum requirements specified in the [App Directory API Part](../app-directory/spec) of this Standard.
- Provide details of whether they implement optional features of the Desktop Agent API in the `optionalFeatures` property of the [`ImplementationMetadata`](ref/Metadata#implementationmetadata) object returned by the [`fdc3.getInfo()`](ref/DesktopAgent#getinfo) function.
- Allow, by default, at least a 15 second timeout for an application, launched via [`fdc3.open`](../api/ref/DesktopAgent#open), [`fdc3.raiseIntent`](../api/ref/DesktopAgent#raiseintent) or [`fdc3.raiseIntentForContext`](../api/ref/DesktopAgent#raiseintentforcontext) to add any context listener (via [`fdc3.addContextListener`](../api/ref/DesktopAgent#addcontextlistener)) or intent listener (via [`fdc3.addIntentListener`](../api/ref/DesktopAgent#addintentlistener)) necessary to deliver context or intent and context to it on launch. This timeout only applies to listeners needed to receive context on launch; further intent and context listeners not required on launch MAY be added later.

An FDC3 Standard compliant Desktop Agent implementation **SHOULD**:

- Support connection to one or more App Directories meeting the [FDC3 App Directory Standard](../app-directory/overview).
- Qualify `appId` values received from an app directory with the hostname of the app directory server (e.g. `myAppId@name.domain.com`) [as defined in the app directory standard](../app-directory/overview#application-identifiers).
- Allow applications to register an [`IntentHandler`](ref/Types#intenthandler) for particular Intent and Context type pairs by providing `interop.intents.listensFor` metadata in their AppD record.
- Adopt the [recommended set of User channel definitions](#recommended-user-channel-set).
- Ensure that context messages broadcast by an application on a channel are not delivered back to that same application if they are joined to the channel.
- Make metadata about each context message or intent and context message received (including the app that originated the message) available to the receiving application.
- Prevent external apps from listening or publishing on a [`PrivateChannel`](ref/PrivateChannel) that they did not request or provide.
- Enforce compliance with the expected behavior of intents (where Intents specify a contract that is enforceable by schema, for example, return object types) and return an error if the interface is not met.

An FDC3 Standard compliant Desktop Agent implementation **MAY**:

- Make the Desktop Agent API available through modules, imports, or other means.
- Support multiple routes for registration of an [`IntentHandler`](ref/Types#intenthandler) by an app to be considered during Intent resolution, including dynamic registration of apps at runtime.
- Implement the following OPTIONAL [Desktop Agent](ref/DesktopAgent) API functions:
  - [`joinUserChannel`](ref/DesktopAgent#joinuserchannel)
  - [`leaveCurrentChannel`](ref/DesktopAgent#leavecurrentchannel)
  - [`getCurrentChannel`](ref/DesktopAgent#getcurrentchannel)
- Implement the following deprecated API functions:
  - [`addContextListener`](ref/DesktopAgent#addcontextlistener-deprecated) (without a contextType argument)
  - [`getSystemChannels`](ref/DesktopAgent#getsystemchannels-deprecated) (renamed getUserChannels)
  - [`joinChannel`](ref/DesktopAgent#joinchannel-deprecated) (renamed joinUserChannel)
  - [`open`](ref/DesktopAgent#open-deprecated) (deprecated version that addresses apps via `name` field)
  - [`raiseIntent`](ref/DesktopAgent#raiseintent-deprecated) (deprecated version that addresses apps via `name` field)
  - [`raiseIntentForContext`](ref/DesktopAgent#raiseintentforcontext-deprecated) (deprecated version that addresses apps via `name` field)
- Make use of a resolver user interface or other suitable procedure to resolve an ambiguous unqualified `appId` value received as part of an `AppIdentifier` passed as a paremeter to an API function. 

For more details on FDC3 Standards compliance (including the versioning, deprecation and experimental features policies) please see the [FDC3 Compliance page](../fdc3-compliance).

## Functional Use Cases

### Open an Application

Linking from one application to another is a critical basic workflow that the web revolutionized via the hyperlink.  Supporting semantic addressing of applications across different technologies and platform domains greatly reduces friction in linking different applications into a single workflow.

### Requesting Functionality From Another App

Often, we want to link from one app to another to dynamically create a workflow.  Enabling this without requiring prior knowledge between apps is a key goal of FDC3 and is implemented via the raising of [intents](../intents/spec), which represent a desired action, to be performed with a [context](../context/spec) supplied as input.

Intents provide a way for an app to request functionality from another app and defer the discovery and launching of the destination app to the Desktop Agent.  There are multiple models for interop that intents can support.

- **Chain**:  In this case the workflow is completely handed off from one app to another (similar to linking).  Currently, this is the primary focus in FDC3.
- **Client-Service**: A Client invokes a Service via the Intent, the Service performs some function, then passes the workflow back to the Client. Typically, there is a data payload type associated with this intent that is published as the standard contract for the intent.
- **Remote API**: An app wants to remote an entire API that it owns to another App.  In this case, the API for the App cannot be standardized.  However, the FDC3 API can address how an App connects to another App in order to get access to a proprietary API.

### Send/broadcast Context

On the financial desktop, applications often want to broadcast [context](../context/spec) to any number of applications.  Context sharing needs to support different groupings of applications, which is supported via the concept of 'channels', over which context is broadcast and received by other applications listening to the channel.  

In some cases, an application may want to communicate with a single application or service and to prevent other applications from participating in the communication. For single transactions, this can instead be implemented via a raised intent, which will be delivered to a single application that can, optionally, respond with data. Alternatively, it may instead respond with a [`Channel`](ref/Channel) or [`PrivateChannel`](ref/PrivateChannel) over which a stream of responses or a dialog can be supported.

### Retrieve Metadata about the Desktop Agent implementation

An application may wish to retrieve information about the version of the FDC3 Standard supported by a Desktop Agent implementation and the name of the implementation provider.

Since version 1.2 of the FDC3 Standard it may do so via the [`fdc3.getInfo()`](ref/DesktopAgent#getinfo) function. The metadata returned can be used, for example, to vary the behavior of an application based on the version supported by the Desktop Agent, e.g.:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
import { compareVersionNumbers, versionIsAtLeast } from "@finos/fdc3";

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
</Tabs>

The [`ImplementationMetadata`](ref/Metadata#implementationmetadata) object returned also includes the metadata for the calling application, according to the Desktop Agent. This allows the application to retrieve its own `appId`, `instanceId` and other details, e.g.:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
const implementationMetadata = await fdc3.getInfo();
const { appId, instanceId } = implementationMetadata.appMetadata;

```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var implementationMetadata = await _desktopAgent.GetInfo();
var appId = implementationMetadata.AppMetadata.AppId;
var instanceId = implementationMetadata.AppMetadata.InstanceId;
```

</TabItem>
</Tabs>

### Reference apps or app instance(s) and retrieve their metadata

To construct workflows between applications, you need to be able to reference specific applications and instances of those applications.

From version 2.0 of the FDC3 Standard, Desktop Agent functions that reference or return information about other applications do so via an [`AppIdentifier`](ref/Types#appidentifier) type. [`AppIdentifier`](ref/Types#appidentifier) references specific applications via an `appId` from an [App Directory](../app-directory/overview) record and instances of that application via an `instanceId` assigned by the Desktop Agent.

Additional metadata for an application can be retrieved via the [`fdc3.getAppMetadata(appIdentifier)`](ref/DesktopAgent#getappmetadata) function, which returns an [`AppMetadata`](ref/Metadata#appmetadata) object. The additional metadata may include a title, description, icons, etc., which may be used for display purposes.

Identifiers for instances of an application may be retrieved via the [`fdc3.findInstances(appIdentifier)`](ref/DesktopAgent#findinstances) function.

#### Fully-Qualified AppIds

As an `appId` used in an [`AppIdentifier`](ref/Types#appidentifier) might be replicated in other App Directories, it may be made globally unique (fully-qualified) by appending the domain name of the app directory that it references, [as described in the App Directory Part of the Standard](../app-directory/overview#application-identifiers). Fully-qualified `appId` values may be used to resolve the location of the app directory record that defines them using the [host resolution procedure](../app-directory/overview#fully-qualified-appid-namespace-syntax-host-resolution) defined in the App Directory Part of the Standard. For example, an `appId` such as `"myApplication"` defined in an App Directory record at `https://appd.example.com/api/appd/v2/apps/myApplication` may be fully qualified as `"myApplication@appd.example.com"`. Desktop Agents MAY be configured with details of applications via either unqualified or fully-qualified appIds.

Wherever an `appId` is used to refer to a specific application as part of an [`AppIdentifier`](ref/Types#appidentifier), either the unqualified or fully-qualified version of the `appId` MAY be used interchangeably. Desktop Agents receiving an [`AppIdentifier`](ref/Types#appidentifier) as input to an API call such as [`open`](./ref/DesktopAgent#open), [`raiseIntent`](./ref/DesktopAgent#raiseintent), [`raiseIntentForContext`](./ref/DesktopAgent#raiseintentforcontext), [`getAppMetadata`](./ref/DesktopAgent#getappmetadata) or [`findInstances`](./ref/DesktopAgent#findinstances) MUST attempt to resolve the `appId` provided against the list of `appId` values that it is aware of by first matching the `appId` as provided. I.e. if a fully qualified id such as `myapp@appd.example.com` was provided attempt to match the whole string to known fully-qualified `appId` values, or if an unqualified `appId` was provided attempt to match it to known unqualified `appId` values.

If no exact match is found then a fully-qualified `appId` provided should be split on `@` character and an attempt made to match the unqualified portion to known unqualified `appIds`, ignoring any known fully-qualified `appId` values that were already matched against. Alternatively, if an unqualified `appId` was provided then the known fully-qualified `appId` values should be split on the `@` character and the unqualified appId matched against their unqualified part.

The matching of an unqualified `appId` value against a set of fully-qualified appIds may result in multiple matches. In such cases, Desktop Agents SHOULD attempt additional resolution via any suitable procedure. For API calls such as [`raiseIntent`](./ref/DesktopAgent#raiseintent) or [`raiseIntentForContext`](./ref/DesktopAgent#raiseintentforcontext) Desktop Agents SHOULD use the same approach as they do for resolving ambiguous intents, for example by displaying an Intent Resolver UI and allowing the user to select the desired application. Alternatively, Desktop Agents MAY apply an alternative procedure such as selecting the first matching `appId` or, in the case of `findInstances`, by returning results for all matching fully-qualified `appId` values. Each of the API calls accepting an [`AppIdentifier`](ref/Types#appidentifier) as input, returns details of the `appId` in its results (i.e. [`AppIdentifier`](ref/Types#appidentifier), [`AppMetadata`](ref/Metadata#appmetadata), [IntentResolution](ref/Metadata#intentresolution)), where the fully-qualified appId matched MUST be used.

## Raising Intents

Raising an Intent is a method for an application to request functionality from another application and, if desired, defer the discovery and launching of the destination app to the Desktop Agent.

### Intents and Context

When raising an intent a specific context is provided as input. The type of the provided context may determine which applications can resolve the intent.

A context type may also be associated with multiple intents. For example, an `fdc3.instrument` could be associated with `ViewChart`, `ViewNews`, `ViewAnalysis` or other intents.

To raise an intent without a context, use the [`fdc3.nothing`](../context/ref/Nothing) context type. This type exists so that applications can explicitly declare that they support raising an intent without a context (when registering an `IntentHandler` or in an App Directory). This type is also used when the context is cleared for the channel. If the optional context type is provided when performing [`clearContext`](ref/Channel.md#clearcontext), that type will be recorded in the field `subType` of [`fdc3.nothing`](../context/ref/Nothing) context type.

As an alternative to raising a specific intent, you may also raise an unspecified intent with a known context allowing the Desktop Agent or the user (if the intent is ambiguous) to select the appropriate intent and then to raise it with the specified context for resolution.

### Intent Results

An optional [`IntentResult`](ref/Types#intentresult) may also be returned as output by an application handling an intent. Results may be a single `Context` object, a `Channel` that may be used to send a stream of responses, or `void` (no result). The [`PrivateChannel`](ref/PrivateChannel) type is provided to support synchronization of data transmitted over returned channels, by allowing both parties to listen for events denoting subscription and unsubscription from the returned channel. `PrivateChannels` are only retrievable via [raising an intent](ref/DesktopAgent#raiseintent).

For example, an application handling a `CreateOrder` intent might return a context representing the order and including an ID, allowing the application that raised the intent to make further calls using that ID.

An optional result type is also supported when programmatically resolving an intent via [`findIntent`](ref/DesktopAgent#findintent) or [`findIntentsByContext`](ref/DesktopAgent#findintentsbycontext).

### Resolvers

Successful delivery of an intent depends first upon the Desktop Agent's ability to "resolve the intent" (i.e. map the intent to a specific App instance). Where the target application is ambiguous (because there is more than one application that could resolve the intent and context) Desktop Agents may resolve intents by any suitable methodology. A common method is to display a UI that allows the user to pick the desired App from a list of those that will accept the intent and context. Alternatively, the app issuing the intent may proactively handle resolution by calling [`findIntent`](ref/DesktopAgent#findintent) or [`findIntentsByContext`](ref/DesktopAgent#findintentsbycontext) and then raise the intent with a specific target application, e.g.:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
// Find apps to resolve an intent to start a chat with a given contact
const appIntent = await fdc3.findIntent("StartChat", context);
// use the returned AppIntent object to target one of the returned 
// chat apps or app instances using the AppMetadata object
await fdc3.raiseIntent("StartChat", context, appIntent.apps[0]);

//Find apps to resolve an intent and return a specified context type
const appIntent = await fdc3.findIntent("ViewContact", context, "fdc3.contact");
try {
  const resolution = await fdc3.raiseIntent(appIntent.intent, context, appIntent.apps[0].name);
  try {
    const result = await resolution.getResult();
    console.log(`${resolution.source} returned ${JSON.stringify(result)}`);
  } catch(resultError: ResultError) {
    console.error(`${resolution.source} returned an error: ${resultError.message}`);
  }
} catch(resolveError: ResolveError) {
  console.error(`${JSON.stringify(appIntent.apps[0])} returned an error: ${resolveError.message}`);
}

//Find apps to resolve an intent and return a channel
const appIntent = await fdc3.findIntent("QuoteStream", context, "channel");
try {
  const resolution = await fdc3.raiseIntent(appIntent.intent, context, appIntent.apps[0].name);
  try {
    const result = await resolution.getResult();
    if (result && result.addContextListener) {
      result.addContextListener(null, (context) => { 
        console.log(`received context: ${JSON.stringify(context)}`); 
      });
    } else {
      console.log(`${resolution.source} didn't return a channel! Result: ${JSON.stringify(result)}`);
    }
  } catch(resultError: ResultError) {
    console.error(`${resolution.source} returned an error: ${resultError.message}`);
  }
} catch (resolveError: ResolveError) {
  console.error(`${JSON.stringify(appIntent.apps[0])} returned an error: ${resolveError.message}`);
}

//Find apps that can perform any intent with the specified context
const appIntents = await fdc3.findIntentsByContext(context);
//use the returned AppIntent array to target one of the returned apps
await fdc3.raiseIntent(appIntent[0].intent, context, appIntent[0].apps[0]);
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
// Find apps to resolve an intent to start a chat with a given contact
var appIntent = await _desktopAgent.FindIntent("StartChat", context);
// use the returned AppIntent object to target one of the returned 
// chat apps or app instances using the AppMetadata object
await _desktopAgent.RaiseIntent("StartChat", context, appIntent.Apps.First());

//Find apps to resolve an intent and return a specified context type
var appIntent = await _desktopAgent.FindIntent("ViewContact", context, "fdc3.contact");
var resolution = await _desktopAgent.RaiseIntent(appIntent.Intent.Name, context, appIntent.Apps.First());
try
{
  var result = await resolution.GetResult();
  System.Diagnostics.Debug.WriteLine($"{resolution.Source} returned ${result}");
}
catch (Exception ex)
{
  System.Diagnostics.Debug.WriteLine($"{resolution.Source} returned an error");
}

//Find apps to resolve an intent and return a channel
var appIntent = await _desktopAgent.FindIntent("QuoteStream", context, "channel");
try
{
  var resolution = await _desktopAgent.RaiseIntent(appIntent.Intent.Name, context, appIntent.Apps.First());
  var result = await resolution.GetResult();
  if (result is IChannel resolvedChannel)
  {
      await resolvedChannel.AddContextListener<IContext>(null, (context, metadata) => { });
  }
  else
  {
      System.Diagnostics.Debug.WriteLine("Did not return a channel");
  }
}
catch (Exception ex)
{
}

//Find apps that can perform any intent with the specified context
var appIntents = await _desktopAgent.FindIntentsByContext(context);
//use the returned AppIntent array to target one of the returned apps
await _desktopAgent.RaiseIntent(appIntents.First().Intent.Name, context, appIntents.First().Apps.First());
```

</TabItem>
</Tabs>

Result context types requested are represented by their type name. A channel may be requested by passing the string `"channel"` or a channel that returns a specific type via the syntax `"channel<contextType>"`, e.g. `"channel<fdc3.instrument>"`. Requesting intent resolution to an app returning a channel MUST include apps that are registered as returning a channel with a specific type.

### Intent Resolution

Raising an intent will return a Promise-type object that will resolve/reject based on a number of factors.

#### Resolve

- Intent was resolved unambiguously and the receiving app was launched successfully (if necessary).
- Intent was ambiguous, a resolution was chosen by the end user, and the chosen application was launched successfully.

#### Reject

- No app matching the intent and context (if specified) was found.
- A match was found, but the receiving app failed to launch.
- The intent was ambiguous and the resolver experienced an error.

#### Resolution Object

If the raising of the intent resolves (or rejects), a standard [`IntentResolution`](ref/Metadata#intentresolution) object will be passed into the resolver function with details of the application that resolved the intent and the means to access any results subsequently returned.

For example, to raise a specific intent:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
try {
  const resolution = await fdc3.raiseIntent("StageOrder", context);
}
catch (err: ResolveError) { ... }
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
try
{
    var resolution = await _desktopAgent.RaiseIntent("StageOrder", context);
}
catch (Exception ex) { }
```

</TabItem>
</Tabs>

or to raise an unspecified intent for a specific context, where the user may select an intent from a resolver dialog:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
try {
  const resolution = await fdc3.raiseIntentForContext(context);
  if (resolution.data) {
    const orderId = resolution.data.id;
  }
} catch (err: ResolveError) { ... }
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
try
{
    var resolution = await _desktopAgent.RaiseIntentForContext(context);
    if (resolution is IContext resolvedContext)
    {
        var orderId = resolvedContext.ID;
    }
}
catch (Exception ex) { }
```

</TabItem>
</Tabs>

Use metadata about the resolving app instance to target a further intent

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
try {
  const resolution = await fdc3.raiseIntent("StageOrder", context);
  ...

  //some time later
  await agent.raiseIntent("UpdateOrder", context, resolution.source);
}
catch (err: ResolveError) { ... }
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
try
{
    var resolution = await _desktopAgent.RaiseIntent("StageOrder", context);

    //some time later
    await _desktopAgent.RaiseIntent("UpdateOrder", context, resolution.Source);
}
catch (Exception ex) {  }
```

</TabItem>
</Tabs>

Raise an intent and retrieve either data or a channel from the IntentResolution:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
let resolution = await agent.raiseIntent("intentName", context);
try {
  const result = await resolution.getResult();
  /* Detect whether the result is Context or a Channel by checking for properties unique to Channels. */
  if (result && result.broadcast) { 
    console.log(`${resolution.source} returned a channel with id ${result.id}`);
  } else if (result) {
    console.log(`${resolution.source} returned data: ${JSON.stringify(result)}`);
  } else {
    console.error(`${resolution.source} didn't return anything`);
  }
} catch(err: ResultError) {
  console.error(`${resolution.source} returned a data error: ${err.message}`);
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
        System.Diagnostics.Debug.WriteLine($"{resolution.Source} returned a channel with id {channel.Id}");
    }
    else if (result is IContext context)
    {
        System.Diagnostics.Debug.WriteLine($"{resolution.Source} returned data {context}");
    }
    else
    {
        System.Diagnostics.Debug.WriteLine($"{resolution.Source} didn't return anything");
    }
}
catch (Exception ex)
{
    System.Diagnostics.Debug.WriteLine($"{resolution.Source} returned an error");
}
```

</TabItem>
</Tabs>

### Register an Intent Handler

Applications need to let the system know the intents they can support.  Typically, this SHOULD be done via registration with an [App Directory](../app-directory/spec) by providing `interop.intents.listensFor` metadata. However, Desktop Agent implementations MAY support dynamic registration of an [`IntentHandler`](ref/Types#intenthandler) by an app at runtime (for example, when they add an `IntentListener` via the API) to allow for ad-hoc registration which may be helpful at development time.  Although dynamic registration is not part of this specification, a Desktop Agent agent MAY choose to support any number of registration paths.

When an instance of an application is launched, it is expected to add an [`IntentHandler`](ref/Types#intenthandler) function to the Desktop Agent for each intent it has registered by calling the [`fdc3.addIntentListener`](ref/DesktopAgent#addintentlistener) function of the Desktop Agent. Doing so allows the Desktop Agent to pass incoming intents and contexts to that instance of the application. Hence, if the application instance was spawned in response to the raised intent, then the Desktop Agent must wait for the relevant intent listener to be added by that instance before it can deliver the intent and context to it. In order to facilitate accurate error responses, calls to `fdc3.raiseIntent` should not return an `IntentResolution` until the intent handler has been added and the intent delivered to the target app.

Intent handlers SHOULD be registered via [`fdc3.addIntentListener`](ref/DesktopAgent#addintentlistener) within 15 seconds of the application launch (the minimum timeout Desktop Agents are required to provide) in order to be widely compatible with Desktop Agent implementations. Individual Desktop Agent implementations MAY support longer timeouts or configuration to control or extend timeouts.

### Originating App Metadata

Optional metadata about each intent & context message received, including the app that originated the message, SHOULD be provided by the desktop agent implementation to registered intent handlers. As this metadata is optional, apps making use of it MUST handle cases where it is not provided.

### Compliance with Intent Standards

Intents represent a contract with expected behavior if an app asserts that it supports the intent.  Where this contract is enforceable by schema (for example, return object types), the FDC3 API implementation SHOULD enforce compliance and return an error if the interface is not met.

It is expected that App Directories SHOULD also curate listed apps and ensure that they are complying with declared intents.

## Context Channels

Context channels allows a set of apps to share a stateful piece of data between them, and be alerted when it changes.  Use cases for channels include color linking between applications to automate the sharing of context and topic based pub/sub such as theme.

### Types of Channel

There are three types of channels, which have different visibility and discoverability semantics:

1. ***User channels***, which:

    - facilitate the creation of user-controlled context links between applications (often via the selection of a color channel),
    - are created and named by the desktop agent,
    - are discoverable (via the [`getUserChannels()`](ref/DesktopAgent#getuserchannels) API call),
    - can be 'joined' (via the [`joinUserChannel()`](ref/DesktopAgent#joinuserchannel) API call).

    :::note

    Prior to FDC3 2.0, 'user' channels were known as 'system' channels. They were renamed in FDC3 2.0 to reflect their intended usage, rather than the fact that they are created by system (which could also create 'app' channels).

    :::

    :::note

    Earlier versions of FDC3 included the concept of a 'global' system channel
    which was deprecated in FDC3 1.2 and removed in FDC3 2.0.

    :::

2. ***App channels***, which:

    - facilitate developer controlled messaging between applications,
    - are created and named by applications (via the [`getOrCreateChannel()`](ref/DesktopAgent#getorcreatechannel) API call),
    - are not discoverable,
    - are interacted with via the [Channel API](ref/Channel) (accessed via the desktop agent [`getOrCreateChannel`](ref/DesktopAgent#getorcreatechannel) API call)

3. ***Private*** channels, which:

    - facilitate private communication between two parties,
    - have an auto-generated identity and can only be retrieved via a raised intent.

Channels are interacted with via `broadcast` and `addContextListener` functions, allowing an application to send and receive Context objects via the channel. For User channels, these functions are provided on the Desktop Agent, e.g. [`fdc3.broadcast(context)`](ref/DesktopAgent#broadcast), and apply to channels joined via [`fdc3.joinUserChannel`](ref/DesktopAgent#joinuserchannel). For App channels, a channel object must be retrieved, via [`fdc3.getOrCreateChannel(channelName)`](ref/DesktopAgent#getorcreatechannel), which provides the functions, i.e. [`myChannel.broadcast(context)`](ref/Channel#broadcast) and [`myChannel.addContextListener(context)`](ref/Channel#addcontextlistener). For `PrivateChannels`, a channel object must also be retrieved, but via an intent raised with [`fdc3.raiseIntent(intent, context)`](ref/DesktopAgent#raiseintent) and returned as an [`IntentResult`](ref/Types#intentresult).

Channel implementations SHOULD ensure that context messages broadcast by an application on a channel are not delivered back to that same application if they are also listening on the channel.

### Joining User Channels

Apps can join *User channels*.  An app can only be joined to one User channel at a time.  

When an app is joined to a User channel, calls to [`fdc3.broadcast`](ref/DesktopAgent#broadcast) will be routed to that channel and listeners added through [`fdc3.addContextListener`](ref/DesktopAgent#addcontextlistener) will receive context broadcasts from other apps also joined to that channel. If an app is not joined to a User channel [`fdc3.broadcast`](ref/DesktopAgent#broadcast) will be a no-op and handler functions added with  [`fdc3.addContextListener`](ref/DesktopAgent#addcontextlistener) will not receive any broadcasts. However, apps can still choose to listen and broadcast to specific channels (both User and App channels) via the methods on the [`Channel`](ref/Channel) class.

When an app joins a User channel, or adds a context listener when already joined to a channel, it will automatically receive the current context for that channel, unless the context was cleared through [`clearContext`](ref/Channel.md#clearcontext).

It is possible that a call to join a User channel could be rejected.  If for example, the desktop agent wanted to implement controls around what data apps can access.

Joining channels in FDC3 is intended to be a behavior initiated by the end user. For example: by color linking or apps being grouped in the same workspace.  Most of the time, it is expected that apps will be joined to a channel by mechanisms outside of the app. To support programmatic management of joined channels and the implementation of channel selector UIs other than those provided outside of the app, Desktop Agent implementations MAY provide [`fdc3.joinUserChannel()`](ref/DesktopAgent#joinuserchannel), [`fdc3.getCurrentChannel()`](ref/DesktopAgent#getcurrentchannel) and [`fdc3.leaveCurrentChannel()`](ref/DesktopAgent#leavecurrentchannel) functions and if they do, MUST do so as defined in the [Desktop Agent API reference](ref/DesktopAgent).

There SHOULD always be a clear UX indicator of what channel an app is joined to.

#### Examples

To find a User channel, one calls:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
// returns an array of channels
const allChannels = await fdc3.getUserChannels();
const redChannel = allChannels.find(c => c.id === "red");
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var allChannels = await _desktopAgent.GetUserChannels();
var redChannel = allChannels.Single(c => c.Id == "red");
```

</TabItem>
</Tabs>

To join a User channel, one calls:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
fdc3.joinUserChannel(redChannel.id);
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
await _desktopAgent.JoinUserChannel(redChannel.Id);
```

</TabItem>
</Tabs>

Calling `fdc3.broadcast` will now route context to the joined channel.

Channel implementations SHOULD ensure that context messages broadcast by an application on a channel are not delivered back to that same application if they are joined to the channel.

  > Prior to FDC3 2.0, 'user' channels were known as 'system' channels. They were renamed in FDC3 2.0 to reflect their intended usage, rather than the fact that they are created by system (which could also create 'app' channels). The `joinChannel` function was also renamed to `joinUserChannel` to clarify that it is only intended to be used to join 'user', rather than 'app', channels.

### Recommended User Channel Set

Desktop Agent implementations SHOULD use the following set of channels, to enable a consistent user experience across different implementations. Desktop Agent implementation MAY support configuration of the user channels.

:::note
Future versions of the FDC3 Standard may support connections between desktop agents, where differing user channel sets may cause user experience issues.
:::

```ts
const recommendedChannels = [
  {
    id: "fdc3.channel.1",
    type: "user",
    displayMetadata: {
      name: "Channel 1",
      color: "red",
      glyph: "1",
    },
  },
  {
    id: "fdc3.channel.2",
    type: "user",
    displayMetadata: {
      name: "Channel 2",
      color: "orange",
      glyph: "2",
    },
  },
  {
    id: "fdc3.channel.3",
    type: "user",
    displayMetadata: {
      name: "Channel 3",
      color: "yellow",
      glyph: "3",
    },
  },
  {
    id: "fdc3.channel.4",
    type: "user",
    displayMetadata: {
      name: "Channel 4",
      color: "green",
      glyph: "4",
    },
  },
  {
    id: "fdc3.channel.5",
    type: "user",
    displayMetadata: {
      name: "Channel 5",
      color: "cyan",
      glyph: "5",
    },
  },
  {
    id: "fdc3.channel.6",
    type: "user",
    displayMetadata: {
      name: "Channel 6",
      color: "blue",
      glyph: "6",
    },
  },
  {
    id: "fdc3.channel.7",
    type: "user",
    displayMetadata: {
      name: "Channel 7",
      color: "magenta",
      glyph: "7",
    },
  },
  {
    id: "fdc3.channel.8",
    type: "user",
    displayMetadata: {
      name: "Channel 8",
      color: "purple",
      glyph: "8",
    },
  },
];
```

### Direct Listening and Broadcast on Channels

While joining User channels (using [`fdc3.joinUserChannel`](ref/DesktopAgent#joinuserchannel)) automates a lot of the channel behavior for an app, it has the limitation that an app can only be 'joined' to one channel at a time.  However, an app may instead retrieve an App [`Channel`](ref/Channel) Object via the [`fdc3.getOrCreateChannel`](ref/DesktopAgent#getorcreatechannel) API, create a [`PrivateChannel`](ref/PrivateChannel) via the [`fdc3.createPrivateChannel`](ref/DesktopAgent#createprivatechannel) API, or by raising an intent that returns a channel created by another app. The `Channel` object may then be used to listen to and broadcast on that channel directly using the [`Channel.addContextListener`](ref/Channel#addcontextlistener) and the [`Channel.broadcast`](ref/Channel#broadcast) APIs. FDC3 imposes no restriction on adding context listeners or broadcasting to multiple channels.

### App Channels

App Channels are topics dynamically created by applications connected via FDC3. For example, an app may create a named App Channel to broadcast data or status that is specific to that app to other apps that know to connect to the channel with that name.

To get (or create) a [`Channel`](ref/Channel) reference, then interact with it:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
const appChannel = await fdc3.getOrCreateChannel("my_custom_channel");
// get the current context of the channel
const current = await appChannel.getCurrentContext();
// add a listener
await appChannel.addContextListener(null, context => {...});
// broadcast to the channel
await appChannel.broadcast(context);
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var appChannel = await _desktopAgent.GetOrCreateChannel("my_custom_channel");
// get the current context of the channel
var current = await appChannel.GetCurrentContext(null);
// add a listener
await appChannel.AddContextListener<IContext>(null, (context, metadata) => { });
// broadcast to the channel
await appChannel.Broadcast(context);
```

</TabItem>
</Tabs>

An app can still explicitly receive context events on any [`Channel`](ref/Channel), regardless of the channel it is currently joined to.

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
// check for current fdc3 channel
let joinedChannel = await fdc3.getCurrentChannel()
//current channel is null, as the app is not currently joined to a channel

//add a context listener for channels we join
const listener = await fdc3.addContextListener(null, context => { ... });

//retrieve an App channel and add a listener that is specific to that channel
const myChannel = await fdc3.getOrCreateChannel("my_custom_channel");
const myChannelListener = await myChannel.addContextListener(null, context => { ... });

fdc3.joinUserChannel('blue')
joinedChannel = await fdc3.getCurrentChannel()
//current channel is now the 'blue' channel
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
var joinedChannel = await _desktopAgent.GetCurrentChannel();
// current channel is null, as the app is not currently joined to a channel

// add a context listener for channels we join
var listener = await _desktopAgent.AddContextListener<IContext>(null, (context, metadata) => { });

// retrieve an App Channel and add a listener that is specific to that channel
var myChannel = await _desktopAgent.GetOrCreateChannel("my_custom_channel");
var myChannelListener = await myChannel.AddContextListener<IContext>(null, (context, metadata) => { });

await _desktopAgent.JoinUserChannel("blue");
joinedChannel = await _desktopAgent.GetCurrentChannel();
// current channel is now the "blue" channel
```

</TabItem>
</Tabs>

if another application broadcasts to "my_custom_channel" (by retrieving it and broadcasting to it via `myChannel.broadcast()`) then the broadcast will be received by the specific listener (`myChannelListener`) but NOT by the listener for joined channels (`listener`).

### Private Channels

A [`PrivateChannel`](ref/PrivateChannel) is created to support the return of a stream of responses from a raised intent, or private dialog between two applications.

It is intended that Desktop Agent implementations:

- SHOULD restrict external apps from listening or publishing on this channel.
- MUST prevent `PrivateChannels` from being retrieved via `fdc3.getOrCreateChannel`.
- MUST provide the `id` value for the channel as required by the `Channel` interface.

The `PrivateChannel` type also supports synchronization of data transmitted over returned channels. They do so by extending the `Channel` interface with event handlers which provide information on the connection state of both parties, ensuring that desktop agents do not need to queue or retain messages that are broadcast before a context listener is added and that applications are able to stop broadcasting messages when the other party has disconnected.

### Broadcasting and listening for multiple context types

The [Context specification](../context/spec#assumptions) recommends that complex context objects are defined using simpler context types for particular fields. For example, a `Position` is composed of an `Instrument` and a holding amount. This leads to situations where an application may be able to receive or respond to context objects that are embedded in a more complex type, but not the more complex type itself. For example, a pricing chart might respond to an `Instrument` but doesn't know how to handle a `Position`.

To facilitate context linking in such situations it is recommended that applications `broadcast` each context type that other apps (listening on a User Channel or App Channel) may wish to process, starting with the simpler types, followed by the complex type. Doing so allows applications to filter the context types they receive by adding listeners for specific context types - but requires that the application broadcasting context make multiple broadcast calls in quick succession when sharing its context.

### Context clearing on channels
Channel interface provides the ability to [`clearContext`](ref/Channel.md#clearcontext) on the channel, either for the specific context type, if provided, or for all contexts on that channel. Applications may listen to the `contextCleared` event on the channel. If a specific type was cleared, the `contextType` field of the event will be set with that type. Once cleared, any apps that join the channel, add new context listeners or call [`getCurrentContext`](ref/Channel.md#getcurrentcontext) will not return anything to the caller (other than the `fdc3.nothing` type indicating that context was cleared) until new context is broadcast to the channel. 

### Originating App Metadata

Optional metadata about each context message received, including the app that originated the message, SHOULD be provided by the desktop agent implementation to registered context handlers on all types of channel. As this metadata is optional, apps making use of it MUST handle cases where it is not provided.
