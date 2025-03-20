---
id: Message
sidebar_label: Message
title: Message
hide_title: true
---
# `Message`

A chat message to be sent through an instant messaging application. Can contain one or several text bodies (organised by mime-type, plaintext or markdown),
as well as attached entities (either arbitrary file attachments or FDC3 actions to be embedded in the message). To be put inside a ChatInitSettings object.

## Type

`fdc3.message`

## Schema

[https://fdc3.finos.org/schemas/2.1/context/message.schema.json](pathname:///schemas/2.1/context/message.schema.json)

## Details

| Property          | Type                                      | Required | Example Value           |
|-------------------|-------------------------------------------|----------|-------------------------|
| `type`            | string                                    | Yes      | `'fdc3.message'`        |
| `text`            | map of string mime-type to string content | No       | \{ text/plain: 'Hello' \} |
| `entities`        | map of json entity to string id           | No       | See Below               |

## Example

```js
const message = {
  type: 'fdc3.message',
  text: {
    'text/plain': 'Hey all, can we discuss the issue together? I attached a screenshot and a link to the current exchange rate'
  },
  entities: {
      'picture1': {
          type: 'fdc3.fileAttachment',
          data: {
          name: 'myImage.png',
                dataUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII'
          }
      },
      'eurusd_action': {
        type: 'fdc3.action',
        title: 'Click to view Chart',
        intent: 'ViewChart',
        context: {
            type: 'fdc3.chart',
            instruments: [
                {
                    type: 'fdc3.instrument',
                    id: {
                        ticker: 'EURUSD'
                    }
                }
            ],
            range: {
                type: 'fdc3.dateRange',
                starttime: '2020-09-01T08:00:00.000Z',
                endtime: '2020-10-31T08:00:00.000Z'
            },
            style: 'candle'
        }
    }
  }
}
```

## See Also

Other Types
* [ChatInitSettings](ChatInitSettings)
* [Action](Action)

Intents
* [StartChat](../../intents/ref/StartChat)
