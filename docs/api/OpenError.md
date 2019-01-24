---
id: OpenError
sidebar_label: OpenError
title: OpenError
hide_title: true
---
# `OpenError`

```typescript
enum OpenError {
  AppNotFound = "AppNotFound",
  ErrorOnLaunch = "ErrorOnLaunch",
  AppTimeout = "AppTimeout",
  ResolverUnavailable = "ResolverUnavailable"
}
```

Contains constants representing the errors that can be encountered when calling the [`open`](DesktopAgent#open) method on the [DesktopAgent](DesktopAgent) object.

## See also
* [`DesktopAgent.open`](DesktopAgent#open)