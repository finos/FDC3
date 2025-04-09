---
title: Email
sidebar_label: Email

---

# Email

A collection of information to be used to initiate an email with a Contact or ContactList.

## Schema

[https://fdc3.finos.org/schemas/next/context/email.schema.json](pathname:///schemas/next/context/email.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/email.schema.json))

## Type

`fdc3.email`

## Properties

<details>
  <summary><code>recipients</code> <strong>(required)</strong></summary>

**One of:**

- **type**: [Contact](Contact)
- **type**: [ContactList](ContactList)

One or more recipients for the email.

</details>

<details>
  <summary><code>subject</code></summary>

**type**: `string`

Subject line for the email.

</details>

<details>
  <summary><code>textBody</code></summary>

**type**: `string`

Body content for the email.

</details>

## Example

```json
{
  "type": "fdc3.email",
  "recipients": {
    "type": "fdc3.contact",
    "name": "Jane Doe",
    "id": {
      "email": "jane.doe@example.com"
    }
  },
  "subject": "The information you requested",
  "textBody": "Blah, blah, blah ..."
}
```

