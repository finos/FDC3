---
id: ViewChart
sidebar_label: ViewChart
title: ViewChart
hide_title: true
---
# `ViewChart`

Display a chart for the provided context.

## Intent Name

`ViewChart`

## Display Name

`View Chart`

## Possible Contexts

- [Chart](../../context/ref/Chart)
- [Instrument](../../context/ref/Instrument)
- [InstrumentList](../../context/ref/InstrumentList)
- [Portfolio](../../context/ref/Portfolio)
- [Position](../../context/ref/Position)

## Example

Request a chart for an instrument:

```js
const instrument = {
    type: 'fdc3.instrument',
    name: 'International Business Machines',
    id: {
        ticker: 'ibm'
    }
}

fdc3.raiseIntent('ViewChart', instrument)
```

Request a specific chart:

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

Context

- [Chart](../../context/ref/Chart)
- [Instrument](../../context/ref/Instrument)
- [InstrumentList](../../context/ref/InstrumentList)
- [Portfolio](../../context/ref/Portfolio)
- [Position](../../context/ref/Position)

Intents

- [ViewQuote](ViewQuote)
