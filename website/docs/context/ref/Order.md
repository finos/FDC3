---
title: Order
sidebar_label: Order

---

# Order

[@experimental](/docs/fdc3-compliance#experimental-features) context type representing an order. To be used with OMS and EMS systems.

This type currently only defines a required `id` field, which should provide a reference to the order in one or more systems, an optional human readable `name` field to be used to summarize the order and an optional `details` field that may be used to provide additional detail about the order, including a context representing a `product`, which may be extended with arbitrary properties. The `details.product` field is currently typed as a unspecified Context type, but both `details` and `details.product` are expected to be standardized in future.

## Schema

[https://fdc3.finos.org/schemas/next/context/order.schema.json](https://fdc3.finos.org/schemas/next/context/order.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/order.schema.json))

## Type

`fdc3.order`

## Properties

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

<details>
  <summary><code>Additional Properties</code></summary>

**type**: `string`

</details>

One or more identifiers that refer to the order in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

An optional human-readable summary of the order.

</details>

<details>
  <summary><code>notes</code></summary>

**type**: `string`

A description or set of notes.

</details>

<details>
  <summary><code>details</code></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>product</code></summary>

**type**: [Product](Product)

</details>

Optional additional details about the order, which may include a product element that is an, as yet undefined but extensible, Context

</details>

## Examples

```json
{
  "type": "fdc3.order",
  "name": "...",
  "notes": "Some notes attached to this order",
  "id": {
    "myOMS": "12345"
  },
  "details": {
    "product": {
      "type": "fdc3.product",
      "id": {
        "productId": "ABC123"
      },
      "instrument": {
        "type": "fdc3.instrument",
        "id": {
          "ticker": "MSFT"
        }
      }
    }
  }
}
```

```json
{
  "type": "fdc3.order",
  "id": {
    "myOMS": "ABC123"
  }
}
```

