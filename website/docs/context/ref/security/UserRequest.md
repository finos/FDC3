---
title: User Request
sidebar_label: User Request

---

# User Request

[@experimental](/docs/fdc3-compliance#experimental-features) A request for the current user's identity, raised via the GetUser intent. An identity provider app receives this request and responds with an 'fdc3.security.user' context containing a signed JWT wrapped in the requester's public key. The request includes the requesting application's audience identifier needed for the identity provider app to create a token bound to that application and to encrypt the response.

**Note:** This context type MUST be signed to be effective. The identity provider app uses the signature's public key URL to verify the requesting application's identity and to encrypt the response. See the [Security & Identity documentation](/docs/next/api/security) for details on signing context objects.

## Schema

[https://fdc3.finos.org/schemas/next/context/userRequest.schema.json](pathname:///schemas/next/context/userRequest.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/security.userRequest.schema.json))

## Type

`fdc3.security.userRequest`

## Properties

<details>
  <summary><code>aud</code> <strong>(required)</strong></summary>

**type**: `string`

The audience identifier for the returned JWT, typically the URL of the requesting application. The identity provider will embed this value in the JWT's 'aud' claim, allowing the requesting application to verify that the token was issued specifically for it. This prevents token misuse if intercepted by other applications.

</details>

## Example

```json
{
  "type": "fdc3.security.userRequest",
  "aud": "https://my-app-url.com"
}
```

