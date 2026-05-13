---
title: Encrypted Context Wrapper
sidebar_label: Encrypted Context Wrapper

---

# Encrypted Context Wrapper

[@experimental](/docs/fdc3-compliance#experimental-features) A wrapper context type for encrypted FDC3 context data. When an app broadcasts encrypted context data, the original type is preserved for routing purposes, while the remaining context information is encrypted. Recipients can request a symmetric key via 'fdc3.security.symmetricKey.request' to decrypt the payload.

## Schema

[https://fdc3.finos.org/schemas/next/context/encrypted.schema.json](pathname:///schemas/next/context/encrypted.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/security.encryptedContext.schema.json))

## Type

`fdc3.security.encryptedContext`

## Properties

<details>
  <summary><code>originalType</code> <strong>(required)</strong></summary>

**type**: `string`

The original FDC3 context type that was encrypted (e.g., 'fdc3.instrument', 'fdc3.contact'). This field is used by the desktop agent and context handlers for routing decisions.

</details>

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>kid</code> <strong>(required)</strong></summary>

**type**: `string`

Key ID identifying the symmetric key used to encrypt the payload.

</details>

Identifiers for the encryption key used.

</details>

<details>
  <summary><code>encryptedPayload</code> <strong>(required)</strong></summary>

**type**: `string`

The encrypted context data as a base64-encoded string. Contains all fields from the original context except for the type. Encrypted using the symmetric key identified by 'id.kid'.

</details>

## Examples

```json
{
  "type": "fdc3.security.encryptedContext",
  "originalType": "fdc3.instrument",
  "id": {
    "kid": "channel-key-abc123"
  },
  "encryptedPayload": "eyJuYW1lIjoiQXBwbGUiLCJpZCI6eyJ0aWNrZXIiOiJBQVBMIn19..."
}
```

```json
{
  "type": "fdc3.security.encryptedContext",
  "originalType": "fdc3.contact",
  "id": {
    "kid": "session-key-xyz789"
  },
  "encryptedPayload": "eyJuYW1lIjoiSm9obiBEb2UiLCJpZCI6eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20ifX0=..."
}
```

