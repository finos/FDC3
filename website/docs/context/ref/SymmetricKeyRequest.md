---
title: Symmetric Key Request
sidebar_label: Symmetric Key Request

---

# Symmetric Key Request

A request to obtain a symmetric encryption key.

## Schema

[https://fdc3.finos.org/schemas/next/context/symmetricKeyRequest.schema.json](pathname:///schemas/next/context/symmetricKeyRequest.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/security.symmetricKey.request.schema.json))

## Type

`fdc3.security.symmetricKey.request`

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
  "type": "fdc3.security.symmetricKey.request"
}
```

```json
{
  "type": "fdc3.security.symmetricKey.request",
  "id": {
    "kid": "channel-key-abc123"
  }
}
```

