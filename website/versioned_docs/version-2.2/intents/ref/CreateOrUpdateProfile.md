---
id: CreateOrUpdateProfile
sidebar_label: CreateOrUpdateProfile
title: CreateOrUpdateProfile
hide_title: true
---
# `CreateOrUpdateProfile`

Create a record or update an existing profile record with information for the individual or organization provided as context.

## Intent Name

`CreateOrUpdateProfile`

## Display Name

`Create or Update Profile`

## Possible Contexts

- [Contact](../../context/ref/Contact)
- [Organization](../../context/ref/Organization)

SHOULD return context as a result:

- [TransactionResult](../../context/ref/TransactionResult)

## Example

```js
const organization = {
  "type": "fdc3.organization",
  "name": "Cargill, Incorporated",
  "id": {
    "LEI": "QXZYQNMR4JZ5RIRN4T31",
    "FDS_ID": "00161G-E"
  }
};

const intentResolution = await fdc3.raiseIntent('CreateOrUpdateProfile', organization);
const result = await intentResolution.getResult();
console.log(result);
```

Console log might display:

```js
{
    type: 'fdc3.transactionResult',
    status: 'Created',
    context: {
        "type": "fdc3.organization",
        "name": "Cargill, Incorporated",
        "id": {
            "LEI": "QXZYQNMR4JZ5RIRN4T31",
            "FDS_ID": "00161G-E",
            "internalId": "al983020303a_23"
        }
    },
    message: 'record with id "al983020303a_23" was created'
}
```

## See Also

- [ViewProfile](../../intents/ref/ViewProfile)
- [Contact](../../context/ref/Contact)
- [Organization](../../context/ref/Organization)
- [TransactionResult](../../context/ref/TransactionResult)