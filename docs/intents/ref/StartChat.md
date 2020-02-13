---
id: StartChat
sidebar_label: StartChat
title: StartChat
hide_title: true
---
# `StartChat`

Initiate a chat with a contact or list of contacts.

## Intent Name

`StartChat`

## Display Name

`Chat`

## Possible Contexts

* [Contact](../../context/ref/Contact)
* [ContactList](../../context/ref/ContactList)

## Example

```js
const contact = {
    type: 'fdc3.contact',
    id: {
        email: 'nick@gmail.com'
    },
    name: 'Nick Kolba'
}

fdc3.raiseIntent('StartChat', contact)
```

## See Also

Context
- [Contact](../../context/ref/Contact)
- [ContactList](../../context/ref/ContactList)

Intents
- [StartCall](StartCall)