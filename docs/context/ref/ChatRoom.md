---
title: ChatRoom
sidebar_label: ChatRoom

---

# ChatRoom

Reference to the chat room which could be used to send a message to the room

## Schema

[https://fdc3.finos.org/schemas/next/context/chatRoom.schema.json](https://fdc3.finos.org/schemas/next/context/chatRoom.schema.json) ([github](https://github.com/finos/FDC3/tree/main/schemas/context/chatRoom.schema.json))

## Type

`fdc3.chat.room`

## Properties

<details>
  <summary><code>providerName</code> <strong>(required)</strong></summary>

**type**: `string`

The name of the service that hosts the chat

</details>

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

<details>
  <summary><code>Additional Properties</code></summary>

**type**: `string`

</details>

Identifier(s) for the chat - currently unstandardized

</details>

<details>
  <summary><code>url</code></summary>

**type**: `string`

Universal url to access to the room. It could be opened from a browser, a mobile app, etc...

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

Display name for the chat room

</details>

## Example

```json
{
  "type": "fdc3.chat.room",
  "providerName": "Symphony",
  "id": {
    "streamId": "j75xqXy25NBOdacUI3FNBH"
  },
  "url": "http://symphony.com/ref/room/j75xqXy25NBOdacUI3FNBH___pqSsuJRdA",
  "name": "My new room"
}
```

