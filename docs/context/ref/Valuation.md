---
id: Valuation
sidebar_label: Valuation
title: Valuation
hide_title: true
---
# `Valuation`

A valuation expresses a price and value of a holding. It is a key component of a [Trade](Trade) or [Position](Position) record.

## Type

`fdc3.valuation`

## Schema

https://fdc3.finos.org/schemas/next/valuation.schema.json

## Details

| Property         | Type    | Required | Example Value                        |
|------------------|---------|----------|--------------------------------------|
| `type`          | string  | Yes      | `'fdc3.valuation'`                 |
| `price`         | number  | No       | `5.00`                               |
| `value`         | number  | Yes      | `500.00`                            |
| `currency`     | Currency | No       | `{ type: 'fdc3.currency', ... }` |

## Example

```js
const valuation = {
    type: 'fdc3.valuation',
    price: 20.00,
    value: 20000000,
    currency: {
        type: 'fdc3.currency',
        code: 'USD'
    }
}

fdc3.broadcast(valuation)
```

## See Also

Other Types
- [Currency](Currency)
- [Trade](Trade)

Intents
- [ViewAnalysis](../../intents/ref/viewAnalysis)
- [ViewNews](../../intents/ref/ViewNews)

FINOS Financial Objects
- [Currency](https://fo.finos.org/docs/objects/valuation)
