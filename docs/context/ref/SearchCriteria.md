---
id: SearchCriteria
sidebar_label: SearchCriteria
title: SearchCriteria
hide_title: true
---
# `SearchCriteria`

A context type representing a search criteria that can be used to filter and display messages from a chat.

## Type

`fdc3.searchCriteria`

## Schema

https://fdc3.finos.org/schemas/next/searchCriteria.schema.json

## Details

| Property         | Type            | Required | Example Value        |
|------------------|-----------------|----------|----------------------|
| `type`           | string          | Yes      | `'fdc3.searchCriteria'`     |
| `contexts`    | (Instrument&#124;<br>Contact&#124;<br>Organization&#124;<br>string)[]  | Yes      | `[{ type: "fdc3.instrument", id: { ticker: "AAPL" }}, { type: "fdc3.contact", name: "Jane Doe", id: { email: "jane.doe@mail.com" }}, { type: "fdc3.organization", name: "Symphony" }, "#OrderID45788422"]` |

## Example

```js
const searchCriteria = {
    type: "fdc3.searchCriteria",
    contexts: [
        {
            type: "fdc3.instrument",
            id: {
                ticker: "AAPL"
            }
        },
        {
            type: "fdc3.contact",
            name: "Jane Doe",
            id: {
                email: "jane.doe@mail.com"
            }
        },
        {
            type: "fdc3.organization",
            name: "Symphony"
        },
        "#OrderID45788422"
    ]
}

fdc3.raiseIntent('ViewMessages', searchCriteria);
```

## See Also

Intents

* [ViewMessages](../../intents/ref/ViewMessages)
