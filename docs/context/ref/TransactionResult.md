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
| `context`  | string  | Yes       | See Below |

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
    }
}
```
