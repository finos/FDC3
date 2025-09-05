import { ContextHandler, ContextMetadata, Listener, PrivateChannel } from '@finos/fdc3-standard';
import { Context, SymmetricKeyRequest } from '@finos/fdc3-context';
import { JSONWebEncryption } from '../PublicFDC3Security';
import { PrivateFDC3Security } from '../PrivateFDC3Security';
import { EncryptingPrivateChannel } from './EncryptingPrivateChannel';
import { AbstractChannelDelegate } from '../delegates/AbstractChannelDelegate';
import { signedContext } from '../signing/SigningSupport';

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
export class EncryptingChannelDelegate extends AbstractChannelDelegate implements EncryptingPrivateChannel {
  private symmetricKey: JsonWebKey | null = null;
  private typeFilter: null | ((type: string) => boolean) = null;
  private readonly fdc3Security: PrivateFDC3Security;

  requestListener: Listener | null = null;
  responseListener: Listener | null = null;

  constructor(d: PrivateChannel, fdc3Security: PrivateFDC3Security) {
    super(d);
    this.fdc3Security = fdc3Security;
  }

  isEncrypting(type: string): boolean {
    return this.typeFilter != null && this.typeFilter(type);
  }

  async setChannelEncryption(filter: null | ((type: string) => boolean)): Promise<void> {
    this.typeFilter = filter;
  }

  async broadcastKey(publicKeyUrl: string): Promise<void> {
    if (this.symmetricKey) {
      const ctx = await this.fdc3Security.wrapKey(this.symmetricKey, publicKeyUrl);
      const signedCtx = await signedContext(this.fdc3Security, ctx, null, this.id);
      return this.delegate.broadcast(signedCtx);
    } else {
      throw new Error('Channel not set to encrypting');
    }
  }

  async setSymmetricKey(key: JsonWebKey): Promise<void> {
    console.log('setting symmetric key', key);
    this.symmetricKey = key;
  }

  async getSymmetricKey(): Promise<JsonWebKey | null> {
    console.log('getting symmetric key', this.symmetricKey);
    return this.symmetricKey;
  }

  async requestEncryptionKey(): Promise<void> {
    const request = {
      type: 'fdc3.security.symmetricKey.request',
    } as SymmetricKeyRequest;
    const signedRequest = await signedContext(this.fdc3Security, request, null, this.id);
    return this.broadcast(signedRequest);
  }

  async encryptIfAvailable(context: Context): Promise<Context> {
    if (this.isEncrypting(context.type)) {
      const jwe = await this.fdc3Security.encryptSymmetric(context, this.symmetricKey!!);
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
          context = await this.fdc3Security.decryptSymmetric(encrypted, this.symmetricKey);
          newMeta['encryption'] = 'decrypted';
        } else {
          newMeta['encryption'] = 'cant_decrypt';
          this.requestEncryptionKey();
        }
      } else {
        newMeta['encryption'] = 'not_encrypted';
      }

      return ch(context, newMeta);
    };

    return out as ContextHandler;
  }
}
