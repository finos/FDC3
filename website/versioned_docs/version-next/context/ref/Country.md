---
id: version-next-Country
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

- Try to only use country identifiers as intended and specified in the [ISO standard](https://en.wikipedia.org/wiki/ISO_3166-1). E.g. the `ISOALPHA2` property must be a recognized value and not a proprietary two-letter code. If the identifier you want to share is not a standardised and recognized one, rather define a property that makes it clear what value it is. This makes it easier for target applications.


## Type

`fdc3.country`

## Schema

https://fdc3.finos.org/schemas/next/country.schema.json

## Details

| Property         | Type    | Required | Example Value        |
|------------------|---------|----------|----------------------|
| `type`           | string  | Yes      | `'fdc3.country'`     |
| `name`           | string  | No       | `'Sweden'`           |
| `id.ISOALPHA2`   | string  | No       | `'SE'`               |
| `id.ISOALPHA3`   | string  | No       | `'SWE'`              |

## Example

```js
const country = {
    type: 'fdc3.country'
    name: 'Sweden',
    id: {
        ISOALPHA3: 'SWE'
    }
}


fdc3.broadcast(country)
```

## See Also

Intents
- [ViewNews](../../intents/ref/ViewNews)
- [ViewAnalysis](../../intents/ref/viewAnalysis)

FINOS Financial Objects
- [Country](https://fo.finos.org/docs/objects/country)
