---
id: Errors
sidebar_label: Errors
title: Errors
hide_title: true
---

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
Contains constants representing the errors that can be encountered when calling channels using the [`joinChannel`](DesktopAgent#joinchannel) or [`getOrCreateChannel`](DesktopAgent#getorcreatechannel) methods, or the [`getCurrentContext`](DesktopAgent#channel), [`broadcast`](DesktopAgent#channel) or [`addBroadcastListener`](DesktopAgent#channel) methods on the Channel object.
