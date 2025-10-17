---
title: Symmetric Key Response
sidebar_label: Symmetric Key Response

---

# Symmetric Key Response

A response containing a wrapped symmetric key and metadata.

## Schema

[https://fdc3.finos.org/schemas/next/context/symmetricKeyResponse.schema.json](pathname:///schemas/next/context/symmetricKeyResponse.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/security.symmetricKey.response.schema.json))

## Type

`fdc3.security.symmetricKey.response`

## Properties

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>kid</code> <strong>(required)</strong></summary>

**type**: `string`

Key ID used to identify the public key used to wrap the symmetric key.

</details>

<details>
  <summary><code>pki</code> <strong>(required)</strong></summary>

**type**: `string`

Public Key Infrastructure JSON Web Key Set URL used to wrap the symmetric key.

</details>

</details>

<details>
  <summary><code>wrappedKey</code> <strong>(required)</strong></summary>

**type**: `string`

The symmetric key, encrypted using the recipient's public key.


**Example**: 

```js
"u4jvA7...=="
```

</details>

## Example

```json
{
  "type": "fdc3.security.symmetricKey.response",
  "id": {
    "kid": "key-id-123",
    "pki": "https://examples.com/myJWKSendpoint"
  },
  "wrappedKey": "u4jvA7Gx8LdH...=="
}
```

