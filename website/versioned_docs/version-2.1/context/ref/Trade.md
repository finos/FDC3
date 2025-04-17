---
id: Trade
sidebar_label: Trade
title: Trade
hide_title: true
---
# `Trade`

[`@experimental`](/docs/fdc3-compliance#experimental-features) context type representing a trade. To be used with execution systems.

This type currently only defines a required `id` field, which should provide a reference to the trade in one or more systems, an optional human readable `name` field to be used to summarize the trade and a required `product` field that may be used to provide additional detail about the trade, which is currently typed as an unspecified Context type, but `product` is expected to be standardized in future.

Notes:

- The Trade schema does not explicitly include identifiers in the id section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Type

`fdc3.trade`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/trade.schema.json](pathname:///schemas/2.1/context/trade.schema.json)

## Details

| Property     | Type       | Required | Details             |
|--------------|------------|----------|---------------------------|
| `type`       | string     | Yes      | `'fdc3.trade'`        |
| `id`         | object     | Yes      | One or more identifiers that refer to the trade in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future. |
| `name`       | string     | No       | A human-readable summary of the trade, e.g. `'100 TSLA @ 290.85 USD'`    |
| `product`    | Product    | Yes      | A tradeable product  |

## Example

```js
const trade = {
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
};
```

## See Also

Other Types

- [Product](Product)
- [TradeList](TradeList)
