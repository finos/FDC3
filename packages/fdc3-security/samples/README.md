# FDC3 Security Samples

This directory contains examples demonstrating how to use the FDC3 Security features for context encryption, signing, and user identification.

Each example is a standalone TypeScript file that can be executed directly using `tsx` from the package root. The desktop agent is mocked in each sample to illustrate the information flows between applications and their secure backends.

## Running the Examples

From the `packages/fdc3-security` directory:

```bash
# Example: Run the Mutually Authenticated Intent example
npx tsx samples/signing-intent-example.ts

# Example: Run the Signing Broadcast example
npx tsx samples/signing-broadcast-example.ts
```

---

## [Backend Encrypted Channel Example](backend-encrypted-channel-example.ts)

Demonstrates how to use `EncryptedBroadcastSupport` and `PrivateEncryptedContextListenerSupport` on the backend. Encryption and decryption are handled entirely by backend processes, with the frontend acting only as a transport for FDC3 channels.

```mermaid
sequenceDiagram
    participant 1FE as App 1 Front End (Broadcaster)
    participant 1BE as App 1 Back End
    participant 2FE as App 2 Front End (Listener)
    participant 2BE as App 2 Back End

    Note over 2BE: Starts Server & JWKS
    Note over 1BE: Starts Server & JWKS
    
    1FE->>1BE: Connect (WebSocket)
    1FE->>1BE: Register Intent Handler (ShareEncryptedChannel)
    
    2FE->>2BE: Connect (WebSocket)
    2FE->>1FE: raiseIntent(ShareEncryptedChannel)
    
    1FE->>1BE: handleRemoteChannel(ShareEncryptedChannel)
    Note right of 1BE: Wraps Channel with<br/>EncryptedBroadcastSupport
    
    2FE->>2BE: handleRemoteChannel(listen)
    Note right of 2BE: Sets up Listener with<br/>PrivateEncryptedContextListenerSupport
    
    1BE->>1FE: broadcast(Encrypted Context)
    1FE->>2FE: FDC3 Broadcast
    
    2FE->>2BE: Incoming Context Event
    Note right of 2BE: Requests Symmetric Key (via JWKS)<br/>Unwraps with Private Key<br/>Decrypts Context
    Note right of 2BE: ✅ Decrypted Context Logged
```

---

## [Frontend Encrypted Channel Example](frontend-encrypted-channel-example.ts)

Shows how to use `EncryptedBroadcastSupport` and `PublicEncryptedContextListenerSupport` for frontend-driven encryption. Encryption and decryption occur on the frontend, while sensitive key unwrapping and signing are delegated to a secure backend via `exchangeData`.

```mermaid
sequenceDiagram
    participant 1FE as App 1 Front End (Broadcaster)
    participant 1BE as App 1 Back End
    participant 2FE as App 2 Front End (Listener)
    participant 2BE as App 2 Back End

    Note over 1FE: Sets up EncryptedBroadcastSupport<br/>(signingFunction calls 1BE)
    1FE->>1BE: exchangeData(sign-context)
    1BE-->>1FE: Signature & Anti-Replay
    1FE->>2FE: broadcast(Encrypted Context)
    
    Note over 2FE: Sets up PublicEncryptedContextListenerSupport<br/>(unwrappingFunction calls 2BE)
    2FE->>2BE: exchangeData(unwrap-key)
    2BE-->>2FE: Unwrapped Symmetric Key
    Note over 2FE: ✅ Decrypts & Logs Context
```

---

## [Signing Broadcast Example](signing-broadcast-example.ts)

Illustrates how to sign FDC3 broadcasts using `BasicSignedBroadcaster` and verify them using `PublicSignatureCheckingHandlerSupport`. This covers a full cycle of signed context dissemination.

```mermaid
sequenceDiagram
    participant AFE as App A Front End (Broadcaster)
    participant ABE as App A Back End
    participant BFE as App B Front End (Listener)
    participant BBE as App B Back End

    Note over ABE: Starts Server & JWKS
    AFE->>ABE: Connect & Export Channel
    Note right of ABE: Creates BasicSignedBroadcaster
    
    Note over BFE: Sets up Listener wrapped with<br/>PublicSignatureCheckingHandlerSupport
    
    ABE->>ABE: sign(context)
    ABE->>AFE: broadcast(Signed Packed Context)
    AFE->>BFE: FDC3 Broadcast
    
    BFE->>BFE: verifySignature(via App A JWKS)
    Note over BFE: ✅ Verified Context Received
```

---

## [Signing Intent Example (Mutual Authentication)](signing-intent-example.ts)

A full end-to-end demonstration of mutual authentication in FDC3 intent flows. This composite example replaces previous partial samples to show a complete secure cycle: 
 - Raiser signs the request 
 - Handler verifies and signs the result 
 - Raiser verifies the result.

Potentially, users could modify this to do one-way authentication.

```mermaid
sequenceDiagram
    participant BFE as Raiser App Front End
    participant BBE as Raiser App Back End
    participant AFE as Handler App Front End
    participant ABE as Handler App Back End

    AFE->>ABE: Register Intent Handler
    Note right of ABE: Wraps Handler with SignatureCheckingHandlerSupport

    BFE->>BFE: raiseIntent(name, Context)
    activate BFE
    Note over BFE: Uses SignedRaiseIntentSupport
    BFE->>BBE: exchangeData('sign', Context)
    BBE-->>BFE: Signature & Anti-Replay Metadata
    BFE->>AFE: raiseIntent(name, Context, Metadata)
    deactivate BFE
    
    AFE->>ABE: Invoke Remote Handler
    Note right of ABE: verifySignature(Incoming Request)<br/>✅ Authenticated
    
    Note right of ABE: signs result with<br/>PrivateSignedIntentResultSupport
    ABE-->>AFE: Signed Response
    AFE-->>BFE: Intent Result (Signed Context)

    activate BFE
    BFE->>BFE: checks signature
    deactivate BFE    
    Note over BFE: ✅ Mutually Verified Result Returned
```
---

## [Get User Example](get-user-example.ts)

A detailed demonstration of the **`GetUser`** intent (`fdc3.security.userRequest` in, **`fdc3.contact`** out on the requesting side). The sample follows the same layout as other security samples: **(1)** start the IDP backend, **(2)** start the requesting-app backend, **(3)** IDP front-end connects and registers a **GetUser** intent listener on a mock desktop agent, **(4)** requesting-app front-end signs the user request, **raises** `GetUser`, then calls **`exchangeData('get-user-identity', …)`** so the JWT is verified only on the requesting backend and never reaches the browser-side code path shown here.

```mermaid
sequenceDiagram
    participant RFE as Requesting App Front End
    participant RBE as Requesting App Back End
    participant IDPFE as IDP Front End
    participant IDPBE as IDP Back End

    Note over IDPBE,RBE: Steps 1-2: start IDP backend and requesting-app backend (JWKS on each)

    Note over IDPFE,IDPBE: Step 3: IDP front-end binds GetUser to IDP backend and mock agent
    IDPFE->>IDPBE: connectRemoteHandlers + remoteIntentHandler(GetUser)
    Note over IDPFE: addIntentListener(GetUser) on mock IDP desktop agent

    Note over RFE,RBE: Step 4: requesting front-end
    RFE->>RBE: exchangeData(sign-context, userRequest as payload object)
    RBE-->>RFE: detached signature + antiReplay

    Note over RFE: mockRequesting.raiseIntent(GetUser, userRequest, metadata from sign)
    RFE->>IDPFE: intent delivered to GetUser listener (from step 3)
    IDPFE->>IDPBE: execute remote GetUser handler
    Note over IDPBE: PublicSignatureCheckingHandlerSupport<br/>verify signature + antiReplay (JWKS @ jku)<br/>createJWTToken, encrypt user for aud
    IDPBE-->>IDPFE: fdc3.security.encryptedContext
    IDPFE-->>RFE: intent result (encrypted context)

    RFE->>RBE: exchangeData(get-user-identity, GetUser result as payload object)
    Note over RBE: decrypt JWE (requesting private key)<br/>verifyJWT (IDP public keys)<br/>return fdc3.contact
    RBE-->>RFE: exchangeData response (context = fdc3.contact)

    Note over RFE: JWT verified only on RBE not shown in front-end payload
```
