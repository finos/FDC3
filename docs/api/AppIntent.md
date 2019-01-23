---
id: AppIntent
sidebar_label: AppIntent
title: AppIntent
hide_title: true
---

# `AppIntent`
An interface that represents the binding of an intent to apps
```
interface AppIntent {
  intent: IntentMetadata;
  apps: Array<AppMetadata>;
}
```
**See also** [`IntentMetadata`](IntentMetadata)