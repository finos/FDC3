# FDC3 Security

FDC3 Security provides standardized mechanisms for **signed context**, **encrypted private channels**, and **verified user identity** across FDC3-enabled applications.

This package implements the [@experimental](https://fdc3.finos.org/docs/next/fdc3-compliance#experimental-features) [FDC3 Security & Identity specification](https://fdc3.finos.org/docs/next/api/security), focusing on the separation of concerns between a low-trust frontend (e.g., a browser) and a high-trust backend where cryptographic private keys are managed. See the specification for the full conceptual model, use cases, and key management requirements.

## Core Concepts

### Trusted Backend Contract

All cryptographic operations that involve a private key — signing outbound context, generating symmetric encryption keys, unwrapping received JWE-wrapped keys — MUST be performed in a trusted backend (server), not in the browser frontend. This package provides `FDC3Handlers`, a TypeScript interface defining the contract between a frontend and its backend, together with `ClientSideHandlersImpl` and `ServerSideHandlersImpl` to implement that contract over a WebSocket.

### ContextVerificationMetadata

Verification results are never placed on `ContextMetadata` (the wire type forwarded by the Desktop Agent). Instead, when a receiving application calls its security implementation's verification function with the received `ContextMetadata`, it gets back a `ContextVerificationMetadata` object containing:

- `authenticity` — the result of signature verification (`signed`, `valid`, `trusted`, `jku`, `kid`, `alg`, `errors`)
- `encryption` — the result of decryption (`'decrypted'` | `'cant_decrypt'` | `'not_encrypted'`)

`ContextVerificationMetadata` is exported from `@finos/fdc3-security` and is also the type used by `SecurityAwareContextHandler` and `SecurityAwareIntentHandler`.

### SecurityAwareContextHandler / SecurityAwareIntentHandler

When wrapping a context or intent handler with `SignatureCheckingHandlerSupport`, you must provide a handler with a three-argument signature rather than the standard two-argument `ContextHandler` / `IntentHandler`:

```typescript
// Standard FDC3 handler
(context: Context, metadata: ContextMetadata | undefined) => void

// Security-aware handler — receives verification result as third argument
(context: Context, metadata: ContextMetadata | undefined, verification: ContextVerificationMetadata) => void
```

This keeps `ContextMetadata` clean as a wire type while making the verification result conveniently available to handler logic.

---

## Package Structure

### `src/impl`

The core cryptographic interfaces and implementations.

- `PublicFDC3Security`: Interface for public-key operations — signature verification, JWT verification, symmetric key creation and encryption, key wrapping and unwrapping. Used by frontend or backend components that do not hold private keys.
- `PrivateFDC3Security`: Extends `PublicFDC3Security` with private-key operations — signing context, creating user identity JWTs, and decrypting asymmetrically encrypted payloads. Implementations MUST run in a trusted backend.
- `JosePublicFDC3Security`: Implementation of `PublicFDC3Security` using the [`jose`](https://github.com/panva/jose) library (JWS/JWE).
- `JosePrivateFDC3Security`: Extends `JosePublicFDC3Security` with private-key operations.
- `AntiReplayChecker`: Interface and `DefaultAntiReplayChecker` implementation for tracking seen `jti` values to prevent replay attacks. In production, back with a shared cache (e.g. Redis) rather than the in-memory default.
- `ContextVerificationMetadata`: The outcome of verifying a signed or encrypted context — populated locally by the security library, never sent on the wire. Contains `authenticity` (signature check result) and `encryption` (decryption status). This type is defined here rather than in `@finos/fdc3-standard` because it is a library-computed result, not part of the FDC3 wire protocol.
- `FDC3UserClaims`: TypeScript interface for the JWT payload returned by a `GetUser` intent (`iss`, `sub`, `aud`, `exp`, `iat`, `jti`).
- `FDC3SecurityAlgorithms`: Configuration record for the cryptographic algorithms used (signing, key wrapping, content encryption). Defaults to `EdDSA` / `RSA-OAEP-256` / `A256GCM`.
- `FDC3SecurityTimeLimits`: Configuration for signature freshness and context expiry windows.

### `src/signing`

Supports the signing and verification of FDC3 messages (broadcasts and intents).

- `SignedBroadcastSupport` / `BasicSignedBroadcaster`: Signs outgoing broadcasts using a `PrivateFDC3Security` instance running on the backend.
- `SignatureCheckingHandlerSupport` / `BasicSignatureCheckingHandlerSupport`: Wraps a `SecurityAwareContextHandler` or `SecurityAwareIntentHandler` so that incoming signatures are verified before the handler is called. The `ContextVerificationMetadata` result is passed as the third argument to the handler.
- `SecurityAwareContextHandler` / `SecurityAwareIntentHandler`: Handler types that receive `ContextVerificationMetadata` as a third argument alongside the standard `Context` and `ContextMetadata`.
- `SignedIntentResultSupport`: Signs context returned as an intent result.
- `SignedRaiseIntentSupport` / `BasicSignedRaiseIntentSupport`: Raises intents with a signed context and optionally verifies the signature on the returned result. Returns a `VerifiedIntentResolution` whose `getVerification()` method provides the `ContextVerificationMetadata` for the context result, without storing it in `ContextMetadata`.

### `src/encryption`

Classes and utilities for end-to-end encryption over FDC3 channels.

- `EncryptedBroadcastSupport`: Encrypts outgoing context with a symmetric key and broadcasts it as `fdc3.security.encryptedContext`. Also sets up a listener for incoming `fdc3.security.symmetricKeyRequest` messages to deliver the wrapped key to authorized requestors.
- `EncryptedContextListenerSupport`: Listens for `fdc3.security.encryptedContext` broadcasts, negotiates the symmetric key with the broadcaster via `fdc3.security.symmetricKeyRequest` / `fdc3.security.symmetricKeyResponse`, and decrypts the payload. The handler receives a `ContextVerificationMetadata` third argument (as a `SecurityAwareContextHandler`) with `encryption: 'decrypted'` on success.

### `src/delegates`

High-level abstractions for managing metadata alongside FDC3 contexts.

- `MetadataHandler`: Manages packing and unpacking of app-provided metadata (`signature`, `antiReplay`, `traceId`) into and out of FDC3 contexts. Supports both FDC3 3.0+ (where metadata is a first-class `broadcast` parameter) and earlier versions (where it is embedded in the context object under `__appMeta`).

### `src/secure-boundary`

Provides a secure bridge — typically over WebSockets — allowing a frontend application to delegate sensitive cryptographic operations to a trusted backend without exposing private keys in the browser.

- `FDC3Handlers`: The interface your trusted backend implements. Defines three methods: `handleRemoteChannel` (mirror a channel to the backend for signing/encrypting broadcasts), `remoteIntentHandler` (register an intent handler that runs on the backend), and `exchangeData` (a general-purpose RPC for operations such as signing a context or unwrapping a symmetric key).
- `BackendIntentHandler`: The handler type returned by `remoteIntentHandler`. Like the standard FDC3 `IntentHandler` but with the return type widened to include `PrivateChannelSignal`, so backend implementations can signal the frontend to create a `PrivateChannel` without unsafe casts.
- `PrivateChannelSignal` / `PRIVATE_CHANNEL_SIGNAL`: A sentinel type and constant (`{ type: 'private' }`) that a `BackendIntentHandler` returns to signal the frontend to call `createPrivateChannel()` and export it to the backend via `handleRemoteChannel`. This is a secure-boundary-internal protocol token — it is never transmitted over FDC3 or seen by the Desktop Agent.
- `DefaultFDC3Handlers`: A base class implementing `FDC3Handlers` with no-op defaults, intended to be subclassed.
- `ClientSideHandlersImpl` / `connectRemoteHandlers`: Client-side stub that implements `FDC3Handlers` by forwarding calls to the backend over a WebSocket.
- `ServerSideHandlersImpl` / `setupWebsocketServer`: Server-side adapter that receives WebSocket messages and dispatches them to your `FDC3Handlers` implementation.

---

## Getting Started

To explore the capabilities of the library and see these components in action, refer to the examples in the `samples` directory.

### [Samples and Detailed Walkthroughs](./samples/README.md)

The samples directory contains a dedicated README with sequence diagrams illustrating how the different components interact across the secure boundary.

- **Signed Broadcasts**: Authenticate the sender of a context message.
- **Encrypted Channels**: Protect message privacy from the Desktop Agent and other observers. Two patterns are provided: backend key (stricter data boundary, decrypted plaintext never in browser) and frontend key (lower latency, symmetric key returned to browser after one-time unwrap on backend).
- **Mutual Intent Authentication**: Verify both the raiser and the responder of an FDC3 intent.
- **User Identity**: Securely request and verify identity tokens from an identity provider app via the `GetUser` intent.

---

## Installation and Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run unit and integration tests
npm run test
```
