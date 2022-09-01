---
id: SearchCriteria
sidebar_label: SearchCriteria
title: SearchCriteria
hide_title: true
---
# `SearchCriteria`

A context type that represents a simple search criterion, based on a list of other context objects, that can be used to search or filter content in an application (such as messages in a chat app).

## Type

`fdc3.searchCriteria`

## Schema

https://fdc3.finos.org/schemas/next/searchCriteria.schema.json

## Details

| Property         | Type            | Required | Example Value        |
|------------------|-----------------|----------|----------------------|
| `type`           | string          | Yes      | `'fdc3.searchCriteria'`     |
| `contexts` | (Instrument&#124;<br>Contact&#124;<br>Organization&#124;<br>string)[] | Yes | <pre>[<br>&emsp;&emsp;{<br>&emsp;&emsp;&emsp;&emsp;"type": "fdc3.instrument",<br>&emsp;&emsp;&emsp;&emsp;"id": {<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"ticker": "AAPL"<br>&emsp;&emsp;&emsp;&emsp;}<br>&emsp;&emsp;},<br>&emsp;&emsp;{<br>&emsp;&emsp;&emsp;&emsp;"type": "fdc3.contact",<br>&emsp;&emsp;&emsp;&emsp;"name":"Jane Doe",<br>&emsp;&emsp;&emsp;&emsp;"id": {<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"email": "jane.doe@mail.com"<br>&emsp;&emsp;&emsp;&emsp;}<br>&emsp;&emsp;},<br>&emsp;&emsp;{<br>&emsp;&emsp;&emsp;&emsp;"type": "fdc3.organization",<br>&emsp;&emsp;&emsp;&emsp;"name":"Symphony",<br>&emsp;&emsp;},<br>&emsp;&emsp;"#OrderID45788422",<br>]</pre> |

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
