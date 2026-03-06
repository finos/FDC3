import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import { EncryptingPrivateChannel } from './EncryptingPrivateChannel';
import { PrivateFDC3Security } from '../impl/PrivateFDC3Security';
import { ContextMetadata, Listener } from '@finos/fdc3-standard';
import { checkSignature, signContext } from '../signing/SigningSupport';

/**
 * Used for agents that send the symmetric key when asked for it.
 */
export async function createSymmetricKeyRequestContextListener(
  fdc3Security: PrivateFDC3Security,
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
          const wrappedKey = await fdc3Security.wrapKey(theKey, ma.jku!);
          const { ctx, meta } = await signContext(fdc3Security, wrappedKey);
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
  fdc3Security: PrivateFDC3Security,
  channel: EncryptingPrivateChannel
): Promise<Listener> {
  const listener = channel.addContextListener(
    'fdc3.security.symmetricKeyResponse',
    async (skr: Context, skrMeta: ContextMetadata | undefined) => {
      const { context, meta } = await checkSignature(fdc3Security, skrMeta, skr);
      const ma = meta?.authenticity;

      if (ma?.signed && ma.trusted && ma.valid) {
        const skr = context as SymmetricKeyResponse;
        const key = await fdc3Security.unwrapKey(skr);
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
