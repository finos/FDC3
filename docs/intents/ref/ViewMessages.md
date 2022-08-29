---
id: ViewMessages
sidebar_label: ViewMessages
title: ViewMessages
hide_title: true
---
# `ViewMessages`

Search and display a list of messages to the user.

## Intent Name

`ViewMessages`

## Display Name

`View Messages`

## Possible Contexts

* [SearchCriteria](../../context/ref/SearchCriteria)

## Example

Request to display messages for a specific ticker:
```js
const searchCriteria = {
    type: "fdc3.searchCriteria",
    contexts: [
        {
            type: "fdc3.instrument",
            id: {
                ticker: "AAPL"
            }
        }
    ]
}

fdc3.raiseIntent('ViewMessages', searchCriteria);
```

Request to display messages for a specific **contact**:

```js
const searchCriteria = {
    type: "fdc3.searchCriteria",
    contexts: [
        {
            type: "fdc3.contact",
            name: "Jane Doe",
            id: {
                email: "jane.doe@mail.com"
            }
        }
    ]
}

fdc3.raiseIntent('ViewMessages', searchCriteria);
```

Request to display messages for a specific **organization**:

```js
const searchCriteria = {
    type: "fdc3.searchCriteria",
    contexts: [
        {
            type: "fdc3.organization",
            name: "Symphony"
        }
    ]
}

fdc3.raiseIntent('ViewMessages', searchCriteria);
```

Request to display messages containing a specific **phrase**:

```js
const searchCriteria = {
    type: "fdc3.searchCriteria",
    contexts: [
        "#OrderID45788422"
    ]
}

fdc3.raiseIntent('ViewMessages', searchCriteria);
```

Request to display messages with **multiples** criteria:
```js
const searchCriteria = {
    type: "fdc3.searchCriteria",
    contexts: [
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

Context

* [Instrument](../../context/ref/Instrument)
* [Contact](../../context/ref/Contact)
* [Organization](../../context/ref/Organization)
* [SearchCriteria](../../context/ref/SearchCriteria)

Intents

* [ViewChat](ViewChat)