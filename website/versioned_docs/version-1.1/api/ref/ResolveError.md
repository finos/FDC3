---
id: version-1.1-ResolveError
sidebar_label: ResolveError
title: ResolveError
hide_title: true
original_id: ResolveError
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