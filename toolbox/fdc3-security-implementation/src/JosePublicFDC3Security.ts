import { Context } from '@finos/fdc3-context';
import canonicalize from 'canonicalize';
import * as jose from 'jose';
import { FDC3JWTPayload, JSONWebSignature, MessageAuthenticity, PublicFDC3Security } from '@finos/fdc3-security';

export type JSONWebKeyWithId = JsonWebKey & {
  kid: string; // Key ID
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

/**
 * Implements the FDC3Security interface either in node or the browser.
 * Using the jose library for JSON Web Signatures and Encryption.
 * @param signingPublicKey - The signing public key
 * @param wrappingPublicKey - The wrapping public key
 * @param publicKeyResolver - Function to resolve public keys from URLs
 * @param allowListFunction - TODO.
 * @param validityTimeLimit - Optional validity time limit in seconds (default: 5 minutes)
 */
export class JosePublicFDC3Security implements PublicFDC3Security {
  readonly signingPublicKey: JSONWebKeyWithId;
  readonly wrappingPublicKey: JSONWebKeyWithId;
  readonly validityTimeLimit: number; // in seconds
  readonly publicKeyResolver: (url: string) => JWKSResolver;
  readonly allowListFunction: (jku: string, iss?: string) => boolean;

  constructor(
    signingPublicKey: JsonWebKey,
    wrappingPublicKey: JsonWebKey,
    publicKeyResolver: (url: string) => JWKSResolver,
    allowListFunction: (url: string) => boolean,
    validityTimeLimit: number = 5 * 60
  ) {
    this.allowListFunction = allowListFunction;
    this.validityTimeLimit = validityTimeLimit;
    this.publicKeyResolver = publicKeyResolver;

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

  protected canonicalize(ctx: Context, intent: string | null, channelId: string | null): Uint8Array {
    const canonicalJson = canonicalize({ ctx, intent, channelId });
    const encoder = new TextEncoder();
    const payloadBytes = encoder.encode(canonicalJson);
    return payloadBytes;
  }

  protected getParametersFromHeader(sig: JSONWebSignature): { jku?: string; kid?: string; iat?: number } {
    const [protectedHeaderJSON] = sig.split('.');
    const protectedHeader = JSON.parse(atob(protectedHeaderJSON));
    return { jku: protectedHeader.jku, kid: protectedHeader.kid, iat: protectedHeader.iat };
  }

  async check(
    jws: JSONWebSignature,
    ctx: Context,
    intent: string | null,
    channelId: string | null
  ): Promise<MessageAuthenticity> {
    try {
      const { jku, kid, iat } = this.getParametersFromHeader(jws);

      if (!jku || !kid || !iat) {
        return {
          signed: false,
          error: `Signature does not contain a public key URL / Key ID / Issued At timestamp ${JSON.stringify({ jku, kid, iat })}`,
        };
      }

      const jwksEndpoint = this.publicKeyResolver(jku);
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const data1 = canonicalize({ ctx, intent, channelId });
      const data2 = jose.base64url.encode(data1!);
      const parts = jws.split('.');
      const reconstitutedJws = `${parts[0]}.${data2}.${parts[2]}`;

      const result = await jose.compactVerify(reconstitutedJws, jwksEndpoint, {});

      if (iat && now - iat > this.validityTimeLimit) {
        return {
          signed: false,
          error: `Signature is too old, valid for ${this.validityTimeLimit} seconds`,
        };
      }

      return {
        signed: true,
        valid: result.payload != null,
        trusted: this.allowListFunction(jku),
        publicKeyUrl: jku,
      };
    } catch (error) {
      return {
        signed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  getPublicKeys(): JSONWebKeyWithId[] {
    return [this.signingPublicKey, this.wrappingPublicKey];
  }

  async verifyJWTToken(token: string): Promise<FDC3JWTPayload> {
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

    return payload as FDC3JWTPayload;
  }
}

export function provisionJWKS(jku: string): JWKSResolver {
  return jose.createRemoteJWKSet(new URL(jku));
}
