import { checkSignature, JSONWebSignature, PrivateFDC3Security } from '@finos/fdc3-security';
import { FDC3Handlers } from '../../../src/helpers/FDC3Handlers';
import { ContextMetadata, ContextHandler, IntentHandler, IntentResult, Channel } from '@finos/fdc3';
import { Context, User, UserRequest } from '@finos/fdc3-context';
import { JosePrivateFDC3Security } from '../../../src/JosePrivateFDC3Security';

/**
 * Microsoft Entra ID Business Logic
 * Handles the GetUser intent with Microsoft Entra authentication
 */
export class EntraBusinessLogic implements FDC3Handlers {
  private fdc3Security: PrivateFDC3Security;
  private user: User | null = null;

  constructor(fdc3Security: PrivateFDC3Security) {
    this.fdc3Security = fdc3Security;
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    throw new Error('Not used');
  }

  /**
   * For simplicity here, I am using the same trust function for determining whether
   * we're happy to give out JWTs as I do for checking contexts/signatures etc.
   */
  private isTrusted(aud: string, jku: string): boolean {
    const allowListFunction = (this.fdc3Security as JosePrivateFDC3Security).allowListFunction;
    return allowListFunction(jku, aud);
  }

  /**
   * Validates Microsoft Entra ID token
   * In a real implementation, this would validate the JWT signature and claims
   */
  private validateEntraToken(idToken: string): { valid: boolean; claims?: any } {
    try {
      // In a real implementation, you would:
      // 1. Verify the JWT signature using Microsoft's public keys
      // 2. Validate the issuer (iss) claim matches your tenant
      // 3. Validate the audience (aud) claim matches your client ID
      // 4. Check token expiration (exp) claim
      // 5. Validate other claims as needed
      // 6. Use libraries like jwks-client to fetch and validate keys

      if (idToken && idToken.length > 0) {
        // For demo purposes, we'll decode the JWT without signature verification
        // In production, you MUST verify the signature using Microsoft's public keys
        const parts = idToken.split('.');
        if (parts.length === 3) {
          try {
            const payload = JSON.parse(atob(parts[1]));

            // Basic validation checks
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < now) {
              console.warn('Token has expired');
              return { valid: false };
            }

            if (payload.iss && !payload.iss.includes('login.microsoftonline.com')) {
              console.warn('Invalid issuer');
              return { valid: false };
            }

            return { valid: true, claims: payload };
          } catch (decodeError) {
            console.error('Failed to decode token:', decodeError);
            return { valid: false };
          }
        }
      }

      return { valid: false };
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  }

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    if (intent == 'GetUser') {
      const ih: IntentHandler = async (ctx: Context, metadata: ContextMetadata | undefined) => {
        if (ctx.type === 'fdc3.user.request') {
          const request = ctx as UserRequest;
          const aud = request.aud;
          const jku = request.jku;

          if (this.isTrusted(aud, jku) && this.user) {
            // Validate the Microsoft Entra ID token
            const tokenValidation = this.validateEntraToken(this.user.jwt || '');

            if (!tokenValidation.valid) {
              throw new Error('Invalid Microsoft Entra ID token');
            }

            const audScopedUserToken = {
              ...this.user,
              jwt: await this.fdc3Security.createJWTToken(aud, this.user?.id?.email || ''),
            };

            const encryptedUserContext = {
              type: 'fdc3.user',
              __encrypted: await this.fdc3Security.encryptPublicKey(audScopedUserToken, jku),
            };

            const signature = await this.fdc3Security.sign(encryptedUserContext, intent, null);

            return {
              ...encryptedUserContext,
              __signature: signature,
            };
          }
        }

        throw new Error('Unauthorized: ' + JSON.stringify(ctx));
      };

      return ih;
    } else {
      throw new Error('Invalid intent: ' + intent);
    }
  }

  async exchangeData(purpose: string, ctx: Context): Promise<Context | void> {
    if (ctx.type === 'fdc3.user.request' && purpose === 'user-request') {
      if (!this.user) {
        // In a real implementation, this would be populated from the actual Microsoft Entra authentication
        // The user data should come from the client-side authentication result
        // For now, we'll create a placeholder that will be updated when the client authenticates
        this.user = {
          type: 'fdc3.user',
          id: {
            email: 'pending-authentication@example.com',
          },
          name: 'Pending Authentication',
          jwt: '', // This will be populated with the actual ID token from Microsoft
        };
      }

      return this.user;
    } else if (purpose === 'user-logout') {
      this.user = null;
    }
  }

  // Method to update user data from Microsoft Entra authentication
  updateUserFromEntraAuth(entraUser: any, idToken: string): void {
    this.user = {
      type: 'fdc3.user',
      id: {
        email: entraUser.username || entraUser.email || '',
      },
      name: entraUser.name || entraUser.username || '',
      jwt: idToken,
    };
  }
}
