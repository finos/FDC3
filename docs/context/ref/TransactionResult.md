---
id: TransactionResult
sidebar_label: TransactionResult
title: TransactionResult
hide_title: true
---
# `TransactionResult`

`TransactionResult` is intended to be returned as an [`IntentResult`](../../api/Types#intentresult) by intents that create, retrieve, update or delete content or records in another application. Its purpose is to provide a status and message (where needed) for the transaction and MAY wrap a returned context object.

## Type

`fdc3.transactionResult`

## Schema

https://fdc3.finos.org/schemas/next/transactionresult.schema.json

## Details

| Property    | Type    | Required | Example Value     |
|-------------|---------|----------|-------------------|
| `type`      | string  | Yes      | 'fdc3.transactionResult'  |
| `status`      | string  | Yes       | `'Updated'`      |
| `context`  | Context  | Yes       | See Below |
| `message`  | string  | No       | See Below |

## Example

```js
const contact = {
    type: "fdc3.contact",
    name: "Jane Doe",
    id: {
        email: "jane.doe@mail.com"
    }
}

const resolution = await window.fdc3.raiseIntent('CreateOrUpdateProfile', contact);
const result = await resolution.getResult();
console.log(JSON.stringify(result));
```

Console log will display:

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
    "message": "record with id jane.doe@mail.com was updated"
}
```
