---
id: security
sidebar_label: Security & Identity
title: Security & Identity (next)
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info _[@experimental](../fdc3-compliance#experimental-features)_

Security and Identity features are experimental additions to FDC3. Limited aspects of their design may change in future.

:::

As FDC3 evolves from desktop containers to web-based implementations, new security challenges arise in open, decentralized environments. This specification defines mechanisms for **application identity verification**, **encrypted communications**, and **user identity sharing** across FDC3-enabled applications.

## Overview

FDC3 Security addresses the following key challenges:

1. **Shift to Web**: Web environments are more hostile than controlled desktop containers, requiring robust identity verification
2. **App Identity**: Applications need verifiable identities to establish trust
3. **User Authentication**: Users need portable identity across heterogeneous applications  
4. **Data Integrity**: Context data requires authenticity guarantees
5. **Scalable Trust**: Moving beyond bilateral trust relationships to circles of trust

The security framework introduces:

- **Digital Signatures** for proving data authenticity and app identity
- **Encrypted Channels** for private communications
- **JWT-based User Identity** for portable authentication

## Trust Boundaries

- why we have public / private parts of the API.  browsers are untrusted, servers are trusted.
- how to move data / intents / context between untrusted and trusted parts of the app.

(diagrams here)

### Public / Private Keys

-- JWKS Hosting at .well-known/jwks.json (?)
1. Generate a public/private key pair
2. Publish the public key at an HTTPS endpoint as a [JSON Web Key Set (JWKS)](https://datatracker.ietf.org/doc/html/rfc7517).  The URL on which the JWKS identifies the entity of the publisher. 

## Trust Model

- Apps decide who they trust and enforced app-to-app.
- Desktop agents are untrusted.
- Browsers are _untrusted_ by apps, to the extent that private keys won't be sent to app front-ends.

### Trust Function

Receiving apps provide an `allowListFunction(jku, iss?)` when configuring their security layer. This function determines whether a signer is trusted: given the signer's JWKS URL (`jku`) from the JWS header—and optionally the issuer (`iss`) for JWT verification—it returns `true` if the signer is in the receiver's circle of trust. When verifying a signature, the security layer sets `authenticity.trusted` to the result of this function, so apps can decide who they trust without bilateral configuration.


## App Identity and Signatures

### Signing Context Data

Applications can sign the context objects they broadcast using their private key. This allows receiving applications to verify:

1. **Origin**: Which application sent the data
2. **Integrity**: Whether the data was tampered with in transit

### Signature Metadata

When a context is signed, the signature is provided in metadata (via [`AppProvidableContextMetadata`](ref/Metadata#contextmetadata) on broadcast/raiseIntent, or [`ContextMetadata`](ref/Metadata#contextmetadata) when received), not on the context object itself.

| Context Metadata field | Description |
|------------------------|-------------|
| `signature` | The detached JWS (`protected` + `signature`) |
| `antiReplay` | Claims (`iat`, `exp`, `jti`) used for replay detection; must be included when signing |

### Example

```typescript
// When broadcasting or raising an intent, include signature and antiReplay in metadata
channel.broadcast(
  { type: "fdc3.instrument", id: { ticker: "AAPL" } },
  {
    signature: {
      protected: "<base64url-encoded JWS protected header>",  // contains alg, jku, kid, iat, exp, jti
      signature: "<base64url-encoded digital signature>"
    },
    antiReplay: { iat: 1739692800, exp: 1739696100, jti: "unique-token-id" }
  }
);
```
### Generating The Signature

To generate a signature, the signer:

1. Creates `antiReplay` claims: `iat` (current time), `exp` (iat + validity window), and `jti` (random UUID).
2. Canonicalizes `{ context, antiReplay }` and signs it with the private key using [JOSE](https://github.com/panva/jose) (or any [JWS](https://datatracker.ietf.org/doc/html/rfc7515)-compliant library). Use `CompactSign` to produce a compact JWS; the protected header includes `alg`, `jku`, `kid`, and `iat`.
3. Extracts the detached form: the compact JWS (`header.payload.signature`) yields `protected` (header) and `signature`—the payload is omitted since the signed data is the context itself. Returns `{ protected, signature }` plus `antiReplay` in metadata.

### Signature Structure

The `signature` is a detached [JSON Web Signature (JWS)](https://datatracker.ietf.org/doc/html/rfc7515). The `protected` header, when base64url-decoded, contains:

| Header field | Description |
|--------------|-------------|
| `alg` | Signature algorithm (e.g., `EdDSA`) |
| `jku` | URL of the JWKS containing the public key for verification |
| `kid` | Key identifier within the JWKS |
| `iat` | Issued-at time (Unix timestamp), prevents replay |
| `exp` | Expiration time (Unix timestamp) |
| `jti` | Unique token ID for replay protection |

### Checking the Signature

To verify a signature, the receiver:

1. Extracts `alg`, `jku`, `kid`, and `iat` from the JWS protected header.
2. Resolves the public key from the `jku` JWKS URL (via a resolver or [JOSE](https://github.com/panva/jose) remote JWKS).
3. Reconstitutes the full JWS: canonicalizes `{ context, antiReplay }`, base64url-encodes it as the payload, and forms `header.payload.signature`. Uses `compactVerify` (or equivalent) to verify the signature.
4. Validates freshness (`iat`), context expiry (`antiReplay.exp`), and anti-replay claims (`jti`).
5. Populates the `authenticity` object in context metadata.

### Authenticity Metadata

When a signed context is received, the FDC3 security layer verifies the signature and populates the `authenticity` field in [`ContextMetadata`](ref/Metadata#contextmetadata):

```typescript
{
  authenticity: {
    signed: true,           // A signature was present
    valid: true,            // The signature cryptographically verified
    jku: "https://myapp.example.com/.well-known/jwks.json",
    trusted: true           // allowListFunction(jku) returned true
  }
}
```

Applications receiving context can check these fields to make trust decisions:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
fdc3.addContextListener("fdc3.instrument", (context, metadata) => {
  const auth = metadata?.authenticity;

  if (!auth?.signed) {
    // No signature present - treat as untrusted
    console.warn("Received unsigned context");
    handleUntrustedContext(context);
  } else if (!auth.valid) {
    // Signature present but verification failed (tampered, stale, or bad key)
    console.warn("Signature verification failed", auth.errors);
    rejectContext(context);
  } else if (!auth.trusted) {
    console.warn(`Untrusted context from: ${auth.jku}`);
    promptUserForConfirmation(context, auth.jku);
  } else {   
    // this is trusted - continue without user intervention
    processVerifiedInstrument(context);
  }
});
```

</TabItem>
</Tabs>

## Encrypted Communications

### Private Channel Encryption

Applications communicating over a [`PrivateChannel`](ref/PrivateChannel) can negotiate encryption to ensure their communications remain confidential. This is particularly important when sharing sensitive data such as positions, pricing, or user information.

### Symmetric Key Exchange

Encryption uses a symmetric key (e.g. AES-GCM) created by the channel owner and distributed via [JWE](https://datatracker.ietf.org/doc/html/rfc7516). See [encrypted-private-channel-example.ts](pathname:///packages/fdc3-security/samples/encrypted-private-channel-example.ts) for a working flow.

**Key owner (broadcaster):** Creates and holds the symmetric key. Encrypts context payloads with it and broadcasts them as JWE in `encryptedPayload`. When a key request arrives, verifies the requestor's JWS (signature valid and `allowListFunction(jku)` returns true), reads `jku` from their JWS protected header, fetches their public key from that JWKS, wraps the symmetric key in a JWE using that public key (e.g. RSA-OAEP), signs the response with JWS, and broadcasts it.

**Key requestor (listener):** Broadcasts a signed key request (JWS). When the response arrives, verifies the JWS, unwraps the JWE with their private key to obtain the symmetric key, then decrypts subsequent encrypted payloads. If an encrypted message arrives before the key, the requestor sends a key request.

Both the key request and response **must be signed** (JWS). The key owner uses the requestor's `jku` from the JWS header to target the JWE—only that requestor's private key can unwrap it.

#### Context Types

| Type | Description |
|------|-------------|
| [`fdc3.security.symmetricKeyRequest`](../context/ref/security/SymmetricKeyRequest) | Request for the channel symmetric key (optional `id.kid`). Must be signed. |
| [`fdc3.security.symmetricKeyResponse`](../context/ref/security/SymmetricKeyResponse) | Response containing `wrappedKey` (JWE) and `id.{kid,pki}`. Must be signed. |
| [`fdc3.security.encryptedContext`](../context/ref/security/EncryptedContextWrapper) | Wrapper with `encryptedPayload` (JWE); `originalType` and `id.kid` preserved for routing. |

**Examples:**

```typescript
// fdc3.security.symmetricKeyRequest (broadcast with metadata—must be signed)
channel.broadcast(
  { type: "fdc3.security.symmetricKeyRequest", id: { kid: "channel-key-abc123" } },
  {
    signature: { protected: "eyJhbGc...", signature: "TjDgrB6k..." },
    antiReplay: { iat: 1739692800, exp: 1739696100, jti: "req-uuid-123" }
  }
);

// fdc3.security.symmetricKeyResponse (broadcast with metadata—must be signed)
channel.broadcast(
  {
    type: "fdc3.security.symmetricKeyResponse",
    id: { kid: "key-id-123", pki: "https://requestor.example.com/.well-known/jwks.json" },
    wrappedKey: "u4jvA7Gx8LdH...=="  // JWE
  },
  {
    signature: { protected: "eyJhbGc...", signature: "a1b2c3d4..." },
    antiReplay: { iat: 1739692810, exp: 1739696110, jti: "resp-uuid-456" }
  }
);

// fdc3.security.encryptedContext (broadcast with metadata; typically signed)
channel.broadcast(
  {
    type: "fdc3.security.encryptedContext",
    originalType: "fdc3.instrument",
    id: { kid: "channel-key-abc123" },
    encryptedPayload: "eyJuYW1lIjoiQXBwbGUiLCJpZCI6eyJ0aWNrZXIiOiJBQVBMIn19..."  // JWE
  },
  {
    signature: { protected: "eyJhbGc...", signature: "e5f6g7h8..." },
    antiReplay: { iat: 1739692820, exp: 1739696120, jti: "ctx-uuid-789" }
  }
);
```



## User Identity

### The User Context Type

The [`fdc3.user`](../context/ref/User) context type represents a verified user identity:

```typescript
{
  type: "fdc3.user",
  name: "John Doe",
  id: {
    email: "john.doe@example.com"
  },
  jwt: "eyJhbGciOiJFZERTQSIsImprdSI6Imh0dHBzOi8vaWRwLmV4YW1wbGUuY29tLy53ZWxsLWtub3duL2p3a3MuanNvbiIsImtpZCI6ImtleS0xIn0..."
}
```

| Field | Description |
|-------|-------------|
| `name` | Human-readable name of the user |
| `id.email` | Email address as a unique identifier (must match JWT `sub` claim) |
| `jwt` | JSON Web Token asserting user identity and permissions |

### JWT Token Structure

The `jwt` field contains a signed JSON Web Token with the following structure:

**Header:**
```json
{
  "alg": "EdDSA",
  "jku": "https://idp.example.com/.well-known/jwks.json",
  "kid": "key-1"
}
```

**Payload:**
```json
{
  "iss": "https://idp.example.com",
  "sub": "john.doe@example.com",
  "aud": "https://requesting-app.example.com",
  "exp": 1739750400,
  "iat": 1739746800,
  "jti": "unique-token-id-123"
}
```

| Claim | Description |
|-------|-------------|
| `iss` | Issuer - the identity provider that created the token |
| `sub` | Subject - the user's unique identifier |
| `aud` | Audience - the specific application this token was issued for |
| `exp` | Expiration time (Unix timestamp) |
| `iat` | Issued at time (Unix timestamp) |
| `jti` | JWT ID - unique identifier for this token |

The token is scoped to a specific application (`aud`) to prevent token reuse if leaked.

### Requesting User Identity

Applications request user identity by raising the `CreateIdentityToken` intent with an [`fdc3.user.request`](../context/ref/UserRequest) context:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
const userRequest = {
  type: "fdc3.user.request",
  aud: "https://my-app.example.com",
  jku: "https://my-app.example.com/.well-known/jwks.json"
};

const resolution = await fdc3.raiseIntent("CreateIdentityToken", userRequest);
const result = await resolution.getResult();

if (result && result.type === "fdc3.user") {
  const user = result;
  console.log(`Authenticated user: ${user.name}`);
  // Verify and use the JWT token
  await verifyAndProcessUser(user);
}
```

</TabItem>
</Tabs>

The `fdc3.user.request` context includes:

| Field | Description |
|-------|-------------|
| `aud` | The audience claim for the returned JWT - typically the requesting app's URL |
| `jku` | URL to the requesting app's JWKS, used by the IDP to encrypt the response |

### Identity Provider (IDP) Role

Applications acting as Identity Providers handle `CreateIdentityToken` intents:

1. Receive the `fdc3.user.request` context with the requestor's `aud` and `jku`
2. Verify the requesting application is trusted (via signature verification and circle of trust)
3. Create a JWT scoped to the requesting application
4. Return the `fdc3.user` context, optionally encrypted for the requestor

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
fdc3.addIntentListener("CreateIdentityToken", async (context, metadata) => {
  if (context.type !== "fdc3.user.request") {
    throw new Error("Invalid context type");
  }
  
  // Verify the requesting app is trusted
  if (!metadata?.authenticity?.trusted) {
    throw new Error("Requesting app is not trusted");
  }
  
  // Create a JWT for the authenticated user, scoped to the requesting app
  const jwt = await createJwtForUser(
    currentUser,
    context.aud,  // Audience: the requesting app
    context.jku   // Requestor's public key for encryption
  );
  
  return {
    type: "fdc3.user",
    name: currentUser.name,
    id: { email: currentUser.email },
    jwt: jwt
  };
});
```

</TabItem>
</Tabs>

## Trust Levels

FDC3 Security introduces trust levels for both applications and users:

### Application Trust Levels

| Level | State | Description |
|-------|-------|-------------|
| Unknown | - | No identity information available |
| Known | Authenticated | Identity verified via signature and public key |
| Trusted | Authorized | Member of a shared circle of trust |

### User Trust Levels

| Level | State | Description |
|-------|-------|-------------|
| Unknown | - | User not authenticated |
| Known | Authenticated | User verified via JWT from an IDP |
| Trusted | Authorized | User authorized for specific operations |

Applications should use these trust levels to make access control decisions:

```ts
function canPerformOperation(operation: string, metadata: ContextMetadata): boolean {
  const appTrusted = metadata?.authenticity?.trusted ?? false;
  const userKnown = metadata?.user?.jwt != null;
  
  switch (operation) {
    case "ViewNews":
      return true;  // No trust required
    case "ViewPrice":
      return appTrusted;  // Requires app trust
    case "CreateOrder":
      return appTrusted && userKnown;  // Requires both app and user trust
    default:
      return false;
  }
}
```

## Circles of Trust

### Concept

A **Circle of Trust** is a group of applications that mutually recognize each other as trusted. This enables:

1. **Scalable Trust**: Apps don't need bilateral relationships with every other app
2. **Third-Party Verification**: A trusted authority (e.g., FINOS) can certify app membership
3. **Simplified Authorization**: Trust decisions based on circle membership rather than individual app verification

### How It Works

1. Applications join a circle of trust by obtaining a certificate from the circle administrator
2. When communicating, apps include their certificate proving circle membership
3. Receiving apps verify the certificate against the circle's root certificate
4. If both apps are members of the same circle, the `authenticity.trusted` field is set to `true`

### FINOS Circle of Trust

FINOS may operate a circle of trust for conformant FDC3 applications. Membership requires:

1. Passing FDC3 conformance tests
2. Meeting security requirements for key management
3. Agreeing to circle policies for data handling

Applications in the FINOS circle can trust each other without establishing direct bilateral relationships.

## Implementation Requirements

### Desktop Agent Requirements

Desktop Agents implementing security features **MUST**:

- Forward signature metadata with context messages (signature and antiReplay in metadata)
- Populate authenticity metadata when signature verification is performed
- Support the `CreateIdentityToken` intent for user identity workflows
- Handle encrypted context types appropriately

Desktop Agents implementing security features **SHOULD**:

- Provide APIs for applications to sign outgoing context
- Cache public keys from JWKS endpoints to improve performance
- Support configuration of trusted circles

### Application Requirements

Applications implementing security features **MUST**:

- Publish public keys at a stable HTTPS endpoint using JWKS format
- Use strong cryptographic algorithms (ECDSA with P-521 recommended)
- Validate signatures before trusting context data
- Scope JWT tokens to specific audiences

Applications implementing security features **SHOULD**:

- Implement key rotation with overlapping validity periods
- Log authentication and authorization decisions for audit
- Handle unsigned contexts gracefully with appropriate user prompts

## Security Considerations

### Key Management

- Private keys MUST be stored securely and never transmitted
- JWKS endpoints MUST be served over HTTPS with valid certificates
- Key rotation SHOULD be performed periodically
- Old keys SHOULD remain available for verification during transition periods

### Token Security

- JWT tokens are scoped to specific audiences to prevent misuse if leaked
- Short expiration times reduce the window for token theft attacks
- Tokens SHOULD be transmitted over encrypted channels when possible

### Replay Attacks

- Signatures include timestamps to enable replay detection
- Applications SHOULD reject contexts with timestamps outside an acceptable window
- JWTs include unique identifiers (`jti`) to enable single-use enforcement

## Context Types

The following context types support security features:

| Context Type | Description |
|-------------|-------------|
| [`fdc3.user`](../context/ref/User) | User identity with JWT |
| [`fdc3.user.request`](../context/ref/UserRequest) | Request for user identity |
| [`fdc3.security.symmetricKey.request`](../context/ref/SymmetricKeyRequest) | Request for encryption key |
| [`fdc3.security.symmetricKey.response`](../context/ref/SymmetricKeyResponse) | Encryption key response |
| [`fdc3.security.encryptedContext`](../context/ref/EncryptedContext) | Encrypted context wrapper |

## Intents

| Intent | Input Context | Output Context | Description |
|--------|---------------|----------------|-------------|
| `CreateIdentityToken` | `fdc3.user.request` | `fdc3.user` | Request user identity from an IDP |
