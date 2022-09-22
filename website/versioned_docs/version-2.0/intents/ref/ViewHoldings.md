---
id: version-2.0-ViewHoldings
sidebar_label: ViewHoldings
title: ViewHoldings
hide_title: true
original_id: ViewHoldings
---
# `ViewHoldings`

Display any holdings for the provided instrument, list of instruments, or organization.

## Intent Name

`ViewHoldings`

## Display Name

`View Holdings`

## Possible Contexts

* [Instrument](../../context/ref/Instrument)
* [InstrumentList](../../context/ref/InstrumentList)
* [Organization](../../context/ref/Organization)

## Example

```js
const instrument = {
    type: 'fdc3.instrument',
    name: 'Tesla, Inc.',
    id: {
        ticker: 'TSLA'
    }
}

fdc3.raiseIntent('ViewHoldings', instrument)
```

## See Also

Context
- [Instrument](../../context/ref/Instrument)
- [InstrumentList](../../context/ref/InstrumentList)
- [Organization](../../context/ref/Organization)

Intents
- [ViewInstrument](ViewInstrument)
- [ViewAnalysis](ViewAnalysis)
- [ViewOrders](ViewOrders)
