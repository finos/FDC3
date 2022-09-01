---
id: Action
sidebar_label: Action
title: Action
hide_title: true
---
# `Action`

A representation of an FDC3 Action (specified via a Context or Context & Intent) that can be inserted inside another object, 
for example a chat message.

## Type

`fdc3.entity.action`

## Schema

https://fdc3.finos.org/schemas/next/action.schema.json

## Details

| Property          | Type                                      | Required | Example Value           |
|-------------------|-------------------------------------------|----------|-------------------------|
| `type`            | string                                    | Yes      | `'fdc3.entity.action'`  |
| `title`           | string                                    | Yes      | `'Click to view Chart'` |
| `context`         | string                                    | Yes      | See Below               |
| `intent`          | string                                    | No       | `'ViewChart'`           |

## Example

```js
const message = {
    type: 'fdc3.entity.action',
    data: {
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
        }
    }
}

## See Also

Other Types
* [Message](Message)

Intents
* [StartChat](../../intents/ref/StartChat)
