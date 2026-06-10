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
   * Sign the context using the application's private key, then broadcast it on the channel
   * with `signature` and `antiReplay` included in the metadata. Receivers can verify
   * the signature using the `jku` URL embedded in the JWS protected header.
   *
   * @param context The context object to sign and broadcast.
   * @param meta Optional additional metadata to merge with the generated signature fields.
   */
  broadcast(context: Context, meta?: ContextMetadata): Promise<void>;
}

/**
 * Basic implementation of {@link SignedBroadcaster} that signs each context on the
 * backend before broadcasting. The signing operation requires the application's private
 * key and MUST therefore run in a trusted backend process — never in the browser frontend.
 *
 * Typical usage: construct via `FDC3Handlers.handleRemoteChannel` so the channel is
 * proxied to the backend; call `broadcast` from backend logic.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export class BasicSignedBroadcaster implements SignedBroadcaster {
  private security: PrivateFDC3Security;
  private channel: Channel;
  private metadataHandler: MetadataHandler;

  /**
   * @param security A {@link PrivateFDC3Security} instance holding the application's private key.
   * @param metadataHandler Handles packing metadata into the context for FDC3 < 3.0 compatibility.
   * @param channel The FDC3 channel on which signed contexts will be broadcast.
   */
  constructor(security: PrivateFDC3Security, metadataHandler: MetadataHandler, channel: Channel) {
    this.security = security;
    this.metadataHandler = metadataHandler;
    this.channel = channel;
  }

  async broadcast(context: Context, meta?: ContextMetadata): Promise<void> {
    // Sign the context on the backend — produces a DetachedSignature and AntiReplayClaims.
    const { signature, antiReplay } = await this.security.sign(context);

    // Merge the signature and antiReplay into any caller-provided metadata.
    const newMeta = {
      ...meta,
      signature,
      antiReplay,
    };

    // Pack and broadcast: in FDC3 >= 3.0 metadata is passed as a separate argument;
    // in earlier versions it is embedded in the context under __appMeta.
    const { context: packedContext, metadata: packedMetadata } = this.metadataHandler.pack(context, newMeta);
    await this.channel.broadcast(packedContext, packedMetadata);
  }
}
