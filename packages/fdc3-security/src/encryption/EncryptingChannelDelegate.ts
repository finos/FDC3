import { ContextHandler, ContextMetadata, Listener, PrivateChannel } from '@finos/fdc3-standard';
import { Context, EncryptedContextWrapper, SymmetricKeyRequest, SymmetricKeyResponse } from '@finos/fdc3-context';
import { JSONWebEncryption, PublicFDC3Security } from '../impl/PublicFDC3Security';
import { PrivateFDC3Security } from '../impl/PrivateFDC3Security';
import { EncryptingPrivateChannel } from './EncryptingPrivateChannel';
import { AbstractChannelDelegate } from '../delegates/AbstractChannelDelegate';
import { signContext } from '../signing/SigningSupport';

export type KeyUnwrapFunction = (ctx: SymmetricKeyResponse) => Promise<JsonWebKey>;
export type SignRequestFunction = (ctx: Context) => Promise<{ ctx: Context; meta?: ContextMetadata }>;

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
  private readonly fdc3Security: PublicFDC3Security;
  public readonly keyUnwrapFunction: KeyUnwrapFunction;
  public readonly signRequestFunction: SignRequestFunction;

  requestListener: Listener | null = null;
  responseListener: Listener | null = null;

  constructor(
    d: PrivateChannel,
    metadataAvailable: boolean,
    fdc3Security: PublicFDC3Security,
    keyUnwrapFunction?: KeyUnwrapFunction,
    signRequestFunction?: SignRequestFunction
  ) {
    super(d, metadataAvailable);
    this.fdc3Security = fdc3Security;

    if (keyUnwrapFunction) {
      this.keyUnwrapFunction = keyUnwrapFunction;
    } else {
      if (typeof (fdc3Security as any).unwrapKey === 'function') {
        this.keyUnwrapFunction = ctx => (fdc3Security as PrivateFDC3Security).unwrapKey(ctx);
      } else {
        throw new Error(
          'Must provide keyUnwrapFunction or a PrivateFDC3Security implementation that supports unwrapKey'
        );
      }
    }

    if (signRequestFunction) {
      this.signRequestFunction = signRequestFunction;
    } else {
      if (typeof (fdc3Security as any).sign === 'function') {
        this.signRequestFunction = ctx => signContext(fdc3Security as PrivateFDC3Security, ctx);
      } else {
        throw new Error('Must provide signRequestFunction or a PrivateFDC3Security implementation that supports sign');
      }
    }
  }

  isEncrypting(type: string): boolean {
    return this.typeFilter != null && this.typeFilter(type);
  }

  async setChannelEncryption(filter: null | ((type: string) => boolean)): Promise<void> {
    this.typeFilter = filter;
  }

  async broadcastKey(publicKeyUrl: string): Promise<void> {
    if (this.symmetricKey) {
      const wrappedCtx = await this.fdc3Security.wrapKey(this.symmetricKey, publicKeyUrl);
      const { ctx, meta } = await this.signRequestFunction(wrappedCtx);
      return this.delegate.broadcast(ctx, meta);
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
      type: 'fdc3.security.symmetricKeyRequest',
    } as SymmetricKeyRequest;
    const { ctx, meta } = await this.signRequestFunction(request);
    return this.broadcast(ctx, meta);
  }

  async encryptIfAvailable(context: Context): Promise<Context> {
    console.log(
      `[EncryptingChannelDelegate] encryptIfAvailable for ${context.type}, isEncrypting: ${this.isEncrypting(context.type)}, symmetricKey exists: ${!!this.symmetricKey}`
    );
    if (this.isEncrypting(context.type)) {
      if (!this.symmetricKey) {
        throw new Error('No symmetric key set but trying to encrypt context: ' + context.type);
      }
      const jwe = await this.fdc3Security.encryptSymmetric(context, this.symmetricKey);
      const out = {
        type: 'fdc3.security.encryptedContext',
        encryptedPayload: jwe,
      } as EncryptedContextWrapper;
      return out;
    } else {
      return context;
    }
  }

  async wrapContext(ctx: Context, meta?: ContextMetadata): Promise<{ ctx: Context; meta?: ContextMetadata }> {
    const encryptedContext = await this.encryptIfAvailable(ctx);
    return { ctx: encryptedContext, meta };
  }

  addContextListener(context: any, handler?: any): Promise<Listener> {
    const theHandler: ContextHandler = handler ? handler : (context as ContextHandler);
    const originalType: string | null = context && handler ? (context as string) : null;

    // Some protocol messages must be exchanged in the clear, do not decrypt them.
    if (originalType === 'fdc3.security.symmetricKeyRequest' || originalType === 'fdc3.security.symmetricKeyResponse') {
      return super.addContextListener(originalType, theHandler);
    }

    // We must listen for ALL contexts on the underlying channel, because encrypted
    // messages arrive as 'fdc3.security.encryptedContext', not their original type.
    return super.addContextListener(null, this.decryptingContextHandler(theHandler, originalType));
  }

  decryptingContextHandler(ch: ContextHandler, originalType: string | null): ContextHandler {
    const out = async (contextIn: Context, meta: ContextMetadata) => {
      if (contextIn.type !== 'fdc3.security.encryptedContext') {
        return;
      } else {
        const encryptedContext = contextIn as EncryptedContextWrapper;
        const newMeta = {
          ...meta,
        };

        console.log('Decrypting context handler called');

        delete newMeta['encryption'];

        const encrypted = encryptedContext.encryptedPayload as JSONWebEncryption;

        if (encrypted) {
          if (this.symmetricKey) {
            const decryptedContext = await this.fdc3Security.decryptSymmetric(encrypted, this.symmetricKey);
            if (originalType && decryptedContext.type !== originalType) {
              return; // Ignore contexts we aren't listening for
            }
            newMeta['encryption'] = 'decrypted';
            ch(decryptedContext, newMeta);
          } else {
            newMeta['encryption'] = 'cant_decrypt';
            this.requestEncryptionKey();
          }
        }
      }
    };

    return out as ContextHandler;
  }
}
