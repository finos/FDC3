---
id: ChatInitSettings
sidebar_label: ChatInitSettings
title: ChatInitSettings
hide_title: true
---

# `ChatInitSettings`

A collection of settings to start a new chat conversation

## Type

`fdc3.chat.initSettings`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/chatInitSettings.schema.json](https://fdc3.finos.org/schemas/2.1/context/chatInitSettings.schema.json)

## Details

| Property                       | Type        | Required | Example Value                                                        |
| ------------------------------ | ----------- | -------- | -------------------------------------------------------------------- |
| `type`                         | string      | Yes      | `'fdc3.chat.initSettings'`                                           |
| `chatName`                     | string      | No       | `'Instrument XYZ'`                                                   |
| `members`                      | ContactList | No       | ContactList - cf. below                                              |
| `message`                      | Message     | No       | Message - cf. below                                                  |
| `options.groupRecipients`      | boolean     | No       | `true`: if false a separate chat will be created for each member     |
| `options.isPublic`             | boolean     | No       | `true`: the room will be visible to everyone in the chat application |
| `options.allowHistoryBrowsing` | boolean     | No       | `true`: members will be allowed to browse past messages              |
| `options.allowMessageCopy`     | boolean     | No       | `true`: members will be allowed to copy/paste messages               |
| `options.allowAddUser`         | boolean     | No       | `true`: members will be allowed to add other members to the chat     |

If _members_ or _chatName_ are not provided, the application executing this
intent is expected to provide a means to enter such information.

## Example

```js
const initSettings = {
    type: 'fdc3.chat.initSettings',
    chatName: 'Chat ABCD',
    members: {
        type: 'fdc3.contactList',
        contacts: [{
            type: 'fdc3.contact',
            name: 'Jane Doe',
            id: {
                email: 'jane@mail.com'
            }
        },{
            type: 'fdc3.contact',
            name: 'John Doe',
            id: {
                email: 'john@mail.com'
            },
        }]
    },
    options: {
        groupRecipients: true, // one chat with both contacts
        isPublic: false, // private chat room
        allowHistoryBrowsing: true,
        allowMessageCopy: true
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

const res = fdc3.raiseIntent('StartChat', initSettings);

// Return a reference to the room
const chatRoom = await res.getResult();
```

## See Also

Other Types

- [ChatRoom](ChatRoom)
- [ContactList](ContactList)
- [Message](Message)

Intents

- [StartChat](../../intents/ref/StartChat)
- [StartCall](../../intents/ref/StartCall)
- [SendChatMessage](../../intents/ref/StartChat)
- [ViewContact](../../intents/ref/ViewContact)

FINOS Financial Objects

- [Contact](https://fo.finos.org/docs/objects/contact)
