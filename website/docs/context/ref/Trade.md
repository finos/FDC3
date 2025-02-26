---
title: Trade
sidebar_label: Trade

---

# Trade

[@experimental](/docs/fdc3-compliance#experimental-features) context type representing a trade. To be used with execution systems.

This type currently only defines a required `id` field, which should provide a reference to the trade in one or more systems, an optional human readable `name` field to be used to summarize the trade and a required `product` field that may be used to provide additional detail about the trade, which is currently typed as a unspecified Context type, but `product` is expected to be standardized in future.

 The Trade schema does not explicitly include identifiers in the id section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Schema

[https://fdc3.finos.org/schemas/next/context/trade.schema.json](https://fdc3.finos.org/schemas/next/context/trade.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/trade.schema.json))

## Type

`fdc3.trade`

## Properties

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

<details>
  <summary><code>Additional Properties</code></summary>

**type**: `string`

</details>

One or more identifiers that refer to the trade in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

A human-readable summary of the trade.

</details>

<details>
  <summary><code>notes</code></summary>

**type**: `string`

A description or set of notes.

</details>

<details>
  <summary><code>product</code> <strong>(required)</strong></summary>

**type**: [Product](Product)

A product that is the subject of the trade.

</details>

## Example

```json
{
  "type": "fdc3.trade",
  "name": "...",
  "notes": "Some notes attached to this trade",
  "id": {
    "myEMS": "12345"
  },
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
```

