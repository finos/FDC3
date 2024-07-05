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

### `name`

The name of the currency for display purposes

**Type**: `string`


**Example Value**: 
`US Dollar`

### `id`

**Type**: `object`

#### Subproperties
##### CURRENCY_ISOCODE
- Type: `string`
- Description: `The `CURRENCY_ISOCODE` should conform to 3 character alphabetic codes defined in [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html)`


**Example Value**: 
```json
{
  "CURRENCY_ISOCODE": "USD"
}
```

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

