import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import { EncryptingPrivateChannel } from './EncryptingPrivateChannel';
import { ContextMetadata, Listener } from '@finos/fdc3-standard';
import { checkSignature } from '../signing/SigningSupport';
import { PublicFDC3Security } from '../impl/PublicFDC3Security';

/**
 * Used for agents that can send the symmetric key when asked for it.
 */
export async function createSymmetricKeyRequestContextListener(
  fdc3Security: PublicFDC3Security,
  channel: EncryptingPrivateChannel
): Promise<Listener> {
  // create the key if it doesn't exist
  if ((await channel.getSymmetricKey()) == null) {
    const key = await fdc3Security.createSymmetricKey();
    await channel.setSymmetricKey(key);
  }

  const listener = channel.addContextListener(
    'fdc3.security.symmetricKeyRequest',
    async (skr1: Context, skrMeta: ContextMetadata | undefined) => {
      console.log('symmetric key request received', skr1, skrMeta);
      const { meta } = await checkSignature(fdc3Security, skrMeta, skr1);
      const ma = meta?.authenticity;

      if (ma?.signed && ma.trusted && ma.valid) {
        const theKey = await channel.getSymmetricKey();
        if (theKey) {
          const wrappedKey = await fdc3Security.wrapSymmetricKey(theKey, ma.jku!);
          const { ctx, meta } = await channel.signResponse(wrappedKey);
          return channel.broadcast(ctx, meta);
        } else {
          throw new Error('Symmetric key not set');
        }
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
  channel: EncryptingPrivateChannel
): Promise<Listener> {
  const listener = channel.addContextListener(
    'fdc3.security.symmetricKeyResponse',
    async (skr: Context, skrMeta: ContextMetadata | undefined) => {
      const { context, meta } = await checkSignature(fdc3Security, skrMeta, skr);
      const ma = meta?.authenticity;

      if (ma?.signed && ma.trusted && ma.valid) {
        const skr = context as SymmetricKeyResponse;
        const key = await channel.unwrapResponse(skr);
        if (key) {
          channel.setSymmetricKey(key);
        }
      } else {
        throw new Error('Symmetric key response not signed and trusted');
      }
    }
  );

  return listener;
}
