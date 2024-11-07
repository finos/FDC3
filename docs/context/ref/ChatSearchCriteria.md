---
title: ChatSearchCriteria
sidebar_label: ChatSearchCriteria

---

# ChatSearchCriteria

A context type that represents a simple search criterion, based on a list of other context objects, that can be used to search or filter messages in a chat application.

## Schema

[https://fdc3.finos.org/schemas/next/context/chatSearchCriteria.schema.json](https://fdc3.finos.org/schemas/next/context/chatSearchCriteria.schema.json) ([github](https://github.com/finos/FDC3/tree/main/schemas/context/chatSearchCriteria.schema.json))

## Type

`fdc3.chat.searchCriteria`

## Properties

<details>
  <summary><code>criteria</code> <strong>(required)</strong></summary>

**type**: `array`

<details>
  <summary><code>Items</code></summary>

  <summary><code>Search Criteria</code></summary>

**One of:**

- **type**: [Instrument](Instrument)
- **type**: [Organization](Organization)
- **type**: [Contact](Contact)
- **type**: `string`

An individual criteria against which to match chat messages, based on an FDC3 context or free-text string.




</details>

An array of criteria that should match chats returned from by a search.

⚠️ Operators (and/or/not) are not defined in `fdc3.chat.searchCriteria`. It is up to the application that processes the FDC3 Intent to choose and apply the operators between the criteria.

Empty search criteria can be supported to allow resetting of filters.

</details>

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

