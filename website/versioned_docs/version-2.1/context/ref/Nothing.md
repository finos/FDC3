---
id: Nothing
sidebar_label: Nothing
title: Nothing
hide_title: true
---
# `Nothing`

A type that explicitly represents a lack of context.

Notes:

- Intended to be used in situations where no context is desired.
- For example:
  - Raising an intent without context (e.g. opening a blank order form, or chat
    interface without a contact selected).
  - Resetting context on a channel (e.g. when context is used to set a filter in
    other applications a null context might release the filter).
- An explicit representation of a Null or empty context allows apps to declare support for
  a lack of context, for example in their intent metadata in an app directory.

## Type

`fdc3.nothing`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/nothing.schema.json](https://fdc3.finos.org/schemas/2.1/context/nothing.schema.json)

## Example

```js
const nullContext = {
    type: 'fdc3.nothing'
}

fdc3.joinUserChannel('groupA')
fdc3.broadcast(nullContext)
```
