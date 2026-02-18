import { AntiReplay, Context } from '@finos/fdc3-context';
import { BrowserTypes } from '@finos/fdc3-schema';
import canonicalize from 'canonicalize';
import * as jose from 'jose';
import { DEFAULT_FDC3_ALGORITHMS, FDC3SecurityAlgorithms } from '../FDC3SecurityAlgorithms';
import { DEFAULT_FDC3_TIME_LIMITS, FDC3SecurityTimeLimits } from '../FDC3SecurityTimeLimits';
import { FDC3UserClaims } from '../FDC3UserClaims';
import { MessageAuthenticity } from '../MessageAuthenticity';
import { JSONWebEncryption, PublicFDC3Security } from '../PublicFDC3Security';

type DetachedSignature = BrowserTypes.DetachedSignature;

export type JSONWebKeyWithId = JsonWebKey & {
  kid?: string; // Key ID
  alg: string; // Algorithm used for the key
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
 */
export class JosePublicFDC3Security implements PublicFDC3Security {
  readonly signingPublicKey: JSONWebKeyWithId;
  readonly wrappingPublicKey: JSONWebKeyWithId;
  readonly timeLimits: FDC3SecurityTimeLimits;
  readonly publicKeyResolver: (url: string) => JWKSResolver;
  readonly allowListFunction: AllowListFunction;
  readonly algorithms: FDC3SecurityAlgorithms;

  constructor(
    signingPublicKey: JsonWebKey,
    wrappingPublicKey: JsonWebKey,
    publicKeyResolver: (url: string) => JWKSResolver,
    allowListFunction: AllowListFunction,
    timeLimits: FDC3SecurityTimeLimits = DEFAULT_FDC3_TIME_LIMITS,
    algorithms: FDC3SecurityAlgorithms = DEFAULT_FDC3_ALGORITHMS
  ) {
    this.allowListFunction = allowListFunction;
    this.timeLimits = timeLimits;
    this.publicKeyResolver = publicKeyResolver;
    this.algorithms = algorithms;

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

  protected canonicalize(ctx: Context): Uint8Array {
    const canonicalJson = canonicalize(ctx);
    const encoder = new TextEncoder();
    const payloadBytes = encoder.encode(canonicalJson);
    return payloadBytes;
  }

  protected getParametersFromHeader(sig: string): { alg?: string; jku?: string; kid?: string; iat?: number } {
    const [protectedHeaderJSON] = sig.split('.');
    const protectedHeader = JSON.parse(atob(protectedHeaderJSON));
    return { alg: protectedHeader.alg, jku: protectedHeader.jku, kid: protectedHeader.kid, iat: protectedHeader.iat };
  }

  /**
   * Converts a DetachedSignature to a compact JWS string for internal processing.
   */
  protected detachedToCompact(sig: DetachedSignature): string {
    return `${sig.protected}..${sig.signature}`;
  }

  async check(sig: DetachedSignature, ctx: Context): Promise<MessageAuthenticity> {
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
      const data1 = canonicalize(ctx);
      const data2 = jose.base64url.encode(data1!);
      const parts = compactSig.split('.');
      const reconstitutedJws = `${parts[0]}.${data2}.${parts[2]}`;

      const result = await jose.compactVerify(reconstitutedJws, jwksEndpoint, {});

      // Check signature freshness (based on iat in header)
      if (iat && now - iat > this.timeLimits.signatureFreshnessSeconds) {
        return {
          signed: false,
          errors: [
            `Signature is too old (iat: ${iat}, now: ${now}, max age: ${this.timeLimits.signatureFreshnessSeconds}s)`,
          ],
        };
      }

      // Extract anti-replay claims from context if present
      const antiReplayClaims: AntiReplay = ctx.antiReplay ?? {
        iat: iat,
        exp: iat + this.timeLimits.contextValiditySeconds,
        jti: 'unknown',
      };

      // Check context expiry (based on exp in antiReplay)
      if (antiReplayClaims.exp && now > antiReplayClaims.exp) {
        return {
          signed: false,
          errors: [`Context has expired (exp: ${antiReplayClaims.exp}, now: ${now})`],
        };
      }

      return {
        signed: true,
        valid: result.payload != null,
        trusted: this.allowListFunction(jku),
        alg,
        kid,
        jku,
        antiReplayClaims,
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
    if (!payload.iss) {
      throw new Error('JWT payload missing required field: iss');
    }
    if (!payload.aud) {
      throw new Error('JWT payload missing required field: aud');
    }
    if (!payload.sub) {
      throw new Error('JWT payload missing required field: sub');
    }
    if (!payload.exp) {
      throw new Error('JWT payload missing required field: exp');
    }
    if (!payload.iat) {
      throw new Error('JWT payload missing required field: iat');
    }
    if (!payload.jti) {
      throw new Error('JWT payload missing required field: jti');
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
}

export function provisionJWKS(jku: string): JWKSResolver {
  return jose.createRemoteJWKSet(new URL(jku));
}
