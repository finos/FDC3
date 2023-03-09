---
sidebar_label: AppIntent
title: AppIntent
hide_title: true
original_id: AppIntent
---
# `AppIntent`

```ts
interface AppIntent {
  intent: IntentMetadata;
  apps: Array<AppMetadata>;
}
```
An interface that represents the binding of an intent to apps, returned as part of intent disocvery. 
For each intent, it reference the applications that support that intent.

#### See also
* [`AppMetadata`](AppMetadata)
* [`IntentMetadata`](IntentMetadata)
* [`DesktopAgent.findIntent`](DesktopAgent#findintent)
* [`DesktopAgent.findIntentsByContext`](DesktopAgent#findintentsbycontext)