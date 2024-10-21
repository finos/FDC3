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

- [ChatMessage](../../context/ref/ChatMessage)

## Example

```js
// Start a chat and retrieve a reference to the chat room created
const intentResolution = await fdc3.raiseIntent("StartChat", context);
const chatRoom = intentResolution.getResult();

//Some time later

let chatMessage: ChatMessage = {
    type: "fdc3.chat.message",
    chatRoom,
    message: {
      type: 'fdc3.message',
      text: {
        'text/plain': 'Hey all, can we discuss the issue together? I attached a screenshot'
      },
      entities: {
         '0': {
             type: 'fdc3.fileAttachment',
              data: {
              name: 'myImage.png',
                    dataUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII'
              }
          }
      }
    }
}

await fdc3.raiseIntent("SendChatMessage", context, intentResolution.source);
```

## See Also

Context
- [ChatMessage](../../context/ref/ChatMessage)
- [ChatRoom](../../context/ref/ChatRoom)

Intents
- [StartChat](StartChat)
- [StartCall](StartCall)
- [StartEmail](StartEmail)
