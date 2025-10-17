---
title: User Request
sidebar_label: User Request

---

# User Request

A request for the current user’s identity.

## Schema

[https://fdc3.finos.org/schemas/next/context/userRequest.schema.json](pathname:///schemas/next/context/userRequest.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/user.request.schema.json))

## Type

`fdc3.user.request`

## Properties

<details>
  <summary><code>aud</code> <strong>(required)</strong></summary>

**type**: `string`

The audience (aud) claim specifying the intended recipient of the user request, typically the URL of the requesting application.  This will be used in the returned JWT token for the aud claim.

</details>

<details>
  <summary><code>jku</code> <strong>(required)</strong></summary>

**type**: `string`

The JSON Web Key Set URL (jku) claim specifying the URL where the requesting application's JSON Web Key Set (JWKS) can be retrieved. This should contain the public keys for encryption purposes

</details>

## Example

```json
{
  "type": "fdc3.user.request",
  "aud": "https://my-app-url.com",
  "jku": "https://my-app-url.com/.well-known/jwks.json"
}
```

