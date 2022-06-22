---
id: TransactionResult
sidebar_label: TransactionResult
title: TransactionResult
hide_title: true
---
# `TransactionResult`

The result of any given create, update or delete intent.

## Type

`fdc3.transactionResult`

## Schema

https://fdc3.finos.org/schemas/next/transactionresult.schema.json

## Details

| Property    | Type    | Required | Example Value     |
|-------------|---------|----------|-------------------|
| `type`      | string  | Yes      | `'fdc3.transactionResult'`  |
| `status`      | string  | Yes       | `'Updated'`      |
| `context`  | string  | Yes       | `'See Below'` |

## Example

```js
const contact = {
    type: "fdc3.contact",
    name: "Jane Doe",
    id: {
        email: "jane.doe@mail.com"
    }
}


fdc3.broadcast(contact)
```

## See Also

Other Types
- [ContactList](ContactList)

Intents
- [StartChat](../../intents/ref/StartChat)
- [StartCall](../../intents/ref/StartCall)
- [ViewProfile](../../intents/ref/ViewProfile)
- [ViewResearch](../../intents/ref/ViewResearch)
- [ViewInteractions](../../intents/ref/ViewInteractions)
- [ViewOrders](../../intents/ref/ViewOrders)
- [CreateInteraction](../../intents/ref/CreateInteraction)

FINOS Financial Objects
- [Contact](https://fo.finos.org/docs/objects/contact)
