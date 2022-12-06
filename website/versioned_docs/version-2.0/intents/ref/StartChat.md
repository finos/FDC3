---
id: version-2.0-StartChat
sidebar_label: StartChat
title: StartChat
hide_title: true
original_id: StartChat
---
# `StartChat`

Initiate a chat with a contact, a list of contacts or detailed initialization settings.

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
        isPublic: false, // private chat room
        allowHistoryBrowsing: true,
        allowMessageCopy: true,
        allowAddUser: false, // John won't be authorized to add other users to the chat
    }
    initMessage: 'Hello John!'
}

const resolution = fdc3.raiseIntent('StartChat', initSettings);
const chatRoomRefs = await resolution.getResult();
```

## See Also

Context
- [Contact](../../context/ref/Contact)
- [ContactList](../../context/ref/ContactList)
- [ChatInitSettings](../../context/ref/ChatInitSettings)

Intents
* [StartCall](StartCall)
* [StartEmail](StartEmail)
