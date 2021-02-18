---
id: Currency
sidebar_label: Currency
title: Currency
hide_title: true
---
# `Currency`

An entity that can be used when referencing currency that can be used on its own as well as in other contexts when adding additional attributes e.g. when adding details to a Valuation.

## Type

`fdc3.currency`

## Schema

https://fdc3.finos.org/schemas/next/currency.schema.json

## Details

| Property         | Type    | Required | Example Value        |
|------------------|---------|----------|----------------------|
| `type`          | string  | Yes      | `'fdc3.currency'`  |
| `name`          | string  | No       | `'US Dollar'`      |
| `code`          | string  | Yes      | `'USD'`             |


## Example

```js
const currency = {
    type: 'fdc3.currency',
    name: 'US Dollar',
    code: 'USD'
}

fdc3.broadcast(currency)
```

## See Also

Other Types
- [Valuation](Valuation)

Intents
- [ViewAnalysis](../../intents/ref/viewAnalysis)
- [ViewNews](../../intents/ref/ViewNews)

FINOS Financial Objects
- [Currency](https://fo.finos.org/docs/objects/currency)
