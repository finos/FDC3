---
id: IntentResolution
sidebar_label: IntentResolution
title: IntentResolution
hide_title: true
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
```

#### See also
* [`DesktopAgent.raiseIntent`](DesktopAgent#raiseintent)
* [`AppInstance`](AppInstance)