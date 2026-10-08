---
id: ViewNews
sidebar_label: ViewNews
title: ViewNews
hide_title: true
---
# `ViewNews`

Display news stories for the provided context.

## Intent Name

`ViewNews`

## Display Name

`View News`

## Possible Contexts

- [Country](../../context/ref/Country)
- [Instrument](../../context/ref/Instrument)
- [InstrumentList](../../context/ref/InstrumentList)
- [Organization](../../context/ref/Organization)
- [Portfolio](../../context/ref/Portfolio)

## Example

```js
const instrument = {
    type: 'fdc3.instrument',
    name: 'International Business Machines',
    id: {
        ticker: 'IBM'
    },
    market: {
        MIC: "XNYS"
    }
}

fdc3.raiseIntent('ViewNews', instrument)
```

## See Also

Context

- [Country](../../context/ref/Country)
- [Instrument](../../context/ref/Instrument)
- [InstrumentList](../../context/ref/InstrumentList)
- [Organization](../../context/ref/Organization)
- [Portfolio](../../context/ref/Portfolio)
- [Position](../../context/ref/Position)

Intents

- [ViewAnalysis](ViewAnalysis)
