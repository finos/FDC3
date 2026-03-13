import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import { Channel, ContextMetadata, Listener } from '@finos/fdc3-standard';
import { checkSignature } from '../signing/SigningSupport';
import { JsonWebKeyWithId, PublicFDC3Security } from '../impl/PublicFDC3Security';
import { MetadataHandler } from '../delegates/MetadataHandler';

export type SigningFunction = (
  context: Context,
  metadata: ContextMetadata
) => Promise<{ context: Context; metadata: ContextMetadata }>;
export type UnwrapFunction = (context: SymmetricKeyResponse) => Promise<JsonWebKeyWithId>;

/**
 * Used for agents that can send the symmetric key when asked for it.
 */
export async function createSymmetricKeyRequestContextListener(
  fdc3Security: PublicFDC3Security,
  metadataHandler: MetadataHandler,
  channel: Channel,
  symmetricKey: JsonWebKeyWithId,
  signingFunction: SigningFunction
): Promise<Listener> {
  const listener = channel.addContextListener(
    'fdc3.security.symmetricKeyRequest',
    async (skr1: Context, skrMeta: ContextMetadata | undefined) => {
      console.log('symmetric key request received', skr1, skrMeta);
      const { metadata } = await checkSignature(fdc3Security, skrMeta, skr1);
      const ma = metadata?.authenticity;

      if (ma?.signed && ma.trusted && ma.valid) {
        const wrappedKey = await fdc3Security.wrapSymmetricKey(symmetricKey, ma.jku!);
        let { context, metadata } = await signingFunction(wrappedKey, {});
        ({ context, metadata } = metadataHandler.pack(context, metadata));
        return channel.broadcast(context, metadata);
      } else {
        throw new Error('Symmetric key not set');
      }
    }
  );

  return listener;
}

/**
 * Call this for agents that need to request and receive the symmetric key.
 */
export function createSymmetricKeyResponseContextListener(
  fdc3Security: PublicFDC3Security,
  metadataHandler: MetadataHandler,
  channel: Channel,
  keyRequestResolveFunctions: Map<string, (key: JsonWebKeyWithId) => void>,
  unwrapFunction: UnwrapFunction
): Promise<Listener> {
  const listener = channel.addContextListener(
    'fdc3.security.symmetricKeyResponse',
    async (skr: Context, skrMeta: ContextMetadata | undefined) => {
      let { context, metadata } = metadataHandler.unpack(skr, skrMeta);
      ({ metadata } = await checkSignature(fdc3Security, metadata, context));
      const ma = metadata?.authenticity;

      if (ma?.signed && ma.trusted && ma.valid) {
        const skr = context as SymmetricKeyResponse;
        const key = await unwrapFunction(skr);
        if (key) {
          const resolveFunction = keyRequestResolveFunctions.get(key.kid);
          if (resolveFunction) {
            resolveFunction(key);
            keyRequestResolveFunctions.delete(key.kid);
          }
        }
      } else {
        throw new Error('Symmetric key response not signed and trusted');
      }
    }
  );

  return listener;
}
