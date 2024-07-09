---
title: Country
description: >-
  A country entity.


  Notes:


  - It is valid to include extra properties and metadata as part of the country
  payload, but the minimum requirement is for at least one standardized
  identifier to be provided

    - `COUNTRY_ISOALPHA2` SHOULD be preferred.

  - Try to only use country identifiers as intended and specified in the [ISO
  standard](https://en.wikipedia.org/wiki/ISO_3166-1). E.g. the
  `COUNTRY_ISOALPHA2` property must be a recognized value and not a proprietary
  two-letter code. If the identifier you want to share is not a standardized and
  recognized one, rather define a property that makes it clear what value it is.
  This makes it easier for target applications.
sidebar_label: Country

---

# Country

A country entity.

Notes:

- It is valid to include extra properties and metadata as part of the country payload, but the minimum requirement is for at least one standardized identifier to be provided

  - `COUNTRY_ISOALPHA2` SHOULD be preferred.

- Try to only use country identifiers as intended and specified in the [ISO standard](https://en.wikipedia.org/wiki/ISO_3166-1). E.g. the `COUNTRY_ISOALPHA2` property must be a recognized value and not a proprietary two-letter code. If the identifier you want to share is not a standardized and recognized one, rather define a property that makes it clear what value it is. This makes it easier for target applications.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/country.schema.json>

## Type

`fdc3.country`

## Properties

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

**Subproperties:**

`COUNTRY_ISOALPHA2`
- **type**: `string`
- **description**: COUNTRY_ISOALPHA2:  Two-letter ISO country code

`COUNTRY_ISOALPHA3`
- **type**: `string`
- **description**: COUNTRY_ISOALPHA3:  Three-letter ISO country code

`ISOALPHA2`
- **type**: `string`
- **description**: ISOALPHA2:  Two-letter ISO country code. Deprecated in FDC3 2.0 in favour of the version prefixed with `COUNTRY_`.

`ISOALPHA3`
- **type**: `string`
- **description**: ISOALPHA3:  Three-letter ISO country code. Deprecated in FDC3 2.0 in favour of the version prefixed with `COUNTRY_`.

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

