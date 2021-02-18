---
id: version-next-IntentResolution
sidebar_label: IntentResolution
title: IntentResolution
hide_title: true
original_id: IntentResolution
---
# `IntentResolution`

```ts
interface IntentResolution {
  source: string;
  data?: object;
  version: string;
}
```

IntentResolution provides a standard format for data returned upon resolving an intent.
 
#### Example
```js
//resolve a "Chain" type intent
const intentResolution = await fdc3.raiseIntent("intentName", context);

const intentResolution2 = await fdc3.raiseIntentForContext(context);
```

#### See also
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
* [`DesktopAgent.raiseIntentForContext`](DesktopAgent#raiseintentforcontext)