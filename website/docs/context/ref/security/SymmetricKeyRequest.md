---
title: Symmetric Key Request
sidebar_label: Symmetric Key Request

---

# Symmetric Key Request

[@experimental](/docs/fdc3-compliance#experimental-features) A request to obtain a symmetric encryption key for decrypting encrypted context on a channel.

**Note:** This context type MUST be signed to be effective. The key owner uses the signature's public key URL to encrypt the symmetric key in the response, ensuring only the requesting application can decrypt it. See the [Security & Identity documentation](../../api/security) for details on signing context objects and encrypted communications.

## Schema

[https://fdc3.finos.org/schemas/next/context/symmetricKeyRequest.schema.json](pathname:///schemas/next/context/symmetricKeyRequest.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/security.symmetricKeyRequest.schema.json))

## Type

`fdc3.security.symmetricKeyRequest`

## Properties

<details>
  <summary><code>id</code></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>kid</code></summary>

**type**: `string`

Key ID to request a specific symmetric key.

</details>

Optional identifier for the requested key.

</details>

## Examples

```json
{
  "type": "fdc3.security.symmetricKeyRequest"
}
```

```json
{
  "type": "fdc3.security.symmetricKeyRequest",
  "id": {
    "kid": "channel-key-abc123"
  }
}
```

