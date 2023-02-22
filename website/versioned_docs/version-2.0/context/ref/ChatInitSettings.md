---
sidebar_label: ChatInitSettings
title: ChatInitSettings
hide_title: true
original_id: ChatInitSettings
---

# `ChatInitSettings`

A collection of settings to start a new chat conversation

## Type

`fdc3.chat.initSettings`

## Schema

https://fdc3.finos.org/schemas/2.0/chatInitSettings.schema.json

## Details

| Property                       | Type        | Required | Example Value                                                        |
| ------------------------------ | ----------- | -------- | -------------------------------------------------------------------- |
| `type`                         | string      | Yes      | `'fdc3.chat.initSettings'`                                           |
| `chatName`                     | string      | No       | `'Instrument XYZ'`                                                    |
| `members`                      | ContactList | No       | ContactList - cf. below                                              |
| `initMessage`                  | string      | No       | `'Hello!'`                                                           |
| `options.groupRecipients`      | boolean     | No       | `true`: if false a separate chat will be created for each member     |
| `options.public`               | boolean     | No       | `true`: the room will be visible to everyone in the chat application |
| `options.allowHistoryBrowsing` | boolean     | No       | `true`: members will be allowed to browse past messages             |
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
        public: false, // private chat room
        allowHistoryBrowsing: true,
        allowMessageCopy: true
    }
    initMessage: 'Hello both!'
}

const res = fdc3.raiseIntent('StartChat', initSettings);
const roomRefs = await res.getResult();
```

## See Also

Other Types

- [ContactList](ContactList)

Intents

- [StartChat](../../intents/ref/StartChat)
- [StartCall](../../intents/ref/StartCall)
- [ViewContact](../../intents/ref/ViewContact)

FINOS Financial Objects

- [Contact](https://fo.finos.org/docs/objects/contact)
