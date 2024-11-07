---
id: TimeRange
sidebar_label: TimeRange
title: TimeRange
hide_title: true
---
# `TimeRange`

A context representing a period of time. Any user interfaces that represent or visualize events or activity over time can be filtered or focused on a particular time period, e.g.:

- A pricing chart
- A trade blotter
- A record of client contact/activity in a CRM

Example use cases:

- User may want to view pricing/trades/customer activity for a security over a particular time period, the time range might be specified as the context for the `ViewChart` intent OR it might be embedded in another context (e.g. a context representing a chart to plot).
- User filters a visualization (e.g. a pricing chart) to show a particular period, the `TimeRange` is broadcast and other visualizations (e.g. a heatmap of activity by instrument, or industry sector etc.) receive it and filter themselves to show data over the same range.

Notes:

- A `TimeRange` may be closed (i.e. `startTime` and `endTime` are both known) or open (i.e. only one of `startTime` or `endTime` is known).

- Ranges corresponding to dates (e.g. `2022-05-12` to `2022-05-19`) should be specified using times as this prevents issues with timezone conversions and inclusive/exclusive date ranges.

- String fields representing times are encoded according to [ISO 8601-1:2019](https://www.iso.org/standard/70907.html).
  - A timezone indicator should be specified, e.g. `"2022-05-12T15:18:03Z"` or `"2022-05-12T16:18:03+01:00"`
  - Times MAY be specified with millisecond precision, e.g. `"2022-05-12T15:18:03.349Z"`

## Type

`fdc3.timeRange`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/timeRange.schema.json](https://fdc3.finos.org/schemas/2.1/context/timeRange.schema.json)

## Details

| Property    | Type      | Required | Example Value                 |
|-------------|-----------|----------|-------------------------------|
| `type`      | string    | Yes      | `"fdc3.timeRange"`            |
| `startTime` | string *  | No **    | `"2022-03-30T15:44:44Z"`      |
| `endTime`   | string *  | No **    | `"2022-04-30T23:59:59+00:00"` |

\* Fields representing time SHOULD be string encoded according to [ISO 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator included.

\*\* One of `startTime` or `endTime` MUST be specified.

## Example

A closed range:

```js
const timeRange = {
    type: "fdc3.timeRange",
    startTime: "2022-03-30T15:44:44Z",
    endTime: "2022-04-30T23:59:59ZS"
}
```

Open ranges:

```js
const timeRange = {
    type: "fdc3.timeRange",
    startTime: "2022-03-30T15:44:44+00:00"
}
```

```js
const timeRange = {
    type: "fdc3.timeRange",
    endTime: "2022-03-30T16:44:44.123Z"
}
```

## See Also

Other Types

- [Chart](Chart)

Intents
- [CreateInteraction](../../intents/ref/CreateInteraction)
