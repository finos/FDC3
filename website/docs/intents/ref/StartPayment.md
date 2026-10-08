---
id: StartPayment
sidebar_label: StartPayment
title: StartPayment
hide_title: true
---
# `StartPayment`

Trigger a payment initiation or settlement workflow based on the provided payment context. This intent is typically resolved by banking portals, OMS/EMS systems, or DLT wallets that execute an ISO 20022 `pacs.008` instruction.

## Intent Name

`StartPayment`

## Display Name

`Start Payment`

## Possible Contexts

- [Payment](../../context/ref/Payment)

## Example

```js
const paymentContext = {
    type: 'fdc3.payment',
    name: 'ISO 20022 pacs.008 Settlement',
    id: {
        UETR: '123e4567-e89b-12d3-a456-426614174000'
    },
    amount: 150000.00,
    currency: 'USD',
    debtor: {
        name: 'Acme Corp',
        account: 'GB33BUKB20201555555555'
    },
    creditor: {
        name: 'Global Treasury Ltd',
        account: 'US33CHAS021000021'
    }
}

fdc3.raiseIntent('StartPayment', paymentContext)
```

## See Also

Context

- [Payment](../../context/ref/Payment)
