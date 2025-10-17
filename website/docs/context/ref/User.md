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


**Example**: 

```js
"eyJhbGciOiJFZERTQSIsImprdSI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwNS8ud2VsbC1rbm93bi9qd2tzLmpzb24iLCJraWQiOiJhcHAxLXNpZ25pbmcta2V5In0.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjQwMDUiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQwMDMiLCJzdWIiOiJkZW1vLXVzZXIiLCJleHAiOjE3NTcwNjM0MjEsImlhdCI6MTc1NzA2MzEyMSwianRpIjoiMjE0OWQ5NDgtOWVhNy00ZmNjLTk1Y2ItN2Y1MjhhYjAwMjBkIn0.ap-OPusdBgBrubOuRzAQQcyukAHMqVuzR-j3eH5EzACHjbBguKDyby6M7-djrQEHObugF8XfCHCEaAYPRij_Cw"
```

</details>

## Example

```json
{
  "type": "fdc3.user",
  "name": "Mr Demo User",
  "jwt": "eyJhbGciOiJFZERTQSIsImprdSI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDAwNS8ud2VsbC1rbm93bi9qd2tzLmpzb24iLCJraWQiOiJhcHAxLXNpZ25pbmcta2V5In0.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjQwMDUiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQwMDMiLCJzdWIiOiJkZW1vLXVzZXIiLCJleHAiOjE3NTcwNjM0MjEsImlhdCI6MTc1NzA2MzEyMSwianRpIjoiMjE0OWQ5NDgtOWVhNy00ZmNjLTk1Y2ItN2Y1MjhhYjAwMjBkIn0.ap-OPusdBgBrubOuRzAQQcyukAHMqVuzR-j3eH5EzACHjbBguKDyby6M7-djrQEHObugF8XfCHCEaAYPRij_Cw"
}
```

