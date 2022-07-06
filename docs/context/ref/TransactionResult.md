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
| `type`      | Context  | Yes      | See Below  |
| `status`      | string  | Yes       | `'Updated'`      |
| `context`  | string  | Yes       | See Below |
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
