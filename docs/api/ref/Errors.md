---
title: Errors
---

Some FDC3 API operations return promises that can result in errors.

## `OpenError`

```typescript
enum OpenError {
  AppNotFound = "AppNotFound",
  ErrorOnLaunch = "ErrorOnLaunch",
  AppTimeout = "AppTimeout",
  ResolverUnavailable = "ResolverUnavailable"
}
```

Contains constants representing the errors that can be encountered when calling the [`open`](DesktopAgent#open) method on the [DesktopAgent](DesktopAgent) object.

#### See also
* [`DesktopAgent.open`](DesktopAgent#open)

## `ResolveError`

```typescript
export enum ResolveError {
  NoAppsFound = 'NoAppsFound',
  ResolverUnavailable = 'ResolverUnavailable',
  UserCancelled = 'UserCancelledResolution',
  ResolverTimeout = 'ResolverTimeout',
  TargetAppUnavailable = 'TargetAppUnavailable',
  TargetInstanceUnavailable = 'TargetInstanceUnavailable'
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
  NoResultReturned = 'NoResultReturned',
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
  NoChannelFound = "NoChannelFound",
  AccessDenied = "AccessDenied",
  CreationFailed = "CreationFailed"
}
```

Contains constants representing the errors that can be encountered when calling channels using the [`joinChannel`](DesktopAgent#joinchannel) or [`getOrCreateChannel`](DesktopAgent#getorcreatechannel) methods, or the [`getCurrentContext`](Channel#getcurrentcontext), [`broadcast`](Channel#broadcast) or [`addContextListener`](Channel#addcontextlistener) methods on the `Channel` object.

#### See also
* [`DesktopAgent.joinChannel`](DesktopAgent#joincannel)
* [`DesktopAgent.getOrCreateChannel`](DesktopAgent#getorcreatechannel)
* [`Channel.broadcast`](Channel#broadcast)
* [`Channel.addContextListener`](Channel#addcontextlistener)
* [`Channel.getCurrentContext`](Channel#getcurrentcontext)
