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

### `id`

One or more identifiers that refer to the product. Specific key names for systems are expected to be standardized in future.

**type**: `object`


**Example Value**: 
```json
{
  "productId": "ABC123"
}
```

### `name`

A human-readable summary of the product.

**type**: `string`


**Example Value**: 
### `instrument`

 financial instrument that relates to the definition of this product

**Reference**: [instrument](../instrument)


**Example Value**: 
```json
{
  "type": "fdc3.instrument",
  "id": {
    "ticker": "MSFT"
  }
}
```

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

