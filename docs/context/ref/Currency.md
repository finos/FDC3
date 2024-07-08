---
title: Currency
description: A context representing an individual Currency.
sidebar_label: Currency

---

# Currency

A context representing an individual Currency.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/currency.schema.json>

## Type

`fdc3.currency`

## Properties

<details>
  <summary><code>name</code></summary>

**type**: `string`

The name of the currency for display purposes


**Example**: 
`US Dollar`

</details>

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

**Subproperties:**

`CURRENCY_ISOCODE`
- **type**: `string`
- **description**: CURRENCY_ISOCODE:  The `CURRENCY_ISOCODE` should conform to 3 character alphabetic codes defined in [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html)


**Example**: 
```json
{
  "CURRENCY_ISOCODE": "USD"
}
```

</details>

## Example

```json
{
  "type": "fdc3.currency",
  "name": "US Dollar",
  "id": {
    "CURRENCY_ISOCODE": "USD"
  }
}
```

