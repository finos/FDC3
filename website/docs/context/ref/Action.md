---
title: Action
sidebar_label: Action

---

# Action

A representation of an FDC3 Action (specified via a Context or Context & Intent) that can be inserted inside another object, for example a chat message.

The action may be completed by calling:
- `fdc3.raiseIntent()` with the specified Intent and Context
- `fdc3.raiseIntentForContext()` if only a context is specified, (which the Desktop Agent will resolve by presenting the user with a list of available Intents for the Context).
- `channel.broadcast()` with the specified Context, if the `broadcast` action has been defined.

Accepts an optional `app` parameter in order to specify a specific app.

## Schema

<https://fdc3.finos.org/schemas/next/context/action.schema.json> ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/action.schema.json))

## Type

`fdc3.action`

## Properties

<details>
  <summary><code>action</code></summary>

**type**: `string` with values:
- `broadcast`,
- `raiseIntent`

The **action** field indicates the type of action:
- **raiseIntent** :  If no action or `raiseIntent` is specified, then `fdc3.raiseIntent` or `fdc3.raiseIntentForContext` will be called with the specified context (and intent if given).
- **broadcast** : If `broadcast` and a `channelId` are specified then `fdc3.getOrCreateChannel(channelId)` is called to retrieve the channel and broadcast the context to it with `channel.broadcast(context)`. If no `channelId` has been specified, the context should be broadcast to the current channel (`fdc3.broadcast()`)

</details>

<details>
  <summary><code>title</code> <strong>(required)</strong></summary>

**type**: `string`

A human readable display name for the action

</details>

<details>
  <summary><code>intent</code></summary>

**type**: `string`

Optional Intent to raise to perform the actions. Should reference an intent type name, such as those defined in the FDC3 Standard. If intent is not set then `fdc3.raiseIntentForContext` should be used to perform the action as this will usually allow the user to choose the intent to raise.

</details>

<details>
  <summary><code>context</code> <strong>(required)</strong></summary>

**type**: [Context](/docs/next/context/spec#the-context-interface)


A context object with which the action will be performed

</details>

<details>
  <summary><code>channelId</code></summary>

**type**: `string`

Optional channel on which to broadcast the context. The `channelId` property is ignored unless the `action` is broadcast.

</details>

<details>
  <summary><code>app</code></summary>

**type**: api/AppIdentifier

An optional target application identifier that should perform the action. The `app` property is ignored unless the action is raiseIntent.

</details>

## Examples

```json
{
  "type": "fdc3.action",
  "action": "raiseIntent",
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

```json
{
  "type": "fdc3.action",
  "action": "broadcast",
  "channelId": "Channel 1",
  "title": "Click to view Chart",
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
  }
}
```

