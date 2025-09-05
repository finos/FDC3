import { checkSignature, JSONWebSignature, PrivateFDC3Security } from '@finos/fdc3-security';
import { FDC3Handlers } from '../../../src/helpers/FDC3Handlers';
import { ContextMetadata, ContextHandler, IntentHandler, IntentResult, Channel } from '@finos/fdc3';
import { Context, User, UserRequest } from '@finos/fdc3-context';
import { JosePrivateFDC3Security } from '../../../src/JosePrivateFDC3Security';
import e from 'express';

/**
 * Has to handle the GetUser intent.
 */
export class IDPBusinessLogic implements FDC3Handlers {
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

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    if (intent == 'GetUser') {
      const ih: IntentHandler = async (ctx: Context, metadata: ContextMetadata | undefined) => {
        if (ctx.type === 'fdc3.user.request') {
          const request = ctx as UserRequest;
          const aud = request.aud;
          const jku = request.jku;

          if (this.isTrusted(aud, jku) && this.user) {
            const audScopedUserToken = {
              ...this.user,
              jwt: await this.fdc3Security.createJWTToken(aud, 'demo-user@example.com'),
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
        this.user = {
          type: 'fdc3.user',
          id: {
            email: 'demo-user@example.com',
          },
          name: 'Mr Demo User',
          jwt: await this.fdc3Security.createJWTToken('http://localhost:4005', 'demo-user@example.com'),
        };
      }

      return this.user;
    } else if (purpose === 'user-logout') {
      this.user = null;
    }
  }
}
