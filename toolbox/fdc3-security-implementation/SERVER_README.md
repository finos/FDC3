# FDC3 Security Server

This server wrapper exposes the `LocalFDC3Security` class methods as HTTP endpoints, making it easy to use FDC3 security functionality over the network.

## Features

- **RESTful API**: All FDC3 security operations are exposed as HTTP endpoints
- **Auto-generated keys**: The server automatically generates signing and wrapping key pairs
- **Health monitoring**: Built-in health check endpoint
- **Error handling**: Comprehensive error handling with meaningful error messages
- **Configurable**: Customizable allowlist, validity time limits, and more

## Installation

First, install the required dependencies:

```bash
npm install express @types/express
```

## Quick Start

```typescript
import { createFDC3SecurityServer, provisionJWKS } from './src/server';

async function startServer() {
  const config = {
    port: 3000,
    jwksUrl: 'https://your-domain.com/.well-known/jwks.json',
    publicKeyResolver: (url: string) => provisionJWKS(url),
    allowListFunction: (url: string) => {
      // Implement your allowlist logic
      return url.startsWith('https://trusted-domain.com');
    },
    validityTimeLimit: 300, // 5 minutes
  };

  const server = await createFDC3SecurityServer(config);
  console.log('Server started successfully!');
}

startServer().catch(console.error);
```

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status

### Encryption/Decryption
- **POST** `/encrypt`
  - Body: `{ "context": {...}, "symmetricKey": {...} }`
  - Returns: `{ "encrypted": "..." }`

- **POST** `/decrypt`
  - Body: `{ "encrypted": "...", "symmetricKey": {...} }`
  - Returns: `{ "decrypted": {...} }`

### Signing/Verification
- **POST** `/sign`
  - Body: `{ "context": {...}, "intent": "string", "channelId": "string" }`
  - Returns: `{ "signature": "..." }`

- **POST** `/check`
  - Body: `{ "jws": "...", "context": {...}, "intent": "string", "channelId": "string" }`
  - Returns: `{ "authenticity": {...} }`

### Key Management
- **POST** `/create-symmetric-key`
  - Returns: `{ "symmetricKey": {...} }`

- **POST** `/wrap-key`
  - Body: `{ "symmetricKey": {...}, "publicKeyUrl": "string" }`
  - Returns: `{ "wrappedKey": {...} }`

- **POST** `/unwrap-key`
  - Body: `{ "symmetricKeyResponse": {...} }`
  - Returns: `{ "unwrappedKey": {...} }`

- **GET** `/public-keys`
  - Returns: `{ "publicKeys": [...] }`

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `port` | number | No | 3000 | Server port |
| `jwksUrl` | string | Yes | - | URL where public keys are published |
| `publicKeyResolver` | function | Yes | - | Function to resolve public keys from URLs |
| `allowListFunction` | function | Yes | - | Function to determine if a URL is trusted |
| `validityTimeLimit` | number | No | 300 | Signature validity time limit in seconds |
| `signingKeyId` | string | No | auto-generated | Custom ID for signing key |
| `wrappingKeyId` | string | No | auto-generated | Custom ID for wrapping key |

## Example Usage

### Using curl

```bash
# Health check
curl http://localhost:3000/health

# Create a symmetric key
curl -X POST http://localhost:3000/create-symmetric-key

# Sign a context
curl -X POST http://localhost:3000/sign \
  -H "Content-Type: application/json" \
  -d '{
    "context": {"type": "fdc3.instrument", "id": {"ticker": "AAPL"}},
    "intent": "ViewChart",
    "channelId": "channel-1"
  }'

# Check a signature
curl -X POST http://localhost:3000/check \
  -H "Content-Type: application/json" \
  -d '{
    "jws": "eyJhbGciOiJSUzI1NiIsImp3ayI6Imh0dHBzOi8vZXhhbXBsZS5jb20vLndlbGwta25vd24vandrcy5qc29uIiwiaWF0IjoxNjM5NzI5NjAwLCJraWQiOiJzaWduaW5nLWtleSJ9..signature",
    "context": {"type": "fdc3.instrument", "id": {"ticker": "AAPL"}},
    "intent": "ViewChart",
    "channelId": "channel-1"
  }'
```

### Using JavaScript/TypeScript

```typescript
// Create a symmetric key
const response = await fetch('http://localhost:3000/create-symmetric-key', {
  method: 'POST'
});
const { symmetricKey } = await response.json();

// Encrypt a context
const encryptResponse = await fetch('http://localhost:3000/encrypt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    context: { type: 'fdc3.instrument', id: { ticker: 'AAPL' } },
    symmetricKey
  })
});
const { encrypted } = await encryptResponse.json();
```

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Allowlist**: Implement proper allowlist logic for trusted domains
3. **Key Management**: Ensure proper key rotation and management
4. **Rate Limiting**: Consider implementing rate limiting for production use
5. **Authentication**: Add authentication/authorization as needed

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request (missing parameters)
- `500`: Internal server error

Error responses include a descriptive message:
```json
{
  "error": "Missing required parameters: context and symmetricKey"
}
```

## Development

To run the example server:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the example server
node dist/src/example-server.js
```

## License

Apache-2.0 