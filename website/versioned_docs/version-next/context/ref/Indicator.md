---
id: version-next-Indicator
sidebar_label: Indicator
title: Indicator
hide_title: true
original_id: Indicator
---
# `Indicator`

An Indicator is a function or transformation performed on data.  It is usually seen plotted on a financial chart.  This context type is a good example of a building block which can be used as a component of another context type, such as [Chart](Chart).

Indicators usually utilize some input arguments.  This specification enumerates some of the more common ones.

Notes:


- values for matype are generally 'simple', 'exponential', etc, or whatever is supported by chart.
- values for field are generally: 'Close', 'Open', 'High', 'Low', 'Volume', or `refid` value of another indicator.
- The following indicators should be implemented by consumers of this message:
    - Moving Average.  name='ma'.
    - Volume. name='volume'.
    - Standard Deviation.  name='stddev'.
    - Average True Range. name='atr'.
    - Bollinger Bands. name='bollbands'.
    - Price Relative. name='pricerel'.
- More indicators can be supported at a later revision of the schema.  As of now any other indicator would be implementation specific.
- Uncommon properties of an indicator are not defined explicitly in the specification; however, they can be included in the 'custom' object.  To direct custom parameters to specific implementation, add a 'vendor' key to the custom object.
- Missing parameters will be assigned by the receiving application according to its implementation.

## Type

`fdc3.indicator`

## Schema

https://fdc3.finos.org/schemas/next/indicator.schema.json

## Details

| Property                       | Type      | Required | Example Value        |
|--------------------------------|-----------|----------|----------------------|
| `type`                        | string    | Yes      | `'fdc3.indicator'` |
| `name`                        | string    | Yes      | `'ma'`              |
| `refid`                       | string    | No      | `'ma-1'`             |
| `parameters.period`         | number    | No      | `14`                  |
| `parameters.matype`         | string    | No      | `'ema'`              |
| `parameters.field`          | string    | No      | `'Close'`            |
| `parameters.instrument`    | Instrument | No      | `instrument`        |
| `parameters.custom.vendor` | string     | No      | `vendor1`           |
| `parameters.custom.fields` | object     | No      | `{'Offset': 2}`    |

## Example

```js
const indicator = {
    type: 'fdc3.indicator'
    name: 'ma',
    parameters: {
      period: 14,
      matype: 'ema'
    }
}

fdc3.broadcast(indicator)
```

## See Also

Other Types
- [Chart](Chart)
- [Instrument](Instrument)

Intents
- [ViewChart](../../intents/ref/ViewChart)

FINOS Financial Objects
- [Currency](https://fo.finos.org/docs/objects/indicator)
