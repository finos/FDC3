---
id: ChatRoom
sidebar_label: ChatRoom
title: Contact
hide_title: true
---
# `ChatRoom`

Reference to a chat room.

## Type

`fdc3.chat.room`

## Schema

https://fdc3.finos.org/schemas/next/chatRoom.schema.json

## Details

| Property    | Type    | Required | Example Value     |
|-------------|---------|----------|-------------------|
| `type`      | string  | Yes      | `'fdc3.chat.room'`  |
| `providerName`      | string  | Yes       | `'Symphony'`      |
| `id`  | object  | Yes       | `{ roomId: 'j75xqXy25NBOdacUI3FNBH', anyOtherKey: 'abcdef'}` |
| `uri` | string  | No       | `'http://symphony.com/ref/room/j75xqXy25NBOdacUI3FNBH___pqSsuJRdA'`      |
| `name` | string  | No       | `'My new room'`      |

The `uri` is an universal url to access to the room. It could be opened from a browser, a mobile app, etc...

## Example

```js
const chatRoom = {
  type: "fdc3.chat.room",
  providerName: "Symphony",
  id: {
      roomId: "j75xqXy25NBOdacUI3FNBH"
  }
  uri: "http://symphony.com/ref/room/j75xqXy25NBOdacUI3FNBH___pqSsuJRdA",
  name: 'My new room'
};

//Chat rooms are returned by the StartChat intent as a result
const intentResolution = await fdc3.raiseIntent("StartChat", context);

try {
    const chatRoom = await intentResolution.getResult():
} catch (error) {
   //chat room was not created...
}
```

## See Also

Other Types
- [ContactList](ContactList)

Intents
- [StartChat](../../intents/ref/StartChat)
- [StartCall](../../intents/ref/StartCall)
- [SendChatMessage](../../intents/ref/SendChatMessage)
- [ViewProfile](../../intents/ref/ViewProfile)
- [ViewResearch](../../intents/ref/ViewResearch)
- [ViewInteractions](../../intents/ref/ViewInteractions)
- [ViewOrders](../../intents/ref/ViewOrders)

FINOS Financial Objects
- [Contact](https://fo.finos.org/docs/objects/contact)
