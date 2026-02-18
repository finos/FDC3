---
title: User Request
sidebar_label: User Request

---

# User Request

A request for the current user's identity, typically raised via the CreateIdentityToken intent. An identity provider (IDP) receives this request and responds with an 'fdc3.user' context containing a signed JWT. The request includes cryptographic details needed for the IDP to create a token bound to the requesting application and to encrypt the response.

**Note:** This context type MUST be signed to be effective. The IDP uses the signature's public key URL to verify the requesting application's identity and to encrypt the response. See the [Security & Identity documentation](../../api/security) for details on signing context objects.

## Schema

[https://fdc3.finos.org/schemas/next/context/userRequest.schema.json](pathname:///schemas/next/context/userRequest.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/user.request.schema.json))

## Type

`fdc3.user.request`

## Properties

<details>
  <summary><code>aud</code> <strong>(required)</strong></summary>

**type**: `string`

The audience identifier for the returned JWT, typically the URL of the requesting application. The identity provider will embed this value in the JWT's 'aud' claim, allowing the requesting application to verify that the token was issued specifically for it. This prevents token misuse if intercepted by other applications.

</details>

## Example

```json
{
  "type": "fdc3.user.request",
  "aud": "https://my-app-url.com"
}
```

