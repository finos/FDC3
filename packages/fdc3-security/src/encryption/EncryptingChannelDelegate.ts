import { Context, ContextHandler, Listener, PrivateChannel } from '@finos/fdc3';
import {
  CANT_DECRYPT,
  ContextMetadataWithEncryptionStatus,
  DECRYPTED,
  ENCRYPTION_KEY,
  ENCRYPTION_STATUS,
  EncryptedContent,
  EncryptingPrivateChannel,
  NOT_ENCRYPTED,
  UnwrapKey,
  WrapKey,
  createSymmetricKey,
  decrypt,
  encrypt,
} from './EncryptionSupport';
import { ChannelDelegate } from '../delegates/ChannelDelegate';
import {
  SYMMETRIC_KEY_RESPONSE_CONTEXT,
  SYMMETRIC_KEY_REQUEST_CONTEXT,
  SymmetricKeyResponseContext,
  SymmetricKeyRequestContext,
} from './SymmetricKeyContext';

/**
 * Adds encryptiion support for private channels.  A wrapped, symmetric key is sent via the private channel,
 * and the unwrapKey method is used to unwrap it, allowing further decoding of messages.
 *
 * Some considerations:
 *
 * 1.  A symmetric key is only created once for the channel, and is not changeable after that
 * 2.  Whomever calls setChannelEncryption(true) creates the symmetric key and is the keyCreator.
 * 3.  Users of the channel will request an encryption key if they can't decrypt messages.
 * 4.  We need a flow-chart for this.
 */
export class EncryptingChannelDelegate extends ChannelDelegate implements EncryptingPrivateChannel {
  private symmetricKey: CryptoKey | null = null;
  private encrypting: boolean = false;
  private wrapKey: WrapKey;
  private keyCreator: boolean = false;

  requestListener: Listener | null = null;
  responseListener: Listener | null = null;

  constructor(d: PrivateChannel, unwrapKey: UnwrapKey, wrapKey: WrapKey) {
    super(d);
    this.wrapKey = wrapKey;

    // listen for a symmetric key being sent
    this.addContextListener(
      SYMMETRIC_KEY_RESPONSE_CONTEXT,
      async (context: SymmetricKeyResponseContext, _meta: any) => {
        const newKey = await unwrapKey(context);
        if (newKey) {
          if (this.symmetricKey == null) {
            this.symmetricKey = newKey;
          } else {
            // this is an error - key can't be changed after being created
          }
        }
      }
    ).then(l => {
      this.responseListener = l;
    });
  }

  isEncrypting(): boolean {
    return this.symmetricKey != null;
  }

  async setChannelEncryption(state: boolean): Promise<void> {
    this.encrypting = state;
    if (state && !this.symmetricKey) {
      this.symmetricKey = await createSymmetricKey();
      this.keyCreator = true;
    }
  }

  async broadcastKey(publicKeyUrl: string): Promise<void> {
    if (this.symmetricKey) {
      const ctx = await this.wrapKey(this.symmetricKey, publicKeyUrl);
      await super.broadcast(ctx);
      return;
    } else {
      throw new Error('Channel not set to encrypting');
    }
  }

  async requestEncryptionKey(): Promise<void> {
    const request = {
      type: SYMMETRIC_KEY_REQUEST_CONTEXT,
    } as SymmetricKeyRequestContext;
    return this.broadcast(request);
  }

  async encryptIfAvailable(context: Context): Promise<Context> {
    return this.symmetricKey && this.encrypting ? await encrypt(context, this.symmetricKey) : context;
  }

  async broadcast(context: Context): Promise<void> {
    // make sure encryption happens before signing
    console.log('starting encryption');
    const context2 = await super.wrapContext(context);
    const encContext = await this.encryptIfAvailable(context2);
    await super.broadcast(encContext);
    console.log('Encryption done');
  }

  addContextListener(context: any, handler?: any): Promise<Listener> {
    const theHandler: ContextHandler = handler ? handler : (context as ContextHandler);
    const theContextType: string | null = context && handler ? (context as string) : null;
    return super.addContextListener(theContextType, this.decryptingContextHandler(theHandler));
  }

  decryptingContextHandler(ch: ContextHandler): ContextHandler {
    const out = async (context: Context, meta: ContextMetadataWithEncryptionStatus) => {
      const newMeta: ContextMetadataWithEncryptionStatus = {
        ...meta,
      };

      console.log('Decrypting context handler called');

      delete newMeta[ENCRYPTION_STATUS];

      const encrypted = context[ENCRYPTION_KEY] as EncryptedContent;

      if (encrypted) {
        if (this.symmetricKey) {
          context = await decrypt(encrypted, this.symmetricKey);
          newMeta[ENCRYPTION_STATUS] = DECRYPTED;
        } else {
          newMeta[ENCRYPTION_STATUS] = CANT_DECRYPT;
          if (!this.keyCreator) {
            this.requestEncryptionKey();
          }
        }
      } else {
        newMeta[ENCRYPTION_STATUS] = NOT_ENCRYPTED;
      }

      return ch(context, newMeta);
    };

    return out as ContextHandler;
  }
}
