---
id: SendChatMessage
sidebar_label: SendChatMessage
title: SendChatMessage
hide_title: true
---
# `SendChatMessage`

Send a message to an existing chat room.

## Intent Name

`SendChatMessage`

## Display Name

`Send Chat Message`

## Possible Contexts

* [ChatMessage](../../context/ref/ChatMessage)

## Example

```js
// Start a chat and retrieve a reference to the chat room created
const intentResolution = await fdc3.raiseIntent("StartChat", context);
const chatRoom = intentResolution.getResult();

//Some time later

let chatMessage: ChatMessage = {
    type: "fdc3.chat.message",
    chatRoom,
    message: "Another message to send in the room"
}

await fdc3.raiseIntent("SendChatMessage", context, intentResolution.source);
```

## See Also

Context
- [ChatMessage](../../context/ref/ChatMessage)
- [ChatRoom](../../context/ref/ChatRoom)

Intents
* [StartChat](StartChat)
* [StartCall](StartCall)
* [StartEmail](StartEmail)
