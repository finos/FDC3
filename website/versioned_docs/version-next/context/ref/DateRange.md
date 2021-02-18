---
id: version-next-DateRange
sidebar_label: DateRange
title: DateRange
hide_title: true
original_id: DateRange
---
# `DateRange`

A DateRange is a definition of a range of time, consisting of a start and end time. This type is a good example of a building block type, which can be used as a component of another type, such as [Chart](Chart).


## Type

`fdc3.dateRange`

## Schema

https://fdc3.finos.org/schemas/next/dateRange.schema.json

## Details

| Property         | Type    | Required | Example Value                   |
|------------------|---------|----------|---------------------------------|
| `type`          | string  | Yes      | `'fdc3.dateRange'`            |
| `starttime`    | string  | No       | `'2020-09-01T08:00:00.000Z'` |
| `endtime`       | string  | No       | `'2020-10-31T08:00:00.000Z'` |

## Example

```js
const dateRange = {
    type: 'fdc3.dateRange'
    starttime: '2020-09-01T08:00:00.000Z',
    endtime: '2020-10-31T08:00:00.000Z'
}

fdc3.broadcast(dateRange)
```

## See Also

Other Types
- [Chart](Chart)
- [Trade](Trade)

Intents
- [ViewChart](../../intents/ref/ViewChart)

FINOS Financial Objects
- [Currency](https://fo.finos.org/docs/objects/daterange)
