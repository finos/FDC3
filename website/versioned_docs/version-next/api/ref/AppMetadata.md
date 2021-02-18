---
id: version-next-AppMetadata
sidebar_label: AppMetadata
title: AppMetadata
hide_title: true
original_id: AppMetadata
---
# `AppMetadata`

```ts
interface AppMetadata {
  name: string;
  appId?: string;
  version?: string;
  title?: string;
  tooltip?: string;
  description?: string;
  icons?: Array<string>;
  images?: Array<string>;
}
```

App metadata is provided by the FDC3 App Directory that the desktop agent connects to. 

It always includes at least a `name` property, which can be used with [`open`](DesktopAgent#open) and [`raiseIntent`](DesktopAgent#raiseIntent).

Optionally, extra information from the app directory can be returned, to aid in rendering UI elements, e.g. a context menu.
This includes a title, description, tooltip and icon and image URLs.

In situations where a desktop agent connects to multiple app directories or multiple versions of the same app exists in a single app directory, it may be neccessary to specify appId and version to target applications that share the same name. 

#### See also
* [`AppIntent.apps`](AppIntent)