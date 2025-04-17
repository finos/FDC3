---
title: TransactionResult
sidebar_label: TransactionResult

---

# TransactionResult

A context type representing the result of a transaction initiated via FDC3, which SHOULD be returned as an `IntentResult` by intents that create, retrieve, update or delete content or records in another application. Its purpose is to provide a status and message (where needed) for the transaction and MAY wrap a returned context object.

## Schema

[https://fdc3.finos.org/schemas/next/context/transactionresult.schema.json](pathname:///schemas/next/context/transactionresult.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/transactionresult.schema.json))

## Type

`fdc3.transactionResult`

## Properties

<details>
  <summary><code>status</code> <strong>(required)</strong></summary>

**type**: `string` with values:
- `Created`,
- `Deleted`,
- `Updated`,
- `Failed`

The status of the transaction being reported.

</details>

<details>
  <summary><code>context</code></summary>

**type**: [Context](/docs/next/context/spec#the-context-interface)


A context object returned by the transaction, possibly with updated data.

</details>

<details>
  <summary><code>message</code></summary>

**type**: `string`

A human readable message describing the outcome of the transaction.

</details>

## Example

```json
{
  "type": "fdc3.transactionResult",
  "status": "Updated",
  "context": {
    "type": "fdc3.contact",
    "name": "Jane Doe",
    "id": {
      "email": "jane.doe@mail.com"
    }
  },
  "message": "record with id 'jane.doe@mail.com' was updated"
}
```

