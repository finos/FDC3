---
title: Instrument
description: A financial instrument from any asset class.
sidebar_label: Instrument

---

# Instrument

A financial instrument from any asset class.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/instrument.schema.json>

## Type

`fdc3.instrument`

## Properties

### `id`

Any combination of instrument identifiers can be used together to resolve ambiguity, or for a better match. Not all applications will use the same instrument identifiers, which is why FDC3 allows for multiple to be specified. In general, the more identifiers an application can provide, the easier it will be to achieve interoperability.

It is valid to include extra properties and metadata as part of the instrument payload, but the minimum requirement is for at least one instrument identifier to be provided.

Try to only use instrument identifiers as intended. E.g. the `ticker` property is meant for tickers as used by an exchange.
If the identifier you want to share is not a ticker or one of the other standardized fields, define a property that makes it clear what the value represents. Doing so will make interpretation easier for the developers of target applications.

**Type**: `object`

#### Subproperties
##### BBG
- Type: `string`
- Description: `<https://www.bloomberg.com/>`

##### CUSIP
- Type: `string`
- Description: `<https://www.cusip.com/>`

##### FDS_ID
- Type: `string`
- Description: `<https://www.factset.com/>`

##### FIGI
- Type: `string`
- Description: `<https://www.openfigi.com/>`

##### ISIN
- Type: `string`
- Description: `<https://www.isin.org/>`

##### PERMID
- Type: `string`
- Description: `<https://permid.org/>`

##### RIC
- Type: `string`
- Description: ` <https://www.refinitiv.com/>`

##### SEDOL
- Type: `string`
- Description: `<https://www.lseg.com/sedol>`

##### ticker
- Type: `string`
- Description: `Unstandardized stock tickers`


**Example Value**: 
```json
{
  "ticker": "MSFT",
  "RIC": "MSFT.OQ",
  "ISIN": "US5949181045"
}
```

### `market`

The `market` map can be used to further specify the instrument and help achieve interoperability between disparate data sources. This is especially useful when using an `id` field that is not globally unique.

**Type**: `object`

#### Subproperties
##### MIC
- Type: `string`
- Description: `<https://en.wikipedia.org/wiki/Market_Identifier_Code>`

##### name
- Type: `string`
- Description: `Human readable market name`

##### COUNTRY_ISOALPHA2
- Type: `string`
- Description: `<https://www.iso.org/iso-3166-country-codes.html>`

##### BBG
- Type: `string`
- Description: `<https://www.bloomberg.com/>`


**Example Value**: 
```json
{
  "MIC": "XNAS"
}
```

## Example

```json
{
  "type": "fdc3.instrument",
  "name": "Microsoft",
  "id": {
    "ticker": "MSFT",
    "RIC": "MSFT.OQ",
    "ISIN": "US5949181045"
  },
  "market": {
    "MIC": "XNAS"
  }
}
```

