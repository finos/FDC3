---
title: Chart
sidebar_label: Chart

---

# Chart

A context type representing details of a Chart, which may be used to request plotting of a particular chart or to otherwise share details of its composition, such as:

- A list of instruments for comparison
- The time period to plot the chart over
- The style of chart (line, bar, mountain, candle etc.)
- Other settings such as indicators to calculate, or data representing drawings and annotations.

In addition to handling requests to plot charts, a charting application may use this type to output a representation of what it is currently displaying so that it can be recorded by another application.

## Schema

<https://fdc3.finos.org/schemas/next/context/chart.schema.json> ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/chart.schema.json))

## Type

`fdc3.chart`

## Properties

<details>
  <summary><code>instruments</code> <strong>(required)</strong></summary>

**type**: `array`

<details>
  <summary><code>Items</code></summary>

**type**: [Instrument](Instrument)

</details>

An array of instrument contexts whose data should be plotted.

</details>

<details>
  <summary><code>range</code></summary>

**type**: [TimeRange](TimeRange)

The time range that should be plotted

</details>

<details>
  <summary><code>style</code></summary>

**type**: `string` with values:
- `line`,
- `bar`,
- `stacked-bar`,
- `mountain`,
- `candle`,
- `pie`,
- `scatter`,
- `histogram`,
- `heatmap`,
- `custom`

The type of chart that should be plotted

</details>

<details>
  <summary><code>otherConfig</code></summary>

**type**: `array`

<details>
  <summary><code>Items</code></summary>

**type**: [Context](/docs/next/context/spec#the-context-interface)


</details>

It is common for charts to support other configuration, such as indicators, annotations etc., which do not have standardized formats, but may be included in the `otherConfig` array as context objects.

</details>

## Example

```json
{
  "type": "fdc3.chart",
  "instruments": [
    {
      "type": "fdc3.instrument",
      "id": {
        "ticker": "AAPL"
      }
    },
    {
      "type": "fdc3.instrument",
      "id": {
        "ticker": "GOOG"
      }
    }
  ],
  "range": {
    "type": "fdc3.timeRange",
    "startTime": "2020-09-01T08:00:00.000Z",
    "endTime": "2020-10-31T08:00:00.000Z"
  },
  "style": "line",
  "otherConfig": [
    {
      "type": "somevendor.someproduct.indicator",
      "name": "stddev",
      "parameters": {
        "period": 10,
        "matype": "exponential"
      }
    },
    {
      "type": "someothervendor.someotherproduct.formula",
      "formula": "standard-deviation",
      "fields": {
        "lookback": 10,
        "type": "ema"
      }
    }
  ]
}
```

