---
title: Errors
---

Some FDC3 API operations return promises that can result in errors.

## `OpenError`

```typescript
enum OpenError {
  /** Returned if the specified application is not found.*/
  AppNotFound = 'AppNotFound',
  /** Returned if the specified application fails to launch correctly.*/
  ErrorOnLaunch = 'ErrorOnLaunch',
  /** Returned if the specified application launches but fails to add a context listener in order to receive the context passed to the `fdc3.open` call.*/
  AppTimeout = 'AppTimeout',
  /** Returned if the FDC3 desktop agent implementation is not currently able to handle the request.*/
  ResolverUnavailable = 'ResolverUnavailable',
}
```

Contains constants representing the errors that can be encountered when calling the [`open`](DesktopAgent#open) method on the [DesktopAgent](DesktopAgent) object.

#### See also
* [`DesktopAgent.open`](DesktopAgent#open)

## `ResolveError`

```typescript
export enum ResolveError {
  /** SHOULD be returned if no apps are available that can resolve the intent and context combination.*/
  NoAppsFound = 'NoAppsFound',
  /** Returned if the FDC3 desktop agent implementation is not currently able to handle the request.*/
  ResolverUnavailable = 'ResolverUnavailable',
  /** Returned if the user cancelled the resolution request, for example by closing or cancelling a resolver UI.*/
  UserCancelled = 'UserCancelledResolution',
  /** SHOULD be returned if a timeout cancels intent resolution, that required user interaction. Please used `ResolverUnavailable` instead for situations where a resolver UI or similar fails.*/
  ResolverTimeout = 'ResolverTimeout',
  /** Returned if a specified target application is not available or new instance of it cannot be opened. */
  TargetAppUnavailable = 'TargetAppUnavailable',
  /** Returned if a specified target application instance is not available, for example because it has been closed. */
  TargetInstanceUnavailable = 'TargetInstanceUnavailable',
  /** Returned if the intent and context could not be delivered to the selected application or instance, for example because it has not added an intent handler within a timeout.*/
  IntentDeliveryFailed = 'IntentDeliveryFailed',
}
```

Contains constants representing the errors that can be encountered when calling the [`findIntent`](DesktopAgent#findintent), [`findIntentsByContext`](DesktopAgent#findintentsbycontext), [`raiseIntent`](DesktopAgent#raiseintent) or [`raiseIntentForContext`](DesktopAgent#raiseintentforcontext) methods on the [DesktopAgent](DesktopAgent).

#### See also
* [`DesktopAgent.findIntent`](DesktopAgent#findintent)
* [`DesktopAgent.findIntentsByContext`](DesktopAgent#findintentsbycontext)
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
* [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)

## `DataError`

```typescript
enum DataError {
  /** Returned if the intent handler exited without returning Promise or that Promise was not resolved with a Context object. */
  NoDataReturned = 'NoDataReturned',
  /** Returned if the Intent handler function processing the raised intent throws an error or rejects the promise it returned. */
  IntentHandlerRejected = 'IntentHandlerRejected',
}
```

Contains constants representing the errors that can be encountered when calling the [`getResult`](DesktopAgent#findintent) method on the [IntentResolution](Metadata#intentresolution) Object.

#### See also
* [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
* [`IntentResolution`](Metadata#intentresolution)

## `ChannelError`

```typescript
enum ChannelError {
  /** Returned if the specified channel is not found when attempting to join a channel via the `joinUserChannel` function  of the DesktopAgent (`fdc3`).*/
  NoChannelFound = 'NoChannelFound',
  /** SHOULD be returned when a request to join a user channel or to a retrieve a Channel object via the `joinUserChannel` or `getOrCreateChannel` methods of the DesktopAgent (`fdc3`) object is denied. */
  AccessDenied = 'AccessDenied',
  /** SHOULD be returned when a channel cannot be created or retrieved via the `getOrCreateChannel` method of the DesktopAgent (`fdc3`).*/
  CreationFailed = 'CreationFailed',
}
```

Contains constants representing the errors that can be encountered when calling channels using the [`joinChannel`](DesktopAgent#joinchannel) or [`getOrCreateChannel`](DesktopAgent#getorcreatechannel) methods, or the [`getCurrentContext`](Channel#getcurrentcontext), [`broadcast`](Channel#broadcast) or [`addContextListener`](Channel#addcontextlistener) methods on the `Channel` object.

#### See also
* [`DesktopAgent.joinChannel`](DesktopAgent#joincannel)
* [`DesktopAgent.getOrCreateChannel`](DesktopAgent#getorcreatechannel)
* [`Channel.broadcast`](Channel#broadcast)
* [`Channel.addContextListener`](Channel#addcontextlistener)
* [`Channel.getCurrentContext`](Channel#getcurrentcontext)
