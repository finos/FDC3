# FDC3 Security

FDC3 Security enables **signed context**, **encrypted private channels**, and **user identity** across FDC3 applications. This package provides recipes for these capabilities.

## Recipes

The following recipes are demonstrated in the [samples](./samples) directory.

### 1. Signed Broadcast

**Use case:** Broadcast context so receivers can verify who sent it and that it wasn't tampered with.

**Sender:** Wrap your channel with `SigningChannelDelegate` and a private security instance. Call `broadcast(context)`—signing happens automatically. Private keys stay in a trusted backend; the front-end connects via a secure bridge (e.g. remote handlers over WebSocket).

**Receiver:** Wrap your channel with `SigningChannelDelegate` and a public security instance. Add listeners through the delegate. Your handler receives `(context, metadata)` with `metadata.authenticity` populated (`signed`, `valid`, `trusted`, `jku`).

**Sample:** [signing-broadcast-example.ts](./samples/signing-broadcast-example.ts)

---

### 2. Encrypted Private Channel

**Use case:** Communicate privately over a `PrivateChannel` so other apps and the desktop agent cannot read the messages.

**Broadcaster (key creator):** Wrap the private channel with `EncryptingChannelDelegate`. Call `setChannelEncryption(type => …)` to specify which context types to encrypt. Add `createSymmetricKeyRequestContextListener` so you can respond to key requests—the listener validates the requestor and provides the symmetric key wrapped with their public key.

**Listener (key requestor):** Wrap the private channel with `EncryptingChannelDelegate`. Add `createSymmetricKeyResponseContextListener` to request and receive the channel key. Add normal context listeners for the types you care about; encrypted messages are decrypted before your handler runs.

**Sample:** [encrypted-private-channel-example.ts](./samples/encrypted-private-channel-example.ts)

---

### 3. User Identity from an Identity Provider

**Use case:** Request verified user identity from an Identity Provider (IDP) and verify the returned JWT.

**IDP:** Handle `fdc3.security.userRequest` context (with `aud`). Create a signed JWT for the authenticated user and return an `fdc3.user` context containing the JWT. Private keys stay in the IDP backend.

**Requesting app:** Send a `fdc3.security.userRequest` with your app URL as `aud`. Receive the `fdc3.user` context and verify the JWT using the IDP's public key to obtain claims (`sub`, `iss`, etc.).

**Sample:** [get-user-example.ts](./samples/get-user-example.ts)

---

## Installation

```bash
npm install
npm run build
npm run test
```

## License

Copyright 2024 FINOS. Distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
