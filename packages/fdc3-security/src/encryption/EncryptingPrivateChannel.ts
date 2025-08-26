import { PrivateChannel } from '@finos/fdc3-standard';

export interface EncryptingPrivateChannel extends PrivateChannel {
  /**
   * Returns true if this channel is set to encrypt with setChannelEncryption()
   */
  isEncrypting(type: string): boolean;

  /**
   * Call this method after creation to ensure that further communications on
   * the channel are encrypted for the filtered types.
   */
  setChannelEncryption(filter: null | ((type: string) => boolean)): Promise<void>;

  /**
   * Broadcasts the channel's symmetric key, wrapped in the provided public key of
   * a receiving app.
   */
  broadcastKey(publicKeyUrl: string): Promise<void>;

  getSymmetricKey(): Promise<JsonWebKey | null>;

  /**
   * Sets the symmetric key used by this channel for encrypting or decrypting
   * messages.
   */
  setSymmetricKey(key: JsonWebKey): Promise<void>;
}
