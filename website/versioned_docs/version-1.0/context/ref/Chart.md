---
sidebar_label: Chart
title: Chart
hide_title: true
---
# `Chart`

A context type representing details of a Chart, which may be used to request plotting of a particular chart or to otherwise share details of its composition, such as:

* A list of instruments for comparison
* The time period to plot the chart over
* The style of chart (line, bar, mountain, candle etc.)
* Other settings such as indicators to calculate, or data representing drawings and annotations

In addition to handling requests to plot charts, a charting application may use this type to output a representation of what it is currently displaying so that it can be recorded by another application.

## Type

`fdc3.chart`

## Schema

https://fdc3.finos.org/schemas/next/chart.schema.json

## Details

| Property         | Type            | Required | Example Value        |
|------------------|-----------------|----------|----------------------|
| `type`           | string          | Yes      | `'fdc3.chart'`     |
| `instruments`    | Instrument[]  | Yes      | <pre>[<br/>&emsp;&emsp;\{<br/>&emsp;&emsp;&emsp;&emsp;"type": "fdc3.instrument",<br/>&emsp;&emsp;&emsp;&emsp;"id": \{<br/>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"ticker": "AAPL"<br/>&emsp;&emsp;&emsp;&emsp;\}<br/>&emsp;&emsp;\},<br/>&emsp;&emsp;\{<br/>&emsp;&emsp;&emsp;&emsp;"type": "fdc3.instrument",<br/>&emsp;&emsp;&emsp;&emsp;"id": \{<br/>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"ticker": "MSFT"<br/>&emsp;&emsp;&emsp;&emsp;\}<br/>&emsp;&emsp;\}<br/>]</pre> |
| `range` | TimeRange  | No       | <pre>\{<br/>&emsp;&emsp;"type": "fdc3.timeRange",<br/>&emsp;&emsp;"startTime": "2022-03-30T15:44:44+00:00",<br/>&emsp;&emsp;"endTime": "2022-04-30T23:59:59+00:00"<br/>\}</pre>            |
| `style`    | string  | No       | one of: `'line'`, `'bar'`, `'stacked-bar'`, `'mountain'`, `'candle'`, `'pie'`, `'scatter'`, `'histogram'`, `'heatmap'`, `'custom'`      |
| `otherConfig`* | object  | No |  `\{ /* unstandardized additional config */\}`  |

\* It is common for charts to support other configuration, such as indicators, annotations etc., which do not have standarized formats, but may be included in the `otherConfig` element.

## Example

```js
const chart = {
    type: "fdc3.chart",
    instruments: [
        {
            type: "fdc3.instrument",
            id: {
                ticker: "AAPL"
            }
        },
        {
            type: "fdc3.instrument",
            id: {
                ticker: "GOOG"
            }
        }
    ],
    range: {
        type: "fdc3.timeRange",
        startTime: "2020-09-01T08:00:00.000Z",
        endTime: "2020-10-31T08:00:00.000Z"
    },
    style: "line",
    otherConfig: {
        indicators: [
            {
                name: "ma",
                parameters: {
                    period: 14,
                    type: "ema"
                }
            },
            {
                name: "volume"
            }
        ]
    }
};

fdc3.raiseIntent("ViewChart", chart);
```

## See Also

Other Types

* [Instrument](Instrument)
* [TimeRange](TimeRange)

Intents

* [ViewChart](../../intents/ref/ViewChart)
