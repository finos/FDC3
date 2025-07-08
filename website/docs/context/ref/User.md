---
title: User
sidebar_label: User

---

# User

A user identity, extending contact with authentication metadata.

## Schema

[https://fdc3.finos.org/schemas/next/context/user.schema.json](pathname:///schemas/next/context/user.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/user.schema.json))

## Type

`fdc3.user`

## Properties

<details>
  <summary><code>jwt</code> <strong>(required)</strong></summary>

**type**: `string`

A JSON Web Token asserting user identity or permissions.


**Example**: 

```js
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2Nzg5LCJuYW1lIjoiSm9obiBEb2UifQ.OpOSSw7e485LOP5PrzScxHb7SR6sAOMRckfFwi4rp7o"
```

</details>

## Example

```json
{
  "type": "fdc3.user",
  "name": "John Doe",
  "id": {
    "email": "john.doe@somebank.com"
  },
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2Nzg5LCJuYW1lIjoiSm9obiBEb2UifQ.OpOSSw7e485LOP5PrzScxHb7SR6sAOMRckfFwi4rp7o"
}
```

