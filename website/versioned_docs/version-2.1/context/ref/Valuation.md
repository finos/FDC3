---
id: Valuation
sidebar_label: Valuation
title: Valuation
hide_title: true
---
# `Valuation`

A context type representing the price and value of a holding.

## Type

`fdc3.valuation`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/valuation.schema.json](pathname:///schemas/2.1/context/valuation.schema.json)

## Details

| Property             | Type    | Required | Example Value                 |
|----------------------|---------|----------|-------------------------------|
| `type`               | string  | Yes      | `'fdc3.valuation'`            |
| `value`              | number  | Yes      | `500.0`                       |
| `price`              | number  | No       | `5.0`                         |
| `CURRENCY_ISOCODE` * | string  | Yes      | `GBP`                         |
| `valuationTime` **   | string  | No       | `"2022-05-12T16:16:24.815Z"`  |
| `expiryTime` **      | string  | No       | `"2022-05-13T16:16:24+01:00"` |

\* The `CURRENCY_ISOCODE` should conform to 3 character alphabetic codes defined in [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html).

\*\* Time fields SHOULD conform to [ISO 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator included.

## Example

```js
const valuation = {
    type: 'fdc3.valuation',
    value: 500.0,
    price: 5.0,
    CURRENCY_ISOCODE: 'USD',
    expiryTime: "2022-05-13T16:16:24+01:00"
}
```
