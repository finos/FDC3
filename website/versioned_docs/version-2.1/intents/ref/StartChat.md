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

- [Contact](../../context/ref/Contact)
- [ContactList](../../context/ref/ContactList)
- [ChatInitSettings](../../context/ref/ChatInitSettings)

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
    }
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

- [SendChatMessage](SendChatMessage)
- [StartCall](StartCall)
- [StartEmail](StartEmail)
