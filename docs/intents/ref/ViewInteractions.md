---
id: ViewInteractions
sidebar_label: ViewInteractions
title: ViewInteractions
hide_title: true
---
# `ViewInteractions`

Display interactions (calls, meetings, etc.) related to an individual, an instrument or organization provided as context.

## Intent Name

`ViewInteractions`

## Display Name

`View Interactions`

## Possible Contexts

- [Contact](../../context/ref/Contact)
- [Instrument](../../context/ref/Instrument)
- [Organization](../../context/ref/Organization)

## Example

```js
const contact = {
  type: 'fdc3.contact',
  name: 'Jane Doe',
  id: {
    email: 'jane@mail.com'
  }
}

fdc3.raiseIntent('ViewInteractions', contact)
```

## See Also

Context

- [Contact](../../context/ref/Contact)
- [Instrument](../../context/ref/Instrument)
- [Organization](../../context/ref/Organization)

Intents

- [ViewProfile](ViewProfile)
- [ViewResearch](ViewResearch)
