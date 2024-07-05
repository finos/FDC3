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

### `id`

Identifiers that relate to the Contact represented by this context

**Type**: `object`

#### Subproperties
##### email
- Type: `string`
- Description: `The email address for the contact`

##### FDS_ID
- Type: `string`
- Description: `FactSet Permanent Identifier representing the contact`


**Example Value**: 
```json
{
  "email": "jane.doe@mail.com"
}
```

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

