---
id: ViewMessages
sidebar_label: ViewMessages
title: ViewMessages
hide_title: true
---
# `ViewMessages`

Search and display a list of messages (for example in a chat application or CRM) to the user. 

## Intent Name

`ViewMessages`

## Display Name

`View Messages`

## Possible Contexts

* [ChatSearchCriteria](../../context/ref/ChatSearchCriteria)

## Example

Request display of messages relating to a specific `fdc3.instrument` (representing a ticker):
```js
const searchCriteria = {
    type: "fdc3.chat.searchCriteria",
    criteria: [
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

Request display of messages relating to a specific `fdc3.contact`:

```js
const searchCriteria = {
    type: "fdc3.chat.searchCriteria",
    criteria: [
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

Request display of messages relating to a specific `fdc3.organization`:

```js
const searchCriteria = {
    type: "fdc3.chat.searchCriteria",
    criteria: [
        {
            type: "fdc3.organization",
            name: "Symphony"
        }
    ]
}

fdc3.raiseIntent('ViewMessages', searchCriteria);
```

Request display of messages relating to a specific **phrase**:

```js
const searchCriteria = {
    type: "fdc3.chat.searchCriteria",
    criteria: [
        "#OrderID45788422"
    ]
}

fdc3.raiseIntent('ViewMessages', searchCriteria);
```

Request display of messages matching _multiple_ criteria:
```js
const searchCriteria = {
    type: "fdc3.chat.searchCriteria",
    criteria: [
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

* [ChatSearchCriteria](../../context/ref/ChatSearchCriteria)
* [Instrument](../../context/ref/Instrument)
* [Contact](../../context/ref/Contact)
* [Organization](../../context/ref/Organization)

Intents

* [ViewChat](ViewChat)