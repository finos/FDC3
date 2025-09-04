



## The Demo

This demo illustrates the FDC3 Security Interop flow across three main phases: user authentication, secure channel negotiation, and encrypted data exchange.

```mermaid
sequenceDiagram
    participant U as User
    participant A1F as App1 Frontend
    participant A1B as App1 Backend
    participant IDF as IDP Frontend
    participant IDB as IDP Backend
    participant A2F as App2 Frontend
    participant A2B as App2 Backend

    Note over U, A2B: 1. Login Phase
    U->>IDF: User login via OAuth
    IDF->>IDB: fdc3.user credentials
    Note over IDB: User credentials stored in session
    
    A1F->>IDF: Raise intent: GetUser
    Note over A1F, IDF: { type: "fdc3.user.request", aud: https://app1, jki: https://app1/.well-known/jwks.json }
    IDF->>IDB: Handle intent request
    IDB->>IDB: Authentication & Authorization
    IDB->>IDF: Returns signed fdc3.user context
    IDF->>A1F: Intent resolution
    Note over IDF, A1F: { type: "fdc3.user", __signature: <by idp>, __encrypted: xxx }
    Note over IDF, A1F: JWT token scoped to App1, encrypted with App1's public key to avoid PII exposure
    
    A1F->>A1B: Pass encrypted fdc3.user
    A1B->>A1B: Decrypt, validate, authorize

    Note over U, A2B: 2. Negotiating A Channel
    A1F->>A1B: Signing request for prices
    A1B->>A1B: Authentication & Authorization
    A1B->>A1F: Returns signed context
    
    A1F->>A2F: Raise intent: demo.GetPrices
    Note over A1F, A2F: { type: "fdc3.instrument", __signature: <by app1>, __jwt: xxx }
    A2F->>A2B: Relay request
    A2B->>A2B: Authentication & Authorization
    A2B->>A2B: Create symmetric key for channel
    A2B->>A2B: Wrap symmetric key in App1 public key
    A2B->>A2F: Approve, return wrapped key
    A2F->>A1F: Return private channel
    A2F->>A1F: Send wrapped key
    Note over A2F, A1F: { type: "fdc3.security.symmetricKey.response", wrappedKey: xxx }
    
    A1F->>A1B: Send key for decryption with App1 private key
    A1B->>A1B: Authentication & Authorization
    A1B->>A1B: Store key for channel

    Note over U, A2B: 3. Exchanging Secure Data
    A2B->>A2F: Encrypt fdc3.valuation for publication
    A2F->>A1F: Publish context
    Note over A2F, A1F: { type: "fdc3.valuation", __encrypted: xxx, __signature: <by app2> }
    A1F->>A1B: Request decryption
    A1B->>A1F: Check signature, decrypt and return
    Note over A1B, A1F: { type: "fdc3.valuation", price: 24.4 }
```

