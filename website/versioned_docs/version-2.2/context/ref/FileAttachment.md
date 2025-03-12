---
title: File Attachment
sidebar_label: File Attachment

---

# File Attachment

A File attachment encoded in the form of a data URI. Can be added to a Message.

## Schema

[https://fdc3.finos.org/schemas/2.2/context/fileAttachment.schema.json](https://fdc3.finos.org/schemas/2.2/context/fileAttachment.schema.json) ([github](https://github.com/finos/FDC3/tree/main/packages/fdc3-context/schemas/context/fileAttachment.schema.json))

## Type

`fdc3.fileAttachment`

## Properties

<details>
  <summary><code>data</code> <strong>(required)</strong></summary>

**type**: `object`

**Subproperties:**

<details>
  <summary><code>name</code> <strong>(required)</strong></summary>

**type**: `string`

The name of the attached file

</details>

<details>
  <summary><code>dataUri</code> <strong>(required)</strong></summary>

**type**: `string`

A data URI encoding the content of the file to be attached

</details>

</details>

## Example

```json
{
  "type": "fdc3.fileAttachment",
  "data": {
    "name": "myImage.png",
    "dataUri": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII"
  }
}
```

