---
sidebar_label: ViewChart
title: ViewChart
hide_title: true
original_id: ViewChart
---
# `ViewChart`

Display a chart for the provided instrument(s).

## Intent Name

`ViewChart`

## Display Name

`View Chart`

## Possible Contexts

* [Instrument](../../context/ref/Instrument)
* [InstrumentList](../../context/ref/InstrumentList)
* [Portfolio](../../context/ref/Portfolio)
* [Position](../../context/ref/Position)

## Example

```js
const instrument = {
    type: 'fdc3.instrument',
    name: 'International Business Machines',
    id: {
        ticker: 'ibm'
    }
}

fdc3.raiseIntent('ViewChart', instrument)
```

## See Also

Context
- [Instrument](../../context/ref/Instrument)
- [InstrumentList](../../context/ref/InstrumentList)
- [Portfolio](../../context/ref/Portfolio)
- [Position](../../context/ref/Position)

Intents
- [ViewQuote](ViewQuote)