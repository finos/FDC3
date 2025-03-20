---
id: Action
sidebar_label: Action
title: Action
hide_title: true
---
# `Action`

A representation of an FDC3 Action (specified via a Context or Context & Intent) that can be inserted inside another object, for example a chat message.

The action may be completed by calling `fdc3.raiseIntent()` with the specified Intent and Context, or, if only a context is specified, by calling `fdc3.raiseIntentForContext()` (which the Desktop Agent will resolve by presenting the user with a list of available Intents for the Context).

Accepts an optional `app` parameter in order to specify a specific app.

## Type

`fdc3.action`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/action.schema.json](pathname:///schemas/2.1/context/action.schema.json)

## Details

| Property          | Type                                      | Required | Example Value           |
|-------------------|-------------------------------------------|----------|-------------------------|
| `type`            | string                                    | Yes      | `'fdc3.action'`         |
| `title`           | string                                    | Yes      | `'Click to view Chart'` |
| `intent`          | string                                    | No       | `'ViewChart'`           |
| `context`         | string                                    | Yes      | See Below               |
| `app`             | object                                    | No       | `'myApp'`               |
| `app.appId`       | string                                    | Yes      | `'app1'`                |
| `app.instanceId`  | string                                    | No       | `'instance1'`           |

## Example

```js
const action = {
    type: 'fdc3.action',
    title: 'Click to view Chart',
    intent: 'ViewChart',
    context {
        type: 'fdc3.chart',
        instruments: [
            {
                type: 'fdc3.instrument',
                id: {
                    ticker: 'EURUSD'
                }
            }
        ],
        range: {
            type: 'fdc3.dateRange',
            starttime: '2020-09-01T08:00:00.000Z',
            endtime: '2020-10-31T08:00:00.000Z'
        },
        style: 'candle'
    },
    app {
        appId: 'MyChartViewingApp',
        instanceId: 'instance1'
    }
}
```

## See Also

Other Types

- [Message](Message)

Intents

- [StartChat](../../intents/ref/StartChat)
