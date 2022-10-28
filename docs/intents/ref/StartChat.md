---
id: StartChat
sidebar_label: StartChat
title: StartChat
hide_title: true
---
# `StartChat`

Initiate a chat with a contact, a list of contacts or detailed initialization settings.  This could be launched from within another application. For example initiating a chat from a research or OMS application.

## Intent Name

`StartChat`

## Display Name

`Start a Chat`

## Possible Contexts

* [Contact](../../context/ref/Contact)
* [ContactList](../../context/ref/ContactList)
* [ChatInitSettings](../../context/ref/ChatInitSettings)

## Example

```js
const contact = {
    type: 'fdc3.contact',
    name: 'Jane Doe',
    id: {
        email: 'jane@mail.com'
    }
}

fdc3.raiseIntent('StartChat', contact)

// chat with initialization settings
const initSettings = {
    type: 'fdc3.chat.initSettings',
    chatName: 'Issue #123',
    members: {
        type: 'fdc3.contactList',
        contacts: [{
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
        allowMessageCopy: true,
        allowAddUser: false, // John won't be authorized to add other users to the chat
    }
    initMessage: 'Hello John!'
}

const resolution = fdc3.raiseIntent('StartChat', initSettings);

// Return a reference to the room
const chatRoom = await resolution.getResult();
```

## See Also

Context
- [ChatRoom](../../context/ref/ChatRoom)
- [Contact](../../context/ref/Contact)
- [ContactList](../../context/ref/ContactList)
- [ChatInitSettings](../../context/ref/ChatInitSettings)

Intents
* [SendChatMessage](SendChatMessage)
* [StartCall](StartCall)
* [StartEmail](StartEmail)
