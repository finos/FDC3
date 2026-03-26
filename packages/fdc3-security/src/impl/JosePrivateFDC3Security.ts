import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import { BrowserTypes } from '@finos/fdc3-schema';

type AntiReplay = BrowserTypes.AntiReplayClaims;
import * as jose from 'jose';
import { DEFAULT_FDC3_ALGORITHMS, FDC3SecurityAlgorithms } from './FDC3SecurityAlgorithms.js';
import { DEFAULT_FDC3_TIME_LIMITS, FDC3SecurityTimeLimits } from './FDC3SecurityTimeLimits.js';
import { FDC3UserClaims } from './FDC3UserClaims.js';
import { PrivateFDC3Security } from './PrivateFDC3Security.js';
import { JSONWebEncryption, JsonWebKeyWithId } from './PublicFDC3Security.js';
import {
  AllowListFunction,
  JosePublicFDC3Security,
  JWEProtectedHeader,
  JWKSResolver,
} from './JosePublicFDC3Security.js';
import { AntiReplayChecker, DefaultAntiReplayChecker } from './AntiReplayChecker.js';

type DetachedSignature = BrowserTypes.DetachedSignature;

/**
 * Implements the FDC3Security interface either in node or the browser.
 * Using the jose library for JSON Web Signatures and Encryption.
 *
 * @param signingPrivateKey - The signing private key
 * @param signingPublicKey - The signing public key (must have 'kid' property)
 * @param wrappingPrivateKey - The wrapping private key for decryption
 * @param wrappingPublicKey - The wrapping public key (must have 'kid' property)
 * @param issUrl - The issuer URL for JWT tokens
 * @param jwksUrl - The JWKS URL where public keys are published
 * @param publicKeyResolver - Function to resolve public keys from URLs
 * @param allowListFunction - Function to check if a URL is trusted
 * @param timeLimits - Optional time limits for signature freshness and context validity
 * @param algorithms - Optional algorithm configuration (defaults to EdDSA/RSA-OAEP-256/A256GCM)
 */
export class JosePrivateFDC3Security extends JosePublicFDC3Security implements PrivateFDC3Security {
  readonly signingPrivateKey: JsonWebKey;
  readonly wrappingPrivateKey: JsonWebKey;
  readonly issUrl: string;
  readonly jwksUrl: string;

  constructor(
    signingPrivateKey: JsonWebKey,
    signingPublicKey: JsonWebKey,
    wrappingPrivateKey: JsonWebKey,
    wrappingPublicKey: JsonWebKey,
    issUrl: string,
    jwksUrl: string,
    publicKeyResolver: (url: string) => JWKSResolver,
    allowListFunction: AllowListFunction,
    timeLimits: FDC3SecurityTimeLimits = DEFAULT_FDC3_TIME_LIMITS,
    algorithms: FDC3SecurityAlgorithms = DEFAULT_FDC3_ALGORITHMS,
    antiReplayChecker: AntiReplayChecker = new DefaultAntiReplayChecker()
  ) {
    super(
      signingPublicKey,
      wrappingPublicKey,
      publicKeyResolver,
      allowListFunction,
      timeLimits,
      algorithms,
      antiReplayChecker
    );
    this.signingPrivateKey = signingPrivateKey;
    this.wrappingPrivateKey = wrappingPrivateKey;
    this.jwksUrl = jwksUrl;
    this.issUrl = issUrl;
  }

  async encryptPublicKey(ctx: Context, publicKeyUrl: string): Promise<JSONWebEncryption> {
    const protectedHeader: JWEProtectedHeader = {
      alg: this.algorithms.keyWrapping,
      enc: this.algorithms.contentEncryption,
    };
    const jwk = await this.getPublicKey(publicKeyUrl, protectedHeader);
    const key = await jose.importJWK(jwk, this.algorithms.keyWrapping);
    const encrypted = await new jose.CompactEncrypt(new TextEncoder().encode(JSON.stringify(ctx)))
      .setProtectedHeader(protectedHeader)
      .encrypt(key);
    return encrypted;
  }

  async decryptPrivateKey(encrypted: JSONWebEncryption): Promise<Context> {
    const key = await jose.importJWK(this.wrappingPrivateKey, this.algorithms.keyWrapping);
    const decrypted = await jose.compactDecrypt(encrypted, key);
    const plaintext = decrypted.plaintext;
    return JSON.parse(new TextDecoder().decode(plaintext));
  }

  async sign(ctx: Context): Promise<{ signature: DetachedSignature; antiReplay: AntiReplay }> {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const antiReplay: AntiReplay = {
      iat: now,
      exp: now + this.timeLimits.contextValiditySeconds,
      jti: crypto.randomUUID(),
    };

    const data = this.canonicalize({ context: ctx, antiReplay });
    const key = await jose.importJWK(this.signingPrivateKey, this.algorithms.signing);
    const jws = await new jose.CompactSign(data)
      .setProtectedHeader({
        alg: this.algorithms.signing,
        jku: this.jwksUrl,
        iat: now,
        kid: this.signingPublicKey.kid,
      })
      .sign(key);
    const parts = jws.split('.');

    return {
      signature: {
        protected: parts[0],
        signature: parts[2],
      },
      antiReplay,
    };
  }

  async unwrapSymmetricKey(ctx: SymmetricKeyResponse): Promise<JsonWebKeyWithId> {
    const key = await jose.importJWK(this.wrappingPrivateKey, this.algorithms.keyWrapping);
    const result = await jose.compactDecrypt(ctx.wrappedKey, key);
    const jsonString = new TextDecoder().decode(result.plaintext);
    const decodedKey = JSON.parse(jsonString);
    return decodedKey;
  }

  async createJWTToken(aud: string, sub: string): Promise<string> {
    if (!this.allowListFunction(aud)) {
      throw new Error(`Audience is not trusted: ${aud}`);
    }

    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const payload: FDC3UserClaims = {
      iss: this.issUrl,
      aud: aud,
      sub: sub,
      exp: now + this.timeLimits.contextValiditySeconds,
      iat: now,
      jti: crypto.randomUUID(),
    };
    const key = await jose.importJWK(this.signingPrivateKey, this.algorithms.signing);
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({
        alg: this.algorithms.signing,
        jku: this.jwksUrl,
        kid: this.signingPublicKey.kid,
      })
      .sign(key);
    return token;
  }

  async decryptContextWithPrivateKey(encrypted: JSONWebEncryption): Promise<Context> {
    const decrypted = await jose.compactDecrypt(encrypted, this.wrappingPrivateKey);
    const plaintext = decrypted.plaintext;
    return JSON.parse(new TextDecoder().decode(plaintext));
  }
}

/**
 * Creates a signing key pair using the specified algorithm.
 *
 * @param id - The key ID to assign to the public key
 * @param algorithms - Optional algorithm configuration (defaults to EdDSA with Ed25519)
 */
export async function createSigningKeyPair(
  id: string,
  algorithms: FDC3SecurityAlgorithms = DEFAULT_FDC3_ALGORITHMS
): Promise<{ priv: JsonWebKey; pub: JsonWebKey }> {
  const keyPair = await jose.generateKeyPair(algorithms.signing, {
    extractable: true,
    crv: algorithms.signingCurve,
  });
  const privateKey = await jose.exportJWK(keyPair.privateKey);
  const publicKey = await jose.exportJWK(keyPair.publicKey);
  publicKey.kid = id;
  publicKey.alg = algorithms.signing;
  publicKey.use = 'sig';
  return { priv: privateKey, pub: publicKey };
}

/**
 * Creates a wrapping key pair using the specified algorithm.
 *
 * @param id - The key ID to assign to the public key
 * @param algorithms - Optional algorithm configuration (defaults to RSA-OAEP-256)
 */
export async function createWrappingKeyPair(
  id: string,
  algorithms: FDC3SecurityAlgorithms = DEFAULT_FDC3_ALGORITHMS
): Promise<{ priv: JsonWebKey; pub: JsonWebKey }> {
  const keyPair = await jose.generateKeyPair(algorithms.keyWrapping, {
    extractable: true,
    modulusLength: algorithms.rsaModulusLength,
  });
  const privateKey = await jose.exportJWK(keyPair.privateKey);
  const publicKey = await jose.exportJWK(keyPair.publicKey);
  publicKey.kid = id;
  publicKey.alg = algorithms.keyWrapping;
  publicKey.use = 'enc';
  return { priv: privateKey, pub: publicKey };
}

/**
 * Creates an instance with auto-generated keys.
 * This is a simplified constructor that automatically creates all required key pairs.
 *
 * @param baseUrl - The base URL for the application (used for issuer and JWKS URL)
 * @param publicKeyResolver - Function to resolve public keys from URLs
 * @param allowListFunction - Function to determine if a URL is trusted
 * @param timeLimits - Optional time limits for signature freshness and context validity
 * @param algorithms - Optional algorithm configuration (defaults to EdDSA/RSA-OAEP-256/A256GCM)
 * @param signingKeyId - Optional custom ID for the signing key (default: auto-generated)
 * @param wrappingKeyId - Optional custom ID for the wrapping key (default: auto-generated)
 * @returns Promise<JosePrivateFDC3Security> - A fully configured instance
 */
export async function createJosePrivateFDC3Security(
  baseUrl: string,
  publicKeyResolver: (url: string) => JWKSResolver,
  allowListFunction: AllowListFunction,
  timeLimits: FDC3SecurityTimeLimits = DEFAULT_FDC3_TIME_LIMITS,
  algorithms: FDC3SecurityAlgorithms = DEFAULT_FDC3_ALGORITHMS,
  signingKeyId?: string,
  wrappingKeyId?: string,
  antiReplayChecker: AntiReplayChecker = new DefaultAntiReplayChecker()
): Promise<JosePrivateFDC3Security> {
  // Generate unique IDs if not provided
  const finalSigningKeyId = signingKeyId || `signing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const finalWrappingKeyId = wrappingKeyId || `wrapping-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create key pairs using the configured algorithms
  const signingKeys = await createSigningKeyPair(finalSigningKeyId, algorithms);
  const wrappingKeys = await createWrappingKeyPair(finalWrappingKeyId, algorithms);

  // Create and return the instance
  return new JosePrivateFDC3Security(
    signingKeys.priv,
    signingKeys.pub,
    wrappingKeys.priv,
    wrappingKeys.pub,
    baseUrl,
    baseUrl + '/.well-known/jwks.json',
    publicKeyResolver,
    allowListFunction,
    timeLimits,
    algorithms,
    antiReplayChecker
  );
}
