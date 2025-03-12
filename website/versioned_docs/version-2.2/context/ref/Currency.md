---
title: Currency
sidebar_label: Currency

---

# Currency

A context representing an individual Currency.

## Schema

[https://fdc3.finos.org/schemas/2.2/context/currency.schema.json](https://fdc3.finos.org/schemas/2.2/context/currency.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/currency.schema.json))

## Type

`fdc3.currency`

## Properties

<details>
  <summary><code>name</code></summary>

**type**: `string`

The name of the currency for display purposes

</details>

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>CURRENCY_ISOCODE</code></summary>

**type**: `string`

The `CURRENCY_ISOCODE` should conform to 3 character alphabetic codes defined in [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html)

</details>

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

