---
title: Errors
original_id: Errors
---

FDC3 API operations may sometimes result in an error, which must be returned to the caller. Errors should be returned by rejecting the promise returned by the API with a JavaScript `Error` object (or equivalent for the language of the implementation). The `Error` Object's message should be chosen from the appropriate Error enumeration below.

## `ChannelError`

```typescript
enum ChannelError {
  /** Returned if the specified channel is not found when attempting to join a
   *  channel via the `joinUserChannel` function of the DesktopAgent (`fdc3`).
   */
  NoChannelFound = 'NoChannelFound',

  /** SHOULD be returned when a request to join a user channel or to a retrieve
   *  a Channel object via the `joinUserChannel` or `getOrCreateChannel` methods
   *  of the DesktopAgent (`fdc3`) object is denied. 
   */
  AccessDenied = 'AccessDenied',
  
  /** SHOULD be returned when a channel cannot be created or retrieved via the
   *  `getOrCreateChannel` method of the DesktopAgent (`fdc3`).
   */
  CreationFailed = 'CreationFailed',
}
```

Contains constants representing the errors that can be encountered when calling channels using the [`joinUserChannel`](DesktopAgent#joinuserchannel) or [`getOrCreateChannel`](DesktopAgent#getorcreatechannel) methods, or the [`getCurrentContext`](Channel#getcurrentcontext), [`broadcast`](Channel#broadcast) or [`addContextListener`](Channel#addcontextlistener) methods on the `Channel` object.

#### See also

* [`DesktopAgent.createPrivateChannel`](DesktopAgent#createprivatechannel)
* [`DesktopAgent.joinUserChannel`](DesktopAgent#joinuserchannel)
* [`DesktopAgent.getOrCreateChannel`](DesktopAgent#getorcreatechannel)
* [`Channel.broadcast`](Channel#broadcast)
* [`Channel.addContextListener`](Channel#addcontextlistener)
* [`Channel.getCurrentContext`](Channel#getcurrentcontext)

## `OpenError`

```typescript
enum OpenError {
  /** Returned if the specified application is not found.*/
  AppNotFound = 'AppNotFound',

  /** Returned if the specified application fails to launch correctly.*/
  ErrorOnLaunch = 'ErrorOnLaunch',

  /** Returned if the specified application launches but fails to add a context
   *  listener in order to receive the context passed to the `fdc3.open` call.
   */
  AppTimeout = 'AppTimeout',

  /** Returned if the FDC3 desktop agent implementation is not currently able
   *  to handle the request.
   */
  ResolverUnavailable = 'ResolverUnavailable',
}
```

Contains constants representing the errors that can be encountered when calling the [`open`](DesktopAgent#open) method on the [DesktopAgent](DesktopAgent) object.

#### See also

* [`DesktopAgent.open`](DesktopAgent#open)

## `ResolveError`

```typescript
export enum ResolveError {
  /** SHOULD be returned if no apps are available that can resolve the intent
   *  and context combination.
   */
  NoAppsFound = 'NoAppsFound',

  /** Returned if the FDC3 desktop agent implementation is not currently able
   *  to handle the request.
   */
  ResolverUnavailable = 'ResolverUnavailable',

  /** Returned if the user cancelled the resolution request, for example by
   *  closing or cancelling a resolver UI.
   */
  UserCancelled = 'UserCancelledResolution',

  /** SHOULD be returned if a timeout cancels an intent resolution that
   *  required user interaction. Please use `ResolverUnavailable` instead for
   *  situations where a resolver UI or similar fails.
   */
  ResolverTimeout = 'ResolverTimeout',

  /** Returned if a specified target application is not available or a new
   *  instance of it cannot be opened. 
   */
  TargetAppUnavailable = 'TargetAppUnavailable',

  /** Returned if a specified target application instance is not available,
   *  for example because it has been closed. 
   */
  TargetInstanceUnavailable = 'TargetInstanceUnavailable',

  /** Returned if the intent and context could not be delivered to the selected
   *  application or instance, for example because it has not added an intent
   *  handler within a timeout.
   */
  IntentDeliveryFailed = 'IntentDeliveryFailed',
}
```

Contains constants representing the errors that can be encountered when calling the [`findIntent`](DesktopAgent#findintent), [`findIntentsByContext`](DesktopAgent#findintentsbycontext), [`raiseIntent`](DesktopAgent#raiseintent) or [`raiseIntentForContext`](DesktopAgent#raiseintentforcontext) methods on the [DesktopAgent](DesktopAgent).

#### See also

* [`DesktopAgent.findIntent`](DesktopAgent#findintent)
* [`DesktopAgent.findIntentsByContext`](DesktopAgent#findintentsbycontext)
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
* [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)

## `ResultError`

```typescript
enum ResultError {
  /** Returned if the intent handler exited without returning a valid result 
   * (a promise resolving to a Context, Channel object or void).
   */
  NoResultReturned = 'NoResultReturned',

  /** Returned if the `IntentHandler` function processing the raised intent
   *  throws an error or rejects the Promise it returned. 
   */
  IntentHandlerRejected = 'IntentHandlerRejected',
}
```

Contains constants representing the errors that can be encountered when calling the [`getResult`](DesktopAgent#findintent) method on the [IntentResolution](Metadata#intentresolution) Object.

#### See also

* [`DesktopAgent.addIntentListener`](DesktopAgent#addintentlistener)
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
* [`IntentResolution`](Metadata#intentresolution)
