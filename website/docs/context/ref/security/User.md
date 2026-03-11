---
title: User
sidebar_label: User

---

# User

A user identity, expressed as a wrapped JWT.  Receivers will need to unwrap the JWT using their own private key.

## Schema

[https://fdc3.finos.org/schemas/next/context/user.schema.json](pathname:///schemas/next/context/user.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/security.user.schema.json))

## Type

`fdc3.security.user`

## Properties

<details>
  <summary><code>wrappedJwt</code></summary>

**type**: `string`

A JSON Web Token (JWT) asserting user identity and permissions, wrapped in the public key of the requester. The JWT contains a header with cryptographic information and a payload with user claims. Header fields include: 'alg' (signature algorithm, e.g., 'EdDSA'), 'jku' (JSON Web Key Set URL for key verification), and 'kid' (key identifier). Payload fields include: 'iss' (issuer - the application issuing the token), 'aud' (audience - the intended recipient application), 'sub' (subject - the user identifier), 'exp' (expiration time as Unix timestamp), 'iat' (issued at time as Unix timestamp), and 'jti' (JWT ID - unique token identifier). The jti field must be used to prevent the JWT from being replayed from a concurrent session.

</details>

## Example

```json
{
  "type": "fdc3.security.user",
  "wrappedJwt": "--example-jwt-token--but-wrapped-in-the-public-key-of-the-requester--"
}
```

