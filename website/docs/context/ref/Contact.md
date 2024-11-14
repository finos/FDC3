---
title: Contact
sidebar_label: Contact

---

# Contact

A person contact that can be engaged with through email, calling, messaging, CMS, etc.

## Schema

<https://fdc3.finos.org/schemas/next/context/contact.schema.json> ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/contact.schema.json))

## Type

`fdc3.contact`

## Properties

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>email</code></summary>

**type**: `string`

The email address for the contact

</details>

<details>
  <summary><code>FDS_ID</code></summary>

**type**: `string`

FactSet Permanent Identifier representing the contact

</details>

Identifiers that relate to the Contact represented by this context

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

An optional human-readable name for the contact

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

