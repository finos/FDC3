---
title: Country
sidebar_label: Country

---

# Country

A country entity.

Notes:

- It is valid to include extra properties and metadata as part of the country payload, but the minimum requirement is for at least one standardized identifier to be provided

  - `COUNTRY_ISOALPHA2` SHOULD be preferred.

- Try to only use country identifiers as intended and specified in the [ISO standard](https://en.wikipedia.org/wiki/ISO_3166-1). E.g. the `COUNTRY_ISOALPHA2` property must be a recognized value and not a proprietary two-letter code. If the identifier you want to share is not a standardized and recognized one, rather define a property that makes it clear what value it is. This makes it easier for target applications.

## Schema

<https://fdc3.finos.org/schemas/next/context/country.schema.json> ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/country.schema.json))

## Type

`fdc3.country`

## Properties

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>COUNTRY_ISOALPHA2</code></summary>

**type**: `string`

Two-letter ISO country code

</details>

<details>
  <summary><code>COUNTRY_ISOALPHA3</code></summary>

**type**: `string`

Three-letter ISO country code

</details>

<details>
  <summary><code>ISOALPHA2</code></summary>

**type**: `string`

Two-letter ISO country code. Deprecated in FDC3 2.0 in favour of the version prefixed with `COUNTRY_`.

</details>

<details>
  <summary><code>ISOALPHA3</code></summary>

**type**: `string`

Three-letter ISO country code. Deprecated in FDC3 2.0 in favour of the version prefixed with `COUNTRY_`.

</details>

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

An optional human-readable name for the country

</details>

## Example

```json
{
  "type": "fdc3.country",
  "name": "Sweden",
  "id": {
    "COUNTRY_ISOALPHA2": "SE"
  }
}
```

