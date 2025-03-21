---
id: ViewAnalysis
sidebar_label: ViewAnalysis
title: ViewAnalysis
hide_title: true
---
# `ViewAnalysis`

Display analysis on the provided context.

## Intent Name

`ViewAnalysis`

## Display Name

`View Analysis`

## Possible Contexts

- [Instrument](../../context/ref/Instrument)
- [Organization](../../context/ref/Organization)
- [Portfolio](../../context/ref/Portfolio)

## Example

```js
const instrument = {
    type: 'fdc3.instrument',
    name: 'International Business Machines',
    id: {
        ticker: 'ibm'
    }
}

fdc3.raiseIntent('ViewAnalysis', instrument)
```

## See Also

Context

- [Instrument](../../context/ref/Instrument)
- [Organization](../../context/ref/Organization)
- [Portfolio](../../context/ref/Portfolio)
- [Position](../../context/ref/Position)

Intents

- [ViewChart](ViewChart)
- [ViewResearch](ViewResearch)
