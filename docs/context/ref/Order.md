---
title: Order
description: >-
  @experimental context type representing an order. To be used with OMS and EMS
  systems.


  This type currently only defines a required `id` field, which should provide a
  reference to the order in one or more systems, an optional human readable
  `name` field to be used to summarize the order and an optional `details` field
  that may be used to provide additional detail about the order, including a
  context representing a `product`, which may be extended with arbitrary
  properties. The `details.product` field is currently typed as a unspecified
  Context type, but both `details` and `details.product` are expected to be
  standardized in future.
sidebar_label: Order

---

# Order

[@experiemental](/docs/fdc3-compliance#experimental-features) context type representing an order. To be used with OMS and EMS systems.

This type currently only defines a required `id` field, which should provide a reference to the order in one or more systems, an optional human readable `name` field to be used to summarize the order and an optional `details` field that may be used to provide additional detail about the order, including a context representing a `product`, which may be extended with arbitrary properties. The `details.product` field is currently typed as a unspecified Context type, but both `details` and `details.product` are expected to be standardized in future.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/order.schema.json>

## Type

`fdc3.order`

## Properties

### `id`

One or more identifiers that refer to the order in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.

**type**: `object`


**Example Value**: 
```json
{
  "myOMS": "12345"
}
```


**Example Value**: 
```json
{
  "myOMS": "ABC123"
}
```

### `name`

An optional human-readable summary of the order.

**type**: `string`


**Example Value**: 
`...`


**Example Value**: 
### `details`

Optional additional details about the order, which may include a product element that is an, as yet undefined but extensible, Context

**type**: `object`

**Subproperties:**
#### `product`
- **type**: `undefined`
- **description**:  


**Example Value**: 
```json
{
  "product": {
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
}
```


**Example Value**: 
## Examples

```json
{
  "type": "fdc3.order",
  "name": "...",
  "id": {
    "myOMS": "12345"
  },
  "details": {
    "product": {
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
  }
}
```

```json
{
  "type": "fdc3.order",
  "id": {
    "myOMS": "ABC123"
  }
}
```

