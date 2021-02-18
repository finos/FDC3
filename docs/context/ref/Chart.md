---
id: Chart
sidebar_label: Chart
title: Chart
hide_title: true
---
# `Chart`

A Chart is a visualization of data for a financial instrument or a set of instruments.  A chart displays the data for a specific date range, and uses a specific style, such as lines, bars, etc.  [Indicators](Indicator) may be added to a chart to enhance the visualization.

Notes:

- Chart Data is not included in this schema.
- The 'style' property may be set to 'line', 'mountain', 'bar', 'candle', etc.
- The first instrument is always the primary instrument for the chart, any additional instruments are secondary.


## Type

`fdc3.chart`

## Schema

https://fdc3.finos.org/schemas/next/chart.schema.json

## Details

| Property       | Type       | Required | Example Value                      |
|----------------|------------|----------|------------------------------------|
| `type`         | string     | Yes      | `'fdc3.chart'`                  |
| `instruments` | Instrument[] | Yes     | `[instrument1, instrument2]`  |
| `range`       | DateRange  | No        | `dateRange`                      |
| `style`       | string     | No        | `'line'`                         |
| `indicators` | Indicator[] | No        | `[indicator1, indicator2]`    |

## Example

```js
const chart = {
    type: 'fdc3.chart'
    instruments: [
      {
        type: 'fdc3.instrument',
        id: {
          ticker: 'AAPL'
        }
      },
      {
        type: 'fdc3.instrument',
        id: {
          ticker: 'GOOG'
        }
      }
    ],
    range: {
      type: 'fdc3.dateRange',
      start: '2020-09-01T08:00:00.000Z',
      end: '2020-10-31T08:00:00.000Z'
    },
    style: 'line',
    indicators: [
      {
        type: 'fdc3.indicator',
        name: 'ma',
        parameters: {
          period: 14,
          type: 'ema'
        }
      },
      {
        type: 'fdc3.indicator',
        name: 'volume'
      }
    ]
}

fdc3.raiseIntent('ViewChart', chart)
```

## See Also

Other Types
- [DateRange](DateRange)
- [Indicator](Indicator)
- [Instrument](Instrument)

Intents
- [ViewChart](../../intents/ref/ViewChart)

FINOS Financial Objects
- [Chart](https://fo.finos.org/docs/objects/chart)