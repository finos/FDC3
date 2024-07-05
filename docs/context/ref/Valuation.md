---
title: Valuation
description: A context type representing the price and value of a holding.
sidebar_label: Valuation

---

# Valuation

A context type representing the price and value of a holding.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/valuation.schema.json>

## Type

`fdc3.valuation`

## Properties

### `value`

The value of the holding, expresses in the nominated currency.

**type**: `number`


**Example Value**: 
`500`

### `price`

The price per unit the the valuation is based on.

**type**: `number`


**Example Value**: 
`5`

### `CURRENCY_ISOCODE`

The valuation currency, which should conform to 3 character alphabetic codes defined in [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html)

**type**: `string`


**Example Value**: 
`USD`

### `valuationTime`

The time at which the valuation was performed, encoded according to [ISO 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator included.

**type**: `string`


**Example Value**: 
### `expiryTime`

The time at which this valuation expires, encoded according to [ISO 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator included.

**type**: `string`


**Example Value**: 
`2022-05-13T16:16:24+01:00`

## Example

```json
{
  "type": "fdc3.valuation",
  "value": 500,
  "price": 5,
  "CURRENCY_ISOCODE": "USD",
  "expiryTime": "2022-05-13T16:16:24+01:00"
}
```

