import { ContextMetadata, Context, PrivateChannel } from '@finos/fdc3';
import { SymmetricKeyResponseContext } from './SymmetricKeyContext';
import { base64ToArrayBuffer } from '../ClientSideImplementation';

export type Encrypt = (msg: Context, symmetricKey: CryptoKey) => Promise<EncryptedContext>;
export type Decrypt = (msg: EncryptedContent, symmetricKey: CryptoKey) => Promise<Context>;

export type WrapKey = (toWrap: CryptoKey, publicKeyUrl: string) => Promise<SymmetricKeyResponseContext>;
export type UnwrapKey = (key: SymmetricKeyResponseContext) => Promise<CryptoKey | null>;

/**
 * This is the field that is added to the context object to contain the encrypted content
 */
export const ENCRYPTION_KEY = '__encrypted';

export const CANT_DECRYPT = 'cant_decrypt';
export const NOT_ENCRYPTED = 'not_encrypted';
export const DECRYPTED = 'decrypted';

export const ENCRYPTION_STATUS = 'encryption';

export type EncryptedContent = {
  encoded: string;
  algorithm: any;
};

export const SYMMETRIC_ENCRYPTION_ALGORITHM = 'AES-GCM';

export type EncryptedContext = {
  type: string;
  __encrypted: EncryptedContent;
};

export type ContextMetadataWithEncryptionStatus = ContextMetadata & {
  encryption?: 'cant_decrypt' | 'not_encrypted' | 'decrypted';
};

export async function createSymmetricKey() {
  const k = (await crypto.subtle.generateKey(SYMMETRIC_KEY_PARAMS, true, ['encrypt', 'decrypt'])) as CryptoKey;
  return k;
}

export const SYMMETRIC_KEY_PARAMS: AesKeyGenParams = {
  name: SYMMETRIC_ENCRYPTION_ALGORITHM,
  length: 256,
};

function serializeUInt8(array: Uint8Array): string {
  return btoa(String.fromCharCode(...array));
}

function deserializeUInt8(base64: string): Uint8Array {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const encrypt: Encrypt = async (c: Context, key: CryptoKey) => {
  const msg = JSON.stringify(c);
  console.log('ENCRYPTING ' + msg);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const details = { name: SYMMETRIC_ENCRYPTION_ALGORITHM, iv };
  const buffer = await crypto.subtle.encrypt(details, key, new TextEncoder().encode(msg));
  const encoded = btoa(String.fromCharCode(...new Uint8Array(buffer)));

  return {
    type: c.type,
    __encrypted: {
      algorithm: {
        name: SYMMETRIC_ENCRYPTION_ALGORITHM,
        iv: serializeUInt8(iv),
      },
      encoded,
    },
  };
};

export const decrypt: Decrypt = async (e: EncryptedContent, key: CryptoKey) => {
  console.log('DECRYPTING ' + e.encoded);
  const details = { name: SYMMETRIC_ENCRYPTION_ALGORITHM, iv: deserializeUInt8(e.algorithm.iv) };
  const buffer = await crypto.subtle.decrypt(details, key, base64ToArrayBuffer(e.encoded));
  const decrypted = new TextDecoder().decode(buffer);
  return JSON.parse(decrypted);
};

export interface EncryptingPrivateChannel extends PrivateChannel {
  /**
   * Returns true if this channel is set to encrypt with setChannelEncryption(true)
   */
  isEncrypting(): boolean;

  /**
   * Call this method after creation to ensure that further communications on
   * the channel are encrypted.
   */
  setChannelEncryption(state: boolean): Promise<void>;

  /**
   * Broadcasts the channel's symmetric key, wrapped in the provided public key of
   * a receiving app.
   */
  broadcastKey(publicKeyUrl: string): Promise<void>;
}

export const WRAPPING_ALGORITHM = 'RSA-OAEP';

export const WRAPPING_ALGORITHM_KEY_PARAMS: RsaHashedKeyGenParams = {
  name: WRAPPING_ALGORITHM,
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: 'SHA-256',
};

export const WRAPPING_ALGORITHM_DETAILS: RsaOaepParams = {
  name: WRAPPING_ALGORITHM,
};
