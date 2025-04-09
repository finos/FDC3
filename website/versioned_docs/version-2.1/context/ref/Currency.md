---
id: Currency
sidebar_label: Currency
title: Currency
hide_title: true
---

# `Currency`

A context representing an individual Currency.

## Type

`fdc3.currency`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/currency.schema.json](pathname:///schemas/2.1/context/currency.schema.json)

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
