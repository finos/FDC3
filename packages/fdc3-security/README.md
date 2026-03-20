# FDC3 Security

FDC3 Security provides standardized mechanisms for **signed context**, **encrypted private channels**, and **verified user identity** across FDC3-enabled applications.

This package implements the FDC3 Security specification, focusing on the separation of concerns between a low-trust frontend (e.g., a browser) and a high-trust backend where cryptographic keys are managed.

## Package Structure

The library is organized into specialized modules to handle different aspects of the FDC3 security ecosystem:

### `src/encryption`

Classes and utilities for end-to-end encryption over FDC3 channels.

- `EncryptedBroadcastSupport`: Wrappers for broadcasting encrypted context.
- `EncryptedContextListenerSupport`: Utilities for listening to and decrypting incoming encrypted context.

### `src/signing`

Supports the signing and verification of FDC3 messages (Broadcasts and Intents).

- `SignedBroadcastSupport`: Tools for signing outgoing broadcasts.
- `SignatureCheckingHandlerSupport`: Wrappers for context and intent handlers that automatically verify incoming signatures.
- `SignedIntentResultSupport`: Support for signing the results returned from FDC3 intents.
- `SignedRaiseIntentSupport`: Standardized mechanism for raising intents with a signed context.

### `src/delegates`

High-level abstractions for wrapping standard FDC3 objects.

- `MetadataHandler`: Manages the packing and unpacking of security metadata (signatures, anti-replay claims) into standard FDC3 contexts.

### `src/impl`

The core cryptographic implementations.

- `JosePrivateFDC3Security`: Implementation of private security operations (signing, decryption) using JSON Web Encryption (JWE) and JSON Web Signatures (JWS).
- `JosePublicFDC3Security`: Implementation of public security operations (verification, encryption) using the `jose` library.

### `src/secure-boundary`

Provides a secure bridge (typically over WebSockets) to allow a frontend application to delegate sensitive cryptographic operations to a trusted backend process without exposing private keys.

---

## Getting Started

To explore the capabilities of the library and see these components in action, please refer to the comprehensive set of examples in the `samples` directory.

### [Samples and Detailed Walkthroughs](./samples/README.md)

The samples directory contains a dedicated README with sequence diagrams illustrating how the different components interact across the secure boundary.

- **Signed Broadcasts**: Authenticate the sender of a context.
- **Encrypted Channels**: Protect message privacy from third parties and the Desktop Agent.
- **Mutual Intent Authentication**: Verify both the raiser and the responder of an FDC3 intent.
- **User Identity**: Securely request and verify identity JWTs from an IDP.

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

## License

Copyright 2024 FINOS. Distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
