---
id: version-next-Contact
sidebar_label: Contact
title: Contact
hide_title: true
original_id: Contact
---
# `Contact`

A person contact that can be engaged with through email, calling, messaging, CMS, etc.

## Type

`fdc3.contact`

## Schema

https://fdc3.finos.org/schemas/next/contact.schema.json

## Details

| Property    | Type    | Required | Example Value     |
|-------------|---------|----------|-------------------|
| `type`      | string  | Yes      | `'fdc3.contact'`  |
| `name`      | string  | No       | `'Jane Doe'`      |
| `id.email`  | string  | No       | `'jane@mail.com'` |
| `id.FDS_ID` | string  | No       | `'ABC123-E'`      |

## Example

```js
const contact = {
    type: 'fdc3.contact'
    name: 'Jane Doe',
    id: {
        email: 'jane.doe@mail.com'
    }
}


fdc3.broadcast(contact)
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