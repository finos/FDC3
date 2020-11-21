---
id: InstanceError
sidebar_label: InstanceError
title: InstanceError
hide_title: true
---
# `InstanceError`

```typescript
enum InstanceError {
  NoInstanceFound = "NoInstanceFound",
  AccessDenied = "AccessDenied"
}
```

Contains constants representing the errors that can be encountered when calling app instance using the [`getAppInstance`](DesktopAgent#getAppInstance) method, or the  [`broadcast`](AppInstance#broadcast) or [`addContextListener`](AppInstance#addcontextlistener) methods on the `AppInstance` object.

#### See also
* [`DesktopAgent.getAppInstance`](DesktopAgent#getAppInstance)
* [`AppInstance.broadcast`](AppInstance#broadcast)
* [`AppInstance.addContextListener`](AppInstance#addcontextlistener)
