/**
 * Algorithm configuration for FDC3 Security operations.
 *
 * These algorithms follow JOSE (JSON Object Signing and Encryption) standards
 * as defined in RFC 7518 and RFC 8037.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518 | RFC 7518 - JSON Web Algorithms (JWA)}
 * @see {@link https://datatracker.ietf.org/doc/html/rfc8037 | RFC 8037 - CFRG Elliptic Curve Diffie-Hellman (ECDH) and Signatures in JOSE}
 */
export interface FDC3SecurityAlgorithms {
  /**
   * Algorithm for digital signatures.
   * @default "EdDSA" - Edwards-curve Digital Signature Algorithm (Ed25519)
   */
  signing: string;

  /**
   * Curve for EdDSA signing (if applicable).
   * @default "Ed25519"
   */
  signingCurve?: string;

  /**
   * Algorithm for asymmetric key wrapping (encrypting to a recipient's public key).
   * @default "RSA-OAEP-256" - RSA-OAEP using SHA-256
   */
  keyWrapping: string;

  /**
   * RSA modulus length for key generation (if using RSA).
   * @default 2048
   */
  rsaModulusLength?: number;

  /**
   * Algorithm for symmetric content encryption.
   * @default "A256GCM" - AES-256 in Galois/Counter Mode
   */
  contentEncryption: string;

  /**
   * Algorithm identifier for direct symmetric encryption (no key wrapping).
   * @default "dir"
   */
  directEncryption: string;
}

/**
 * Default algorithm configuration following current JOSE best practices.
 *
 * These defaults provide strong security with good performance:
 * - EdDSA with Ed25519: Fast, secure signatures with small keys
 * - RSA-OAEP-256: Widely supported asymmetric encryption
 * - A256GCM: Fast authenticated encryption with hardware acceleration
 */
export const DEFAULT_FDC3_ALGORITHMS: FDC3SecurityAlgorithms = {
  signing: 'EdDSA',
  signingCurve: 'Ed25519',
  keyWrapping: 'RSA-OAEP-256',
  rsaModulusLength: 2048,
  contentEncryption: 'A256GCM',
  directEncryption: 'dir',
};

/**
 * Alternative algorithm configuration using ECDSA instead of EdDSA.
 * Use this if Ed25519 is not supported in your environment.
 */
export const ECDSA_FDC3_ALGORITHMS: FDC3SecurityAlgorithms = {
  signing: 'ES256',
  signingCurve: 'P-256',
  keyWrapping: 'RSA-OAEP-256',
  rsaModulusLength: 2048,
  contentEncryption: 'A256GCM',
  directEncryption: 'dir',
};
