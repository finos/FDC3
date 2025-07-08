import {
  Decrypt,
  SYMMETRIC_ENCRYPTION_ALGORITHM,
  Encrypt,
  UnwrapKey,
  WRAPPING_ALGORITHM_KEY_PARAMS,
  WrapKey,
  decrypt,
  encrypt,
  WRAPPING_ALGORITHM_DETAILS,
} from './encryption/EncryptionSupport';
import {
  Check,
  MessageAuthenticity,
  MessageSignature,
  Sign,
  SIGNING_ALGORITHM_DETAILS,
  SIGNING_ALGORITHM_KEY_PARAMS,
} from './signing/SigningSupport';
import { SYMMETRIC_KEY_RESPONSE_CONTEXT, SymmetricKeyResponseContext } from './encryption/SymmetricKeyContext';

/**
 * When given the URL of a public key to load, this function
 * resolves that URL into an array of JsonWebKey objects that can be turned into
 * a Public Crypto key with the SIGNING_ALGORITHM_DETAILS.
 */
export type Resolver = (url: string) => Promise<JsonWebKey[]>;

export function base64ToArrayBuffer(base64: string) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export class ClientSideImplementation {
  initSigner(privateKey: CryptoKey, publicKeyUrl: string): Sign {
    return async (msg: string, date: Date) => {
      console.log('SIGNING ' + msg);

      const buffer = await crypto.subtle.sign(SIGNING_ALGORITHM_DETAILS, privateKey, new TextEncoder().encode(msg));
      const digest = btoa(String.fromCharCode(...new Uint8Array(buffer)));

      return {
        algorithm: SIGNING_ALGORITHM_DETAILS,
        publicKeyUrl,
        digest,
        date: date.toISOString(),
      } as MessageSignature;
    };
  }

  async createWrappingKeys(): Promise<CryptoKeyPair> {
    const kp = (await crypto.subtle.generateKey(WRAPPING_ALGORITHM_KEY_PARAMS, true, [
      'encrypt',
      'decrypt',
      'wrapKey',
      'unwrapKey',
    ])) as CryptoKeyPair;
    return kp;
  }

  async createSigningKeys(): Promise<CryptoKeyPair> {
    const kp = (await crypto.subtle.generateKey(SIGNING_ALGORITHM_KEY_PARAMS, true, [
      'sign',
      'verify',
    ])) as CryptoKeyPair;
    return kp;
  }

  initWrapKey(resolver: Resolver): WrapKey {
    return async (toWrap: CryptoKey, publicKeyUrl: string) => {
      const wrapKeys = (await resolver(publicKeyUrl)).filter(k => k.key_ops?.includes('wrapKey'));

      if (wrapKeys.length == 0) {
        throw new Error(`No wrapping keys provided at ${publicKeyUrl}`);
      } else {
        const wrapWith = await crypto.subtle.importKey('jwk', wrapKeys[0], WRAPPING_ALGORITHM_KEY_PARAMS, true, [
          'wrapKey',
        ]);
        const buffer = await crypto.subtle.wrapKey('jwk', toWrap, wrapWith, WRAPPING_ALGORITHM_DETAILS);
        const encrypted = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        return {
          type: SYMMETRIC_KEY_RESPONSE_CONTEXT,
          id: {
            publicKeyUrl,
          },
          algorithm: WRAPPING_ALGORITHM_DETAILS,
          wrappedKey: encrypted,
        } as SymmetricKeyResponseContext;
      }
    };
  }

  initEncrypt(): Encrypt {
    return encrypt;
  }

  initDecrypt(): Decrypt {
    return decrypt;
  }

  initUnwrapKey(unwrapWith: CryptoKey, publicKeyUrl: string): UnwrapKey {
    return async (c: SymmetricKeyResponseContext) => {
      if (c.id.publicKeyUrl == publicKeyUrl) {
        const encrypted = c.wrappedKey;
        const key = await crypto.subtle.unwrapKey(
          'jwk',
          base64ToArrayBuffer(encrypted),
          unwrapWith,
          'RSA-OAEP',
          SYMMETRIC_ENCRYPTION_ALGORITHM,
          true,
          ['encrypt', 'decrypt']
        );
        return key;
      } else {
        return null;
      }
    };
  }

  validateAlgorithm(algorithm: any) {
    if (algorithm.name != SIGNING_ALGORITHM_DETAILS.name || algorithm.hash != SIGNING_ALGORITHM_DETAILS.hash) {
      throw new Error('Unsupported Algorithm');
    }
  }

  initChecker(resolver: Resolver, timeWindowMS: number = 1000 * 60 * 60): Check {
    return async (p: MessageSignature, msg: string): Promise<MessageAuthenticity> => {
      console.log('CHECKING ' + msg);
      this.validateAlgorithm(p.algorithm);
      const verifyKeys = (await resolver(p.publicKeyUrl)).filter(k => k.key_ops?.includes('verify'));
      let exceptions = [];

      if (verifyKeys.length == 0) {
        throw new Error(`No signature verification key found for ${p.publicKeyUrl}`);
      }

      for (let I = 0; I < verifyKeys.length; I++) {
        try {
          const jsonKey = verifyKeys[I];
          const publicKey = await crypto.subtle.importKey('jwk', jsonKey, SIGNING_ALGORITHM_DETAILS, true, ['verify']);
          const validated = await crypto.subtle.verify(
            p.algorithm,
            publicKey,
            base64ToArrayBuffer(p.digest),
            new TextEncoder().encode(msg)
          );
          const timeNow = new Date();
          const messageTime = new Date(p.date);
          const timeOk = timeNow.getTime() - messageTime.getTime() < timeWindowMS;
          console.log(validated && timeOk ? 'OK' : 'BAD');
          return {
            verified: true,
            valid: validated && timeOk,
            publicKeyUrl: p.publicKeyUrl,
          };
        } catch (e) {
          console.error(e);
          exceptions.push(e);
        }
      }

      console.log('NOT OK');

      const e = new Error("Couldn't verify signature");
      (e as any).exceptions = exceptions;
      throw e;
    };
  }
}
