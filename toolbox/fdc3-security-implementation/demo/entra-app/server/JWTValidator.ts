import { jwtVerify, createRemoteJWKSet, JWTPayload } from 'jose';
import { EntraConfig } from '../src/config';

/**
 * JWT Validator for Microsoft Entra ID tokens
 * Implements proper JWT signature verification and claim validation
 */
export class JWTValidator {
  private jwksUri: string;
  private expectedIssuer: string;
  private expectedAudience: string;
  private expectedTenantId: string;
  private JWKS: ReturnType<typeof createRemoteJWKSet>;

  constructor(config: EntraConfig) {
    this.expectedAudience = config.clientId;
    this.expectedTenantId = config.tenantId;
    this.expectedIssuer = `https://login.microsoftonline.com/${config.tenantId}/v2.0`;
    this.jwksUri = `https://login.microsoftonline.com/${config.tenantId}/discovery/v2.0/keys`;

    // Create a remote JWKS set for fetching Microsoft's public keys
    this.JWKS = createRemoteJWKSet(new URL(this.jwksUri));
  }

  /**
   * Validates a Microsoft Entra ID token with full signature verification
   * @param idToken - The JWT ID token to validate
   * @returns Promise with validation result and claims
   */
  async validateToken(idToken: string): Promise<{ valid: boolean; claims?: JWTPayload; error?: string }> {
    try {
      if (!idToken || idToken.trim().length === 0) {
        return { valid: false, error: 'Token is empty or undefined' };
      }

      // Verify the JWT signature using Microsoft's public keys
      const { payload } = await jwtVerify(idToken, this.JWKS, {
        issuer: this.expectedIssuer,
        audience: this.expectedAudience,
        algorithms: ['RS256'], // Microsoft uses RS256 for ID tokens
      });

      // Additional claim validations
      const validationResult = this.validateClaims(payload);
      if (!validationResult.valid) {
        return validationResult;
      }

      return { valid: true, claims: payload };
    } catch (error) {
      console.error('JWT validation error:', error);

      // Provide specific error messages for different failure types
      if (error instanceof Error) {
        if (error.message.includes('signature verification failed')) {
          return { valid: false, error: 'Invalid token signature' };
        } else if (error.message.includes('expired')) {
          return { valid: false, error: 'Token has expired' };
        } else if (error.message.includes('invalid issuer')) {
          return { valid: false, error: 'Invalid token issuer' };
        } else if (error.message.includes('invalid audience')) {
          return { valid: false, error: 'Invalid token audience' };
        }
      }

      return { valid: false, error: 'Token validation failed' };
    }
  }

  /**
   * Validates specific claims in the JWT payload
   * @param payload - The decoded JWT payload
   * @returns Validation result
   */
  private validateClaims(payload: JWTPayload): { valid: boolean; error?: string } {
    const now = Math.floor(Date.now() / 1000);

    // Check token expiration
    if (payload.exp && payload.exp < now) {
      console.warn('Token has expired');
      return { valid: false, error: 'Token has expired' };
    }

    // Check not before time
    if (payload.nbf && payload.nbf > now) {
      console.warn('Token is not yet valid');
      return { valid: false, error: 'Token is not yet valid' };
    }

    // Validate issuer
    if (payload.iss !== this.expectedIssuer) {
      console.warn(`Invalid issuer. Expected: ${this.expectedIssuer}, Got: ${payload.iss}`);
      return { valid: false, error: 'Invalid token issuer' };
    }

    // Validate audience
    if (payload.aud !== this.expectedAudience) {
      console.warn(`Invalid audience. Expected: ${this.expectedAudience}, Got: ${payload.aud}`);
      return { valid: false, error: 'Invalid token audience' };
    }

    // Validate tenant ID in the token (if present)
    if (payload.tid && payload.tid !== this.expectedTenantId) {
      console.warn(`Invalid tenant ID. Expected: ${this.expectedTenantId}, Got: ${payload.tid}`);
      return { valid: false, error: 'Invalid tenant ID' };
    }

    // Validate token version (should be 2.0 for v2.0 tokens)
    if (payload.ver && payload.ver !== '2.0') {
      console.warn(`Unexpected token version. Expected: 2.0, Got: ${payload.ver}`);
      return { valid: false, error: 'Invalid token version' };
    }

    // Validate that required claims are present
    if (!payload.sub) {
      console.warn('Missing subject claim');
      return { valid: false, error: 'Missing subject claim' };
    }

    return { valid: true };
  }
}
