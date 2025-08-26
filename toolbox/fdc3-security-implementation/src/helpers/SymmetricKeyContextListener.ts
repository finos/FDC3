import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import { EncryptingPrivateChannel } from '@finos/fdc3-security';
import { PrivateFDC3Security } from '@finos/fdc3-security';
import { ContextMetadata, Listener } from '@finos/fdc3-standard';
import { checkSignature, signedContext } from '@finos/fdc3-security';

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
    'fdc3.security.symmetricKey.request',
    async (skr1: Context, skrMeta: ContextMetadata | undefined) => {
      console.log('symmetric key request received', skr1, skrMeta);
      const { meta } = await checkSignature(fdc3Security, skrMeta, skr1, null, channel.id);
      const ma = meta?.authenticity;

      if (ma?.signed && ma.trusted && ma.valid) {
        const theKey = await channel.getSymmetricKey();
        if (theKey) {
          const wrappedKey = await fdc3Security.wrapKey(theKey, ma.publicKeyUrl);
          const signedKey = await signedContext(fdc3Security, wrappedKey, null, channel.id);
          return channel.broadcast(signedKey);
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
    'fdc3.security.symmetricKey.response',
    async (skr: Context, skrMeta: ContextMetadata | undefined) => {
      const { context, meta } = await checkSignature(fdc3Security, skrMeta, skr, null, channel.id);
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
