import { PrivateChannel } from '@finos/fdc3-standard';

/**
 * A private channel with end-to-end encryption capabilities.
 *
 * This interface extends FDC3's `PrivateChannel` to add symmetric key encryption
 * for secure communication between apps. Messages are encrypted using a shared
 * symmetric key (AES-GCM), ensuring that only participants with the key can
 * read the content.
 *
 * ## Typical Usage Flow
 *
 * **Channel Creator (key owner):**
 * 1. Create the private channel
 * 2. Call `setChannelEncryption()` with a filter to enable encryption
 * 3. When another app joins, call `broadcastKey()` with their public key URL
 *    to securely share the symmetric key
 *
 * **Channel Joiner:**
 * 1. Join the private channel
 * 2. Listen for wrapped key broadcasts and call `setSymmetricKey()` when received
 * 3. Messages are automatically decrypted once the key is set
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export interface EncryptingPrivateChannel extends PrivateChannel {
  /**
   * Checks whether encryption is enabled for a specific context type.
   *
   * @param type - The FDC3 context type to check (e.g., `"fdc3.instrument"`)
   * @returns `true` if messages of this type will be encrypted before broadcast
   *
   * @example
   * ```typescript
   * if (channel.isEncrypting('fdc3.instrument')) {
   *   console.log('Instrument data will be encrypted');
   * }
   * ```
   */
  isEncrypting(type: string): boolean;

  /**
   * Enables or disables encryption for messages on this channel.
   *
   * When enabled, outgoing messages matching the filter are encrypted with the
   * channel's symmetric key before broadcast. Incoming encrypted messages are
   * automatically decrypted if the symmetric key is set.
   *
   * @param filter - A function that returns `true` for context types that should
   *                 be encrypted. Pass `null` to disable encryption entirely.
   * @returns A promise that resolves when encryption settings are applied
   *
   * @example
   * ```typescript
   * // Encrypt all messages
   * await channel.setChannelEncryption(() => true);
   *
   * // Encrypt only sensitive context types
   * await channel.setChannelEncryption(type =>
   *   type === 'fdc3.portfolio' || type === 'fdc3.trade'
   * );
   *
   * // Disable encryption
   * await channel.setChannelEncryption(null);
   * ```
   */
  setChannelEncryption(filter: null | ((type: string) => boolean)): Promise<void>;

  /**
   * Shares the channel's symmetric key with another app by wrapping it with
   * their public key.
   *
   * The symmetric key is encrypted (wrapped) using the recipient's public key
   * from their JWKS endpoint, then broadcast on the channel. Only the recipient
   * with the corresponding private key can unwrap and use the symmetric key.
   *
   * @param publicKeyUrl - The JWKS URL of the receiving app (e.g., from their
   *                       signature's `jku` header field)
   * @returns A promise that resolves when the wrapped key has been broadcast
   * @throws Error if the public key cannot be retrieved or key wrapping fails
   *
   * @example
   * ```typescript
   * // When a new app joins, share the encryption key with them
   * channel.onAddContextListener(listener => {
   *   const joinerPublicKey = listener.metadata?.source?.publicKeyUrl;
   *   if (joinerPublicKey) {
   *     await channel.broadcastKey(joinerPublicKey);
   *   }
   * });
   * ```
   */
  broadcastKey(publicKeyUrl: string): Promise<void>;

  /**
   * Retrieves the current symmetric key used for encryption on this channel.
   *
   * @returns A promise resolving to the symmetric key as a JWK, or `null` if
   *          no key has been set (encryption not yet initialized)
   *
   * @example
   * ```typescript
   * const key = await channel.getSymmetricKey();
   * if (key) {
   *   console.log('Channel is ready for encrypted communication');
   * } else {
   *   console.log('Waiting for encryption key...');
   * }
   * ```
   */
  getSymmetricKey(): Promise<JsonWebKey | null>;

  /**
   * Sets the symmetric key for encrypting and decrypting messages on this channel.
   *
   * Channel creators typically generate a new key automatically when enabling
   * encryption. Channel joiners call this method after receiving and unwrapping
   * a key that was shared via `broadcastKey()`.
   *
   * @param key - The symmetric key as a JSON Web Key (JWK), typically an AES key
   * @returns A promise that resolves when the key is set and ready for use
   *
   * @example
   * ```typescript
   * // After receiving a wrapped key response
   * const unwrappedKey = await security.unwrapSymmetricKey(wrappedKeyResponse);
   * await channel.setSymmetricKey(unwrappedKey);
   * // Channel can now decrypt incoming messages
   * ```
   */
  setSymmetricKey(key: JsonWebKey): Promise<void>;
}
