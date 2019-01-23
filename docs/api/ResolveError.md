---
id: ResolveError
sidebar_label: ResolveError
title: ResolveError
hide_title: true
---
# `ResolveError`
Contains constants representing the errors that can be encountered when calling the [`findIntent`](findIntent) or [`findIntentsByContext`](findIntentsByContext) methods.

```
enum ResolveError {
  NoAppsFound = "NoAppsFound",
  ResolverUnavailable = "ResolverUnavailable",
  ResolverTimeout = "ResolverTimeout"
}
```
**See also** [`findIntent`](findIntent), [`findIntentsByContext`](findIntentsByContext)