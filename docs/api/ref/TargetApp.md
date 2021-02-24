---
id: TargetApp
sidebar_label: TargetApp
title: TargetApp
hide_title: true
---
# `TargetApp`

```typescript
type TargetApp = string | AppMetadata;
```

Operations that target apps (like `open` or `raiseIntent`) can identify an app just by by its name,
or pass full app metadata, giving the desktop agent more information about the targeted app.

#### See also
* [`AppMetadata`](AppMetadata)
* [`DesktopAgent.open`](DesktopAgent#open)
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
* [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)
* [`IntentResolution`](IntentResolution)
