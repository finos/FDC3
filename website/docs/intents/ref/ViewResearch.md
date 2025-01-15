---
id: ViewResearch
sidebar_label: ViewResearch
title: ViewResearch
hide_title: true
---
# `ViewResearch`

Show research related to an instrument, an individual or organization provided as context.

## Intent Name

`ViewResearch`

## Display Name

`View Research`

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

fdc3.raiseIntent('ViewResearch', contact)
```

## See Also

Context

- [Contact](../../context/ref/Contact)
- [Instrument](../../context/ref/Instrument)
- [Organization](../../context/ref/Organization)

Intents

- [ViewAnalysis](ViewAnalysis)
