---
title: Portfolio
sidebar_label: Portfolio

---

# Portfolio

A financial portfolio made up of multiple positions (holdings) in several instruments. Contrast this with e.g. the [InstrumentList](InstrumentList) type, which is just a list of instruments.

This is a good example of how types can be composed and extended with extra properties to define more complex types.

The Portfolio type consists of an array of [Position](Position) types, each of which refers to a single [Instrument](Instrument) and a holding amount for that instrument.

The portfolio schema does not explicitly include identifiers in the `id` section, as there bis not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Schema

[https://fdc3.finos.org/schemas/next/context/portfolio.schema.json](https://fdc3.finos.org/schemas/next/context/portfolio.schema.json) ([github](https://github.com/finos/FDC3/tree/main/schemas/context/portfolio.schema.json))

## Type

`fdc3.portfolio`

## Properties

<details>
  <summary><code>positions</code> <strong>(required)</strong></summary>

**type**: `array`

<details>
  <summary><code>Items</code></summary>

**type**: [Position](Position)

</details>

The List of Positions which make up the Portfolio

</details>

<details>
  <summary><code>id</code></summary>

**type**: `object`

<details>
  <summary><code>Additional Properties</code></summary>

**type**: `string`

</details>

One or more identifiers that refer to the portfolio in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

An optional human-readable name for the portfolio

</details>

## Example

```json
{
  "type": "fdc3.portfolio",
  "positions": [
    {
      "type": "fdc3.position",
      "instrument": {
        "type": "fdc3.instrument",
        "id": {
          "ticker": "AAPL"
        }
      },
      "holding": 2000000
    },
    {
      "type": "fdc3.position",
      "instrument": {
        "type": "fdc3.instrument",
        "id": {
          "ticker": "MSFT"
        }
      },
      "holding": 1500000
    },
    {
      "type": "fdc3.position",
      "instrument": {
        "type": "fdc3.instrument",
        "id": {
          "ticker": "IBM"
        }
      },
      "holding": 3000000
    }
  ]
}
```

