import { Context, EncryptedContextWrapper } from '@robmoffat/fdc3-context';
import { Channel, ContextMetadata, Listener } from '@robmoffat/fdc3-standard';
import { JsonWebKeyWithId, PublicFDC3Security } from '../impl/PublicFDC3Security.js';
import { MetadataHandler } from '../delegates/MetadataHandler.js';

/**
 * A wrapper around the broadcast function of a channel which will encrypt any context that is broadcast
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
 * Listener for 'fdc3.security.symmetricKeyRequest' – validates the request and broadcasts
 * the symmetric key wrapped for the requestor. Used by EncryptedBroadcaster.
 */
export async function createSymmetricKeyRequestContextListener(
  fdc3Security: PublicFDC3Security,
  metadataHandler: MetadataHandler,
  channel: Channel,
  symmetricKey: JsonWebKeyWithId
): Promise<Listener> {
  const listener = channel.addContextListener(
    'fdc3.security.symmetricKeyRequest',
    async (skrContextIn: Context, skrMetaIn: ContextMetadata | undefined) => {
      console.log('symmetric key request received', skrContextIn, skrMetaIn);
      const { context, metadata } = metadataHandler.unpack(skrContextIn, skrMetaIn);
      const { signature, antiReplay } = metadata;
      const ma = await fdc3Security.verifySignature(signature, context, antiReplay);

      if (ma?.signed && ma.trusted && ma.valid) {
        const wrappedKey = await fdc3Security.wrapSymmetricKey(symmetricKey, ma.jku!);
        const { context, metadata } = metadataHandler.pack(wrappedKey, {});
        return channel.broadcast(context, metadata);
      } else {
        throw new Error('Symmetric key not set');
      }
    }
  );

  return listener;
}

/**
 * Basic implementation of EncryptedBroadcaster which sets up a listener for
 * 'fdc3.security.symmetricKeyRequest' to respond to key requests.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export class BasicEncryptedBroadcaster implements EncryptedBroadcaster {
  private security: PublicFDC3Security;
  private channel: Channel;
  private key: JsonWebKeyWithId;
  private keyListener: Promise<Listener>;
  private isShutdown: boolean = false;
  private metadataHandler: MetadataHandler;

  constructor(security: PublicFDC3Security, metadataHandler: MetadataHandler, channel: Channel, key: JsonWebKeyWithId) {
    this.security = security;
    this.metadataHandler = metadataHandler;
    this.channel = channel;
    this.key = key;
    this.keyListener = createSymmetricKeyRequestContextListener(security, metadataHandler, channel, key);
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
    const { context, metadata } = this.metadataHandler.pack(encryptedContext, metaIn);
    return this.channel.broadcast(context, metadata);
  }

  async shutdown(): Promise<void> {
    this.isShutdown = true;
    await (await this.keyListener).unsubscribe();
  }
}

/**
 * Provides support for broadcasting encrypted contexts on FDC3 channels.
 * Wrap the channel so that contexts broadcast through the returned EncryptedBroadcaster
 * are encrypted into 'fdc3.security.encryptedContext' before being sent.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export class EncryptedBroadcastSupport {
  constructor(
    private security: PublicFDC3Security,
    private metadataHandler: MetadataHandler
  ) {}

  /**
   * Wrap the channel so that contexts broadcast through the returned EncryptedBroadcaster
   * are encrypted into 'fdc3.security.encryptedContext' before being sent.
   *
   * @see DesktopAgent.broadcast
   */
  async broadcastWrapper(channel: Channel): Promise<EncryptedBroadcaster> {
    const key = await this.security.createSymmetricKey();
    return new BasicEncryptedBroadcaster(this.security, this.metadataHandler, channel, key);
  }
}
