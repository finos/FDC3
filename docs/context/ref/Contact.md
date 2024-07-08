---
title: Contact
description: >-
  A person contact that can be engaged with through email, calling, messaging,
  CMS, etc.
sidebar_label: Contact

---

# Contact

A person contact that can be engaged with through email, calling, messaging, CMS, etc.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/contact.schema.json>

## Type

`fdc3.contact`

## Properties

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

Identifiers that relate to the Contact represented by this context

**Subproperties:**

`email`
- **type**: `string`
- **description**: Email address:  The email address for the contact

`FDS_ID`
- **type**: `string`
- **description**: FDS ID:  FactSet Permanent Identifier representing the contact


**Example**: 
```json
{
  "email": "jane.doe@mail.com"
}
```

</details>

## Example

```json
{
  "type": "fdc3.contact",
  "name": "Jane Doe",
  "id": {
    "email": "jane.doe@mail.com"
  }
}
```

