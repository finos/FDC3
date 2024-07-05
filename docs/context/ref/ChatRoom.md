---
title: Chat Room
description: Reference to the chat room which could be used to send a message to the room
sidebar_label: Chat Room

---

# Chat Room

Reference to the chat room which could be used to send a message to the room

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/chatRoom.schema.json>

## Type

`fdc3.chat.room`

## Properties

### `providerName`

The name of the service that hosts the chat

**Type**: `string`


**Example Value**: 
`Symphony`

### `id`

Identifier(s) for the chat - currently unstandardized

**Type**: `object`


**Example Value**: 
```json
{
  "streamId": "j75xqXy25NBOdacUI3FNBH"
}
```

### `url`

Universal url to access to the room. It could be opened from a browser, a mobile app, etc...

**Type**: `string`


**Example Value**: 
`http://symphony.com/ref/room/j75xqXy25NBOdacUI3FNBH___pqSsuJRdA`

### `name`

Display name for the chat room

**Type**: `string`


**Example Value**: 
`My new room`

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

