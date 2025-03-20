---
id: ChatMessage
sidebar_label: ChatMessage
title: ChatMessage
hide_title: true
---
# `ChatMessage`

A context representing a chat message. Typically used to send the message or to pre-populate a message for sending.

## Type

`fdc3.chat.message`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/chatMessage.schema.json](pathname:///schemas/2.1/context/chatMessage.schema.json)

## Details

| Property    | Type    | Required | Example Value     |
|-------------|---------|----------|-------------------|
| `type`      | string  | Yes      | `'fdc3.chat.message'`  |
| `chatRoom`      | ChatRoom  | Yes       | `{ type: 'fdc3.chat.room', providerName: 'Symphony', id:{ streamId: 'j75xqXy25NBOdacUI3FNBH'} }`      |
| `message`  | [Message](pathname:///schemas/2.1/message.schema.json)  | Yes       | `'A message to send'` |

## Example

```js
const chatMessage = {
    type: "fdc3.chat.message",
    chatRoom: {
        type: 'fdc3.chat.room',
        providerName: "Symphony",
        id: {
            streamId: "j75xqXy25NBOdacUI3FNBH"
        }
    },
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
```

## See Also

Intents
- [StartChat](../../intents/ref/StartChat)
- [StartCall](../../intents/ref/StartCall)
- [SendChatMessage](../../intents/ref/SendChatMessage)

FINOS Financial Objects
- [Contact](https://fo.finos.org/docs/objects/contact)
