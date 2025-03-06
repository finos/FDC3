---
title: Product
sidebar_label: Product

---

# Product

[@experimental](/docs/fdc3-compliance#experimental-features) context type representing a tradable product. To be used with OMS and EMS systems.

This type is currently only loosely defined as an extensible context object, with an optional instrument field.

The Product schema does not explicitly include identifiers in the id section, as there is not a common standard for such identifiers. Applications can, however, populate this part of the contract with custom identifiers if so desired.

## Schema

[https://fdc3.finos.org/schemas/next/context/product.schema.json](https://fdc3.finos.org/schemas/next/context/product.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/product.schema.json))

## Type

`fdc3.product`

## Properties

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

<details>
  <summary><code>Additional Properties</code></summary>

**type**: `string`

</details>

One or more identifiers that refer to the product. Specific key names for systems are expected to be standardized in future.

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

A human-readable summary of the product.

</details>

<details>
  <summary><code>notes</code></summary>

**type**: `string`

A description or set of notes.

</details>

<details>
  <summary><code>instrument</code></summary>

**type**: [Instrument](Instrument)

A financial instrument that relates to the definition of this product

</details>

<details>
  <summary><code>details</code></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>description</code></summary>

**type**: `string`

A description of the product as a string mi the style often used by traders to describe products within a chat messaging system


**Example**: 

```js
"SPY CF W+ 20DEC24 580/590/600 1x2x1 r572.99 d13% (PHLX)"
```

</details>

<details>
  <summary><code>orderType</code></summary>

**type**: `string` with values:
- `market`,
- `limit`,
- `limit-sell`,
- `buy-stop`,
- `stop-loss`,
- `stop`,
- `day`,
- `gtc`,
- `iceberg`,
- `once-cancels-the-other`,
- `immediate-or-cancel`,
- `all-or-none`,
- `fill-or-kill`

The type of order

</details>

<details>
  <summary><code>structureType</code></summary>

**type**: `string`

A description of the the structure or strategy of the product


**Example**: 

```js
"Call Fly Wing+"
```

</details>

<details>
  <summary><code>exchange</code></summary>

**type**: `string`

The exchange or marketplace where the product is offered


**Example**: 

```js
"PHLX"
```

</details>

<details>
  <summary><code>size</code></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>min</code></summary>

**type**: `number`

The minimum size

</details>

<details>
  <summary><code>max</code></summary>

**type**: `number`

The maximum size

</details>

<details>
  <summary><code>increment</code></summary>

**type**: `number`

The amount to increment the size by

</details>

Logic used to determine the size, size limits and increments to use when trading the product.

</details>

<details>
  <summary><code>price</code></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>tick</code></summary>

**type**: `number`



</details>

Logic used to determine the size, size limits and increments to use when trading the product.

</details>

<details>
  <summary><code>legs</code></summary>

**type**: `array`

<details>
  <summary><code>Items</code></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>id</code></summary>

**type**: `string`

Unique identifier for this order leg within the multi-leg order

</details>

<details>
  <summary><code>expirationDate</code></summary>

**type**: `string`

For options, the date at which the contract expires.

</details>

<details>
  <summary><code>maturityDate</code></summary>

**type**: `string`

The date on which the the issuer repays the holders.

</details>

<details>
  <summary><code>strikePrice</code> <strong>(required)</strong></summary>

**type**: `number`

The  price at which the underlying asset is bought or sold

</details>

<details>
  <summary><code>ratioQty</code></summary>

**type**: `number`

A 'per unit' quantity for the leg as a ratio of the order size.

</details>

<details>
  <summary><code>side</code> <strong>(required)</strong></summary>

**type**: `string` with values:
- `Buy`,
- `Sell`

Indicates whether the asset is being bought or sold.

</details>

A part of a multi-part transaction.

</details>

Description of the parts of a multi-part transaction.

</details>

Details that further define this product.

</details>

## Example

```json
{
  "type": "fdc3.product",
  "id": {
    "productId": "ABC123"
  },
  "notes": "Some notes attached to this product",
  "instrument": {
    "type": "fdc3.instrument",
    "id": {
      "ticker": "MSFT"
    }
  },
  "details": {
    "description": "SPY CF W+ 20DEC24 580/590/600 1x2x1 r572.99 d13% (PHLX)",
    "structureType": "Call Fly Wing+",
    "exchange": "PHLX",
    "size": {
      "min": 1000,
      "increment": 100,
      "type": "Lots"
    },
    "price": {
      "tick": 0.1,
      "type": "Price"
    },
    "legs": [
      {
        "type": "Call",
        "maturityDate": "2024-12-20",
        "strikePrice": 580,
        "ratioQty": 1,
        "side": "Buy"
      },
      {
        "type": "Call",
        "maturityDate": "2024-12-20",
        "strikePrice": 590,
        "ratioQty": -2,
        "side": "Sell"
      },
      {
        "type": "Call",
        "maturityDate": "2024-12-20",
        "strikePrice": 600,
        "ratioQty": 1,
        "side": "Buy"
      }
    ]
  }
}
```

