import { PrivateFDC3Security } from '@finos/fdc3-security';
import { FDC3Handlers } from '../../../src/helpers/FDC3Handlers';
import { ContextMetadata, IntentHandler, Channel } from '@finos/fdc3';
import { Context, User, UserRequest } from '@finos/fdc3-context';
import { JosePrivateFDC3Security } from '../../../src/JosePrivateFDC3Security';
import { JWTValidator } from './JWTValidator';
import { getEntraConfig } from '../src/config';

/**
 * Microsoft Entra ID Business Logic
 * Handles the GetUser intent with Microsoft Entra authentication
 */
export class EntraBusinessLogic implements FDC3Handlers {
  private fdc3Security: PrivateFDC3Security;
  private user: User | null = null;
  private jwtValidator: JWTValidator;

  constructor(fdc3Security: PrivateFDC3Security) {
    this.fdc3Security = fdc3Security;
    this.jwtValidator = new JWTValidator(getEntraConfig());
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
    const out = allowListFunction(jku, aud);
    return out;
  }

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    if (intent == 'GetUser') {
      const ih: IntentHandler = async (ctx: Context, metadata: ContextMetadata | undefined) => {
        if (ctx.type === 'fdc3.user.request') {
          const request = ctx as UserRequest;
          const aud = request.aud;
          const jku = request.jku;

          if (this.isTrusted(aud, jku) && this.user) {
            // User token has already been validated during exchangeData
            // Create aud-scoped user token for the requesting application
            const audScopedUserToken = {
              ...this.user,
              jwt: await this.fdc3Security.createJWTToken(aud, (this.user.id?.email as string) || ''),
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
      };

      return ih;
    } else {
      throw new Error('Invalid intent: ' + intent);
    }
  }

  async exchangeData(purpose: string, ctx: Context): Promise<Context | void> {
    if (ctx.type === 'fdc3.user' && purpose === 'user-data') {
      const jwt = ctx.jwt;
      const { valid, claims, error } = await this.jwtValidator.validateToken(jwt);
      if (error) {
        console.error('Invalid Microsoft Entra ID token:', error);
      } else if (valid) {
        this.user = {
          type: 'fdc3.user',
          jwt: jwt,
          id: {
            email: (claims?.email as string) || (claims?.preferred_username as string) || '',
          },
          name: (claims?.name as string) || (claims?.given_name as string) || '',
        };
        return this.user;
      } else {
        console.error('Invalid Microsoft Entra ID token');
      }
    } else if (purpose === 'user-logout') {
      this.user = null;
    }
  }
}
