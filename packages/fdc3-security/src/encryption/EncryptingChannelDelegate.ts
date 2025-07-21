import { ContextHandler, ContextMetadata, Listener, PrivateChannel } from '@finos/fdc3-standard';
import { Context, SymmetricKeyResponse, SymmetricKeyRequest } from '@finos/fdc3-context';
import { ChannelDelegate } from '../delegates/ChannelDelegate';
import { FDC3Security, JSONWebEncryption } from '../FDC3Security';
import { EncryptingPrivateChannel } from './EncryptingPrivateChannel';

/**
 * TODO: this should be moved into Julianna's code.
 */
export type ContextMetadataWithEncryptionStatus = ContextMetadata & {
  encryption?: 'cant_decrypt' | 'not_encrypted' | 'decrypted';
};

/**
 * Adds encryption support for private channels.  A wrapped, symmetric key is sent via the private channel,
 * and the unwrapKey method is used to unwrap it, allowing further decoding of messages.
 *
 * Some considerations:
 *
 * 1.  A symmetric key is only created once for the channel, and is not changeable after that
 * 2.  Whomever calls setChannelEncryption(true) creates the symmetric key and is the keyCreator.
 * 3.  Users of the channel will request an encryption key if they can't decrypt messages.
 */
export class EncryptingChannelDelegate extends ChannelDelegate implements EncryptingPrivateChannel {
  private symmetricKey: JsonWebKey | null = null;
  private typeFilter: null | ((type: string) => boolean) = null;
  private keyCreator: boolean = false;
  private readonly fdc3Security: FDC3Security;

  requestListener: Listener | null = null;
  responseListener: Listener | null = null;

  constructor(d: PrivateChannel, fdc3Security: FDC3Security) {
    super(d);
    this.fdc3Security = fdc3Security;

    // listen for a symmetric key being sent
    this.addContextListener(
      'fdc3.security.symmetricKey.response',
      async (context: SymmetricKeyResponse, _meta: any) => {
        const newKey = await fdc3Security.unwrapKey(context);
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

  isEncrypting(type: string): boolean {
    return this.typeFilter != null && this.typeFilter(type);
  }

  async setChannelEncryption(filter: null | ((type: string) => boolean)): Promise<void> {
    this.typeFilter = filter;
    if (!this.symmetricKey && this.typeFilter != null) {
      this.symmetricKey = await this.fdc3Security.createSymmetricKey();
      this.keyCreator = true;
    }
  }

  async broadcastKey(publicKeyUrl: string): Promise<void> {
    if (this.symmetricKey) {
      const ctx = await this.fdc3Security.wrapKey(this.symmetricKey, publicKeyUrl);
      return this.delegate.broadcast(ctx);
    } else {
      throw new Error('Channel not set to encrypting');
    }
  }

  async requestEncryptionKey(): Promise<void> {
    const request = {
      type: 'fdc3.security.symmetricKey.request',
    } as SymmetricKeyRequest;
    return this.broadcast(request);
  }

  async encryptIfAvailable(context: Context): Promise<Context> {
    if (this.isEncrypting(context.type)) {
      const jwe = await this.fdc3Security.encrypt(context, this.symmetricKey!!);
      const out = {
        type: context.type,
        __encrypted: jwe,
      };
      return out;
    } else {
      return context;
    }
  }

  async wrapContext(ctx: Context): Promise<Context> {
    const encryptedContext = await this.encryptIfAvailable(ctx);
    return encryptedContext;
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

      delete newMeta['encryption'];

      const encrypted = context['__encrypted'] as JSONWebEncryption;

      if (encrypted) {
        if (this.symmetricKey) {
          context = await this.fdc3Security.decrypt(encrypted, this.symmetricKey);
          newMeta['encryption'] = 'decrypted';
        } else {
          newMeta['encryption'] = 'cant_decrypt';
          if (!this.keyCreator) {
            this.requestEncryptionKey();
          }
        }
      } else {
        newMeta['encryption'] = 'not_encrypted';
      }

      return ch(context, newMeta);
    };

    return out as ContextHandler;
  }
}
