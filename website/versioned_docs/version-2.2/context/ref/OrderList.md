---
title: OrderList
sidebar_label: OrderList

---

# OrderList

[@experimental](/docs/fdc3-compliance#experimental-features) A list of orders. Use this type for use cases that require not just a single order, but multiple.

The OrderList schema does not explicitly include identifiers in the id section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Schema

[https://fdc3.finos.org/schemas/2.2/context/orderList.schema.json](https://fdc3.finos.org/schemas/2.2/context/orderList.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/orderList.schema.json))

## Type

`fdc3.orderList`

## Properties

<details>
  <summary><code>id</code></summary>

**type**: `object`

<details>
  <summary><code>Additional Properties</code></summary>

**type**: `string`

</details>

One or more identifiers that refer to the order list in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future.

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

An optional human-readable summary of the order list

</details>

<details>
  <summary><code>orders</code> <strong>(required)</strong></summary>

**type**: `array`

<details>
  <summary><code>Items</code></summary>

**type**: [Order](Order)

</details>

An array of order contexts that forms the list.

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

