---
id: ViewProfile
sidebar_label: ViewProfile
title: ViewProfile
hide_title: true
---
# `ViewProfile`

Display basic profile information for the provided individual or organization.

## Intent Name

`ViewProfile`

## Display Name

`View Profile`

## Possible Contexts

* [Contact](../../context/ref/Contact)
* [Organization](../../context/ref/Organization)

## Example

```js
const contact = {
  type: 'fdc3.contact',
  name: 'Jane Doe',
  id: {
    email: 'jane@mail.com'
  }
}

fdc3.raiseIntent('ViewProfile', contact)
```

## See Also

Context
* [Contact](../../context/ref/Contact)
* [Organization](../../context/ref/Organization)

Intents
* [ViewHoldings](ViewHoldings)
