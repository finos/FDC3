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

FDC3 Security addresses six key challenges:

1. **Shift to Web**: Web environments are more hostile than controlled desktop containers, requiring robust identity verification
2. **App Identity**: Applications need verifiable identities to establish trust
3. **User Authentication**: Users need portable identity across heterogeneous applications  
4. **Data Integrity**: Context data requires authenticity guarantees
5. **Scalable Trust**: Moving beyond bilateral trust relationships to circles of trust
6. **Compliance**: Meeting regulatory requirements for data protection and audit

The security framework introduces:

- **Digital Signatures** for proving data authenticity and app identity
- **Encrypted Channels** for private communications
- **JWT-based User Identity** for portable authentication
- **Circles of Trust** for scalable authorization

## App Identity and Signatures

### Signing Context Data

Applications can sign the context objects they broadcast using their private key. This allows receiving applications to verify:

1. **Origin**: Which application sent the data
2. **Integrity**: Whether the data was tampered with in transit

To enable signing, an application must:

1. Generate a public/private key pair
2. Publish the public key at an HTTPS endpoint as a [JSON Web Key Set (JWKS)](https://datatracker.ietf.org/doc/html/rfc7517)
3. Sign outgoing context objects with the private key

### Signature Metadata

When a context is signed, a `__signature` field is added to the context object:

```typescript
{
  // Original context fields...
  type: "fdc3.instrument",
  id: { ticker: "AAPL" },
  
  // Signature metadata
  __signature: {
    digest: "<base64-encoded signature>",
    publicKeyUrl: "https://myapp.example.com/.well-known/jwks.json",
    algorithm: {
      name: "ECDSA",
      hash: "SHA-512", 
      namedCurve: "P-521"
    },
    date: "2025-02-16T12:00:00Z"
  }
}
```

| Field | Description |
|-------|-------------|
| `digest` | The cryptographic signature of the context, encoded using the app's private key |
| `publicKeyUrl` | URL of the JWKS containing the public key for signature verification |
| `algorithm` | Cryptographic algorithm details (ECDSA with P-521 curve recommended) |
| `date` | Timestamp when the message was signed, used to prevent replay attacks |

### Authenticity Metadata

When a signed context is received, the FDC3 security layer verifies the signature and populates the `authenticity` field in [`ContextMetadata`](ref/Metadata#contextmetadata):

```typescript
{
  authenticity: {
    signed: true,           // A signature was present
    valid: true,            // The signature was verified successfully
    publicKeyUrl: "https://myapp.example.com/.well-known/jwks.json",
    trusted: true           // Both apps belong to the same circle of trust
  }
}
```

| Field | Description |
|-------|-------------|
| `signed` | `true` if the context included a valid signature |
| `valid` | `true` if the public key successfully verified the signature |
| `publicKeyUrl` | The URL of the JWKS used to verify the signature |
| `trusted` | `true` if both sending and receiving apps belong to the same circle of trust |

Applications receiving context can check these fields to make trust decisions:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript/JavaScript">

```ts
fdc3.addContextListener("fdc3.instrument", (context, metadata) => {
  if (metadata?.authenticity?.signed && metadata.authenticity.valid) {
    console.log(`Verified context from: ${metadata.authenticity.publicKeyUrl}`);
    
    if (metadata.authenticity.trusted) {
      // App is in our circle of trust - proceed with sensitive operations
      processVerifiedInstrument(context);
    } else {
      // App is verified but not in circle of trust - may require user confirmation
      promptUserForConfirmation(context, metadata.authenticity.publicKeyUrl);
    }
  } else {
    // Unsigned or invalid signature - handle accordingly
    console.warn("Received unsigned or invalid context");
  }
});
```

</TabItem>
</Tabs>

## Encrypted Communications

### Private Channel Encryption

Applications communicating over a [`PrivateChannel`](ref/PrivateChannel) can negotiate encryption to ensure their communications remain confidential. This is particularly important when sharing sensitive data such as positions, pricing, or user information.

### Symmetric Key Exchange

Encryption uses symmetric keys that are exchanged securely between channel participants. The exchange process uses the following context types:

#### Requesting a Key

To request a symmetric key for decryption, an application broadcasts an [`fdc3.security.symmetricKey.request`](../context/ref/SymmetricKeyRequest) context:

```typescript
{
  type: "fdc3.security.symmetricKey.request",
  id: {
    kid: "channel-key-abc123"  // Optional: request a specific key
  }
}
```

#### Providing a Key

The key owner responds with an [`fdc3.security.symmetricKey.response`](../context/ref/SymmetricKeyResponse) context:

```typescript
{
  type: "fdc3.security.symmetricKey.response",
  id: {
    kid: "channel-key-abc123",
    pki: "https://requestor.example.com/.well-known/jwks.json"
  },
  wrappedKey: "u4jvA7Gx8LdH...=="  // Symmetric key encrypted with requestor's public key
}
```

The `wrappedKey` is encrypted using the requesting application's public key (retrieved from the `pki` URL), ensuring only the intended recipient can decrypt and use the symmetric key.

### Encrypted Context

When context is broadcast on an encrypted channel, it is wrapped in an [`fdc3.security.encryptedContext`](../context/ref/EncryptedContext) type:

```typescript
{
  type: "fdc3.security.encryptedContext",
  originalType: "fdc3.instrument",  // Original type preserved for routing
  id: {
    kid: "channel-key-abc123"       // Key used for encryption
  },
  encryptedPayload: "eyJuYW1lIjoi..."  // Base64-encoded encrypted content
}
```

The `originalType` field is preserved to allow desktop agents and context handlers to route messages appropriately, while the actual content remains encrypted in `encryptedPayload`.

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

- Forward signature metadata (`__signature`) with context messages
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
