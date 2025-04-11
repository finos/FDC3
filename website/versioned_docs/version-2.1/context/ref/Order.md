---
id: Order
sidebar_label: Order
title: Order
hide_title: true
---
# `Order`

[`@experimental`](/docs/fdc3-compliance#experimental-features) context type representing an order. To be used with OMS and EMS systems.

This type currently only defines a required `id` field, which should provide a reference to the order in one or more systems, an optional human-readable `name` field to be used to summarize the order, and an optional `details` field that may be used to provide additional detail about the order, including a Context representing a `product`, which may be extended with arbitrary properties. The `details.product` field is currently typed as an unspecified Context type, but both `details` and `details.product` are expected to be standardized in the future.

## Type

`fdc3.order`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/order.schema.json](pathname:///schemas/2.1/context/order.schema.json)

## Details

| Property          | Type       | Required | Details                   |
|-------------------|------------|----------|---------------------------|
| `type`            | string     | Yes      | `'fdc3.order'`            |
| `id`              | object     | Yes      | One or more identifiers that refer to the order in an OMS, EMS or related system. Specific key names for systems are expected to be standardized in future. E.g.:`{ myOMS: '12345' }` |
| `name`            | string     | No       | An optional human-readable summary of the order.    |
| `details`         | object     | No       | Optional additional details about the order, which may include a product element that is an, as yet undefined but extensible, Context  |
| `details.product` | Product    | No       | The product that the order relates to  |

## Examples

```js
const order1 = {
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
};
```

```js
const order2 = {
    "type": "fdc3.order",
    "id": {
        "myOMS": "ABC123"
    }
};
```

## See Also

Other Types

- [OrderList](OrderList)
- [Product](Product)
- [Trade](Trade)
