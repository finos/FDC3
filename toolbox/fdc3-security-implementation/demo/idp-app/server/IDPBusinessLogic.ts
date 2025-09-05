import { checkSignature, JSONWebSignature, PrivateFDC3Security } from '@finos/fdc3-security';
import { FDC3Handlers } from '../../../src/helpers/FDC3Handlers';
import { ContextMetadata, ContextHandler, IntentHandler, IntentResult, Channel } from '@finos/fdc3';
import { Context, User, UserRequest } from '@finos/fdc3-context';

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

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    if (intent == 'GetUser') {
      const ih: IntentHandler = async (ctx: Context, metadata: ContextMetadata | undefined) => {
        const { context, meta } = await checkSignature(this.fdc3Security, metadata, ctx, intent, null);
        const ma = meta?.authenticity;
        if (ma?.signed && ma.trusted && ma.valid) {
          const userId = this.user?.id?.userId;
          if (this.user) {
            // user is logged in.
            // create a JWT token for the user
            const request = ctx as UserRequest;

            // Create fdc3.user context object
            const userContext: User = {
              type: 'fdc3.user',
              id: { userId },
              name: this.user?.name,
              jwt: await this.fdc3Security.createJWTToken(request.aud, userId),
            };

            val enc = await this.fdc3Security.encrypt(userContext, request.pki);

            return userContext;
          }
        }
      };

      return ih;
    } else {
      throw new Error('Invalid intent');
    }
  }

  async receivedIntentResult(intent: string, result: IntentResult): Promise<object> {
    throw new Error('Method not implemented.');
  }

  async exchangeData(purpose: string, ctx: Context): Promise<Context | void> {
    if ((ctx.type === 'fdc3.user.request') && (purpose === 'user-request')) {
      if (!this.user) {
        this.user = {
          type: 'fdc3.user',
          id: {
            userId: 'demo-user',
          },
          name: 'demo-user',
          email: 'demo-user@example.com',
          jwt: await this.fdc3Security.createJWTToken('http://localhost:4005', 'demo-user'),
        };
      }

      return this.user;
    } else if (ctx.type === 'fdc3.user.logout') {
      this.user = null;
    }
  }
}
