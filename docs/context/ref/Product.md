---
title: Product
description: >-
  @experimental context type representing a tradable product. To be used with
  OMS and EMS systems.


  This type is currently only loosely defined as an extensible context object,
  with an optional instrument field.


  The Product schema does not explicitly include identifiers in the id section,
  as there is not a common standard for such identifiers. Applications can,
  however, populate this part of the contract with custom identifiers if so
  desired.
sidebar_label: Product

---

# Product

[@experiemental](/docs/fdc3-compliance#experimental-features) context type representing a tradable product. To be used with OMS and EMS systems.

This type is currently only loosely defined as an extensible context object, with an optional instrument field.

The Product schema does not explicitly include identifiers in the id section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/product.schema.json>

## Type

`fdc3.product`

## Properties

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

One or more identifiers that refer to the product. Specific key names for systems are expected to be standardized in future.


**Example**: 
```json
{
  "productId": "ABC123"
}
```

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

A human-readable summary of the product.


**Example**: 
</details>

<details>
  <summary><code>instrument</code></summary>

**type**: [instrument](../instrument)

 financial instrument that relates to the definition of this product


**Example**: 
```json
{
  "type": "fdc3.instrument",
  "id": {
    "ticker": "MSFT"
  }
}
```

</details>

## Example

```json
{
  "type": "fdc3.product",
  "id": {
    "productId": "ABC123"
  },
  "instrument": {
    "type": "fdc3.instrument",
    "id": {
      "ticker": "MSFT"
    }
  }
}
```

