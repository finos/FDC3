---
id: ViewContact
sidebar_label: ViewContact
title: ViewContact
hide_title: true
---
# `ViewContact`

View details for a contact.

## Intent Name

`ViewContact`

## Display Name

`View Contact Details`

## Possible Contexts

* [Contact](../../context/ref/Contact)

## Example

```js
const contact = {
    type: 'fdc3.contact',
    name: 'Jane Doe',
    id: {
        email: 'jane@mail.com'
    }
}

fdc3.raiseIntent('ViewContact', contact)
```

## See Also

Context
- [Contact](../../context/ref/Contact)

Intents
- [StartChat](StartChat)