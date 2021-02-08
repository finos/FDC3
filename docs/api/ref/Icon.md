---
id: Icon
sidebar_label: Icon
title: Icon
hide_title: true
---
# `Icon`

```typescript
interface Icon {
  src: string;
  size: string;
  type: string;
}
```

App Metadata icon's description. 

Various properties may be used by the Desktop Agent to decide which icon is the most suitable to be used considering the device DPI, bandwith and format support.

#### Example

```js
"icons": [
  {
    "src": "https://app.foo.icon/app_icons/lowres.webp",
    "size": "48x48",
    "type": "image/webp"
  },
  {
    "src": "https://app.foo.icon/app_icons/hd_hi.svg",
    "size": "72x72"
  }
]
```

## Properties

### `src`

The fully qualified url to the icon.

### `size`

The dimension of the icon using formatted as "<height>x<width>"

### `type`

The media type of the icon. If not provided the Desktop agent may refer to the src file extension.



#### See also
* [`AppMetadata`](AppMetadata)

