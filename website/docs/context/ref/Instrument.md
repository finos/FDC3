---
title: Instrument
sidebar_label: Instrument

---

# Instrument

A financial instrument from any asset class.

## Schema

[https://fdc3.finos.org/schemas/next/context/instrument.schema.json](pathname:///schemas/next/context/instrument.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/instrument.schema.json))

## Type

`fdc3.instrument`

## Properties

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>BBG</code></summary>

**type**: `string`

https://www.bloomberg.com/

</details>

<details>
  <summary><code>CUSIP</code></summary>

**type**: `string`

https://www.cusip.com/

</details>

<details>
  <summary><code>FDS_ID</code></summary>

**type**: `string`

https://www.factset.com/

</details>

<details>
  <summary><code>FIGI</code></summary>

**type**: `string`

https://www.openfigi.com/

</details>

<details>
  <summary><code>ISIN</code></summary>

**type**: `string`

https://www.isin.org/

</details>

<details>
  <summary><code>PERMID</code></summary>

**type**: `string`

https://permid.org/

</details>

<details>
  <summary><code>RIC</code></summary>

**type**: `string`

https://www.refinitiv.com/

</details>

<details>
  <summary><code>SEDOL</code></summary>

**type**: `string`

https://www.lseg.com/sedol

</details>

<details>
  <summary><code>ticker</code></summary>

**type**: `string`

Unstandardized stock tickers

</details>

Any combination of instrument identifiers can be used together to resolve ambiguity, or for a better match. Not all applications will use the same instrument identifiers, which is why FDC3 allows for multiple to be specified. In general, the more identifiers an application can provide, the easier it will be to achieve interoperability.

It is valid to include extra properties and metadata as part of the instrument payload, but the minimum requirement is for at least one instrument identifier to be provided.

Try to only use instrument identifiers as intended. E.g. the `ticker` property is meant for tickers as used by an exchange.
If the identifier you want to share is not a ticker or one of the other standardized fields, define a property that makes it clear what the value represents. Doing so will make interpretation easier for the developers of target applications.

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

An optional human-readable name for the instrument

</details>

<details>
  <summary><code>market</code></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>MIC</code></summary>

**type**: `string`

https://en.wikipedia.org/wiki/Market_Identifier_Code

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

Human readable market name

</details>

<details>
  <summary><code>COUNTRY_ISOALPHA2</code></summary>

**type**: `string`

https://www.iso.org/iso-3166-country-codes.html

</details>

<details>
  <summary><code>BBG</code></summary>

**type**: `string`

https://www.bloomberg.com/

</details>

The `market` map can be used to further specify the instrument and help achieve interoperability between disparate data sources. This is especially useful when using an `id` field that is not globally unique.

</details>

<details>
  <summary><code>classification</code></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>name</code></summary>

**type**: `string`

classification of the instrument by type or category. SHOULD be one of the following values, although other string values are permitted: '`commodity`', '`commodityIndex`', '`corporateDebt`', '`creditDefaultSwapIndex`', '`deal`', '`debt`', '`debtIndex`', '`etf`', '`fixedIncome`', '`future`', '`governmentBenchmarkDebt`', '`loan`', '`mortgageBackedSecurity`', '`municipalDebt`', '`mutualFund`', '`mutualFundIndex`', '`option`', '`otherDebt`', '`ownershipPrivateCompany`', '`pevcFirm`', '`pevcFund`', '`privateCompany`', '`publicCompany`', '`publicCompanyIndex`', '`sovereignDebt`', '`structuredProduct`', '`unknown`'

</details>

<details>
  <summary><code>FDS_TYPE</code></summary>

**type**: `string`

FactSet classification for the instrument.

</details>

[@experimental](/docs/fdc3-compliance#experimental-features) The `classification` map can be used to specify the categorization of the instrument and help achieve interoperability between disparate data sources.

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
  },
  "classification": {
    "name": "publicCompany"
  }
}
```

