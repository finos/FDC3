---
id: version-next-Organization
sidebar_label: Organization
title: Organization
hide_title: true
original_id: Organization
---
# `Organization`

An entity that can be used when referencing private companies and other organizations where a specific instrument is not available or desired e.g. CRM and News workflows.

Notes:

- It is valid to include extra properties and metadata as part of the organization payload, but the minimum requirement
is for at least one specified identifier to be provided.

## Type

`fdc3.organization`

## Schema

https://fdc3.finos.org/schemas/next/organization.schema.json

## Details

| Property    | Type    | Required | Example Value             |
|-------------|---------|----------|---------------------------|
| `type`      | string  | Yes      | `'fdc3.organization'`     |
| `name`      | string  | No       | `'Cargill, Incorporated'` |
| `id.LEI`    | string  | No       | `'QXZYQNMR4JZ5RIRN4T31'`  |
| `id.PERMID` | string  | No       | `'4296555324'`            |
| `id.FDS_ID` | string  | No       | `'00161G-E'`              |

## Example

```js
const organization = {
    type: 'fdc3.organization'
    name: 'Cargill, Incorporated',
    id: {
        LEI: 'QXZYQNMR4JZ5RIRN4T31',
        FDS_ID: '00161G-E'
    }
}


fdc3.broadcast(organization)
```

## See Also

Other Types
- [Instrument](Instrument)

Intents
- [ViewNews](../../intents/ref/ViewNews)
- [ViewAnalysis](../../intents/ref/viewAnalysis)

FINOS Financial Objects
- [Organization](https://fo.finos.org/docs/objects/organization)
