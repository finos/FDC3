---
id: version-next-ContactList
sidebar_label: ContactList
title: ContactList
hide_title: true
original_id: ContactList
---
# `ContactList`

A collection of contacts, e.g. for chatting to or calling multiple contacts.

Notes:

- The contact list schema does not explicitly include identifiers in the `id` section, as there
is not a common standard for such identifiers. Applications can, however, populate
this part of the contract with custom identifiers if so desired.

## Type

`fdc3.contactList`

## Schema

https://fdc3.finos.org/schemas/next/contactList.schema.json

## Details

| Property    | Type      | Required | Example Value          |
|-------------|-----------|----------|------------------------|
| `type`      | string    | Yes      | `'fdc3.contactList'`   |
| `id`        | object    | No       | `{ customId: '5576' }` |
| `name`      | string    | No       | `'My address book'`    |
| `contacts`  | Contact[] | Yes      | `[contact1, contact2]` |

## Example

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


fdc3.raiseIntent('StartChat', contacts)
```

## See Also

Other Types
- [Contact](Contact)

Intents
- [StartChat](../../intents/ref/StartChat)
- [StartCall](../../intents/ref/StartCall)

FINOS Financial Objects
- [ContactList](https://fo.finos.org/docs/objects/contactlist)