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

<details>
  <summary><code>value</code> <strong>(required)</strong></summary>

**type**: `number`

The value of the holding, expresses in the nominated currency.


**Example**: 
`500`

</details>

<details>
  <summary><code>price</code></summary>

**type**: `number`

The price per unit the the valuation is based on.


**Example**: 
`5`

</details>

<details>
  <summary><code>CURRENCY_ISOCODE</code> <strong>(required)</strong></summary>

**type**: `string`

The valuation currency, which should conform to 3 character alphabetic codes defined in [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html)


**Example**: 
`USD`

</details>

<details>
  <summary><code>valuationTime</code></summary>

**type**: `string`

The time at which the valuation was performed, encoded according to [ISO 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator included.


**Example**: 
</details>

<details>
  <summary><code>expiryTime</code></summary>

**type**: `string`

The time at which this valuation expires, encoded according to [ISO 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator included.


**Example**: 
`2022-05-13T16:16:24+01:00`

</details>

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

