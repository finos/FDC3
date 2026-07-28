import { jwtVerify, createRemoteJWKSet, type JWTPayload } from 'jose';
import type { EntraConfig } from './config';

/**
 * Validates Microsoft Entra ID tokens (signature + claims) using the tenant JWKS.
 */
export class JWTValidator {
  private readonly expectedAudience: string;
  private readonly expectedTenantId: string;
  private readonly expectedIssuer: string;
  private readonly JWKS: ReturnType<typeof createRemoteJWKSet>;

  constructor(config: EntraConfig) {
    this.expectedAudience = config.clientId;
    this.expectedTenantId = config.tenantId;
    this.expectedIssuer = `https://login.microsoftonline.com/${config.tenantId}/v2.0`;
    const jwksUri = `https://login.microsoftonline.com/${config.tenantId}/discovery/v2.0/keys`;
    this.JWKS = createRemoteJWKSet(new URL(jwksUri));
  }

  async validateToken(idToken: string): Promise<{ valid: boolean; claims?: JWTPayload; error?: string }> {
    try {
      if (!idToken || idToken.trim().length === 0) {
        return { valid: false, error: 'Token is empty or undefined' };
      }

      const { payload } = await jwtVerify(idToken, this.JWKS, {
        issuer: this.expectedIssuer,
        audience: this.expectedAudience,
        algorithms: ['RS256'],
      });

      const validationResult = this.validateClaims(payload);
      if (!validationResult.valid) {
        return validationResult;
      }

      return { valid: true, claims: payload };
    } catch (error) {
      console.error('JWT validation error:', error);

      if (error instanceof Error) {
        if (error.message.includes('signature verification failed')) {
          return { valid: false, error: 'Invalid token signature' };
        }
        if (error.message.includes('expired')) {
          return { valid: false, error: 'Token has expired' };
        }
        if (error.message.includes('invalid issuer')) {
          return { valid: false, error: 'Invalid token issuer' };
        }
        if (error.message.includes('invalid audience')) {
          return { valid: false, error: 'Invalid token audience' };
        }
      }

      return { valid: false, error: 'Token validation failed' };
    }
  }

  private validateClaims(payload: JWTPayload): {
    valid: boolean;
    error?: string;
  } {
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      console.warn('Token has expired');
      return { valid: false, error: 'Token has expired' };
    }

    if (payload.nbf && payload.nbf > now) {
      console.warn('Token is not yet valid');
      return { valid: false, error: 'Token is not yet valid' };
    }

    if (payload.iss !== this.expectedIssuer) {
      console.warn(`Invalid issuer. Expected: ${this.expectedIssuer}, Got: ${payload.iss}`);
      return { valid: false, error: 'Invalid token issuer' };
    }

    if (payload.aud !== this.expectedAudience) {
      console.warn(`Invalid audience. Expected: ${this.expectedAudience}, Got: ${payload.aud}`);
      return { valid: false, error: 'Invalid token audience' };
    }

    if (payload.tid && payload.tid !== this.expectedTenantId) {
      console.warn(`Invalid tenant ID. Expected: ${this.expectedTenantId}, Got: ${payload.tid}`);
      return { valid: false, error: 'Invalid tenant ID' };
    }

    if (payload.ver && payload.ver !== '2.0') {
      console.warn(`Unexpected token version. Expected: 2.0, Got: ${payload.ver}`);
      return { valid: false, error: 'Invalid token version' };
    }

    if (!payload.sub) {
      console.warn('Missing subject claim');
      return { valid: false, error: 'Missing subject claim' };
    }

    return { valid: true };
  }
}
