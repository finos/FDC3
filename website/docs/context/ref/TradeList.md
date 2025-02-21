---
title: TradeList
sidebar_label: TradeList

---

# TradeList

[@experimental](/docs/fdc3-compliance#experimental-features) A list of trades. Use this type for use cases that require not just a single trade, but multiple.

The TradeList schema does not explicitly include identifiers in the id section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Schema

[https://fdc3.finos.org/schemas/next/context/tradeList.schema.json](https://fdc3.finos.org/schemas/next/context/tradeList.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/tradeList.schema.json))

## Type

`fdc3.tradeList`

## Properties

<details>
  <summary><code>trades</code> <strong>(required)</strong></summary>

**type**: `array`

<details>
  <summary><code>Items</code></summary>

**type**: [Trade](Trade)

</details>

An array of trade contexts that forms the list.

</details>

<details>
  <summary><code>id</code></summary>

**type**: `object`

<details>
  <summary><code>Additional Properties</code></summary>

**type**: `string`

</details>

One or more identifiers that refer to the trade list in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

An optional human-readable name for the trade list

</details>

## Example

```json
{
  "type": "fdc3.tradeList",
  "trades": [
    {
      "type": "fdc3.trade",
      "name": "...",
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
    },
    {
      "type": "fdc3.trade",
      "id": {
        "myEMS": "67890"
      },
      "product": {
        "type": "fdc3.product",
        "id": {
          "productId": "DEF456"
        },
        "instrument": {
          "type": "fdc3.instrument",
          "id": {
            "ticker": "TSLA"
          }
        }
      }
    }
  ]
}
```

