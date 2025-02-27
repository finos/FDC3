---
sidebar_label: Country
title: Country
hide_title: true
original_id: Country
---
# `Country`

A country entity.

Notes:

- It is valid to include extra properties and metadata as part of the country payload, but the minimum requirement
is for at least one standardised identifier to be provided.
  - `COUNTRY_ISOALPHA2` SHOULD be preferred.

- Try to only use country identifiers as intended and specified in the [ISO standard](https://en.wikipedia.org/wiki/ISO_3166-1). E.g. the `COUNTRY_ISOALPHA2` property must be a recognized value and not a proprietary two-letter code. If the identifier you want to share is not a standardised and recognized one, rather define a property that makes it clear what value it is. This makes it easier for target applications.


## Type

`fdc3.country`

## Schema

https://fdc3.finos.org/schemas/2.0/country.schema.json

## Details

| Property                 | Type    | Required | Example Value        |
|--------------------------|---------|----------|----------------------|
| `type`                   | string  | Yes      | `'fdc3.country'`     |
| `name`                   | string  | No       | `'Sweden'`           |
| `id.COUNTRY_ISOALPHA2`   | string  | No       | `'SE'`               |
| `id.COUNTRY_ISOALPHA3`   | string  | No       | `'SWE'`              |
| `id.ISOALPHA2` *         | string  | No       | `'SE'`               |
| `id.ISOALPHA3` *         | string  | No       | `'SWE'`              |

\* Field names deprecated in FDC3 2.0 in favour of the versions prefixed with `COUNTRY_`.
## Example

```js
const country = {
    type: "fdc3.country",
    name: "Sweden",
    id: {
        COUNTRY_ISOALPHA2: "SE"
    }
}

fdc3.broadcast(country)
```

## See Also

Intents
- [ViewNews](../../intents/ref/ViewNews)
- [ViewAnalysis](../../intents/ref/ViewAnalysis)

FINOS Financial Objects
- [Country](https://fo.finos.org/docs/objects/country)
