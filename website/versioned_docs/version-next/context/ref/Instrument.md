---
id: version-next-Instrument
sidebar_label: Instrument
title: Instrument
hide_title: true
original_id: Instrument
---
# `Instrument`

A financial instrument from any asset class.

Any combination of instrument identifiers can be used together to resolve ambiguity, or for a better match.

Notes:

- Not all applications will use the same instrument identifiers, which is why FDC3 allows for multiple to be specified.
In general, the more identifiers an application can provide, the easier it will be to achieve interoperability.

- It is valid to include extra properties and metadata as part of the instrument payload, but the minimum requirement
is for at least one instrument identifier to be provided.

- Try to only use instrument identifiers as intended. E.g. the `ticker` property is meant for stock tickers specifically,
if the identifier you want to share is not a stock ticker, or one of the other standardised ones, rather define 
a property that makes it clear what value it is. This makes it easier for target applications.

## Type

`fdc3.instrument`

## Schema

https://fdc3.finos.org/schemas/next/instrument.schema.json

## Details

| Property    | Type    | Required | Example Value       |
|-------------|---------|----------|---------------------|
| `type`      | string  | Yes      | `'fdc3.instrument'` |
| `name`      | string  | No       | `'Microsoft'`       |
| `id.ticker` | string  | No       | `'MSFT'`            |
| `id.BBG`    | string  | No       | `'MSFT:US'`         |
| `id.CUSIP`  | string  | No       | `'594918104'`       |
| `id.FDS_ID` | string  | No       | `'P8R3C2-R'`        |
| `id.FIGI`   | string  | No       | `'BBG000BPH459'`    |
| `id.ISIN`   | string  | No       | `'US5949181045'`    |
| `id.PERMID` | string  | No       | `'4295907168'`      |
| `id.RIC`    | string  | No       | `'MSFT.OQ'`         |
| `id.SEDOL`  | string  | No       | `'2588173'`         |

## Example

```js
const instrument = {
    type: 'fdc3.instrument'
    name: 'Microsoft',
    id: {
        ticker: 'MSFT',
        RIC: 'MSFT.OQ',
        ISIN: 'US5949181045'
    }
}

fdc3.joinChannel('global')
fdc3.broadcast(instrument)
```

## See Also

Other Types
- [InstrumentList](InstrumentList)
- [Position](Position)
- [Portfolio](Portfolio)

Intents
- [ViewAnalysis](../../intents/ref/ViewAnalysis)
- [ViewChart](../../intents/ref/ViewChart)
- [ViewInstrument](../../intents/ref/ViewInstrument)
- [ViewNews](../../intents/ref/ViewNews)
- [ViewQuote](../../intents/ref/ViewQuote)

FINOS Financial Objects
- [Instrument](https://fo.finos.org/docs/objects/instrument)