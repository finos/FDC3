# Microsoft Entra ID Integration for FDC3 Security Demo

This app demonstrates how to integrate Microsoft Entra ID (formerly Azure AD) with FDC3 security features.

## Overview

The Microsoft Entra app follows the same pattern as the IDP app but integrates with Microsoft's identity platform instead of using a simple demo authentication.

## Features

- Microsoft Entra ID authentication using MSAL (Microsoft Authentication Library)
- FDC3 User context creation from Microsoft account information
- JWT token validation for Microsoft Entra ID tokens
- Secure user data exchange through FDC3 intents

## Setup Instructions

### 1. Azure AD App Registration

To use this app with a real Microsoft Entra ID tenant, you need to:

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Configure the app:
   - Name: "FDC3 Security Demo"
   - Supported account types: "Accounts in this organizational directory only"
   - Redirect URI: Web - `http://localhost:4006` (or your preferred port)
5. Note down the Application (client) ID and Directory (tenant) ID
6. Go to "Authentication" and add the redirect URI
7. Go to "API permissions" and add "User.Read" permission

### 2. Configuration

The app supports multiple configuration methods:

#### Option A: Environment Variables (Recommended)
Create a `.env` file in the entra-app directory:

```bash
# Microsoft Entra ID Configuration
# Copy these values from your Azure Portal app registration
ENTRA_CLIENT_ID=your-client-id-here
ENTRA_AUTHORITY=https://login.microsoftonline.com/your-tenant-id-here
ENTRA_REDIRECT_URI=http://localhost:4006
```

#### Option B: Direct Configuration
Update the values directly in `src/entra-config.ts`:

```typescript
export const ENTRA_CONFIG: EntraConfig = {
  clientId: 'your-client-id-here',
  authority: 'https://login.microsoftonline.com/your-tenant-id-here',
  redirectUri: 'http://localhost:4006',
};
```

#### Option C: Server Configuration Endpoint
The server will read environment variables and serve them to the client via the `/api/config` endpoint. This ensures your credentials are not exposed in the client-side code.


## Running the App

1. Start the development server:
   ```bash
   npm run start:entra-app
   ```

2. Open your browser to `http://localhost:4006`

3. Click "Log In with Microsoft" to authenticate

## Security Considerations

- The current implementation uses mock authentication for demo purposes
- In production, implement proper JWT token validation using Microsoft's public keys
- Validate all claims in the ID token (issuer, audience, expiration, etc.)
- Use HTTPS in production environments
- Implement proper error handling and logging

## Architecture

- **Client-side**: Handles Microsoft Entra authentication and FDC3 user context creation
- **Server-side**: Validates Microsoft tokens and manages FDC3 security operations
- **Port**: 4006 (different from other demo apps to avoid conflicts)

## Integration with FDC3

The app integrates with FDC3 by:

1. Authenticating users with Microsoft Entra ID
2. Creating FDC3 User contexts from Microsoft account information
3. Handling GetUser intents with proper security validation
4. Supporting encrypted and signed user data exchange

## Troubleshooting

- Ensure the redirect URI in Azure AD matches your application URL
- Check that the client ID and tenant ID are correct
- Verify that the required permissions are granted in Azure AD
- Check browser console for authentication errors
