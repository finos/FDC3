---
id: GetUser
sidebar_label: GetUser
title: GetUser
hide_title: true
---
# `GetUser`

Request authenticated user identity information from an identity provider app.

## Intent Name

`GetUser`

## Display Name

`Get User`

## Possible Contexts

- [UserRequest](../../context/ref/security/UserRequest)

## Result Type

- [User](../../context/ref/security/User)

## Example

```js
const userRequest = {
    type: 'fdc3.security.userRequest',
    aud: 'https://myapp.example.com'
}

const resolution = await fdc3.raiseIntent('GetUser', userRequest);
const securityUser = await resolution.getResult();

// securityUser contains authenticated identity information (fdc3.security.user)
console.log(securityUser.name, securityUser.id.email);
```

## Security Considerations

The `GetUser` intent is part of the FDC3 security model for establishing user identity across applications. The requesting application should:

1. Sign the `UserRequest` context to prove its identity
2. Specify its audience (`aud` — the requesting app's URL) so the identity provider app issues a token scoped to this application
3. Decrypt the returned `fdc3.security.user` context's `wrappedJwt` field using its private key
4. Verify the JWT signature using the identity provider app's published JWKS

The intent is handled by an identity provider app — an FDC3 application that can authenticate the current user and issue signed, audience-scoped JWTs. This is distinct from an OAuth 2.0 / OIDC identity provider; no redirect flows or token endpoints are involved.

See [Security & Identity](../../api/security) for full details on the FDC3 security model.

## See Also

Context

- [User](../../context/ref/security/User)
- [UserRequest](../../context/ref/security/UserRequest)

Intents

- [StartCall](StartCall)
- [StartChat](StartChat)
