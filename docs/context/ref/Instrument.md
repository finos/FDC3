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

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

Any combination of instrument identifiers can be used together to resolve ambiguity, or for a better match. Not all applications will use the same instrument identifiers, which is why FDC3 allows for multiple to be specified. In general, the more identifiers an application can provide, the easier it will be to achieve interoperability.

It is valid to include extra properties and metadata as part of the instrument payload, but the minimum requirement is for at least one instrument identifier to be provided.

Try to only use instrument identifiers as intended. E.g. the `ticker` property is meant for tickers as used by an exchange.
If the identifier you want to share is not a ticker or one of the other standardized fields, define a property that makes it clear what the value represents. Doing so will make interpretation easier for the developers of target applications.

**Subproperties:**

`BBG`
- **type**: `string`
- **description**: Bloomberg security:  <https://www.bloomberg.com/>

`CUSIP`
- **type**: `string`
- **description**: CUSIP:  <https://www.cusip.com/>

`FDS_ID`
- **type**: `string`
- **description**: FactSet Permanent Security Identifier:  <https://www.factset.com/>

`FIGI`
- **type**: `string`
- **description**: Open FIGI:  <https://www.openfigi.com/>

`ISIN`
- **type**: `string`
- **description**: ISIN:  <https://www.isin.org/>

`PERMID`
- **type**: `string`
- **description**: Refinitiv PERMID:  <https://permid.org/>

`RIC`
- **type**: `string`
- **description**: Refinitiv Identification Code:   <https://www.refinitiv.com/>

`SEDOL`
- **type**: `string`
- **description**: SEDOL:  <https://www.lseg.com/sedol>

`ticker`
- **type**: `string`
- **description**: Stock ticker:  Unstandardized stock tickers


**Example**: 
```json
{
  "ticker": "MSFT",
  "RIC": "MSFT.OQ",
  "ISIN": "US5949181045"
}
```

</details>

<details>
  <summary><code>market</code></summary>

**type**: `object`

The `market` map can be used to further specify the instrument and help achieve interoperability between disparate data sources. This is especially useful when using an `id` field that is not globally unique.

**Subproperties:**

`MIC`
- **type**: `string`
- **description**: Market Identifier Code:  <https://en.wikipedia.org/wiki/Market_Identifier_Code>

`name`
- **type**: `string`
- **description**: Market Name:  Human readable market name

`COUNTRY_ISOALPHA2`
- **type**: `string`
- **description**: Country ISO Code:  <https://www.iso.org/iso-3166-country-codes.html>

`BBG`
- **type**: `string`
- **description**: Bloomberg Market Identifier:  <https://www.bloomberg.com/>


**Example**: 
```json
{
  "MIC": "XNAS"
}
```

</details>

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

