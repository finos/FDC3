/**
 * Microsoft Entra ID Configuration
 * Shared configuration for both client and server
 */

export interface EntraConfig {
  clientId: string;
  authority: string;
  redirectUri: string;
}

/**
 * Get Microsoft Entra configuration from environment variables
 * Falls back to default values for development
 */
export function getEntraConfig(): EntraConfig {
  return {
    clientId: process.env.ENTRA_CLIENT_ID || 'YOUR_CLIENT_ID',
    authority: process.env.ENTRA_AUTHORITY || 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: process.env.ENTRA_REDIRECT_URI || 'http://localhost:4006',
  };
}
