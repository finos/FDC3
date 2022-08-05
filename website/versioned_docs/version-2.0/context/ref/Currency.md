---
id: version-2.0-Currency
sidebar_label: Currency
title: Currency
hide_title: true
original_id: Currency
---

# `Currency`

A context representing an individual Currency. 

## Type

`fdc3.currency`

## Schema

https://fdc3.finos.org/schemas/next/currency.schema.json

## Details

| Property                | Type    | Required | Example Value     |
|-------------------------|---------|----------|-------------------|
| `type`                  | string  | Yes      | `'fdc3.currency'` |
| `name`                  | string  | No       | `'US Dollar'`     |
| `id.CURRENCY_ISOCODE` * | string  | Yes      | `'USD'`           |

\* The `CURRENCY_ISOCODE` should conform to 3 character alphabetic codes defined in [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html).

## Example

```js
const currency = {
    type: 'fdc3.currency',
    name: 'US Dollar',
    id: {
        CURRENCY_ISOCODE: "USD"
    }
}
```
