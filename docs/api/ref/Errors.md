---
title: Errors
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

FDC3 API operations may sometimes result in an error that is returned to the caller. Errors MUST be returned by rejecting the promise returned by the API with a JavaScript `Error` object (or equivalent for the language of the implementation). The `Error` Object's message should be chosen from the appropriate Error enumeration below.

## `AgentError`

Contains constants representing the errors that can be encountered when calling the [`getAgent`](getAgent) function to establish connectivity to a Desktop Agent. Primarily used with web applications, but may also be used in other language implementations.

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
enum AgentError { 
    /** Returned if no Desktop Agent was found by any means available or 
     * if the Agent previously connected to is not contactable on a  
     * subsequent connection attempt.*/
    AgentNotFound = "AgentNotFound",

    /** Returned if validation of the app identity by the Desktop Agent 
     * failed or the app is not being allowed to connect to the Desktop Agent 
     * for another reason. */ 
    AccessDenied = "AccessDenied",

    /** Returned if an error or exception occurs while trying to set  
     * up communication with a Desktop Agent. */ 
    ErrorOnConnect = "ErrorOnConnect",

    /** Returned if the failover function is not a function, or it did not
     * resolve to one of the allowed types.*/ 
    InvalidFailover = "InvalidFailover",
} 
```

</TabItem>
<TabItem value="golang" label="Go">

```go
var AgentError = struct {
	// Returned if no Desktop Agent was found by any means available or 
  // if the Agent previously connected to is not contactable on a  
  // subsequent connection attempt.
	AgentNotFound string
	// Returned if validation of the app identity by the Desktop Agent 
  // failed or the app is not being allowed to connect to the Desktop Agent for another reason.
	AccessDenied string
	// Returned if an error or exception occurs while trying to set  
  // up communication with a Desktop Agent.
	ErrorOnConnect string
	// Returned if the failover function is not a function, or it did not
  // resolve to one of the allowed types.
	InvalidFailover string
}{
	AgentNotFound:    "AgentNotFound",
	AccessDenied:     "AccessDenied",
	ErrorOnConnect:   "ErrorOnConnect",
	InvalidFailover:  "InvalidFailover",
}
```

</TabItem>
</Tabs>

## `ChannelError`

Contains constants representing the errors that can be encountered when calling channels using the [`joinUserChannel`](DesktopAgent#joinuserchannel) or [`getOrCreateChannel`](DesktopAgent#getorcreatechannel) methods, or the [`getCurrentContext`](Channel#getcurrentcontext), [`broadcast`](Channel#broadcast) or [`addContextListener`](Channel#addcontextlistener) methods on the `Channel` object.

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
enum ChannelError {
  /** Returned if the specified channel is not found when attempting to join a
   *  channel via the `joinUserChannel` function of the DesktopAgent (`fdc3`).
   */
  NoChannelFound = "NoChannelFound",

  /** SHOULD be returned when a request to join a user channel or to a retrieve
   *  a Channel object via the `joinUserChannel` or `getOrCreateChannel` methods
   *  of the DesktopAgent (`fdc3`) object is denied. 
   */
  AccessDenied = "AccessDenied",
  
  /** SHOULD be returned when a channel cannot be created or retrieved via the
   *  `getOrCreateChannel` method of the DesktopAgent (`fdc3`).
   */
  CreationFailed = "CreationFailed",

  /** Returned if a call to the `broadcast` functions is made with an invalid
   *  context argument. Contexts should be Objects with at least a `type` field
   *  that has a `string` value.
   */
  MalformedContext = "MalformedContext",
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
public static class ChannelError
{
    /// <summary>
    /// Returned if the specified channel is not found when attempting to join a
    /// channel via the `JoinUserChannel` function of the DesktopAgent.
    /// </summary>
    public static readonly string NoChannelFound = nameof(NoChannelFound);

    /// <summary>
    /// SHOULD be returned when a request to join a user channel or to a retrieve
    /// a Channel object via the `JoinUserChannel` or `GetOrCreateChannel` methods
    /// of the DesktopAgent is denied.
    /// </summary>
    public static readonly string AccessDenied = nameof(AccessDenied);

    /// <summary>
    /// SHOULD be returned when a channel cannot be created or retrieved via the
    /// `GetOrCreateChannel` method of the DesktopAgent.
    /// </summary>
    public static readonly string CreationFailed = nameof(CreationFailed);

    /// <summary>
    /// Returned if a call to the `Broadcast` functions is made with an invalid
    /// context argument.Contexts should be Objects with at least a `Type` field
    /// that has a `String` value.
    /// </summary>
    public static readonly string MalformedContext = nameof(MalformedContext);
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
var ChannelError = struct {
	// Returned if the specified channel is not found when attempting to join a
	// channel via the `joinUserChannel` function of the DesktopAgent.
	NoChannelFound string
	// SHOULD be returned when a request to join a user channel or to a retrieve
	// a Channel object via the `JoinUserChannel` or `GetOrCreateChannel` methods
	// of the DesktopAgent object is denied.
	AccessDenied string
	// SHOULD be returned when a channel cannot be created or retrieved via the
	// `GetOrCreateChannel` method of the DesktopAgent.
	CreationFailed string
	// Returned if a call to the `broadcast` functions is made with an invalid
	// context argument. Contexts should be Objects with at least a `type` field
	// that has a `string` value.
	MalformedContext string
}{
	NoChannelFound: "NoChannelFound",
	AccessDenied:   "AccessDenied",
	CreationFailed: "CreationFailed",
	MalformedContext: "MalformedContext",
}
```

</TabItem>
</Tabs>

**See also:**

- [`DesktopAgent.createPrivateChannel`](DesktopAgent#createprivatechannel)
- [`DesktopAgent.joinUserChannel`](DesktopAgent#joinuserchannel)
- [`DesktopAgent.getOrCreateChannel`](DesktopAgent#getorcreatechannel)
- [`Channel.broadcast`](Channel#broadcast)
- [`Channel.addContextListener`](Channel#addcontextlistener)
- [`Channel.getCurrentContext`](Channel#getcurrentcontext)

## `OpenError`

Contains constants representing the errors that can be encountered when calling the [`open`](DesktopAgent#open) method on the [DesktopAgent](DesktopAgent) object.

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
enum OpenError {
  /** Returned if the specified application is not found.*/
  AppNotFound = "AppNotFound",

  /** Returned if the specified application fails to launch correctly.*/
  ErrorOnLaunch = "ErrorOnLaunch",

  /** Returned if the specified application launches but fails to add a context
   *  listener in order to receive the context passed to the `fdc3.open` call.
   */
  AppTimeout = "AppTimeout",

  /** Returned if the FDC3 desktop agent implementation is not currently able
   *  to handle the request.
   */
  ResolverUnavailable = "ResolverUnavailable",

  /** Returned if a call to the `open` function is made with an invalid
   *  context argument. Contexts should be Objects with at least a `type` field
   *  that has a `string` value.
   */
  MalformedContext = "MalformedContext",

    /** @experimental Returned if the specified Desktop Agent is not found, via a connected 
   *  Desktop Agent Bridge. */
  DesktopAgentNotFound = "DesktopAgentNotFound",
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
public static class OpenError
{
    /// <summary>
    /// Returned if the specified application is not found.
    /// </summary>
    public static readonly string AppNotFound = nameof(AppNotFound);

    /// <summary>
    /// Returned if the specified application fails to launch correctly.
    /// </summary>
    public static readonly string ErrorOnLaunch = nameof(ErrorOnLaunch);

    /// <summary>
    /// Returned if the specified application launches but fails to add a context
    /// listener in order to receive the context passed to the `Open` call.
    /// </summary>
    public static readonly string AppTimeout = nameof(AppTimeout);

    /// <summary>
    /// Returned if the FDC3 desktop agent implementation is not currently able
    /// to handle the request.
    /// </summary>
    public static readonly string ResolverUnavailable = nameof(ResolverUnavailable);

    /// <summary>
    /// Returned if a call to the `Open` function is made with an invalid
    /// context argument.Contexts should be Objects with at least a `Type` field
    /// that has a `String` value.
    /// </summary>
    public static readonly string MalformedContext = nameof(MalformedContext);
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
var OpenError = struct {
	// Returned if the specified application is not found.
	AppNotFound string
	// Returned if the specified application fails to launch correctly.
	ErrorOnLaunch string
	// Returned if the specified application launches but fails to add a context
	// listener in order to receive the context passed to the `fdc3.open` call.
	AppTimeout string
	// Returned if the FDC3 desktop agent implementation is not currently able to handle the request.
	ResolverUnavailable string
	// Returned if a call to the `Open` function is made with an invalid
	// context argument.Contexts should be Objects with at least a `Type` field
	// that has a `string` value.
	MalformedContext string
	// Experimental: Returned if the specified Desktop Agent is not found, via a connected Desktop Agent Bridge.
	DesktopAgentNotFound string,
}{
	AppNotFound:         "AppNotFound",
	ErrorOnLaunch:       "ErrorOnLaunch",
	AppTimeout:          "AppTimeout",
	ResolverUnavailable: "ResolverUnavailable",
	MalformedContext:    "MalformedContext",
	DesktopAgentNotFound: "DesktopAgentNotFound",
}
```

</TabItem>
</Tabs>

**See also:**

- [`DesktopAgent.open`](DesktopAgent#open)

## `ResolveError`

Contains constants representing the errors that can be encountered when calling the [`findIntent`](DesktopAgent#findintent), [`findIntentsByContext`](DesktopAgent#findintentsbycontext), [`raiseIntent`](DesktopAgent#raiseintent) or [`raiseIntentForContext`](DesktopAgent#raiseintentforcontext) methods on the [DesktopAgent](DesktopAgent).

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
export enum ResolveError {
  /** SHOULD be returned if no apps are available that can resolve the intent
   *  and context combination.
   */
  NoAppsFound = "NoAppsFound",

  /** Returned if the FDC3 desktop agent implementation is not currently able
   *  to handle the request.
   */
  ResolverUnavailable = "ResolverUnavailable",

  /** Returned if the user cancelled the resolution request, for example by
   *  closing or cancelling a resolver UI.
   */
  UserCancelled = "UserCancelledResolution",

  /** SHOULD be returned if a timeout cancels an intent resolution that
   *  required user interaction. Please use `ResolverUnavailable` instead for
   *  situations where a resolver UI or similar fails.
   */
  ResolverTimeout = "ResolverTimeout",

  /** Returned if a specified target application is not available or a new
   *  instance of it cannot be opened. 
   */
  TargetAppUnavailable = "TargetAppUnavailable",

  /** Returned if a specified target application instance is not available,
   *  for example because it has been closed. 
   */
  TargetInstanceUnavailable = "TargetInstanceUnavailable",

  /** Returned if the intent and context could not be delivered to the selected
   *  application or instance, for example because it has not added an intent
   *  handler within a timeout.
   */
  IntentDeliveryFailed = "IntentDeliveryFailed",

  /** Returned if a call to one of the `raiseIntent` functions is made with an 
   *  invalid context argument. Contexts should be Objects with at least a `type`
   *  field that has a `string` value.
   */
  MalformedContext = "MalformedContext",

    /** @experimental Returned if the specified Desktop Agent is not found, via a connected 
   *  Desktop Agent Bridge. */
  DesktopAgentNotFound = "DesktopAgentNotFound",
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
public static class ResolveError
{
    /// <summary>
    /// SHOULD be returned if no apps are available that can resolve the intent
    /// and context combination.
    /// </summary>
    public static readonly string NoAppsFound = nameof(NoAppsFound);

    /// <summary>
    /// Returned if the FDC3 desktop agent implementation is not currently able
    /// to handle the request.
    /// </summary>
    public static readonly string ResolverUnavailable = nameof(ResolverUnavailable);

    /// <summary>
    /// SHOULD be returned if a timeout cancels an intent resolution that
    /// required user interaction. Please use `ResolverUnavailable` instead for
    /// situations where a resolver UI or similar fails.
    /// </summary>
    public static readonly string ResolverTimeout = nameof(ResolverTimeout);

    /// <summary>
    /// Returned if the user cancelled the resolution request, for example by
    /// closing or cancelling a resolver UI.
    /// </summary>
    public static readonly string UserCancelledResolution = nameof(UserCancelledResolution);

    /// <summary>
    /// Returned if a specified target application is not available or a new
    /// instance of it cannot be opened.
    /// </summary>
    public static readonly string TargetAppUnavailable = nameof(TargetAppUnavailable);

    /// <summary>
    /// Returned if a specified target application instance is not available,
    /// for example because it has been closed.
    /// </summary>
    public static readonly string TargetInstanceUnavailable = nameof(TargetInstanceUnavailable);

    /// <summary>
    /// Returned if the intent and context could not be delivered to the selected
    /// application or instance, for example because it has not added an intent
    /// handler within a timeout.
    /// </summary>
    public static readonly string IntentDeliveryFailed = nameof(IntentDeliveryFailed);
    
    /// <summary>
    /// Returned if a call to one of the `RaiseIntent` functions is made with an 
    /// invalid context argument. Contexts should be Objects with at least a `Type`
    /// field that has a `String` value.
    /// </summary>
    public static readonly string MalformedContext = nameof(MalformedContext);
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
var ResolveError = struct {
	// SHOULD be returned if no apps are available that can resolve the intent and context combination
	NoAppsFound string
	// Returned if the FDC3 desktop agent implementation is not currently able to handle the request
	ResolverUnavailable string
	// Returned if the user cancelled the resolution request,
	// for example by closing or cancelling a resolver UI
	UserCancelled string
	// SHOULD be returned if a timeout cancels an intent resolution that required user interaction.
	// Please use `ResolverUnavailable` instead for situations where a resolver UI or similar fails
	ResolverTimeout string
	// Returned if a specified target application is not available or
	// a new instance of it cannot be opened.
	TargetAppUnavailable string
	// Returned if a specified target application instance is not available,
	// for example because it has been closed
	TargetInstanceUnavailable string
	// Returned if the intent and context could not be delivered to the selected
	// application or instance, for example because it has not added an intent handler within a timeout
	IntentDeliveryFailed string
	// Returned if a call to one of the `RaiseIntent` functions is made with an 
	// invalid context argument. Contexts should be Objects with at least a `Type`
	// field that has a `string` value.
	MalformedContext string
}{
	NoAppsFound:               "NoAppsFound",
	ResolverUnavailable:       "ResolverUnavailable",
	UserCancelled:             "UserCancelledResolution",
	ResolverTimeout:           "ResolverTimeout",
	TargetAppUnavailable:      "TargetAppUnavailable",
	TargetInstanceUnavailable: "TargetInstanceUnavailable",
	IntentDeliveryFailed:      "IntentDeliveryFailed",
	MalformedContext:          "MalformedContext",
}
```

</TabItem>
</Tabs>

**See also:**

- [`DesktopAgent.findIntent`](DesktopAgent#findintent)
- [`DesktopAgent.findIntentsByContext`](DesktopAgent#findintentsbycontext)
- [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
- [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)

## `ResultError`

Contains constants representing the errors that can be encountered when calling the [`getResult`](DesktopAgent#findintent) method on the [IntentResolution](Metadata#intentresolution) Object.

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
enum ResultError {
  /** Returned if the intent handler exited without returning a valid result 
   * (a promise resolving to a Context, Channel object or void).
   */
  NoResultReturned = "NoResultReturned",

  /** Returned if the `IntentHandler` function processing the raised intent
   *  throws an error or rejects the Promise it returned. 
   */
  IntentHandlerRejected = "IntentHandlerRejected",
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```csharp
public static class ResultError
{
    /// <summary>
    /// Returned if the intent handler exited without returning a valid result 
    /// (a Task resolving to a Context, Channel object or void).
    /// </summary>
    public static readonly string NoResultReturned = nameof(NoResultReturned);

    /// <summary>
    /// Returned if the `IntentHandler` function processing the raised intent
    /// throws an error.
    /// </summary>
    public static readonly string IntentHandlerRejected = nameof(IntentHandlerRejected);
}
```

</TabItem>
<TabItem value="golang" label="Go">

```go
var ResultError = struct {
	// IntentHandlerRejected Returned if the `IntentHandler` function processing the raised intent
	// throws an error or rejects the Promise it returned.
	IntentHandlerRejected string
	// NoResultReturned Returned if the `IntentHandler` exited without returning a Promise or that
	// Promise was not resolved with a Context or Channel object.
	NoResultReturned string
}{
	IntentHandlerRejected: "IntentHandlerRejected",
	NoResultReturned:      "NoResultReturned",
}
```

</TabItem>
</Tabs>

**See also:**

- [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
- [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
- [`IntentResolution`](Metadata#intentresolution)

## `BridgingError`

[`@experimental`](../../fdc3-compliance#experimental-features)

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
enum BridgingError {
  /** @experimental Returned if a Desktop Agent did not return a response, via 
   *  Desktop Agent Bridging, within the allotted timeout. */
  ResponseTimedOut = "ResponseToBridgeTimedOut",

  /** @experimental Returned if a Desktop Agent that has been targeted by a 
   *  particular request has been disconnected from the Bridge before a 
   *  response has been received from it. */
  AgentDisconnected = "AgentDisconnected",

  /** @experimental Returned for FDC3 API calls that are specified with
   *  arguments indicating that a remote Desktop agent should be targeted
   *  (e.g. raiseIntent with an app on a remote DesktopAgent targeted), 
   *  when the local Desktop Agent is not connected to a bridge. */
  NotConnectedToBridge = "NotConnectedToBridge",

  /** @experimental Returned if a message to a Bridge deviates from the schema
   *  for that message sufficiently that it could not be processed.
   */
  MalformedMessage = "MalformedMessage",
}
```

</TabItem>
<TabItem value="dotnet" label=".NET">

```
Not implemented
```

</TabItem>
<TabItem value="golang" label="Go">

```go
var BridgingError = struct {
	// Experimental: Returned if a Desktop Agent did not return a response, via 
	// Desktop Agent Bridging, within the allotted timeout.
	ResponseTimedOut string
	// Experimental: Returned if a Desktop Agent that has been targeted by a 
	// particular request has been disconnected from the Bridge before a 
	// response has been received from it.
	AgentDisconnected string
	// Experimental: Returned for FDC3 API calls that are specified with
	// arguments indicating that a remote Desktop agent should be targeted
	// (e.g. raiseIntent with an app on a remote DesktopAgent targeted), 
	// when the local Desktop Agent is not connected to a bridge. 
	NotConnectedToBridge string
	// Experimental: Returned if a message to a Bridge deviates from the schema
	// for that message sufficiently that it could not be processed.
	MalformedMessage string
}{
	ResponseTimedOut: "ResponseTimedOut",
	AgentDisconnected:      "AgentDisconnected",
	NotConnectedToBridge: "NotConnectedToBridge",
	MalformedMessage: "MalformedMessage",
}
```

</TabItem>
</Tabs>

Contains constants representing the errors that can be encountered when queries are forwarded to a Desktop Agent Bridge, but one or more remote Desktop Agents connected to it disconnects, times-out or a malformed message is encountered while a particular request is in flight. These errors may be returned via the FDC3 API when a Desktop Agent is (or was) connected to a Desktop Agent Bridge.

**See also:**

- [Agent Bridging - Workflows broken by disconnects](../../agent-bridging/spec##workflows-broken-by-disconnects)
