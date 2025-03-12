---
title: Position
sidebar_label: Position

---

# Position

A financial position made up of an instrument and a holding in that instrument. This type is a good example of how new context types can be composed from existing types.

In this case, the instrument and the holding amount for that instrument are required values.

The [Position](Position) type goes hand-in-hand with the [Portfolio](Portfolio) type, which represents multiple holdings in a combination of instruments.

The position schema does not explicitly include identifiers in the `id` section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Schema

[https://fdc3.finos.org/schemas/2.2/context/position.schema.json](https://fdc3.finos.org/schemas/2.2/context/position.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/position.schema.json))

## Type

`fdc3.position`

## Properties

<details>
  <summary><code>instrument</code> <strong>(required)</strong></summary>

**type**: [Instrument](Instrument)



</details>

<details>
  <summary><code>holding</code> <strong>(required)</strong></summary>

**type**: `number`

The amount of the holding, e.g. a number of shares

</details>

<details>
  <summary><code>id</code></summary>

**type**: `object`

<details>
  <summary><code>Additional Properties</code></summary>

**type**: `string`

</details>

One or more identifiers that refer to the position in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

An optional human-readable name for the position

</details>

## Example

```json
{
  "type": "fdc3.position",
  "instrument": {
    "type": "fdc3.instrument",
    "id": {
      "ticker": "AAPL"
    }
  },
  "holding": 2000000
}
```

