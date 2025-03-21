---
sidebar_label: AppMetadata
title: AppMetadata
hide_title: true
original_id: AppMetadata
---
# `AppMetadata`

```ts
interface AppMetadata {
  name: string;
  title?: string;
  tooltip?: string;
  description?: string;
  icons?: Array<string>;
  images?: Array<string>;
}
```

App metadata is provided by the FDC3 App Directory that the desktop agent connects to.

It always includes at least a `name` property, which can be used with [`open`](DesktopAgent#open) and [`raiseIntent`](DesktopAgent#raiseintent).

Optionally, extra information from the app directory can be returned, to aid in rendering UI elements, e.g. a context menu.
This includes a title, description, tooltip and icon and image URLs.

#### See also

* [`AppIntent.apps`](AppIntent)