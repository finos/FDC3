---
id: ViewInstrument
sidebar_label: ViewInstrument
title: ViewInstrument
hide_title: true
---
# `ViewInstrument`

Display details for the provided instrument.

## Intent Name

`ViewInstrument`

## Display Name

`View Instrument Details`

## Possible Contexts

- [Instrument](../../context/ref/Instrument)

## Example

```js
const instrument = {
    type: 'fdc3.instrument',
    name: 'International Business Machines',
    id: {
        ticker: 'ibm'
    }
}

fdc3.raiseIntent('ViewInstrument', instrument)
```

## See Also

Context

- [Instrument](../../context/ref/Instrument)

Intents

- [ViewChart](ViewChart)
- [ViewOrders](ViewOrders)
