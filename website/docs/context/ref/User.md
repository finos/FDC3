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
  <summary><code>name</code></summary>

**type**: `string`

The human-readable name of the user

</details>

<details>
  <summary><code>id</code></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>email</code></summary>

**type**: `string`

The user's email address as a unique identifier. If provided, this email must match the 'sub' field in the JWT token.

</details>

User identifiers that uniquely identify this user across different systems

</details>

<details>
  <summary><code>jwt</code> <strong>(required)</strong></summary>

**type**: `string`

A JSON Web Token (JWT) asserting user identity and permissions. The JWT contains a header with cryptographic information and a payload with user claims. Header fields include: 'alg' (signature algorithm, e.g., 'EdDSA'), 'jku' (JSON Web Key Set URL for key verification), and 'kid' (key identifier). Payload fields include: 'iss' (issuer - the application issuing the token), 'aud' (audience - the intended recipient application), 'sub' (subject - the user identifier), 'exp' (expiration time as Unix timestamp), 'iat' (issued at time as Unix timestamp), and 'jti' (JWT ID - unique token identifier).

</details>

## Example

```json
{
  "type": "fdc3.user",
  "name": "Mr Demo User",
  "jwt": "--example-jwt-token--"
}
```

