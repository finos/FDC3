---
id: version-next-Portfolio
sidebar_label: Portfolio
title: Portfolio
hide_title: true
original_id: Portfolio
---
# `Portfolio`

A financial portfolio made up of multiple positions (holdings) in several instruments. Contrast this
with e.g. the [InstrumentList](InstrumentList) type, which is just a list of instruments.

This is a good example of how types can be composed and extended with extra properties to define more complex types.

The [Portfolio](Portfolio) type consists of an array of [Position](Position) types, each of which
refers to a single [Instrument](Instrument) and a holding amount for that instrument.

Notes:

- Like all other FDC3 context types, extra properties for the portfolio can be added, the schema just 
specifies the minimum contract.

- The portfolio schema does not explicitly include identifiers in the `id` section, as there
is not a common standard for such identifiers. Applications can, however, populate
this part of the contract with custom identifiers if so desired.

## Type

`fdc3.portfolio`

## Schema

https://fdc3.finos.org/schemas/next/portfolio.schema.json

## Details

| Property     | Type       | Required | Example Value             |
|--------------|------------|----------|---------------------------|
| `type`       | string     | Yes      | `'fdc3.portfolio'`        |
| `id`         | object     | No       | `{ portfolioId: '7381' }` |
| `name`       | string     | No       | `'My share portfolio'`    |
| `positions`  | Position[] | Yes      | `[position1, position2]`  |

## Example

```js
const portfolio = {
    type: 'fdc3.portfolio',
    positions: [
        {
            type: 'fdc3.position',
            instrument: {
                type: 'fdc3.instrument'
                id: {
                    ticker: 'AAPL'
                }
            },
            holding: 2000000
        },
        {
            type: 'fdc3.position',
            instrument: {
                type: 'fdc3.instrument'
                id: {
                    ticker: 'MSFT'
                }
            },
            holding: 1500000
        },
        {
            type: 'fdc3.position',
            instrument: {
                type: 'fdc3.instrument'
                id: {
                    ticker: 'IBM'
                }
            },
            holding: 3000000
        }
    ]
}

fdc3.raiseIntent('ViewAnalysis', portfolio)
```

## See Also

Other Types
- [Instrument](Instrument)
- [InstrumentList](InstrumentList)
- [Position](Position)

Intents
- [ViewAnalysis](../../intents/ref/ViewAnalysis)
- [ViewChart](../../intents/ref/ViewChart)
- [ViewNews](../../intents/ref/ViewNews)

FINOS Financial Objects
- [Position](https://fo.finos.org/docs/objects/portfolio)
