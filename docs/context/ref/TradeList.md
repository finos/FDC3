---
title: TradeList
description: >-
  @experimental A list of trades. Use this type for use cases that require not
  just a single trade, but multiple.


  The TradeList schema does not explicitly include identifiers in the id
  section, as there is not a common standard for such identifiers. Applications
  can, however, populate this part of the contract with custom identifiers if so
  desired.
sidebar_label: TradeList

---

# TradeList

[@experiemental](/docs/fdc3-compliance#experimental-features) A list of trades. Use this type for use cases that require not just a single trade, but multiple.

The TradeList schema does not explicitly include identifiers in the id section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/tradeList.schema.json>

## Type

`fdc3.tradeList`

## Properties

### `trades`

An array of trade contexts that forms the list.

**type**: `array`


**Example Value**: 
```json
[
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
```

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

