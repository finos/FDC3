---
title: Payment
sidebar_label: Payment

---

# Payment

[@experimental](/docs/fdc3-compliance#experimental-features) context type representing an institutional payment instruction, mapping to ISO 20022 pacs.008 (FIToFICustomerCreditTransfer). This type defines routing and settlement details including amount, currency, debtor, creditor, and optional network routing information.

## Schema

[https://fdc3.finos.org/schemas/3.0/context/payment.schema.json](pathname:///schemas/3.0/context/payment.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/payment.schema.json))

## Type

`fdc3.payment`

## Properties

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

<details>
  <summary><code>Additional Properties</code></summary>

**type**: `string`

</details>

One or more identifiers that refer to the payment in an OMS, EMS, or Settlement network (e.g., UETR, TransactionHash).

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

An optional human-readable summary of the payment context.

</details>

<details>
  <summary><code>amount</code> <strong>(required)</strong></summary>

**type**: `number`

The exact numerical value of the payment.

</details>

<details>
  <summary><code>currency</code> <strong>(required)</strong></summary>

**type**: `string`

The ISO 4217 currency code or standard asset identifier (e.g., 'USD', 'EUR', 'GBP').

</details>

<details>
  <summary><code>debtor</code> <strong>(required)</strong></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>name</code></summary>

**type**: `string`

</details>

<details>
  <summary><code>account</code> <strong>(required)</strong></summary>

**type**: `string`

</details>

<details>
  <summary><code>agent</code></summary>

**type**: `string`

</details>

The originating party initiating the payment.

</details>

<details>
  <summary><code>creditor</code> <strong>(required)</strong></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>name</code></summary>

**type**: `string`

</details>

<details>
  <summary><code>account</code> <strong>(required)</strong></summary>

**type**: `string`

</details>

<details>
  <summary><code>agent</code></summary>

**type**: `string`

</details>

The receiving party for the payment.

</details>

<details>
  <summary><code>networkRouting</code></summary>

**type**: `object`

<details>
  <summary><code>Additional Properties</code></summary>

**type**: `string`

</details>

Optional parameters for payment routing and settlement execution, such as clearing system identifiers, rail routing codes, or network-specific execution parameters.

</details>

## Example

```json
{
  "type": "fdc3.payment",
  "name": "ISO 20022 pacs.008 Settlement",
  "id": {
    "UETR": "123e4567-e89b-12d3-a456-426614174000"
  },
  "amount": 150000,
  "currency": "USD",
  "debtor": {
    "name": "Acme Corp",
    "account": "GB33BUKB20201555555555"
  },
  "creditor": {
    "name": "Global Treasury Ltd",
    "account": "US33CHAS021000021"
  },
  "networkRouting": {
    "rail": "RTGS",
    "settlementMethod": "CLRG",
    "clearingSystem": "SWIFT"
  }
}
```
