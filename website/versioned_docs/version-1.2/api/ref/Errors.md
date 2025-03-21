---
title: Errors
original_id: Errors
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
enum ResolveError {
  NoAppsFound = "NoAppsFound",
  ResolverUnavailable = "ResolverUnavailable",
  ResolverTimeout = "ResolverTimeout"
}
```

Contains constants representing the errors that can be encountered when calling the [`findIntent`](DesktopAgent#findintent) or [`findIntentsByContext`](DesktopAgent#findintentsbycontext) methods on the [DesktopAgent](DesktopAgent).

#### See also

* [`DesktopAgent.findIntent`](DesktopAgent#findintent)
* [`DesktopAgent.findIntentsByContext`](DesktopAgent#findintentsbycontext)

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

* [`DesktopAgent.joinChannel`](DesktopAgent#joinchannel)
* [`DesktopAgent.getOrCreateChannel`](DesktopAgent#getorcreatechannel)
* [`Channel.broadcast`](Channel#broadcast)
* [`Channel.addContextListener`](Channel#addcontextlistener)
* [`Channel.getCurrentContext`](Channel#getcurrentcontext)
