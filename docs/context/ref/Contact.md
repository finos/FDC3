---
id: Contact
sidebar_label: Contact
title: Contact
hide_title: true
---
# `Contact`

A person contact that can be engaged with through email, calling, messaging, CMS, etc.

## Type

`fdc3.contact`

## Schema

https://fdc3.finos.org/schemas/next/contact.schema.json

## Details

| Property   | Type    | Required | Value             |
|------------|---------|----------|-------------------|
| `type`     | string  | Yes      | `'fdc3.contact'`  |
| `name`     | string  | No       | `'Jane Doe'`      |
| `id.email` | string  | Yes      | `'jane@mail.com'` |

## Example

```js
const contact = {
    type: 'fdc3.contact',
    id: {
        email: 'nick@gmail.com'
    },
    name: 'Nick Kolba'
}

fdc3.broadcast(contact)
```

## See Also

Context
- [ContactList](ContactList)

Intents
- [StartChat](../../intents/ref/StartChat)
- [StartCall](../../intents/ref/StartCall)