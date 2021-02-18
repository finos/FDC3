---
id: version-next-InstrumentList
sidebar_label: InstrumentList
title: InstrumentList
hide_title: true
original_id: InstrumentList
---
# `InstrumentList`

A collection of instruments. Use this type for use cases that require not just a single instrument, but multiple (e.g. to populate a watchlist).

When holding information for each instrument is required, it is recommended to use the [Portfolio](Portfolio) type, though.

Notes:

- The instrument list schema does not explicitly include identifiers in the `id` section, as there
is not a common standard for such identifiers. Applications can, however, populate
this part of the contract with custom identifiers if so desired.

## Type

`fdc3.instrumentList`

## Schema

https://fdc3.finos.org/schemas/next/instrumentList.schema.json

## Details

| Property      | Type         | Required | Example Value                  |
|---------------|--------------|----------|--------------------------------|
| `type`        | string       | Yes      | `'fdc3.instrumentList'`        |
| `name`        | string       | No       | `'Interesting instruments...'` |
| `id`          | object       | No       | `{ customId: '5464' }`         |
| `instruments` | Instrument[] | Yes      | `[instrument1, instrument2]`   |

## Example

```js
const instruments = {
    type: 'fdc3.instrumentList',
    instruments: [
        {
            type: 'fdc3.instrument',
            id: {
                ticker: 'AAPL'
            }
        },
        {
            type: 'fdc3.instrument',
            id: {
                ticker: 'MSFT'
            }
        },
    ]
}

fdc3.joinChannel('global')
fdc3.broadcast(instruments)
```

## See Also

Other Types
- [Instrument](Instrument)
- [Position](Position)
- [Portfolio](Portfolio)

Intents
- [ViewAnalysis](../../intents/ref/ViewAnalysis)
- [ViewChart](../../intents/ref/ViewChart)
- [ViewInstrument](../../intents/ref/ViewInstrument)
- [ViewNews](../../intents/ref/ViewNews)
- [ViewQuote](../../intents/ref/ViewQuote)

FINOS Financial Objects
- [InstrumentList](https://fo.finos.org/docs/objects/instrumentlist)