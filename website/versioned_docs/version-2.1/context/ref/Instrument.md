---
id: Instrument
sidebar_label: Instrument
title: Instrument
hide_title: true
---
# `Instrument`

A financial instrument from any asset class.

Any combination of instrument identifiers can be used together to resolve ambiguity, or for a better match.

Notes:

- Not all applications will use the same instrument identifiers, which is why FDC3 allows for multiple to be specified.
In general, the more identifiers an application can provide, the easier it will be to achieve interoperability.

- The `market` map can be used to further specify the instrument and help achieve interoperability between disparate data sources. This is especially useful when using an `id` field that is not globally unique.

- It is valid to include extra properties and metadata as part of the instrument payload, but the minimum requirement
is for at least one instrument identifier to be provided.

- Try to only use instrument identifiers as intended. E.g. the `ticker` property is meant for tickers as used by an exchange.
If the identifier you want to share is not a ticker or one of the other standardized fields, define
a property that makes it clear what value represents. Doing so will make interpretation easier for the developers of target applications.

## Type

`fdc3.instrument`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/instrument.schema.json](pathname:///schemas/2.1/context/instrument.schema.json)

## Details

| Property                    | Type    | Required | Example Value            | More Info                                              |
|-----------------------------|---------|----------|--------------------------|--------------------------------------------------------|
| `type`                      | string  | Yes      | `"fdc3.instrument"`      |                                                        |
| `name`                      | string  | No       | `"Microsoft"`            |                                                        |
| `id.ticker`                 | string  | No       | `"MSFT"`                 |                                                        |
| `id.BBG`                    | string  | No       | `"MSFT:US"`              | [https://www.bloomberg.com/](https://www.bloomberg.com/)                           |
| `id.CUSIP`                  | string  | No       | `"594918104"`            | [https://www.cusip.com/](https://www.cusip.com/)                               |
| `id.FDS_ID`                 | string  | No       | `"P8R3C2-R"`             | [https://www.factset.com/](https://www.factset.com/)                             |
| `id.FIGI`                   | string  | No       | `"BBG000BPH459"`         | [https://www.openfigi.com/](https://www.openfigi.com/)                            |
| `id.ISIN`                   | string  | No       | `"US5949181045"`         | [https://www.isin.org/](https://www.isin.org/)                                |
| `id.PERMID`                 | string  | No       | `"4295907168"`           | [https://permid.org/](https://permid.org/)                                  |
| `id.RIC`                    | string  | No       | `"MSFT.OQ"`              | [https://www.refinitiv.com/](https://www.refinitiv.com/)                           |
| `id.SEDOL`                  | string  | No       | `"2588173"`              | [https://www.lseg.com/sedol](https://www.lseg.com/sedol)                           |
| `market.MIC`                | string  | No       | `"XNAS"`                 | [https://en.wikipedia.org/wiki/Market_Identifier_Code](https://en.wikipedia.org/wiki/Market_Identifier_Code) |
| `market.name`               | string  | No       | `"NASDAQ - All Markets"` |                                                        |
| `market.COUNTRY_ISOALPHA2`  | string  | No       | `"US"`                   |                                                        |
| `market.BBG`                | string  | No       | `"US"`                   | [https://www.bloomberg.com/](https://www.bloomberg.com/)                           |

## Example

```js
const instrument = {
    type: "fdc3.instrument",
    name: "Microsoft",
    id: {
        ticker: "MSFT",
        RIC: "MSFT.OQ",
        ISIN: "US5949181045"
    },
    market: {
        MIC: "XNAS"
    }
}

fdc3.joinUserChannel('Channel 1')
fdc3.broadcast(instrument)
```

## See Also

Other Types

- [InstrumentList](InstrumentList)
- [Chart](Chart)
- [Position](Position)
- [Portfolio](Portfolio)

Intents

- [ViewAnalysis](../../intents/ref/ViewAnalysis)
- [ViewChart](../../intents/ref/ViewChart)
- [ViewInstrument](../../intents/ref/ViewInstrument)
- [ViewNews](../../intents/ref/ViewNews)
- [ViewQuote](../../intents/ref/ViewQuote)
- [ViewResearch](../../intents/ref/ViewResearch)
- [ViewInteractions](../../intents/ref/ViewInteractions)
- [ViewOrders](../../intents/ref/ViewOrders)

FINOS Financial Objects

- [Instrument](https://fo.finos.org/docs/objects/instrument)
