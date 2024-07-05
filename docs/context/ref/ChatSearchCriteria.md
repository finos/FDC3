---
title: Chat Search Criteria
description: >-
  A context type that represents a simple search criterion, based on a list of
  other context objects, that can be used to search or filter messages in a chat
  application.
sidebar_label: Chat Search Criteria

---

# Chat Search Criteria

A context type that represents a simple search criterion, based on a list of other context objects, that can be used to search or filter messages in a chat application.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/chatSearchCriteria.schema.json>

## Type

`fdc3.chat.searchCriteria`

## Properties

### `criteria`

An array of criteria that should match chats returned from by a search.

⚠️ Operators (and/or/not) are not defined in `fdc3.chat.searchCriteria`. It is up to the application that processes the FDC3 Intent to choose and apply the operators between the criteria.

Empty search criteria can be supported to allow resetting of filters.

**type**: `array`


**Example Value**: 
```json
[
  {
    "type": "fdc3.contact",
    "name": "Jane Doe",
    "id": {
      "email": "jane.doe@mail.com"
    }
  },
  {
    "type": "fdc3.instrument",
    "id": {
      "ticker": "TSLA"
    },
    "name": "Tesla, inc."
  },
  "annual return"
]
```

## Example

```json
{
  "type": "fdc3.chat.searchCriteria",
  "criteria": [
    {
      "type": "fdc3.contact",
      "name": "Jane Doe",
      "id": {
        "email": "jane.doe@mail.com"
      }
    },
    {
      "type": "fdc3.instrument",
      "id": {
        "ticker": "TSLA"
      },
      "name": "Tesla, inc."
    },
    "annual return"
  ]
}
```

