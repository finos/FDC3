---
id: version-next-Position
sidebar_label: Position
title: Position
hide_title: true
original_id: Position
---
# `Position`

A financial position is made up of an instrument and a holding in that instrument. This type is a good
example of how new context types can be composed from existing types.

In this case, the instrument and the holding amount for that instrument are required values.

The [Position](Position) type goes hand-in-hand with the [Portfolio](Portfolio) type, which represents
multiple holdings in a combination of instruments.

Notes:

- Some of the more common additional properties of a position are provided in the schema.  Depending on the type of application sending the context, these properties may be populated or left out.

- The position schema does not explicitly include identifiers in the `id` section, as there
is not a common standard for such identifiers. Applications can, however, populate
this part of the contract with custom identifiers if so desired.

## Type

`fdc3.position`

## Schema

https://fdc3.finos.org/schemas/next/position.schema.json

## Details

| Property     | Type       | Required | Example Value                      |
|--------------|------------|----------|------------------------------------|
| `type`       | string     | Yes      | `'fdc3.position'`                  |
| `id`         | object     | No       | `{ positionId: '6475' }`           |
| `name`       | string     | No       | `'My Apple shares'`                |
| `instrument` | Instrument | Yes      | `{ type: 'fdc3.instrument', ... }` |
| `holding`    | number     | Yes      | `2000000`                          |
| `trades`    | trade[]     | No       | `[trade1, trade2]`                |
| `basis`     | valuation   | No       | `{ type: 'fdc3.valuation', ... }`  |
| `current`   | valuation   | No       | `{ type: 'fdc3.valuation', ... }`  |
| `gain`      | number      | No       | `8000000`                          |
| `restricted`  | number      | No       | `4000`                          |

## Example

```js
const position = {
    type: 'fdc3.position',
    instrument: {
        type: 'fdc3.instrument'
        id: {
            ticker: 'AAPL'
        }
    },
    holding: 2000000
    trades: [
        {
             type: 'fdc3.trade',
             tradedaterange: {
                type: 'fdc3.dateRange',
                starttime: '2020-09-01T08:00:00.000Z'
            },
            settledaterange: {
                type: 'fdc3.dateRange',
                starttime: '2020-09-02T08:00:00.000Z'
            },
            units: 1000000,
            open: {
                type: 'fdc3.valuation',
                price: 20.00,
                value: 20000000,
                currency: {
                    type: 'fdc3.currency',
                    code: 'USD'
                }
            },
            location: 'XYZ',
            account: 'cash'
        },
        {
            type: 'fdc3.trade',
            tradedaterange: {
                type: 'fdc3.dateRange',
                starttime: '2020-09-08T08:00:00.000Z'
            },
            settledaterange: {
                type: 'fdc3.dateRange',
                starttime: '2020-09-09T08:00:00.000Z'
            },
            units: 1000000,
            open: {
                type: 'fdc3.valuation',
                price: 22.00,
                value: 22000000,
                currency: {
                    type: 'fdc3.currency',
                    code: 'USD'
                }
            },
            location: 'XYZ',
            account: 'cash'
        }
    ],
    basis: {
        type: 'fdc3.valuation',
        price: 21.00,
        value: 42000000,
        currency: {
           type: 'fdc3.currency',
           code: 'USD'
         }
    },
    current: {
        type: 'fdc3.valuation',
        price: 25.00,
        value: 50000000,
        currency: {
            type: 'fdc3.currency',
            code: 'USD'
        }
    },
    gain: 8000000,
    restricted: 0
}

fdc3.raiseIntent('ViewChart', position)
```

## See Also

Other Types
- [Instrument](Instrument)
- [Trade](Trade)
- [Portfolio](Portfolio)
- [Valuation](Valuation)

Intents
- [ViewAnalysis](../../intents/ref/ViewAnalysis)
- [ViewChart](../../intents/ref/ViewChart)
- [ViewNews](../../intents/ref/ViewNews)

FINOS Financial Objects
- [Position](https://fo.finos.org/docs/objects/position)