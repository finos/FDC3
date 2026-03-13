import { Context, EncryptedContextWrapper, SymmetricKeyRequest, SymmetricKeyResponse } from '@finos/fdc3-context';
import { Channel, ContextHandler, ContextMetadata, Listener } from '@finos/fdc3-standard';
import { PrivateFDC3Security } from '../impl/PrivateFDC3Security';
import { JSONWebEncryption, JsonWebKeyWithId, PublicFDC3Security } from '../impl/PublicFDC3Security';
import {
  createSymmetricKeyRequestContextListener,
  createSymmetricKeyResponseContextListener,
  SigningFunction,
  UnwrapFunction,
} from './SymmetricKeyContextListener';
import { MetadataHandler } from '../delegates/MetadataHandler';

/**
 * Creates a wrapper around the broadcast function of a channel which will encrypt any context that is broadcast
 * into a 'fdc3.security.encryptedContext'
 *
 * This will also set up a listener on the channel for 'fdc3.security.symmetricKeyRequest'
 * to handle the exchange of symmetric keys for the encrypted context.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export interface EncryptedBroadcaster {
  /**
   * Broadcast a context on the channel.  The context will be encrypted into a 'fdc3.security.encryptedContext'
   * before being broadcast.
   *
   * @param context The context to broadcast
   * @param meta The metadata to broadcast
   */
  broadcast(context: Context, meta?: ContextMetadata): Promise<void>;

  /**
   * Shutdown the encrypted broadcaster and the symmetric key request listener.
   */
  shutdown(): Promise<void>;
}

/**
 * Basic implementation of EncryptedBroadcaster which uses the trust function supplied
 * in the PublicFDC3Security implementation to decide whether to respond to a symmetric key request.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export class BasicEncryptedBroadcaster implements EncryptedBroadcaster {
  private security: PublicFDC3Security;
  private channel: Channel;
  private key: JsonWebKeyWithId;
  private keyListener: Promise<Listener>;
  private isShutdown: boolean = false;
  private signingFunction: SigningFunction;
  private metadataHandler: MetadataHandler;

  constructor(
    security: PublicFDC3Security,
    metadataHandler: MetadataHandler,
    channel: Channel,
    key: JsonWebKeyWithId,
    signingFunction: SigningFunction
  ) {
    this.security = security;
    this.metadataHandler = metadataHandler;
    this.channel = channel;
    this.key = key;
    this.keyListener = createSymmetricKeyRequestContextListener(
      security,
      metadataHandler,
      channel,
      key,
      signingFunction
    );
    this.signingFunction = signingFunction;
  }

  async broadcast(contextIn: Context, metaIn?: ContextMetadata): Promise<void> {
    if (this.isShutdown) {
      throw new Error('Encryption support is shutdown');
    }
    const encryptedContent = await this.security.encryptSymmetric(contextIn, this.key);
    const encryptedContext: EncryptedContextWrapper = {
      type: 'fdc3.security.encryptedContext',
      id: {
        kid: this.key.kid,
      },
      originalType: contextIn.type,
      encryptedPayload: encryptedContent,
    };
    let { context, metadata } = await this.signingFunction(encryptedContext, metaIn || {});
    ({ context, metadata } = this.metadataHandler.pack(context, metadata));
    return this.channel.broadcast(context, metadata);
  }

  async shutdown(): Promise<void> {
    this.isShutdown = true;
    await (await this.keyListener).unsubscribe();
  }
}

/**
 * Provides support for encrypting and decrypting contexts published on FDC3 channels.
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export interface EncryptionSupport {
  /**
   * Wrap the broadcast function so that it encrypts any context that is broadcast
   * into a 'fdc3.security.encryptedContext'
   *
   * @see DesktopAgent.broadcast
   */
  broadcastWrapper(channel: Channel): Promise<EncryptedBroadcaster>;

  /**
   * Wrap the context handler so that it decrypts any context that is received
   * that has a type of 'fdc3.security.encryptedContext'.  Having decrypted the context
   * it will then call the original context handler with the decrypted context if the
   * original type matches the type parameter.
   *
   * @see DesktopAgent.addContextListener
   */
  addContextListener(channel: Channel, contextType: string | null, handler: ContextHandler): Promise<Listener>;
}

/**
 * Use this when encrypting context on the front end (i.e. in the browser) with a browser-held
 * symmetric key.  This requires a backend implementation of PrivateFDC3Security to be available
 * to unwrap the symmetric key and sign requests for key.
 */
export class PublicEncryptionSupport implements EncryptionSupport {
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

  async getSymmetricKey(kid: string, jku: string, channel: Channel): Promise<JsonWebKeyWithId> {
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

    // now make the key request
    const request = {
      type: 'fdc3.security.symmetricKeyRequest',
      id: {
        kid: kid,
      },
      jku: jku,
    } as SymmetricKeyRequest;
    let { context, metadata } = await this.signingFunction(request, {});
    ({ context, metadata } = this.metadataHandler.pack(context, metadata));
    await channel.broadcast(context, metadata);

    return newKeyPromise;
  }

  async broadcastWrapper(channel: Channel): Promise<EncryptedBroadcaster> {
    const key = await this.security.createSymmetricKey();
    return new BasicEncryptedBroadcaster(this.security, this.metadataHandler, channel, key, this.signingFunction);
  }

  decryptingContextHandler(ch: ContextHandler, originalType: string | null, channel: Channel): ContextHandler {
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
        const kid = encryptedContext.id?.kid;

        const symmetricKey = await this.getSymmetricKey(kid, encryptedContext.jku, channel);
        const decryptedContext = await this.security.decryptSymmetric(encrypted, symmetricKey);
        if (originalType && decryptedContext.type !== originalType) {
          return; // Ignore contexts we aren't listening for
        }

        newMeta['encryption'] = 'decrypted';
        ch(decryptedContext, newMeta);
      }
    };

    return out as ContextHandler;
  }

  async addContextListener(channel: Channel, contextType: string | null, handler: ContextHandler): Promise<Listener> {
    const underlyingContextListener = channel.addContextListener(
      'fdc3.security.encryptedContext',
      this.decryptingContextHandler(handler, contextType, channel)
    );
    const keyListener = createSymmetricKeyResponseContextListener(
      this.security,
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
}

/**
 * Use this when you are encrypting context on the backend (i.e. in the desktop agent)
 * with a backend-held symmetric key.  This requires a backend implementation of PrivateFDC3Security
 * to be available to unwrap the symmetric key and sign requests for key.
 */
export class PrivateEncryptionSupport extends PublicEncryptionSupport {
  constructor(security: PrivateFDC3Security, metadataHandler: MetadataHandler) {
    const signingFunction: SigningFunction = async (context: Context, metadata: ContextMetadata) => {
      const { signature: DetachedSignature, antiReplay: AntiReplayClaims } = await security.sign(context);
      return {
        context,
        metadata: {
          ...metadata,
          signature: DetachedSignature,
          antiReplay: AntiReplayClaims,
        },
      };
    };

    const unwrapFunction: UnwrapFunction = async (ctx: SymmetricKeyResponse) => {
      return security.unwrapSymmetricKey(ctx);
    };

    super(security, metadataHandler, signingFunction, unwrapFunction);
  }
}
