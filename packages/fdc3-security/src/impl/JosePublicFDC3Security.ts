import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import { BrowserTypes } from '@finos/fdc3-schema';

type AntiReplay = BrowserTypes.AntiReplayClaims;
import canonicalize from 'canonicalize';
import * as jose from 'jose';
import { DEFAULT_FDC3_ALGORITHMS, FDC3SecurityAlgorithms } from './FDC3SecurityAlgorithms';
import { DEFAULT_FDC3_TIME_LIMITS, FDC3SecurityTimeLimits } from './FDC3SecurityTimeLimits';
import { FDC3UserClaims } from './FDC3UserClaims';
import { PublicFDC3Security } from './PublicFDC3Security';
import { AntiReplayChecker, DefaultAntiReplayChecker } from './AntiReplayChecker';

type MessageAuthenticity = BrowserTypes.MessageAuthenticity;
type JSONWebEncryption = string;

type DetachedSignature = BrowserTypes.DetachedSignature;

export type JSONWebKeyWithId = JsonWebKey & {
  kid?: string; // Key ID
  alg: string; // Algorithm used for the key
};

/**
 * JWE protected header parameters for encryption operations.
 */
export type JWEProtectedHeader = {
  alg: string;
  enc: string;
};

export type JWKSResolver = {
  (protectedHeader?: jose.JWSHeaderParameters, token?: jose.FlattenedJWSInput): Promise<CryptoKey>;
  /** @ignore */
  coolingDown: boolean;
  /** @ignore */
  fresh: boolean;
  /** @ignore */
  reloading: boolean;
  /** @ignore */
  reload: () => Promise<void>;
  /** @ignore */
  jwks: () => jose.JSONWebKeySet | undefined;
};

export type AllowListFunction = (jku: string, iss?: string) => boolean;

/**
 * Implements the FDC3Security interface either in node or the browser.
 * Using the jose library for JSON Web Signatures and Encryption.
 *
 * @param signingPublicKey - The signing public key
 * @param wrappingPublicKey - The wrapping public key
 * @param publicKeyResolver - Function to resolve public keys from URLs
 * @param allowListFunction - Function to check if a URL is trusted
 * @param timeLimits - Optional time limits for signature freshness and context validity
 * @param algorithms - Optional algorithm configuration (defaults to EdDSA/RSA-OAEP-256/A256GCM)
 * @param antiReplayChecker - Checks for replay attacks
 */
export class JosePublicFDC3Security implements PublicFDC3Security {
  readonly signingPublicKey: JSONWebKeyWithId;
  readonly wrappingPublicKey: JSONWebKeyWithId;
  readonly timeLimits: FDC3SecurityTimeLimits;
  readonly publicKeyResolver: (url: string) => JWKSResolver;
  readonly allowListFunction: AllowListFunction;
  readonly algorithms: FDC3SecurityAlgorithms;
  readonly antiReplayChecker?: AntiReplayChecker;

  constructor(
    signingPublicKey: JsonWebKey,
    wrappingPublicKey: JsonWebKey,
    publicKeyResolver: (url: string) => JWKSResolver,
    allowListFunction: AllowListFunction,
    timeLimits: FDC3SecurityTimeLimits = DEFAULT_FDC3_TIME_LIMITS,
    algorithms: FDC3SecurityAlgorithms = DEFAULT_FDC3_ALGORITHMS,
    antiReplayChecker: AntiReplayChecker = new DefaultAntiReplayChecker()
  ) {
    this.allowListFunction = allowListFunction;
    this.timeLimits = timeLimits;
    this.publicKeyResolver = publicKeyResolver;
    this.algorithms = algorithms;
    this.antiReplayChecker = antiReplayChecker;

    if (!(signingPublicKey as JSONWebKeyWithId).kid) {
      throw new Error("Signing public key must have a 'kid' (Key ID) property");
    } else {
      this.signingPublicKey = signingPublicKey as JSONWebKeyWithId;
    }

    if (!(wrappingPublicKey as JSONWebKeyWithId).kid) {
      throw new Error("Wrapping public key must have a 'kid' (Key ID) property");
    } else {
      this.wrappingPublicKey = wrappingPublicKey as JSONWebKeyWithId;
    }
  }

  protected canonicalizeKey(key: JsonWebKey): Uint8Array {
    const canonicalJson = canonicalize(key);
    const encoder = new TextEncoder();
    const keyBytes = encoder.encode(canonicalJson);
    return keyBytes;
  }

  protected canonicalize(obj: any): Uint8Array {
    const canonicalJson = canonicalize(obj);
    const encoder = new TextEncoder();
    const payloadBytes = encoder.encode(canonicalJson);
    return payloadBytes;
  }

  protected getParametersFromHeader(sig: string): { alg?: string; jku?: string; kid?: string; iat?: number } {
    const [protectedHeaderJSON] = sig.split('.');
    const protectedHeader = JSON.parse(atob(protectedHeaderJSON));
    return { alg: protectedHeader.alg, jku: protectedHeader.jku, kid: protectedHeader.kid, iat: protectedHeader.iat };
  }

  protected async getPublicKey(publicKeyUrl: string, protectedHeader: JWEProtectedHeader): Promise<JSONWebKeyWithId> {
    const JWKS = this.publicKeyResolver(publicKeyUrl);
    await JWKS.reload();

    const allKeys = JWKS.jwks()?.keys ?? [];
    const key = allKeys.find((k: JsonWebKey) => k.alg == protectedHeader.alg);

    if (key == undefined) {
      throw new Error(`No key found for algorithm ${protectedHeader.alg}`);
    }

    return key as JSONWebKeyWithId;
  }

  /**
   * Converts a DetachedSignature to a compact JWS string for internal processing.
   */
  protected detachedToCompact(sig: DetachedSignature): string {
    return `${sig.protected}..${sig.signature}`;
  }

  async check(sig: DetachedSignature, ctx: Context, antiReplay: AntiReplay): Promise<MessageAuthenticity> {
    try {
      const compactSig = this.detachedToCompact(sig);
      const { alg, jku, kid, iat } = this.getParametersFromHeader(compactSig);

      if (!alg || !jku || !kid || !iat) {
        return {
          signed: false,
          errors: [`Signature does not contain required header fields: ${JSON.stringify({ alg, jku, kid, iat })}`],
        };
      }

      const jwksEndpoint = this.publicKeyResolver(jku);
      const now = Math.floor(Date.now() / 1000); // Current time in seconds

      // Canonicalize both context and antiReplay for verification
      const data1 = canonicalize({ context: ctx, antiReplay });
      const data2 = jose.base64url.encode(data1!);
      const parts = compactSig.split('.');
      const reconstitutedJws = `${parts[0]}.${data2}.${parts[2]}`;

      const result = await jose.compactVerify(reconstitutedJws, jwksEndpoint, {});

      // Check signature freshness (based on iat in header)
      if (iat && now - iat > this.timeLimits.signatureFreshnessSeconds) {
        return {
          signed: true,
          valid: false,
          trusted: false,
          antiReplayClaims: antiReplay,

          errors: [
            `Signature is too old (iat: ${iat}, now: ${now}, max age: ${this.timeLimits.signatureFreshnessSeconds}s)`,
          ],
        };
      }

      // Check context expiry (based on exp in antiReplay)
      if (antiReplay.exp && now > antiReplay.exp) {
        return {
          signed: false,
          errors: [`Context has expired (exp: ${antiReplay.exp}, now: ${now})`],
        };
      }

      // Check pluggable anti-replay claims (like jti)
      if (this.antiReplayChecker) {
        const replayValid = await this.antiReplayChecker.check(antiReplay);
        if (!replayValid) {
          return {
            signed: false,
            errors: [`Anti-replay check failed for jti: ${antiReplay.jti}`],
          };
        }
      }

      return {
        signed: true,
        valid: result.payload != null,
        trusted: this.allowListFunction(jku),
        alg,
        kid,
        jku,
        antiReplayClaims: antiReplay,
      };
    } catch (error) {
      return {
        signed: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  getPublicKeys(): JSONWebKeyWithId[] {
    return [this.signingPublicKey, this.wrappingPublicKey];
  }

  async createSymmetricKey(): Promise<JsonWebKey> {
    const secret = await jose.generateSecret(this.algorithms.contentEncryption, { extractable: true });
    return jose.exportJWK(secret);
  }

  async verifyJWTToken(token: string): Promise<FDC3UserClaims> {
    const { jku, kid } = this.getParametersFromHeader(token);

    if (!jku || !kid) {
      throw new Error(`JWT does not contain jku / kid ${JSON.stringify({ jku, kid })}`);
    }

    // check the issuer
    if (!this.allowListFunction(jku)) {
      throw new Error(`JWT issuer is not trusted: ${jku}`);
    }

    const jwksEndpoint = this.publicKeyResolver(jku);

    const { payload } = await jose.jwtVerify(token, jwksEndpoint);

    // Validate required fields exist
    const requiredFields = ['iss', 'aud', 'sub', 'exp', 'iat', 'jti'] as const;
    for (const field of requiredFields) {
      if (!payload[field]) {
        throw new Error(`JWT payload missing required field: ${field}`);
      }
    }

    if (!this.allowListFunction(jku, payload.iss)) {
      throw new Error(`JWT issuer is not trusted: ${payload.iss}`);
    }

    return payload as FDC3UserClaims;
  }

  async encryptSymmetric(ctx: Context, symmetricKey: JsonWebKey): Promise<JSONWebEncryption> {
    const key = await jose.importJWK(symmetricKey as jose.JWK, this.algorithms.contentEncryption);
    const encrypted = await new jose.CompactEncrypt(new TextEncoder().encode(JSON.stringify(ctx)))
      .setProtectedHeader({
        alg: this.algorithms.directEncryption,
        enc: this.algorithms.contentEncryption,
      })
      .encrypt(key);
    return encrypted;
  }

  async decryptSymmetric(encrypted: JSONWebEncryption, symmetricKey: JsonWebKey): Promise<Context> {
    const key = await jose.importJWK(symmetricKey as jose.JWK, this.algorithms.contentEncryption);
    const decrypted = await jose.compactDecrypt(encrypted, key);
    const plaintext = decrypted.plaintext;
    return JSON.parse(new TextDecoder().decode(plaintext));
  }

  async wrapKey(symmetricKey: JsonWebKey, publicKeyUrl: string): Promise<SymmetricKeyResponse> {
    const protectedHeader: JWEProtectedHeader = {
      alg: this.algorithms.keyWrapping,
      enc: this.algorithms.contentEncryption,
    };
    const data = this.canonicalizeKey(symmetricKey);
    const jwk = await this.getPublicKey(publicKeyUrl, protectedHeader);
    const key = await jose.importJWK(jwk, this.algorithms.keyWrapping);
    const wrapped = await new jose.CompactEncrypt(data).setProtectedHeader(protectedHeader).encrypt(key);

    return {
      type: 'fdc3.security.symmetricKeyResponse',
      wrappedKey: wrapped,
      id: {
        pki: publicKeyUrl,
        kid: jwk.kid ?? 'not specified',
      },
    };
  }
}

export function provisionJWKS(jku: string): JWKSResolver {
  return jose.createRemoteJWKSet(new URL(jku));
}
