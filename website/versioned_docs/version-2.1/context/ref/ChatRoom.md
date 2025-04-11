---
id: ChatRoom
sidebar_label: ChatRoom
title: ChatRoom
hide_title: true
---
# `ChatRoom`

Reference to the chat room, which could be used later to send a message to the room.

## Type

`fdc3.chat.room`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/chatRoom.schema.json](pathname:///schemas/2.1/context/chatRoom.schema.json)

## Details

| Property    | Type    | Required | Example Value     |
|-------------|---------|----------|-------------------|
| `type`      | string  | Yes      | `'fdc3.chat.room'`  |
| `providerName`      | string  | Yes       | `'Symphony'`      |
| `id`  | object  | Yes       | `{ streamId: 'j75xqXy25NBOdacUI3FNBH', anyOtherKey: 'abcdef'}` |
| `url` | string  | No       | `'http://symphony.com/ref/room/j75xqXy25NBOdacUI3FNBH___pqSsuJRdA'`      |
| `name` | string  | No       | `'My new room'`      |

The `url` is a universal url to access to the room. It could be opened from a browser, a mobile app, etc...

## Example

```js
const chatRoom = {
  type: "fdc3.chat.room",
  providerName: "Symphony",
  id: {
      streamId: "j75xqXy25NBOdacUI3FNBH"
  }
  url: "http://symphony.com/ref/room/j75xqXy25NBOdacUI3FNBH___pqSsuJRdA",
  name: 'My new room'
};

//Chat rooms are returned by the StartChat intent as a result
const intentResolution = await fdc3.raiseIntent("StartChat", context);

try {
    const chatRooms = await intentResolution.getResult():
} catch (error) {
   //chat room were not created...
}
```

## See Also

Other Types
* [ChatInitSettings](ChatInitSettings)

Intents
- [StartChat](../../intents/ref/StartChat)
- [SendChatMessage](../../intents/ref/SendChatMessage)

FINOS Financial Objects
- [Contact](https://fo.finos.org/docs/objects/contact)
