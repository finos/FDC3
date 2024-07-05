---
title: Organization
description: >-
  An entity that can be used when referencing private companies and other
  organizations where a specific instrument is not available or desired e.g. CRM
  and News workflows.


  It is valid to include extra properties and metadata as part of the
  organization payload, but the minimum requirement is for at least one
  specified identifier to be provided.
sidebar_label: Organization

---

# Organization

An entity that can be used when referencing private companies and other organizations where a specific instrument is not available or desired e.g. CRM and News workflows.

It is valid to include extra properties and metadata as part of the organization payload, but the minimum requirement is for at least one specified identifier to be provided.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/organization.schema.json>

## Type

`fdc3.organization`

## Properties

### `id`

Identifiers for the organization, at least one must be provided.

**type**: `object`

**Subproperties:**
#### `LEI`
- **type**: `string`
- **description**: Legal Entity Identifier:  The Legal Entity Identifier (LEI) is a 20-character, alpha-numeric code based on the ISO 17442 standard developed by the International Organization for Standardization (ISO). It connects to key reference information that enables clear and unique identification of legal entities participating in financial transactions.

#### `PERMID`
- **type**: `string`
- **description**: Organization:  Refinitiv Permanent Identifiers, or PermID for the organization

#### `FDS_ID`
- **type**: `string`
- **description**: Organization:  FactSet Permanent Identifier representing the organization


**Example Value**: 
```json
{
  "LEI": "QXZYQNMR4JZ5RIRN4T31",
  "FDS_ID": "00161G-E"
}
```

## Example

```json
{
  "type": "fdc3.organization",
  "name": "Cargill, Incorporated",
  "id": {
    "LEI": "QXZYQNMR4JZ5RIRN4T31",
    "FDS_ID": "00161G-E"
  }
}
```

