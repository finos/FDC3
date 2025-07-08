---
id: CreateIdentityToken
sidebar_label: CreateIdentityToken
title: CreateIdentityToken
hide_title: true
---

# `CreateIdentityToken`

Request a secure identity token representing the current user. Intended for applications that need to authenticate or assert user identity via an identity provider.

## Intent Name

`CreateIdentityToken`

## Display Name

`Create Identity Token`

## Possible Contexts

- [User Request](../../context/ref/UserRequest)

SHOULD return context as a result:

- [User](../../context/ref/User)

## Example

```js
const userRequest = {
  type: "fdc3.user.request"
};

const intentResolution = await fdc3.raiseIntent('CreateIdentityToken', userRequest);
const userContext = await intentResolution.getResult();
console.log(userContext);
```

Console might display:

```json
{
  type: "fdc3.user",
  name: "John Doe",
  id: {
    email: "john.doe@somebank.com"
  },
  jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
