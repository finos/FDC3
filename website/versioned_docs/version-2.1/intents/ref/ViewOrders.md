---
id: ViewOrders
sidebar_label: ViewOrders
title: ViewOrders
hide_title: true
---
# `ViewOrders`

Display any orders related to the provided contact, instrument, or organization.

## Intent Name

`ViewOrders`

## Display Name

`View Orders`

## Possible Contexts

- [Contact](../../context/ref/Contact)
- [Instrument](../../context/ref/Instrument)
- [Organization](../../context/ref/Organization)

## Example

```js
const instrument = {
    type: 'fdc3.instrument',
    name: 'Tesla, Inc.',
    id: {
        ticker: 'TSLA'
    }
}

fdc3.raiseIntent('ViewOrders', instrument)
```

## See Also

Context

- [Contact](../../context/ref/Contact)
- [Instrument](../../context/ref/Instrument)
- [Organization](../../context/ref/Organization)

Intents

- [ViewHoldings](ViewHoldings)
- [ViewInstrument](ViewInstrument)
