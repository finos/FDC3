# FDC3 Security Samples

This directory contains examples demonstrating how to use the FDC3 Security features for context encryption, signing, and user identification.

Each example is a standalone TypeScript file that can be executed directly using `tsx` from the package root. The desktop agent is mocked in each sample to illustrate the information flows between applications and their secure backends.

## Running the Examples

From the `packages/fdc3-security` directory:

```bash
# Run the Mutually Authenticated Intent example
npx tsx samples/signing-intent-example.ts

# Run the Signing Broadcast example
npx tsx samples/signing-broadcast-example.ts

# Run the Backend Encrypted Channel example
npx tsx samples/backend-encrypted-channel-example.ts

# Run the Frontend Encrypted Channel example
npx tsx samples/frontend-encrypted-channel-example.ts

# Run the Get User example
npx tsx samples/get-user-example.ts
```

---

## [Backend Encrypted Channel Example](backend-encrypted-channel-example.ts)

Demonstrates the **backend key** pattern: the symmetric key is created and held entirely on the broadcasting app's backend, and all message decryption happens on the receiving app's backend. Neither the key nor the decrypted plaintext ever enters the browser. Every received message incurs a backend round-trip for decryption, which largely offsets the latency advantage of symmetric encryption, but this is the correct choice when the threat model requires that decrypted plaintext never exists in browser memory — for example, when handling highly regulated data or when the browser environment itself is not considered trusted.

```mermaid
sequenceDiagram
    box Broadcasting App
        participant BBE as Back End
        participant BFE as Front End
    end
    box Receiving App
        participant RFE as Front End
        participant RBE as Back End
    end

    Note over BBE: Starts Server & JWKS
    Note over RBE: Starts Server & JWKS

    Note over BFE: UI loaded in browser
    BFE->>BBE: Connect (WebSocket)
    
    Note over RFE: UI loaded in browser
    RFE->>RBE: Connect (WebSocket)
    
    BFE->>BBE: remoteIntentHandler(ShareEncryptedChannel)
    BBE->>BFE: returns intent handler
    BFE-->>BFE: addIntentListener(ShareEncryptedChannel)

    RFE-->>BFE: raiseIntent(ShareEncryptedChannel) ···via DA···
    Note right of BFE: Intent handler returns { type: 'private' }<br/>FDC3 client creates PrivateChannel
    BFE->>BBE: handleRemoteChannel(ShareEncryptedChannel, channel)
    Note right of BBE: Wraps channel with EncryptedBroadcastSupport<br/>Creates symmetric key (K)<br/>Listens for symmetricKeyRequest
    BFE-->>RFE: return PrivateChannel as IntentResult ···via DA···

    RFE->>RBE: handleRemoteChannel(listen, channel)
    Note right of RBE: Sets up PrivateEncryptedContextListenerSupport

    BBE->>BBE: Encrypt context with K, sign (JWS)
    BBE->>BFE: send fdc3.security.encryptedContext
    BFE-->>RFE: broadcast(fdc3.security.encryptedContext) ···via DA···
    RFE->>RBE: forward fdc3.security.encryptedContext
    Note right of RBE: No key yet<br/>Encrypted context is buffered<br/>Create and sign symmetricKeyRequest

    RBE->>RFE: forward fdc3.security.symmetricKeyRequest (signed)
    RFE-->>BFE: broadcast(fdc3.security.symmetricKeyRequest) ···via DA···
    BFE->>BBE: forward fdc3.security.symmetricKeyRequest
    Note right of BBE: Verifies request JWS<br/>Wraps K with Receiving App public key (JWE)<br/>Signs response
    BBE->>BFE: send signed fdc3.security.symmetricKeyResponse
    BFE-->>RFE: broadcast(fdc3.security.symmetricKeyResponse) ···via DA···
    RFE->>RBE: forward fdc3.security.symmetricKeyResponse
    Note right of RBE: Verifies response JWS<br/>Unwraps K with private key<br/>Decrypts buffered context

    Note right of RBE: ✅ Decrypted context logged<br/>verification.encryption === 'decrypted'
```

---

## [Frontend Encrypted Channel Example](frontend-encrypted-channel-example.ts)

Demonstrates the **frontend key** pattern: the symmetric key is unwrapped once on the receiving app's backend (the only operation requiring the private key), then returned to the frontend for low-latency per-message decryption in the browser. This mirrors the TLS model most closely — pay the asymmetric cost once, then use the cheap symmetric cipher for the stream. Use this pattern when the browser is a sufficiently trusted environment for a short-lived session key and message throughput or latency matters.

```mermaid
sequenceDiagram
    box Broadcasting App
        participant BBE as Back End
        participant BFE as Front End
    end
    box Receiving App
        participant RFE as Front End
        participant RBE as Back End
    end

    Note over BBE: Starts Server & JWKS
    Note over RBE: Starts Server & JWKS

    Note over BFE: UI loaded in browser
    BFE->>BBE: Connect (WebSocket)
    BFE-->>BFE: createPrivateChannel()<br/>Sets up EncryptedBroadcastSupport<br/>Creates symmetric key K on front end
    BFE-->>BFE: addIntentListener(ShareEncryptedChannel)

    Note over RFE: UI loaded in browser
    RFE->>RBE: Connect (WebSocket)
    RFE-->>BFE: raiseIntent(ShareEncryptedChannel) ···via DA···
    Note right of BFE: Intent handler returns channel
    BFE-->>RFE: return PrivateChannel as IntentResult ···via DA···

    Note over RFE: Sets up PublicEncryptedContextListenerSupport<br/>signingFunction → calls RBE<br/>unwrapFunction → calls RBE

    BFE->>BFE: Encrypt context with K (JWS)
    BFE-->>RFE: broadcast(fdc3.security.encryptedContext) ···via DA···
    RFE->>RBE: forward fdc3.security.encryptedContext
    Note right of RBE: No key yet<br/>Encrypted context is buffered<br/>Create and sign symmetricKeyRequest

    RBE->>RFE: forward fdc3.security.symmetricKeyRequest (signed)
    RFE-->>BFE: broadcast(fdc3.security.symmetricKeyRequest) ···via DA···
    Note right of BFE: Wraps K for Receiving App (JWE)<br/>Signs response
    BFE-->>RFE: broadcast(fdc3.security.symmetricKeyResponse) ···via DA···

    RFE->>RBE: exchangeData('sign-context', symmetricKeyRequest context)
    RBE->>RFE: DetachedSignature + AntiReplayClaims
    RFE->>RBE: exchangeData('unwrap-symmetric-key', symmetricKeyResponse)
    RBE->>RFE: unwrapped symmetric key K

    Note over RFE: Decrypts buffered context with K
    Note over RFE: ✅ Decrypted context logged<br/>(verification.encryption === 'decrypted')
```

---

## [Signing Broadcast Example](signing-broadcast-example.ts)

Illustrates how to sign FDC3 broadcasts using `BasicSignedBroadcaster` (running on the sender's backend) and verify them using `PublicSignatureCheckingHandlerSupport` (running on the receiver's frontend). The handler is wrapped using a `SecurityAwareContextHandler`, which receives a `ContextVerificationMetadata` object as its third argument rather than reading verification results from `ContextMetadata` directly.

```mermaid
sequenceDiagram
    box App A (Broadcaster)
        participant ABE as Back End
        participant AFE as Front End
    end
    box App B (Listener)
        participant BFE as Front End
        participant BBE as Back End
    end

    Note over ABE: Starts Server & JWKS
    Note over BBE: Starts Server & JWKS

    Note over AFE: UI loaded in browser
    AFE->>ABE: Connect (WebSocket)
    AFE-->>AFE: getOrCreateChannel('fdc3.channel.1')
    AFE->>ABE: handleRemoteChannel('broadcast', channel)
    Note right of ABE: Wraps channel with BasicSignedBroadcaster

    Note over BFE: UI loaded in browser
    BFE-->>BFE: getOrCreateChannel('fdc3.channel.1')
    Note over BFE: Wraps handler with PublicSignatureCheckingHandlerSupport<br/>(SecurityAwareContextHandler receives ContextVerificationMetadata)
    BFE-->>BFE: addContextListener('fdc3.instrument', wrapped handler)

    ABE->>ABE: sign(context) → DetachedSignature + AntiReplayClaims
    ABE->>AFE: send fdc3.instrument (context + metadata)
    AFE-->>BFE: broadcast(fdc3.instrument) ···via DA···

    Note over BFE: PublicSignatureCheckingHandlerSupport verifies signature<br/>fetches App A JWKS from jku in signature header
    Note over BFE: Handler called with (context, metadata, verification)<br/>verification.authenticity.trusted === true
    Note over BFE: ✅ Verified context received
```

---

## [Signing Intent Example (Mutual Authentication)](signing-intent-example.ts)

A full end-to-end demonstration of mutual authentication in FDC3 intent flows. The raiser signs its request context (via its backend), the handler verifies the request and signs its response (via its backend), and the raiser verifies the response. Both sides use `SecurityAwareIntentHandler` so that `ContextVerificationMetadata` is available in the handler without polluting `ContextMetadata`.

One-way authentication (raiser only, or handler only) can be achieved by removing either the signing or the verification half.

```mermaid
sequenceDiagram
    box Handler App
        participant HBE as Back End
        participant HFE as Front End
    end
    box Raiser App
        participant RFE as Front End
        participant RBE as Back End
    end

    Note over HBE: Starts Server & JWKS
    Note over RBE: Starts Server & JWKS

    Note over HFE: UI loaded in browser
    HFE->>HBE: Connect (WebSocket)
    HFE->>HBE: remoteIntentHandler(DataTransfer)
    Note right of HBE: Wraps handler with SignatureCheckingHandlerSupport<br/>(SecurityAwareIntentHandler)
    HFE-->>HFE: addIntentListener(DataTransfer, wrappedHandler)

    Note over RFE: UI loaded in browser
    RFE->>RBE: Connect (WebSocket)
    RFE->>RBE: exchangeData('sign-context', requestContext)
    RBE->>RFE: DetachedSignature + AntiReplayClaims

    RFE-->>HFE: raiseIntent(DataTransfer, context, metadata) ···via DA···
    HFE->>HBE: forward to remote handler

    Note right of HBE: verifySignature → ContextVerificationMetadata<br/>verification.authenticity.trusted === true ✅
    HBE->>HBE: sign(responseContext) via PrivateSignedIntentResultSupport
    HBE->>HFE: send ContextWithMetadata (signed response)
    HFE-->>RFE: intent result ···via DA···

    RFE-->>RFE: resolution.getResult()
    RFE->>HBE: fetch Handler App JWKS (HTTPS)
    HBE->>RFE: JWKS
    Note right of RFE: verificationFunction verifies response signature
    Note over RFE: ContextVerificationMetadata available via<br/>resolution.getVerification()
    Note over RFE: ✅ Mutually verified result returned
```

---

## [Get User Example](get-user-example.ts)

Demonstrates raising the **`GetUser`** intent with a signed `fdc3.security.userRequest` context to an identity provider app. The identity provider app verifies the requesting application's signature, mints a signed JWT scoped to the requesting application's audience, and returns it encrypted with the requesting application's public key. The requesting application's backend decrypts the payload and verifies the JWT before projecting the identity into a standard `fdc3.contact` context — keeping the raw JWT off the frontend entirely.

```mermaid
sequenceDiagram
    box Identity Provider App
        participant IDPBE as Back End
        participant IDPFE as Front End
    end
    box Requesting App
        participant RFE as Front End
        participant RBE as Back End
    end

    Note over IDPBE: Starts Server & JWKS
    Note over RBE: Starts Server & JWKS

    Note over IDPFE: UI loaded in browser
    IDPFE->>IDPBE: Connect (WebSocket)
    IDPFE->>IDPBE: remoteIntentHandler(GetUser)
    Note right of IDPBE: Wraps handler with SignatureCheckingHandlerSupport
    IDPFE-->>IDPFE: addIntentListener(GetUser, wrappedHandler)

    Note over RFE: UI loaded in browser
    RFE->>RBE: Connect (WebSocket)
    RFE->>RBE: exchangeData('sign-context', userRequest)
    RBE->>RFE: DetachedSignature + AntiReplayClaims

    RFE-->>IDPFE: raiseIntent(GetUser, userRequest, metadata) ···via DA···
    IDPFE->>IDPBE: forward to remote handler

    Note right of IDPBE: Verifies requesting app signature ✅<br/>Creates JWT (sub, aud = requesting app URL)<br/>Encrypts fdc3.security.user with<br/>requesting app's public key (JWE)<br/>Returns as fdc3.security.encryptedContext

    IDPBE->>IDPFE: send fdc3.security.encryptedContext
    IDPFE-->>RFE: intent result ···via DA···

    RFE->>RBE: exchangeData('get-user-identity', encryptedContext)
    Note right of RBE: Decrypts JWE with private key<br/>Extracts JWT from fdc3.security.user<br/>Verifies JWT signature (identity provider JWKS)<br/>Projects to fdc3.contact
    RBE->>RFE: fdc3.contact (email from verified JWT sub)

    Note over RFE: ✅ Requesting app has verified fdc3.contact<br/>JWT never reaches the frontend
```
