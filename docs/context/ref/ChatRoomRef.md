---
id: ChatRoomRef
sidebar_label: ChatRoomRef
title: ChatRoomRef
hide_title: true
---
# `ChatRoomRef`

A room reference returned when a chat is created.

## Type

`fdc3.chat.roomRef`

## Schema

https://fdc3.finos.org/schemas/next/chatRoomRef.schema.json

## Details

| Property    | Type         | Required | Example Value                                  |
|-------------|--------------|----------|------------------------------------------------|
| `type`      | string       | Yes      | `'fdc3.chat.roomRef'`                          |
| `app`       | AppMetadata  | Yes      | AppMetadata corresponding to the application that generated the id |
| `name`      | string       | No       | `'Room #123'`                                  |
| `id`        | string       | No       | `'JRwnsrwfWE23' - id for chat application xxx` |

## Example

```js
const roomRefExample = {
    type: "fdc3.chat.roomRef",
    name: "FX",
    app: {/*...*/}, // AppMetadata object
    id: "ypCMgBms4mzpf77jLcP8M3///oYxkqpEdA=="
}

// Retrieving a ChatRoomRef from StartChat
const newChat = await fdc3.raiseIntent('StartChat', {
    type: 'fdc3.chat.initSettings',
    chatName: 'Issue #123',
    members: [{
        type: 'fdc3.contact',
        name: 'Jane Doe',
        id: {
            email: 'jane@mail.com'
        }
    }],
    initMessage: "Hello Jane"
});
const roomRefs = await newChat.getResult();
```

## See Also

Other Types
- [ChatInitSettings](ChatInitSettings)

Intents
- [StartChat](../../intents/ref/StartChat)
