---
id: ChatSearchCriteria
sidebar_label: ChatSearchCriteria
title: ChatSearchCriteria
hide_title: true
---
# `ChatSearchCriteria`

A context type that represents a simple search criterion, based on a list of other context objects, that can be used to search or filter messages in a chat application.

## Type

`fdc3.chat.searchCriteria`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/chatSearchCriteria.schema.json](pathname:///schemas/2.1/context/chatSearchCriteria.schema.json)

## Details

| Property         | Type            | Required | Example Value        |
|------------------|-----------------|----------|----------------------|
| `type`           | string          | Yes      | `'fdc3.chat.searchCriteria'`     |
| `criteria` | (Instrument &#124;<br/>Contact &#124;<br/>Organization &#124;<br/>string)[] | Yes | <pre>[<br/>&emsp;&emsp;\{<br/>&emsp;&emsp;&emsp;&emsp;"type": "fdc3.instrument",<br/>&emsp;&emsp;&emsp;&emsp;"id": \{<br/>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"ticker": "AAPL"<br/>&emsp;&emsp;&emsp;&emsp;\}<br/>&emsp;&emsp;\},<br/>&emsp;&emsp;\{<br/>&emsp;&emsp;&emsp;&emsp;"type": "fdc3.contact",<br/>&emsp;&emsp;&emsp;&emsp;"name":"Jane Doe",<br/>&emsp;&emsp;&emsp;&emsp;"id": \{<br/>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"email": "jane.doe@mail.com"<br/>&emsp;&emsp;&emsp;&emsp;\}<br/>&emsp;&emsp;\},<br/>&emsp;&emsp;\{<br/>&emsp;&emsp;&emsp;&emsp;"type": "fdc3.organization",<br/>&emsp;&emsp;&emsp;&emsp;"name":"Symphony",<br/>&emsp;&emsp;\},<br/>&emsp;&emsp;"#OrderID45788422",<br/>]</pre> |

⚠️ Operators (and/or/not) are not defined in `fdc3.chat.searchCriteria`. It is up to the application that processes the FDC3 Intent to choose and apply the operators between the criteria.

Empty search criteria can be supported to allow resetting of filters.

## Example

```js
const searchCriteria = {
    type: "fdc3.chat.searchCriteria",
    criteria: [
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
