---
id: StartCall
sidebar_label: StartCall
title: StartCall
hide_title: true
---
# `StartCall`

Initiate a call with a contact or list of contacts.

## Intent Name

`StartCall`

## Display Name

`Start a Call`

## Possible Contexts

- [Contact](../../context/ref/Contact)
- [ContactList](../../context/ref/ContactList)

## Example

```js
const contact = {
    type: 'fdc3.contact',
    name: 'Jane Doe',
    id: {
        email: 'jane@mail.com'
    }
}

fdc3.raiseIntent('StartCall', contact)
```

## See Also

Context

- [Contact](../../context/ref/Contact)
- [ContactList](../../context/ref/ContactList)

Intents

- [StartChat](StartChat)
- [StartEmail](StartEmail)
