import { Context } from '@finos/fdc3-context';
import { Channel, ContextMetadata } from '@finos/fdc3-standard';
import { MetadataHandler } from '../delegates/MetadataHandler.js';
import { PrivateFDC3Security } from '../impl/PrivateFDC3Security.js';

/**
 * A wrapper around the broadcast function of a channel which will sign any context that is broadcast.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export interface SignedBroadcaster {
  /**
   * Broadcast a context on the channel.  The context will be signed before being broadcast.
   * before being broadcast.
   *
   * @param context The context to broadcast
   * @param meta The metadata to broadcast
   */
  broadcast(context: Context, meta?: ContextMetadata): Promise<void>;
}

export class BasicSignedBroadcaster implements SignedBroadcaster {
  private security: PrivateFDC3Security;
  private channel: Channel;
  private metadataHandler: MetadataHandler;

  constructor(security: PrivateFDC3Security, metadataHandler: MetadataHandler, channel: Channel) {
    this.security = security;
    this.metadataHandler = metadataHandler;
    this.channel = channel;
  }

  async broadcast(context: Context, meta?: ContextMetadata): Promise<void> {
    const { signature, antiReplay } = await this.security.sign(context);
    const newMeta = {
      ...meta,
      signature,
      antiReplay,
    };
    const { context: packedContext, metadata: packedMetadata } = this.metadataHandler.pack(context, newMeta);
    await this.channel.broadcast(packedContext, packedMetadata);
  }
}
