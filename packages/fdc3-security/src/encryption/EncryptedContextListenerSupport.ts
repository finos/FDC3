import { Context, EncryptedContextWrapper, SymmetricKeyRequest, SymmetricKeyResponse } from '@finos/fdc3-context';
import { Channel, ContextHandler, ContextMetadata, Listener } from '@finos/fdc3-standard';
import { PrivateFDC3Security, SigningFunction, UnwrapFunction } from '../impl/PrivateFDC3Security';
import { JSONWebEncryption, JsonWebKeyWithId, PublicFDC3Security } from '../impl/PublicFDC3Security';
import { MetadataHandler } from '../delegates/MetadataHandler';

/**
 * Provides support for receiving and decrypting encrypted contexts on FDC3 channels.
 * Use this when your app only needs to consume encrypted contexts (e.g. a data consumer).
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export interface EncryptedContextListenerSupport {
  /**
   * Add a context listener that will decrypt incoming 'fdc3.security.encryptedContext' contexts
   * and invoke the handler with the decrypted context when the original type matches contextType.
   *
   * @see DesktopAgent.addContextListener
   */
  addContextListener(channel: Channel, contextType: string | null, handler: ContextHandler): Promise<Listener>;
}

/**
 * Call this for agents that need to request and receive the symmetric key.
 * Listener for 'fdc3.security.symmetricKeyResponse' – validates and unwraps the key,
 * then resolves the matching key request promise.
 */
export function createSymmetricKeyResponseContextListener(
  metadataHandler: MetadataHandler,
  channel: Channel,
  keyRequestResolveFunctions: Map<string, (key: JsonWebKeyWithId) => void>,
  unwrapFunction: UnwrapFunction
): Promise<Listener> {
  return channel.addContextListener(
    'fdc3.security.symmetricKeyResponse',
    async (skr: Context, skrMeta: ContextMetadata | undefined) => {
      let { context } = metadataHandler.unpack(skr, skrMeta);
      const skrCtx = context as SymmetricKeyResponse;
      const key = await unwrapFunction(skrCtx);
      if (key) {
        const resolveFunction = keyRequestResolveFunctions.get(key.kid);
        if (resolveFunction) {
          resolveFunction(key);
          keyRequestResolveFunctions.delete(key.kid);
        }
      }
    }
  );
}

/**
 * Public (front-end) implementation of EncryptedContextListenerSupport.
 * Use when decrypting on the front-end; requires a backend for signing key requests and unwrapping key responses.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export class PublicEncryptedContextListenerSupport implements EncryptedContextListenerSupport {
  private security: PublicFDC3Security;
  private signingFunction: SigningFunction;
  private unwrapFunction: UnwrapFunction;
  private keyRequestPromises: Map<string, Promise<JsonWebKeyWithId>> = new Map();
  private keyRequestResolveFunctions: Map<string, (key: JsonWebKeyWithId) => void> = new Map();
  private metadataHandler: MetadataHandler;

  constructor(
    security: PublicFDC3Security,
    metadataHandler: MetadataHandler,
    signingFunction: SigningFunction,
    unwrapFunction: UnwrapFunction
  ) {
    this.security = security;
    this.metadataHandler = metadataHandler;
    this.signingFunction = signingFunction;
    this.unwrapFunction = unwrapFunction;
  }

  async addContextListener(channel: Channel, contextType: string | null, handler: ContextHandler): Promise<Listener> {
    const underlyingContextListener = channel.addContextListener(
      'fdc3.security.encryptedContext',
      this.decryptingContextHandler(handler, contextType, channel)
    );
    const keyListener = createSymmetricKeyResponseContextListener(
      this.metadataHandler,
      channel,
      this.keyRequestResolveFunctions,
      this.unwrapFunction
    );

    return {
      unsubscribe: async () => {
        await (await underlyingContextListener).unsubscribe();
        await (await keyListener).unsubscribe();
      },
    };
  }

  private async getSymmetricKey(kid: string, jku: string, channel: Channel): Promise<JsonWebKeyWithId> {
    const keyPromise = this.keyRequestPromises.get(kid);
    if (keyPromise) {
      return keyPromise;
    }

    let resolveFunction: (value: JsonWebKeyWithId) => void;
    const newKeyPromise = new Promise<JsonWebKeyWithId>(resolve => {
      resolveFunction = resolve;
    });

    this.keyRequestResolveFunctions.set(kid, resolveFunction!);
    this.keyRequestPromises.set(kid, newKeyPromise);

    const request = {
      type: 'fdc3.security.symmetricKeyRequest',
      id: { kid },
      jku,
    } as SymmetricKeyRequest;
    const { signature, antiReplay } = await this.signingFunction(request);
    const { context, metadata } = this.metadataHandler.pack(request, { signature, antiReplay });
    await channel.broadcast(context, metadata);

    return newKeyPromise;
  }

  private decryptingContextHandler(ch: ContextHandler, originalType: string | null, channel: Channel): ContextHandler {
    const out = async (contextIn: Context, meta: ContextMetadata) => {
      if (contextIn.type !== 'fdc3.security.encryptedContext') {
        return;
      }
      const encryptedContext = contextIn as EncryptedContextWrapper;
      const newMeta = { ...meta };
      delete newMeta['encryption'];

      const encrypted = encryptedContext.encryptedPayload as JSONWebEncryption;
      const kid = encryptedContext.id?.kid;
      const symmetricKey = await this.getSymmetricKey(kid!, encryptedContext.jku!, channel);
      const decryptedContext = await this.security.decryptSymmetric(encrypted, symmetricKey);
      if (originalType && decryptedContext.type !== originalType) {
        return;
      }

      newMeta['encryption'] = 'decrypted';
      ch(decryptedContext, newMeta);
    };
    return out as ContextHandler;
  }
}

/**
 * Private (back-end) implementation of EncryptedContextListenerSupport.
 * Use when decrypting on the back-end with a backend-held private key for unwrapping.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export class PrivateEncryptedContextListenerSupport
  extends PublicEncryptedContextListenerSupport
  implements EncryptedContextListenerSupport
{
  constructor(security: PrivateFDC3Security, metadataHandler: MetadataHandler) {
    const signFunction: SigningFunction = async (context: Context) => security.sign(context);
    const unwrapFunction: UnwrapFunction = async (ctx: SymmetricKeyResponse) => security.unwrapSymmetricKey(ctx);
    super(security, metadataHandler, signFunction, unwrapFunction);
  }
}
