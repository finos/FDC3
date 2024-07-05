---
title: Email
description: >-
  A collection of information to be used to initiate an email with a Contact or
  ContactList.
sidebar_label: Email

---

# Email

A collection of information to be used to initiate an email with a Contact or ContactList.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/email.schema.json>

## Type

`fdc3.email`

## Properties

### `recipients`

One or more recipients for the email.


**Example Value**: 
```json
{
  "type": "fdc3.contact",
  "name": "Jane Doe",
  "id": {
    "email": "jane.doe@example.com"
  }
}
```

### `subject`

Subject line for the email.

**Type**: `string`


**Example Value**: 
`The information you requested`

### `textBody`

Body content for the email.

**Type**: `string`


**Example Value**: 
`Blah, blah, blah ...`

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

