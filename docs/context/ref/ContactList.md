---
title: ContactList
sidebar_label: ContactList

---

# ContactList

A collection of contacts, e.g. for chatting to or calling multiple contacts.

The contact list schema does not explicitly include identifiers in the `id` section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Schema

[https://fdc3.finos.org/schemas/next/context/contactList.schema.json](https://fdc3.finos.org/schemas/next/context/contactList.schema.json) ([github](https://github.com/finos/FDC3/tree/main/schemas/context/contactList.schema.json))

## Type

`fdc3.contactList`

## Properties

<details>
  <summary><code>id</code></summary>

**type**: `object`

<details>
  <summary><code>Additional Properties</code></summary>

**type**: `string`

</details>

One or more identifiers that refer to the contact list in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

An optional human-readable summary of the contact list

</details>

<details>
  <summary><code>contacts</code> <strong>(required)</strong></summary>

**type**: `array`

<details>
  <summary><code>Items</code></summary>

**type**: [Contact](Contact)

</details>

An array of contact contexts that forms the list.

</details>

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

