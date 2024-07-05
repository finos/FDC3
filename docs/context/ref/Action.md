---
title: Action
description: >-
  A representation of an FDC3 Action (specified via a Context or Context &
  Intent) that can be inserted inside another object, for example a chat
  message.


  The action may be completed by calling `fdc3.raiseIntent()` with the specified
  Intent and Context, or, if only a context is specified, by calling
  `fdc3.raiseIntentForContext()` (which the Desktop Agent will resolve by
  presenting the user with a list of available Intents for the Context).


  Accepts an optional `app` parameter in order to specify a specific app.
sidebar_label: Action

---

# Action

A representation of an FDC3 Action (specified via a Context or Context & Intent) that can be inserted inside another object, for example a chat message.

The action may be completed by calling `fdc3.raiseIntent()` with the specified Intent and Context, or, if only a context is specified, by calling `fdc3.raiseIntentForContext()` (which the Desktop Agent will resolve by presenting the user with a list of available Intents for the Context).

Accepts an optional `app` parameter in order to specify a specific app.

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/action.schema.json>

## Type

`fdc3.action`

## Properties

### `title`

A human readable display name for the action

**type**: `string`


**Example Value**: 
`Click to view Chart`

### `intent`

Optional Intent to raise to perform the actions. Should reference an intent type name, such as those defined in the FDC3 Standard. If intent is not set then `fdc3.raiseIntentForContext` should be used to perform the action as this will usually allow the user to choose the intent to raise.

**type**: `string`


**Example Value**: 
`ViewChart`

### `context`

A context object with which the action will be performed

**Reference**: [context](../context)


**Example Value**: 
```json
{
  "type": "fdc3.chart",
  "instruments": [
    {
      "type": "fdc3.instrument",
      "id": {
        "ticker": "EURUSD"
      }
    }
  ],
  "range": {
    "type": "fdc3.dateRange",
    "starttime": "2020-09-01T08:00:00.000Z",
    "endtime": "2020-10-31T08:00:00.000Z"
  },
  "style": "candle"
}
```

### `app`

An optional target application identifier that should perform the action

**Reference**: [api/AppIdentifier](../../../api/schemas/AppIdentifier)




**Example Value**: 
```json
{
  "appId": "MyChartViewingApp",
  "instanceId": "instance1"
}
```

## Example

```json
{
  "type": "fdc3.action",
  "title": "Click to view Chart",
  "intent": "ViewChart",
  "context": {
    "type": "fdc3.chart",
    "instruments": [
      {
        "type": "fdc3.instrument",
        "id": {
          "ticker": "EURUSD"
        }
      }
    ],
    "range": {
      "type": "fdc3.dateRange",
      "starttime": "2020-09-01T08:00:00.000Z",
      "endtime": "2020-10-31T08:00:00.000Z"
    },
    "style": "candle"
  },
  "app": {
    "appId": "MyChartViewingApp",
    "instanceId": "instance1"
  }
}
```

