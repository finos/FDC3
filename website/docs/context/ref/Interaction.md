---
title: Interaction
sidebar_label: Interaction

---

# Interaction

An `Interaction` is a significant direct exchange of ideas or information between a number of participants, e.g. a Sell Side party and one or more Buy Side parties. An `Interaction` might be a call, a meeting (physical or virtual), an IM or the preparation of some specialist data, such as financial data for a given company or sector.

## Schema

[https://fdc3.finos.org/schemas/next/context/interaction.schema.json](pathname:///schemas/next/context/interaction.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/interaction.schema.json))

## Type

`fdc3.interaction`

## Properties

<details>
  <summary><code>id</code></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>URI</code></summary>

**type**: `string`

Can be used by a target application to pass a record's link back to the originating application. This offers the originating application a way to open the record for a user to view.

</details>

<details>
  <summary><code>SALESFORCE</code></summary>

**type**: `string`

Interactions ID in Salesforce

</details>

<details>
  <summary><code>SINGLETRACK</code></summary>

**type**: `string`

Interaction ID in SingleTrack

</details>

Can be used by a target application to pass an identifier back to the originating application after an interaction record has been created, updated or deleted. An interaction ID does not need to be populated by the originating application, however the target application could store it for future reference and SHOULD return it in a `TransactionResult`.

</details>

<details>
  <summary><code>participants</code> <strong>(required)</strong></summary>

**type**: [ContactList](ContactList)

A list of contacts involved in the interaction

</details>

<details>
  <summary><code>timeRange</code> <strong>(required)</strong></summary>

**type**: [TimeRange](TimeRange)

The time range over which the interaction occurred

</details>

<details>
  <summary><code>interactionType</code> <strong>(required)</strong></summary>

**type**: `string`

`interactionType` SHOULD be one of `'Instant Message'`, `'Email'`, `'Call'`, or `'Meeting'` although other string values are permitted.

</details>

<details>
  <summary><code>description</code> <strong>(required)</strong></summary>

**type**: `string`

A human-readable description of the interaction

</details>

<details>
  <summary><code>initiator</code></summary>

**type**: [Contact](Contact)

The contact that initiated the interaction

</details>

<details>
  <summary><code>origin</code></summary>

**type**: `string`

Used to represent the application or service that the interaction was created from to aid in tracing the source of an interaction.

</details>

## Example

```json
{
  "type": "fdc3.interaction",
  "participants": {
    "type": "fdc3.contactList",
    "contacts": [
      {
        "type": "fdc3.contact",
        "name": "Jane Doe",
        "id": {
          "email": "jane.doe@mail.com"
        }
      },
      {
        "type": "fdc3.contact",
        "name": "John Doe",
        "id": {
          "email": "john.doe@mail.com"
        }
      }
    ]
  },
  "interactionType": "Instant Message",
  "timeRange": {
    "type": "fdc3.timeRange",
    "startTime": "2022-02-10T15:12:00Z"
  },
  "description": "Laboris libero dapibus fames elit adipisicing eu, fermentum, dignissimos laboriosam, erat, risus qui deserunt. Praesentium! Reiciendis. Hic harum nostrud, harum potenti amet? Mauris. Pretium aliquid animi, eget eiusmod integer proident. Architecto ipsum blandit ducimus, possimus illum sunt illum necessitatibus ab litora sed, nonummy integer minus corrupti ducimus iste senectus accumsan, fugiat nostrud? Pede vero dictumst excepturi, iure earum consequuntur voluptatum",
  "initiator": {
    "type": "fdc3.contact",
    "name": "Jane Doe",
    "id": {
      "email": "jane.doe@mail.com"
    }
  },
  "origin": "Outlook"
}
```

