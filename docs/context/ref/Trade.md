---
id: Trade
sidebar_label: Trade
title: Trade
hide_title: true
---
# `Trade`

A trade expresses a holding's duration, value and location. It is a key component of a [Position](Position) record.

The trade can either be open or closed.  This is expressed with the population of the fields pertaining to the end time/value.

The Trade type goes hand-in-hand with the [Position](Position) type, which represents
multiple trades in a combination of dates, values, or locations.  It may also be used to construct a list of historical trades.

Notes:

- Leave out the end times and close properties for an open trade.

## Type

`fdc3.trade`

## Schema

https://fdc3.finos.org/schemas/next/position.schema.json

## Details

| Property            | Type       | Required | Example Value                         |
|---------------------|------------|----------|---------------------------------------|
| `type`              | string    | Yes      | `'fdc3.trade'`                       |
| `id`                | string    | No       | `'aabbcc'`                   |       |
| `tradedaterange`  | DateRange  | Yes      | `{ type: 'fdc3.dateRange', ... }` |
| `settledaterange` | DateRange  | No       | `{ type: 'fdc3.dateRange', ... }` |
| `units`            | number     | Yes      | `500`                                 |
| `open`             | Valuation  | Yes      | `{ type: 'fdc3.valuation', ... }`  |
| `close`            | Valuation  | No       | `{ type: 'fdc3.valuation', ... }`  |
| `location`         | string     | No       | `'XYZ'`                               |
| `account`          | string     | No       | `cash`                                |

## Example

```js
const trade = {
    type: 'fdc3.trade',
    tradedaterange: {
        type: 'fdc3.dateRange',
        starttime: '2020-09-01T08:00:00.000Z'
    },
    settledaterange: {
        type: 'fdc3.dateRange',
        starttime: '2020-09-02T08:00:00.000Z'
    },
    units: 1000000,
    open: {
        type: 'fdc3.valuation',
        price: 20.00,
        value: 20000000,
        currency: {
            type: 'fdc3.currency',
            code: 'USD'
        }
    },
    location: 'XYZ',
    account: 'cash'
}

fdc3.broadcast(trade)
```

## See Also

Other Types
- [DateRange](DateRange)
- [Trade](Trade)
- [Valuation](Valuation)

Intents
- [ViewAnalysis](../../intents/ref/ViewAnalysis)

FINOS Financial Objects
- [Position](https://fo.finos.org/docs/objects/trade)