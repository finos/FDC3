---
title: ContactList
description: >-
  A collection of contacts, e.g. for chatting to or calling multiple contacts.


  The contact list schema does not explicitly include identifiers in the `id`
  section, as there is not a common standard for such identifiers. Applications
  can, however, populate this part of the contract with custom identifiers if so
  desired.
sidebar_label: ContactList

---

# ContactList

A collection of contacts, e.g. for chatting to or calling multiple contacts.

The contact list schema does not explicitly include identifiers in the `id` section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/contactList.schema.json>

## Type

`fdc3.contactList`

## Properties

### `contacts`

An array of contact contexts that forms the list.

**Type**: `array`


**Example Value**: 
```json
[
  {
    "type": "fdc3.contact",
    "name": "Jane Doe",
    "id": {
      "email": "jane.doe@mail.com"
    }
  },
  {
    "type": "fdc3.contact",
    "name": "John Doe",
    "id": {
      "email": "john.doe@mail.com"
    }
  }
]
```

## Example

```json
{
  "type": "fdc3.contactList",
  "contacts": [
    {
      "type": "fdc3.contact",
      "name": "Jane Doe",
      "id": {
        "email": "jane.doe@mail.com"
      }
    },
    {
      "type": "fdc3.contact",
      "name": "John Doe",
      "id": {
        "email": "john.doe@mail.com"
      }
    }
  ]
}
```

