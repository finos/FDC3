---
id: ViewQuote
sidebar_label: ViewQuote
title: ViewQuote
hide_title: true
---
# `ViewQuote`

Display pricing for an instrumen.

## Intent Name

`ViewQuote`

## Display Name

`View Quote`

## Possible Contexts

* [Instrument](../../context/ref/Instrument)


## Example

```js
const instrument = {
    type: 'fdc3.instrument',
    name: 'International Business Machines',
    id: {
        ticker: 'ibm'
    }
}

fdc3.raiseIntent('fdc3.ViewQuote', instrument)
```

## See Also

Context
- [Instrument](../../context/ref/Instrument)


Intents
- [ViewChart](ViewChart)