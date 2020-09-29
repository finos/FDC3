---
id: ResolveError
sidebar_label: ResolveError
title: ResolveError
hide_title: true
---
# `ResolveError`

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