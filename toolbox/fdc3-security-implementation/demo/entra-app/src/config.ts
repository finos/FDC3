/**
 * Microsoft Entra ID Configuration
 * Shared configuration for both client and server
 */

export interface EntraConfig {
  clientId: string;
  authority: string;
  redirectUri: string;
  tenantId: string;
}

/**
 * Get Microsoft Entra configuration from environment variables
 * Falls back to default values for development
 */
export function getEntraConfig(): EntraConfig {
  return {
    clientId: '62855256-b4f2-406f-9878-be85128aa4f7',
    authority: 'https://login.microsoftonline.com/445c1fc6-7e1e-46dd-8835-9075a151049a',
    redirectUri: 'http://localhost:4006',
    tenantId: '445c1fc6-7e1e-46dd-8835-9075a151049a',
  };
}
