---
title: Message
sidebar_label: Message

---

# Message

A chat message to be sent through an instant messaging application. Can contain one or several text bodies (organized by mime-type, plaintext or markdown), as well as attached entities (either arbitrary file attachments or FDC3 actions to be embedded in the message). To be put inside a ChatInitSettings object.

## Schema

[https://fdc3.finos.org/schemas/2.2/context/message.schema.json](pathname:///schemas/2.2/context/message.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/message.schema.json))

## Type

`fdc3.message`

## Properties

<details>
  <summary><code>text</code></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>text/plain</code></summary>

**type**: `string`

Plain text encoded content.

</details>

<details>
  <summary><code>text/markdown</code></summary>

**type**: `string`

Markdown encoded content

</details>

A map of string mime-type to string content

</details>

<details>
  <summary><code>entities</code></summary>

**type**: `object`

<details>
  <summary><code>Additional Properties</code></summary>

**One of:**

- **type**: [Action](Action)
- **type**: [File Attachment](FileAttachment)

</details>

A map of string IDs to entities that should be attached to the message, such as an action to perform, a file attachment, or other FDC3 context object.

</details>

## Example

```json
{
  "type": "fdc3.message",
  "text": {
    "text/plain": "Hey all, can we discuss the issue together? I attached a screenshot and a link to the current exchange rate"
  },
  "entities": {
    "picture1": {
      "type": "fdc3.fileAttachment",
      "data": {
        "name": "myImage.png",
        "dataUri": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII"
      }
    },
    "eurusd_action": {
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
      }
    }
  }
}
```

