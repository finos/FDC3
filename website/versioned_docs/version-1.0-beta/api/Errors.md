---
id: version-1.0-beta-Errors
sidebar_label: Errors
title: Errors
hide_title: true
original_id: Errors
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