---
id: StartEmail
sidebar_label: StartEmail
title: StartEmail
hide_title: true
---
# `StartEmail`

Initiate an email with a contact or list of contacts provided as part of an Email context.

## Intent Name

`StartEmail`

## Display Name

`Start Email`

## Possible Contexts

- [Email](../../context/ref/Email)

## Example

```js
window.fdc3.raiseIntent('fdc3.StartEmail', {
  type: 'fdc3.email',
  recipients: {
    type: 'fdc3.contact',
    name: 'Jane Doe',
    id: {
      email: 'jane.doe@example.com'
    }
  },
  subject: 'The information you requested',
  textBody: 'Blah, blah, blah ...'
})
```

## See Also

Context

- [Email](../../context/ref/Email)

Intents

- [StartCall](StartCall)
- [StartChat](StartChat)
