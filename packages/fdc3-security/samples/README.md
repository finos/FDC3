# FDC3 Security Samples

This directory contains examples demonstrating how to use the FDC3 Security features for context encryption, signing, and user identification.

## Contents

- **[Backend Encrypted Channel Example](backend-encrypted-channel-example.ts)**: Demonstrates how to use `EncryptedBroadcastSupport` and `PrivateEncryptedContextListenerSupport` on the backend. This example shows encryption and decryption being handled entirely by a backend process, with the frontend only acting as a transport for FDC3 channels.
- **[Frontend Encrypted Channel Example](frontend-encrypted-channel-example.ts)**: Shows how to use `EncryptedBroadcastSupport` and `PublicEncryptedContextListenerSupport` for frontend-driven encryption. In this scenario, encryption and decryption occur on the frontend, with key unwrapping and signing being delegated to a secure backend.
- **[Get User Example](get-user-example.ts)**: A comprehensive demonstration of requesting and verifying user identity from an Identity Provider (IDP). It uses encrypted contexts and JSON Web Tokens (JWT) to securely share user details between applications.
- **[Signing Broadcast Example](signing-broadcast-example.ts)**: Illustrates how to sign and verify FDC3 broadcasts using the `SigningChannelDelegate`. This example covers the entire flow, including backend-based signing and frontend-based verification of broadcasted instrument data.
- **[Signing Intent Example](signing-intent-example.ts)**: (Placeholder) An upcoming example for signing FDC3 intents.

## Running the Examples

Each example is a standalone TypeScript file that can be executed directly using `tsx` from the package root.  The desktop agent is mocked in each sample so that you can more clearly see the information flows.

```bash
# Example: Run the Backend Encrypted Channel example
npx tsx samples/backend-encrypted-channel-example.ts
```

---
