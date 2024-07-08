---
title: InstrumentList
description: >-
  A collection of instruments. Use this type for use cases that require not just
  a single instrument, but multiple (e.g. to populate a watchlist). However,
  when holding information for each instrument is required, it is recommended to
  use the [Portfolio](Portfolio) type.


  The instrument list schema does not explicitly include identifiers in the `id`
  section, as there is not a common standard for such identifiers. Applications
  can, however, populate this part of the contract with custom identifiers if so
  desired.
sidebar_label: InstrumentList

---

# InstrumentList

A collection of instruments. Use this type for use cases that require not just a single instrument, but multiple (e.g. to populate a watchlist). However, when holding information for each instrument is required, it is recommended to use the [Portfolio](Portfolio) type.

The instrument list schema does not explicitly include identifiers in the `id` section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/instrumentList.schema.json>

## Type

`fdc3.instrumentList`

## Properties

<details>
  <summary><code>instruments</code> <strong>(required)</strong></summary>

**type**: `array`

An array of instrument contexts that forms the list.


**Example**: 
```json
[
  {
    "type": "fdc3.instrument",
    "id": {
      "ticker": "AAPL"
    },
    "market": {
      "MIC": "XNAS"
    }
  },
  {
    "type": "fdc3.instrument",
    "id": {
      "ISIN": "US5949181045"
    }
  }
]
```

</details>

## Example

```json
{
  "type": "fdc3.instrumentList",
  "instruments": [
    {
      "type": "fdc3.instrument",
      "id": {
        "ticker": "AAPL"
      },
      "market": {
        "MIC": "XNAS"
      }
    },
    {
      "type": "fdc3.instrument",
      "id": {
        "ISIN": "US5949181045"
      }
    }
  ]
}
```

