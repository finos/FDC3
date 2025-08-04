import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import { FDC3Security, JSONWebEncryption, JSONWebSignature, MessageAuthenticity, FDC3JWTPayload } from './FDC3Security';
import canonicalize from 'canonicalize';
import * as jose from 'jose';

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
 */
export class JoseFDC3Security implements FDC3Security {
  readonly signingPrivateKey: JsonWebKey;
  readonly signingPublicKey: JSONWebKeyWithId;
  readonly wrappingPrivateKey: JsonWebKey;
  readonly wrappingPublicKey: JSONWebKeyWithId;
  readonly issUrl: string;
  readonly jwksUrl: string;
  readonly allowListFunction: (url: string) => boolean;
  readonly validityTimeLimit: number; // in seconds
  readonly publicKeyResolver: (url: string) => JWKSResolver;

  constructor(
    signingPrivateKey: JsonWebKey,
    signingPublicKey: JsonWebKey,
    wrappingPrivateKey: JsonWebKey,
    wrappingPublicKey: JsonWebKey,
    issUrl: string,
    jwksUrl: string,
    publicKeyResolver: (url: string) => JWKSResolver,
    allowListFunction: (url: string) => boolean,
    validityTimeLimit: number = 5 * 60
  ) {
    this.signingPrivateKey = signingPrivateKey;
    this.wrappingPrivateKey = wrappingPrivateKey;
    this.jwksUrl = jwksUrl;
    this.issUrl = issUrl;
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

  async encrypt(ctx: Context, symmetricKey: JsonWebKey): Promise<JSONWebEncryption> {
    const encrypted = await new jose.CompactEncrypt(new TextEncoder().encode(JSON.stringify(ctx)))
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(symmetricKey);
    return encrypted;
  }

  async decrypt(encrypted: JSONWebEncryption, symmetricKey: JsonWebKey): Promise<Context> {
    const decrypted = await jose.compactDecrypt(encrypted, symmetricKey);
    const plaintext = decrypted.plaintext;
    return JSON.parse(new TextDecoder().decode(plaintext));
  }

  private canonicalizeKey(key: JsonWebKey): Uint8Array {
    const canonicalJson = canonicalize(key);
    const encoder = new TextEncoder();
    const keyBytes = encoder.encode(canonicalJson);
    return keyBytes;
  }

  private canonicalize(ctx: Context, intent: string | null, channelId: string | null): Uint8Array {
    const canonicalJson = canonicalize({ ctx, intent, channelId });
    const encoder = new TextEncoder();
    const payloadBytes = encoder.encode(canonicalJson);
    return payloadBytes;
  }

  private getParametersFromHeader(sig: JSONWebSignature): { jku?: string; kid?: string; iat?: number } {
    const [protectedHeaderJSON] = sig.split('.');
    const protectedHeader = JSON.parse(atob(protectedHeaderJSON));
    return { jku: protectedHeader.jku, kid: protectedHeader.kid, iat: protectedHeader.iat };
  }

  async sign(ctx: Context, intent: string | null, channelId: string | null): Promise<JSONWebSignature> {
    const data = this.canonicalize(ctx, intent, channelId);
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const jws = await new jose.CompactSign(data)
      .setProtectedHeader({ alg: 'EdDSA', jku: this.jwksUrl, iat: now, kid: this.signingPublicKey.kid })
      .sign(this.signingPrivateKey);
    const parts = jws.split('.');
    console.log('SIGNED  : ' + jws);
    const detachedJWS = `${parts[0]}..${parts[2]}`;
    return detachedJWS;
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

      console.log('CHECKING: ' + reconstitutedJws);

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

  async createSymmetricKey(): Promise<JsonWebKey> {
    return jose.generateSecret('A256GCM', { extractable: true }).then(secret => jose.exportJWK(secret));
  }

  async wrapKey(symmetricKey: JsonWebKey, publicKeyUrl: string): Promise<SymmetricKeyResponse> {
    const protectedHeader = { alg: 'RSA-OAEP-256', enc: 'A256GCM' };
    const JWKS = this.publicKeyResolver(publicKeyUrl);
    const data = this.canonicalizeKey(symmetricKey);
    const key = await JWKS(protectedHeader);

    const wrapped = await new jose.CompactEncrypt(data).setProtectedHeader(protectedHeader).encrypt(key);

    return {
      type: 'fdc3.security.symmetricKey.response',
      wrappedKey: wrapped,
      id: {
        pki: publicKeyUrl,
        kid: 'bongo',
      },
    };
  }

  async unwrapKey(ctx: SymmetricKeyResponse): Promise<JsonWebKey> {
    const result = await jose.compactDecrypt(ctx.wrappedKey, this.wrappingPrivateKey);
    const jsonString = new TextDecoder().decode(result.plaintext);
    const decodedKey = JSON.parse(jsonString);
    return decodedKey;
  }

  getPublicKeys(): JSONWebKeyWithId[] {
    return [this.signingPublicKey, this.wrappingPublicKey];
  }

  async createJWTToken(aud: string, sub: string): Promise<string> {
    if (!this.allowListFunction(aud)) {
      throw new Error(`Audience is not trusted: ${aud}`);
    }

    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const payload: FDC3JWTPayload = {
      iss: this.issUrl,
      aud: aud,
      sub: sub,
      exp: now + this.validityTimeLimit,
      iat: now,
      jti: crypto.randomUUID(),
    };
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'EdDSA', jku: this.jwksUrl, kid: this.signingPublicKey.kid })
      .sign(this.signingPrivateKey);
    return token;
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

    return payload as FDC3JWTPayload;
  }
}

export function provisionJWKS(jku: string): JWKSResolver {
  return jose.createRemoteJWKSet(new URL(jku));
}

export async function createSigningKeyPair(id: string): Promise<{ priv: JsonWebKey; pub: JsonWebKey }> {
  const keyPair = await jose.generateKeyPair('EdDSA', {
    extractable: true,
    crv: 'Ed25519',
  });
  const privateKey = await jose.exportJWK(keyPair.privateKey);
  const publicKey = await jose.exportJWK(keyPair.publicKey);
  publicKey.kid = id;
  publicKey.alg = 'EdDSA';
  publicKey.use = 'sig';
  return { priv: privateKey, pub: publicKey };
}

export async function createWrappingKeyPair(id: string): Promise<{ priv: JsonWebKey; pub: JsonWebKey }> {
  const keyPair = await jose.generateKeyPair('RSA-OAEP-256', {
    extractable: true,
    modulusLength: 2048,
  });
  const privateKey = await jose.exportJWK(keyPair.privateKey);
  const publicKey = await jose.exportJWK(keyPair.publicKey);
  publicKey.kid = id;
  publicKey.alg = 'RSA-OAEP-256';
  publicKey.use = 'enc';
  return { priv: privateKey, pub: publicKey };
}

/**
 * Creates an instance with auto-generated keys.
 * This is a simplified constructor that automatically creates all required key pairs.
 *
 * @param jwksUrl - The URL where this instance's public keys can be found
 * @param publicKeyResolver - Function to resolve public keys from URLs
 * @param allowListFunction - Function to determine if a URL is trusted
 * @param validityTimeLimit - Optional validity time limit in seconds (default: 5 minutes)
 * @param signingKeyId - Optional custom ID for the signing key (default: auto-generated)
 * @param wrappingKeyId - Optional custom ID for the wrapping key (default: auto-generated)
 * @returns Promise<ClientSideImplementation> - A fully configured instance
 */
export async function createJoseFDC3Security(
  baseUrl: string,
  publicKeyResolver: (url: string) => JWKSResolver,
  allowListFunction: (url: string) => boolean,
  validityTimeLimit: number = 5 * 60,
  signingKeyId?: string,
  wrappingKeyId?: string
): Promise<JoseFDC3Security> {
  // Generate unique IDs if not provided
  const finalSigningKeyId = signingKeyId || `signing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const finalWrappingKeyId = wrappingKeyId || `wrapping-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create key pairs
  const signingKeys = await createSigningKeyPair(finalSigningKeyId);
  const wrappingKeys = await createWrappingKeyPair(finalWrappingKeyId);

  // Create and return the instance
  return new JoseFDC3Security(
    signingKeys.priv,
    signingKeys.pub,
    wrappingKeys.priv,
    wrappingKeys.pub,
    baseUrl,
    baseUrl + '/.well-known/jwks.json',
    publicKeyResolver,
    allowListFunction,
    validityTimeLimit
  );
}
