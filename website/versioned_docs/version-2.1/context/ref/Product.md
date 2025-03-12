---
id: Product
sidebar_label: Product
title: Product
hide_title: true
---
# `Product`

[`@experimental`](/docs/fdc3-compliance#experimental-features) context type representing a tradable product. To be used with OMS and EMS systems. This type is currently only loosely defined as an extensible context object, with an optional instrument field.

Notes:

- The Product schema does not explicitly include identifiers in the `id` section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Type

`fdc3.product`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/product.schema.json](pathname:///schemas/2.1/context/product.schema.json)

## Details

| Property     | Type       | Required | Example Value             |
|--------------|------------|----------|---------------------------|
| `type`       | string     | Yes      | `'fdc3.product'`        |
| `id`         | object     | Yes      | One or more identifiers that refer to the product. Specific key names for systems are expected to be standardized in future. |
| `name`       | string     | No       | A human-readable summary of the product. |
| `instrument` | Instrument | No       | A financial instrument that relates to the definition of this product. |

## Example

```js
const product = {
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
};
```

## See Also

Other Types

- [Instrument](Instrument)
- [Order](Order)
- [Trade](Trade)
