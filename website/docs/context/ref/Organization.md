---
title: Organization
sidebar_label: Organization

---

# Organization

An entity that can be used when referencing private companies and other organizations where a specific instrument is not available or desired e.g. CRM and News workflows.

It is valid to include extra properties and metadata as part of the organization payload, but the minimum requirement is for at least one specified identifier to be provided.

## Schema

[https://fdc3.finos.org/schemas/next/context/organization.schema.json](https://fdc3.finos.org/schemas/next/context/organization.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/organization.schema.json))

## Type

`fdc3.organization`

## Properties

<details>
  <summary><code>id</code> <strong>(required)</strong></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>LEI</code></summary>

**type**: `string`

The Legal Entity Identifier (LEI) is a 20-character, alpha-numeric code based on the ISO 17442 standard developed by the International Organization for Standardization (ISO). It connects to key reference information that enables clear and unique identification of legal entities participating in financial transactions.

</details>

<details>
  <summary><code>PERMID</code></summary>

**type**: `string`

Refinitiv Permanent Identifiers, or PermID for the organization

</details>

<details>
  <summary><code>FDS_ID</code></summary>

**type**: `string`

FactSet Permanent Identifier representing the organization

</details>

Identifiers for the organization, at least one must be provided.

</details>

<details>
  <summary><code>name</code></summary>

**type**: `string`

An optional human-readable name of the organization

</details>

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

