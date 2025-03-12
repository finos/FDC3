---
title: ChatMessage
sidebar_label: ChatMessage

---

# ChatMessage

A context representing a chat message. Typically used to send the message or to pre-populate a message for sending.

## Schema

[https://fdc3.finos.org/schemas/2.2/context/chatMessage.schema.json](pathname:///schemas/2.2/context/chatMessage.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/chatMessage.schema.json))

## Type

`fdc3.chat.message`

## Properties

<details>
  <summary><code>chatRoom</code> <strong>(required)</strong></summary>

**type**: [ChatRoom](ChatRoom)

</details>

<details>
  <summary><code>message</code> <strong>(required)</strong></summary>

**type**: [Message](Message)

</details>

## Example

```json
{
  "type": "fdc3.chat.message",
  "chatRoom": {
    "type": "fdc3.chat.room",
    "providerName": "Symphony",
    "id": {
      "streamId": "j75xqXy25NBOdacUI3FNBH"
    }
  },
  "message": {
    "type": "fdc3.message",
    "text": {
      "text/plain": "Hey all, can we discuss the issue together? I attached a screenshot"
    },
    "entities": {
      "0": {
        "type": "fdc3.fileAttachment",
        "data": {
          "name": "myImage.png",
          "dataUri": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII"
        }
      }
    }
  }
}
```

