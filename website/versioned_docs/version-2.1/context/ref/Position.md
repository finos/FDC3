---
id: Position
sidebar_label: Position
title: Position
hide_title: true
---
# `Position`

A financial position made up of an instrument and a holding in that instrument. This type is a good
example of how new context types can be composed from existing types.

In this case, the instrument and the holding amount for that instrument are required values.

The [Position](Position) type goes hand-in-hand with the [Portfolio](Portfolio) type, which represents
multiple holdings in a combination of instruments.

Notes:

- Like all other FDC3 context types, extra properties for the position can be added, the schema just
specifies the minimum contract.

- The position schema does not explicitly include identifiers in the `id` section, as there
is not a common standard for such identifiers. Applications can, however, populate
this part of the contract with custom identifiers if so desired.

## Type

`fdc3.position`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/position.schema.json](pathname:///schemas/2.1/context/position.schema.json)

## Details

| Property     | Type       | Required | Example Value                      |
|--------------|------------|----------|------------------------------------|
| `type`       | string     | Yes      | `'fdc3.position'`                  |
| `id`         | object     | No       | `{ positionId: '6475' }`           |
| `name`       | string     | No       | `'My Apple shares'`                |
| `holding`    | number     | Yes      | `2000000`                          |
| `instrument` | Instrument | Yes      | `{ type: 'fdc3.instrument', ... }` |

## Example

```js
const position = {
    type: "fdc3.position",
    instrument: {
        type: "fdc3.instrument",
        id: {
            ticker: "AAPL"
        }
    },
    holding: 2000000
}

fdc3.raiseIntent("ViewChart", position)
```

## See Also

Other Types

- [Instrument](Instrument)
- [Portfolio](Portfolio)

Intents

- [ViewAnalysis](../../intents/ref/ViewAnalysis)
- [ViewChart](../../intents/ref/ViewChart)
- [ViewNews](../../intents/ref/ViewNews)

FINOS Financial Objects

- [Position](https://fo.finos.org/docs/objects/position)
