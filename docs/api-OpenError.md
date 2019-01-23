---
id: api-OpenError
sidebar_label: OpenError
title: OpenError
hide_title: true
---
# `OpenError`
Contains constants representing the errors that can be encountered when calling the [open](api-open) method.
```
enum OpenError {
  AppNotFound = "AppNotFound",
  ErrorOnLaunch = "ErrorOnLaunch",
  AppTimeout = "AppTimeout",
  ResolverUnavailable = "ResolverUnavailable"
}
```
**See also** [open](api-open)