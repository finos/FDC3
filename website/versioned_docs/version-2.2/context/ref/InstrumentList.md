---
title: InstrumentList
sidebar_label: InstrumentList

---

# InstrumentList

A collection of instruments. Use this type for use cases that require not just a single instrument, but multiple (e.g. to populate a watchlist). However, when holding information for each instrument is required, it is recommended to use the [Portfolio](Portfolio) type.

The instrument list schema does not explicitly include identifiers in the `id` section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Schema

[https://fdc3.finos.org/schemas/2.2/context/instrumentList.schema.json](pathname:///schemas/2.2/context/instrumentList.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/instrumentList.schema.json))

## Type

`fdc3.instrumentList`

## Properties

<details>
  <summary><code>id</code></summary>

**type**: `object`

<details>
  <summary><code>Additional Properties</code></summary>

**type**: `string`

</details>

One or more identifiers that refer to the instrument list in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

An optional human-readable summary of the instrument list

</details>

<details>
  <summary><code>instruments</code> <strong>(required)</strong></summary>

**type**: `array`

<details>
  <summary><code>Items</code></summary>

**type**: [Instrument](Instrument)

</details>

An array of instrument contexts that forms the list.

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

