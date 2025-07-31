# FDC3 Security

This is a minimal proof-of-concept for FDC3 Security, as proposed by the FDC3 Identity and Security Working Group.

This project currently provides a Javascript implementation of FDC3 Security as a "decorator" for the FDC3 DesktopAgent API, which provides the following functionality:

1.  Signing of FDC3 Messages (e.g. Broadcast), which allows receipients of broadcasts to verify the sender.
2.  Encrypted FDC3 Private Channels, which allows for secure communication between two or more FDC3 apps privately without observation of messages from either other apps or the desktop agent.

## Signing Of FDC3 Messages

When two applications are using the FDC3 Security module, revceivers can check the authenticity of sender's messages by inspecting the `ContextMetadata` object when their `ContextHandler` is called. See: [ContextHandler](https://fdc3.finos.org/docs/api/ref/Types#contexthandler)

FDC3 Security adds the `authenticity` key to the `ContextMetadata` like so:

```
{
  "authenticity":  {
    "verified":true,                  // set to true if the broadcast was signed and  had a signature that could be verified
    "valid":true,                     // set to true if the public key was able to verify the signature
    "publicKeyUrl":"/sp1-public-key"  // the URL of the public key used to verify the signature, as given by the sender
  }
}
```

The process works in the following way:

```mermaid
sequenceDiagram
    participant AppA
    participant AppASecurityLayer
    participant DesktopAgent
    participant AppBSecurityLayer
    participant AppBIntentHandler
    AppA->>AppASecurityLayer: View Orders Intent containing Contact Context
    note right of AppASecurityLayer: Sign Context with AppA private key
    AppASecurityLayer->>DesktopAgent: Send Intent with Signed Context
    DesktopAgent->>AppBSecurityLayer: Deliver Intent
    note right of AppBSecurityLayer: Verify signature with AppA public key
    AppBSecurityLayer->>AppBIntentHandler: Deliver Intent with Contact Context and AppA metadata
```

## Encrypted FDC3 Private Channels

When two applications are using the FDC3 Security module, they can create a private channel between them, which is encrypted with a symmetric key. This allows for secure communication between two or more FDC3 apps privately without observation of messages from either other apps or the desktop agent.

In order to broadcast encrypted messages, the sender (A) creates the private channel and then calls the following function:

```javascript
privateChannel.setChannelEncryption(true)
```

This instructs the FDC3 Security module to create a symmetric key for the channel and use it to encrypt all messages sent on that channel.

When a recipient (B) receives an encrypted message on a private channel, it broadcasts a special FDC3 Context object of type `fdc3.security.symmetricKey.request` on the private channel, signed with its own private key.

A handles this context object by setting up a listener like so:

```javascript
privateChannel.addContextListener(SYMMETRIC_KEY_REQUEST_CONTEXT, async (_context: Context, meta: ContextMetadataWithAuthenticity | undefined) => {
  if (meta?.authenticity?.verified && meta?.authenticity?.valid) {
    // inspect the meta.authenticity.publicKeyUrl to ensure you want to communicate with this sender,
    // before calling:
    if (trustThisParty(meta.authenticity.publicKeyUrl)) {
      pc.broadcastKey(meta.authenticity.publicKeyUrl)
    }
  }
})
```

When A calls `pc.broadcastKey`, it responds by publishing the symmetric key encrypted with the public key of (B), allowing B (and only B) to decrypt the symmetric key and use it to decrypt anything else broadcast on the channel.

This is summarised here:

```mermaid
sequenceDiagram
    participant AppA
    participant AppB
    AppA->>AppB: View Orders Intent
    note right of AppB: Generate random symmetric key K
    note right of AppB: Create private channel C
    AppB->>AppA: Intent Reply: Private Channel C
    note left of AppA: Subscribe to Channel C
    note right of AppB: I have a new order!
    note right of AppB: Encrypt Order Context with K and sign it with AppB private key
    AppB->>AppA: Broadcast Encrypted Context
    note left of AppA: Context is encrypted!
    note left of AppA: Verify signature of context with AppB public key
    note left of AppA: Signature valid, I need the channel key
    AppA->>AppB: Key Request Intent for Channel C
    note right of AppB: Wrap K with AppA public key
    AppB->>AppA: K wrapped in AppA public key
    note left of AppA: Unwrap with AppA private key
    note left of AppA: I now have K, I can decrypt encrypted contexts on this channel :)
    note left of AppA: Decrypt encrypted context with K
    note right of AppB: I have a new order!
    note right of AppB: Encrypt Order Context with K and sign it with AppB private key
    AppB->>AppA: Broadcast Encrypted Context
    note left of AppA: Context is encrypted!
    note left of AppA: Verify signature of context with AppB public key
    note left of AppA: Decrypt encrypted context with K
```

## Installation

### Build And Test The Code

From the `javascript/fdc3-security` directory, run:

```
npm install
npm run test  # Runs Cucumber tests and coverage
npm build
```

This will build an ES6 module in the `dist` directory.

### Running The Demos

Example javascript code is included in this project in the `/javascript/fdc3-security/demo` directory. This includes a simple example of two FDC3 apps communicating with each other using the FDC3 Security module:

- `sp1`: Listens for the `SecretComms` intent to be raised, returning a Private Channel back to raisers and then broadcasting encrypted messages on that channel.
- `sp2`: Raises the `SecretComms` intent, listens to the private channel and outputs messages in the browser window that it receives.

In order to try this out:

1.  Start the demo applications by running

```
npm install
npm run dev
```

From the `javascript/fdc-security` directory. This starts a server at `localhost:8095` which serves the demo applications.

2. Install the `javascript/fdc3-security/demo/appd.json` directory into your own desktop agent (I used `finsemble-seed` and `fdc3-for-the-web`).

3. Start both apps sp1 and sp2 app and press the button in sp2.

4. sp2's output looks like this:

```
# here, it raises the SecretComms intent to sp1 and it's resolved
Got resolution: SecretComms from [object Object]

# sp1 returns a private cahnnel
Got result: private Private-Channel-Id-d0ee4085-3210-4786-ab05-fb6f8bd76000

# SP1 Sends a demo.counter message on the private channel, but it's encrypted.  After this step, sp2 asks for the channel key.
Private Channel Message ctx={"type":"demo.counter","__encrypted":{"algorithm":{"name":"AES-GCM","iv":"1bhVVRhuKbd42CNd"},"encoded":"IKQORuRYcEIouyMH+l3GO1MPwPOFvLI1ZKnF3hwpdjxnbhxNLQknEZ8MfX0VZuyUkgxquBVfpddOjI9j9+jXpFyN+43LaiZXzFp0lXEQIshXxADTS4vOF7rC0df1Wwmn/7aW4jTcLaMKeJSkd9j88ajh"}} meta={"source":{"appId":"sp1","instanceId":"fdc3-instanceId-sp1=4424741e-1511-438c-9ffe-1eb8c583f05f"},"authenticity":{"verified":true,"valid":true,"publicKeyUrl":"/sp1-public-key"},"encryption":"cant_decrypt"}

# By the time SP2 sends the second message, SP1 has the channel key, and is able to decrypt the contents of the context (containing id and original fields).  You can also see the source of the message is sp1, and the authenticity is verified and valid.
Private Channel Message ctx={"type":"demo.counter","id":{"bc":2},"original":{"type":"fdc3.instrument","id":{"isin":"Abc123"}}} meta={"source":{"appId":"sp1","instanceId":"fdc3-instanceId-sp1=4424741e-1511-438c-9ffe-1eb8c583f05f"},"authenticity":{"verified":true,"valid":true,"publicKeyUrl":"/sp1-public-key"},"encryption":"decrypted"}

```



### Configuring The Decorator

As described above, the FDC3 Security module is a decorator for the FDC3 DesktopAgent API. In order to use it, you need to import the module and then wrap the `DesktopAgent` with the `SecuredDesktopAgent` like so:

```javascript
const securedDa = new SecuredDesktopAgent(window.fdc3, signingFunction, unwrappingFunction, resolver)
````

The parameters are as follows:

- `d` Original platform desktop agent instance (perhaps provided by window.fdc3)
- `sign` A function that signs a message using a private key.  Can be done on the server side if that's what you want.
- `unwrapKey` A function used to unwrap a symmetric key encrypted with a public key.  Again, since it uses a private key, it can be done server side although the demos do client side unwrapping. 
- `resolver` A function that allows the agent to resolve a public key URL into a JSON Web Key Set (JWKS) (JsonWebKey[]).

## Roadmap

1.  Java implementation of FDC3 Security to be added.
2.  Publication into NPM.
3.  Fix the remaining cucumber tests.
4.  Heaed for 100% code coverage.
5.  OSFF Demo at end of September.

## Contributing

1. Fork it (<https://github.com/finos-labs/fdc3-security/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Read our [contribution guidelines](.github/CONTRIBUTING.md) and [Community Code of Conduct](https://www.finos.org/code-of-conduct)
4. Commit your changes (`git commit -am 'Add some fooBar'`)
5. Push to the branch (`git push origin feature/fooBar`)
6. Create a new Pull Request

## Development Envrionment

It's expected that if you contribute functionality to this project, it is well tested. Please implement cucumber tests to make sure your code is well covered. You can run the `javascript/fdc3-security` tests with:

```
npm run test
```

Code coverage is produced in the `coverage` directory and an HTML report is generated in `coverage/lcov-report/index.html`.
Cucumber test results are produced in the `cucumber-report.html` file.

## License

Copyright 2024 FINOS

Distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

SPDX-License-Identifier: [Apache-2.0](https://spdx.org/licenses/Apache-2.0)
