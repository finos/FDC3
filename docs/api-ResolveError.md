---
id: api-ResolveError
sidebar_label: ResolveError
title: ResolveError
hide_title: true
---
# `ResolveError`
Contains constants representing the errors that can be encountered when calling the [findIntent](api-findIntent) or [findIntentsByContext](api-findIntentsByContext) methods.

```
enum ResolveError {
  NoAppsFound = "NoAppsFound",
  ResolverUnavailable = "ResolverUnavailable",
  ResolverTimeout = "ResolverTimeout"
}
```
**See also** [findIntent](api-findIntent), [findIntentsByContext](api-findIntentsByContext)