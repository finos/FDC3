---
id: OrderList
sidebar_label: OrderList
title: OrderList
hide_title: true
---
# `OrderList`

[`@experimental`](/docs/fdc3-compliance#experimental-features) A list of orders. Use this type for use cases that require not just a single order, but multiple.

Notes:

- The OrderList schema does not explicitly include identifiers in the id section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Type

`fdc3.orderList`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/orderList.schema.json](pathname:///schemas/2.1/context/orderList.schema.json)

## Details

| Property     | Type       | Required | Example Value             |
|--------------|------------|----------|---------------------------|
| `type`       | string     | Yes      | `'fdc3.orderList'`        |
| `id`         | object     | No       | `{ listId: '1234' }` |
| `name`       | string     | No       | `'Today's orders'`    |
| `orders`     | Trade[]    | Yes      | `[order1, order2]`  |

## Example

```js
const orderList = {
    type: "fdc3.orderList",
    orders: [
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
};
```

## See Also

Other Types

- [Order](Order)
