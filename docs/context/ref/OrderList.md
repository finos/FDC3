---
title: OrderList
description: >-
  @experimental A list of orders. Use this type for use cases that require not
  just a single order, but multiple.


  The OrderList schema does not explicitly include identifiers in the id
  section, as there is not a common standard for such identifiers. Applications
  can, however, populate this part of the contract with custom identifiers if so
  desired.
sidebar_label: OrderList

---

# OrderList

[@experiemental](/docs/fdc3-compliance#experimental-features) A list of orders. Use this type for use cases that require not just a single order, but multiple.

The OrderList schema does not explicitly include identifiers in the id section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/orderList.schema.json>

## Type

`fdc3.orderList`

## Properties

<details>
  <summary><code>orders</code> <strong>(required)</strong></summary>

**type**: `array`

An array of order contexts that forms the list.


**Example**: 
```json
[
  {
    "type": "fdc3.order",
    "id": {
      "myOMS": "ABC123"
    }
  },
  {
    "type": "fdc3.order",
    "id": {
      "myOMS": "DEF456"
    }
  }
]
```

</details>

## Example

```json
{
  "type": "fdc3.orderList",
  "orders": [
    {
      "type": "fdc3.order",
      "id": {
        "myOMS": "ABC123"
      }
    },
    {
      "type": "fdc3.order",
      "id": {
        "myOMS": "DEF456"
      }
    }
  ]
}
```

