---
id: TimeRange
sidebar_label: TimeRange
title: TimeRange
hide_title: true
---
# `TimeRange`

A context representing a period of time. Any user interfaces that represent or visualise events or activity over time can be filtered or focused on a particular time period, e.g.:

- A pricing chart
- A trade blotter
- A record of client contact/activity in a CRM

A time period may be closed (i.e. `startTime` and `endTime` are both known) or open (i.e. only the `startTime` is known, an `endTime` will be known in the future, e.g. when an order is filled).

Example application in a raised intent:

User may want to view pricing/trades/customer activity for a security over a particular time period, the time range might be specified as the context for the `ViewChart` intent OR it might be embedded in another context (e.g. a context representing a chart to plot).

Example application as a broadcast context:

User filters a visualisation (e.g. a pricing chart) to show a particular period, the `TimeRange` is broadcast and other visualisations (e.g. a heatmap of activity by instrument, or industry sector etc.) receive it and filter themselves to show data over the same range.

## Type

`fdc3.timerange`

## Schema

https://fdc3.finos.org/schemas/next/timerange.schema.json

## Details

| Property    | Type      | Required | Example Value                 |
|-------------|-----------|----------|-------------------------------|
| `type`      | string    | Yes      | `"fdc3.timeRange"`            |
| `startTime` | string *  | Yes      | `"2022-03-30T15:44:44Z"`      |
| `endTime`   | string *  | No       | `"2022-04-30T23:59:59+00:00"` |

Fields representing time SHOULD be string encoded according [ISO 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator included.

## Example

A closed range:

```js
const timeRange = {
    type: "fdc3.timeRange",
    startTime: "2022-03-30T15:44:44+00:00",
    endTime: "2022-04-30T23:59:59+00:00"
}
```

An open range:

```js
const timeRange = {
    type: "fdc3.timeRange",
    startTime: "2022-03-30T15:44:44+00:00"
}
```
