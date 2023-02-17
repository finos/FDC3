---
sidebar_label: DisplayMetadata
title: DisplayMetadata
hide_title: true
original_id: DisplayMetadata
---
# `DisplayMetadata`

```ts
 public interface DisplayMetadata {
  name?: string;
  color?: string;
  glyph?: string;
}
```

A desktop agent (typically for _system_ channels) may want to provide additional information about how a channel can be represented in a UI. A common use case is for color linking.

#### See also

* [`Channel`](Channel)
* [`DesktopAgent.getSystemChannels`](DesktopAgent#getsystemchannels)

## Properties

### `name`

```ts
name?: string;
```

The display name for the channel.

### `color`

```ts
color?: string;
```

A name, hex, rgba, etc. that should be associated within the channel when displaying it in a UI.

### `glyph`

```ts
glyph: string;
```

A URL of an image that can be used to display this channel.