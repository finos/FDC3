---
title: RFQ
sidebar_label: RFQ

---

# RFQ

[@experimental](/docs/fdc3-compliance#experimental-features) context type representing a Request For Quote (RFQ).

## Schema

[https://fdc3.finos.org/schemas/next/context/rfq.schema.json](https://fdc3.finos.org/schemas/next/context/rfq.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/rfq.schema.json))

## Type

`fdc3.rfq`

## Properties

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

<details>
  <summary><code>Additional Properties</code></summary>

**type**: `string`

</details>

One or more identifiers that refer to the RFQ in an OMS or related system. Specific key names for systems are expected to be standardized in future.

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

An optional human-readable summary of the RFQ.

</details>

<details>
  <summary><code>notes</code></summary>

**type**: `string`

A description or set of notes.

</details>

<details>
  <summary><code>broker</code></summary>

**type**: `string`



</details>

<details>
  <summary><code>product</code> <strong>(required)</strong></summary>

**type**: [Product](Product)

Details of the order to be quoted for

</details>

## Example

```json
{
  "type": "fdc3.rfq",
  "id": {
    "rfqId": "RFQ12345"
  },
  "broker": "Broker ABC",
  "product": {
    "type": "fdc3.product",
    "id": {
      "productId": "SPY-CALLFLYWING+-20241220"
    },
    "instrument": {
      "type": "fdc3.instrument",
      "id": {
        "ticker": "SPY"
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
}
```

