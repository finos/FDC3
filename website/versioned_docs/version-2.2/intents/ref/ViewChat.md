---
id: ViewChat
sidebar_label: ViewChat
title: ViewChat
hide_title: true
---
# `ViewChat`

Open an existing chat room.

## Intent Name

`ViewChat`

## Display Name

`View Chat`

## Possible Contexts

- [ChatRoom](../../context/ref/ChatRoom)
- [Contact](../../context/ref/Contact): It will open the **direct** chat where there is the current user and the contact
- [ContactList](../../context/ref/ContactList): It will open the **room** where there is the current user and the listed contacts. Contact List may need to display search results if there are multiple matches.

## Output

This intent returns as output:
- If the chat doesn't exist, will display a modal to create a chat
- if the chat gets created, return its ChatRoom context
- if none is created return void

## Example: ChatRoom

```js
const chatRoom = {
    type: 'fdc3.chat.room',
    providerName: "Symphony",
    id: {
        streamId: "j75xqXy25NBOdacUI3FNBH"
    }
}

const intentResolution = await fdc3.raiseIntent('ViewChat', chatRoom);

const chatRoom = intentResolution.getResult(): // A chatRoom will be returned as context if the room was found
```

## Example: Contact

```js
const contact = {
    type: 'fdc3.contact',
    name: 'Jane Doe',
    id: {
        email: 'jane@mail.com'
    }
}

const intentResolution = await fdc3.raiseIntent('ViewChat', contact);

const chatRoom = intentResolution.getResult(): // A chatRoom will be returned as context if the direct chat was found
```

## Example: ContactList

```js
const contacts = {
    type: 'fdc3.contactList',
    contacts: [
        {
            type: 'fdc3.contact',
            name: 'Jane Doe',
            id: {
                email: 'jane.doe@mail.com'
            }
        },
        {
            type: 'fdc3.contact',
            name: 'John Doe',
            id: {
                email: 'john.doe@mail.com'
            }
        },
    ]
}


const intentResolution = await fdc3.raiseIntent('ViewChat', contacts);

const chatRoom = intentResolution.getResult(): // A chatRoom will be returned as context if the room was found
```

## See Also

Context

- [ChatRoom](../../context/ref/ChatRoom)
- [Contact](../../context/ref/Contact)
- [ContactList](../../context/ref/ContactList)

Intents

- [StartChat](StartChat)