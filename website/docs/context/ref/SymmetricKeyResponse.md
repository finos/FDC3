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
  <summary><code>publicKeyUrl</code> <strong>(required)</strong></summary>

**type**: `string`

URL pointing to the public key used to wrap the symmetric key.

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

<details>
  <summary><code>algorithm</code> <strong>(required)</strong></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>name</code> <strong>(required)</strong></summary>

**type**: `string`

The algorithm name.


**Example**: 

```js
"RSA-OAEP"
```

</details>

<details>
  <summary><code>modulusLength</code> <strong>(required)</strong></summary>

**type**: `integer`

Length of the RSA key modulus in bits.


**Example**: 

```js
4096
```

</details>

<details>
  <summary><code>publicExponent</code> <strong>(required)</strong></summary>

**type**: `array`

<details>
  <summary><code>Items</code></summary>

**type**: `integer`

</details>

The public exponent used for key generation.


**Example**: 

```js
[
  1,
  0,
  1
]
```

</details>

<details>
  <summary><code>hash</code> <strong>(required)</strong></summary>

**type**: `string` with values:
- `SHA-256`,
- `SHA-384`,
- `SHA-512`

The name of the hash algorithm used with RSA-OAEP.


**Example**: 

```js
"SHA-256"
```

</details>

The encryption algorithm parameters used for key wrapping.

</details>

## Example

```json
{
  "type": "fdc3.security.symmetricKey.response",
  "id": {
    "publicKeyUrl": "https://example.com/keys/public.pem"
  },
  "wrappedKey": "u4jvA7Gx8LdH...==",
  "algorithm": {
    "name": "RSA-OAEP",
    "modulusLength": 4096,
    "publicExponent": [
      1,
      0,
      1
    ],
    "hash": "SHA-256"
  }
}
```

