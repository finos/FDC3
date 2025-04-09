---
id: TradeList
sidebar_label: TradeList
title: TradeList
hide_title: true
---
# `TradeList`

[`@experimental`](/docs/fdc3-compliance#experimental-features) A list of trades. Use this type for use cases that require not just a single trade, but multiple.

Notes:

- The TradeList schema does not explicitly include identifiers in the id section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Type

`fdc3.tradeList`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/tradeList.schema.json](pathname:///schemas/2.1/context/tradeList.schema.json)

## Details

| Property     | Type       | Required | Example Value             |
|--------------|------------|----------|---------------------------|
| `type`       | string     | Yes      | `'fdc3.tradeList'`        |
| `id`         | object     | No       | `{ listId: '1234' }` |
| `name`       | string     | No       | `'Today's trades'`    |
| `trades`     | Trade[]    | Yes      | `[trade1, trade2]`  |

## Example

```js
const tradeList = {
    type: "fdc3.tradeList",
    trades: [
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
};
```

## See Also

Other Types

- [Trade](Trade)
