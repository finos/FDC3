---
title: Interaction
description: >-
  An `Interaction` is a significant direct exchange of ideas or information
  between a number of participants, e.g. a Sell Side party and one or more Buy
  Side parties. An `Interaction` might be a call, a meeting (physical or
  virtual), an IM or the preparation of some specialist data, such as financial
  data for a given company or sector.
sidebar_label: Interaction

---

# Interaction

An `Interaction` is a significant direct exchange of ideas or information between a number of participants, e.g. a Sell Side party and one or more Buy Side parties. An `Interaction` might be a call, a meeting (physical or virtual), an IM or the preparation of some specialist data, such as financial data for a given company or sector.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/interaction.schema.json>

## Type

`fdc3.interaction`

## Properties

### `id`

Can be used by a target application to pass an identifier back to the originating application after an interaction record has been created, updated or deleted. An interaction ID does not need to be populated by the originating application, however the target application could store it for future reference and SHOULD return it in a `TransactionResult`.

**type**: `object`

**Subproperties:**
#### `URI`
- **type**: `string`
- **description**: Interaction URI:  Can be used by a target application to pass a record's link back to the originating application. This offers the originating application a way to open the record for a user to view.

#### `SALESFORCE`
- **type**: `string`
- **description**: Salesforce ID:  Interactions ID in Salesforce

#### `SINGLETRACK`
- **type**: `string`
- **description**: SingleTrack ID:  Interaction ID in SingleTrack


**Example Value**: 
### `participants`

A list of contacts involved in the interaction

**Reference**: [contactList](../contactList)


**Example Value**: 
```json
{
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
}
```

### `timeRange`

The time range over which the interaction occurred

**Reference**: [timerange](../timerange)


**Example Value**: 
```json
{
  "type": "fdc3.timeRange",
  "startTime": "2022-02-10T15:12:00Z"
}
```

### `interactionType`

`interactionType` SHOULD be one of `'Instant Message'`, `'Email'`, `'Call'`, or `'Meeting'` although other string values are permitted.


**Example Value**: 
`Instant Message`

### `description`

A human-readable description of the interaction

**type**: `string`


**Example Value**: 
`Laboris libero dapibus fames elit adipisicing eu, fermentum, dignissimos laboriosam, erat, risus qui deserunt. Praesentium! Reiciendis. Hic harum nostrud, harum potenti amet? Mauris. Pretium aliquid animi, eget eiusmod integer proident. Architecto ipsum blandit ducimus, possimus illum sunt illum necessitatibus ab litora sed, nonummy integer minus corrupti ducimus iste senectus accumsan, fugiat nostrud? Pede vero dictumst excepturi, iure earum consequuntur voluptatum`

### `initiator`

The contact that initiated the interaction

**Reference**: [contact](../contact)


**Example Value**: 
```json
{
  "type": "fdc3.contact",
  "name": "Jane Doe",
  "id": {
    "email": "jane.doe@mail.com"
  }
}
```

### `origin`

Used to represent the application or service that the interaction was created from to aid in tracing the source of an interaction.

**type**: `string`


**Example Value**: 
`Outlook`

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

