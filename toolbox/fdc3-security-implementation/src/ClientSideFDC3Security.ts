import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import { FDC3Security, JSONWebEncryption, JSONWebSignature, MessageAuthenticity } from '@finos/fdc3-security';
import canonicalize from 'canonicalize';
import { v4 as uuidv4 } from 'uuid';
import * as jose from 'jose';

export type JSONWebKeyWithId = JsonWebKey & {
  kid: string; // Key ID, optional
};

uuidv4();

export type JWKSResolver = {
  (protectedHeader?: jose.JWSHeaderParameters, token?: jose.FlattenedJWSInput): Promise<jose.CryptoKey>;
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
 * Implements the FDC3Security interface on the client side.
 * Using the jose library for JSON Web Signatures and Encryption.
 */
export class ClientSideImplementation implements FDC3Security {
  private readonly privateKey: JsonWebKey;
  private readonly publicKey: JSONWebKeyWithId;
  private readonly publicKeyUrl: string;
  private readonly allowListFunction: (url: string) => boolean;
  private readonly validityTimeLimit: number; // in seconds
  private readonly publicKeyResolver: (url: string) => JWKSResolver;

  constructor(
    privateKey: JsonWebKey,
    publicKey: JsonWebKey,
    publicKeyUrl: string,
    publicKeyResolver: (url: string) => JWKSResolver,
    allowListFunction: (url: string) => boolean,
    validityTimeLimit: number = 5 * 60
  ) {
    this.privateKey = privateKey;
    this.publicKeyUrl = publicKeyUrl;
    this.allowListFunction = allowListFunction;
    this.validityTimeLimit = validityTimeLimit;
    this.publicKeyResolver = publicKeyResolver;

    if (!(publicKey as JSONWebKeyWithId).kid) {
      throw new Error("Public key must have a 'kid' (Key ID) property");
    } else {
      this.publicKey = publicKey as JSONWebKeyWithId;
    }
  }

  async encrypt(ctx: Context, symmetricKey: JsonWebKey): Promise<JSONWebEncryption> {
    const encrypted = await new jose.CompactEncrypt(new TextEncoder().encode(JSON.stringify(ctx)))
      .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
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
    const protectedHeader = JSON.parse(protectedHeaderJSON);
    return { jku: protectedHeader.jku, kid: protectedHeader.kid, iat: protectedHeader.iat };
  }

  async sign(ctx: Context, intent: string | null, channelId: string | null): Promise<JSONWebSignature> {
    const data = this.canonicalize(ctx, intent, channelId);
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const jws = await new jose.CompactSign(data)
      .setProtectedHeader({ alg: 'RS256', jku: this.publicKeyUrl, iat: now, kid: this.publicKey.kid })
      .sign(this.privateKey);
    const parts = jws.split('.');
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
      const data = this.canonicalize(ctx, intent, channelId);
      const parts = jws.split('.');
      const reconstitutedJws = `${parts[0]}.${data}.${parts[1]}`;

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
        publicKeyUrl: this.publicKeyUrl,
      };
    } catch (error) {
      return {
        signed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async createSymmetricKey(): Promise<JsonWebKey> {
    return jose.generateSecret('A256GCM').then(secret => jose.exportJWK(secret));
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
        publicKeyUrl,
      },
      algorithm: {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: [1, 0, 1],
        hash: 'SHA-256',
      },
    };
  }

  async unwrapKey(ctx: SymmetricKeyResponse): Promise<JsonWebKey> {
    const result = await jose.compactDecrypt(ctx.wrappedKey, this.privateKey);
    const decodedKey = JSON.parse(JSON.parse(new TextDecoder().decode(result.plaintext)));
    return decodedKey;
  }
}

export function provisionJWKS(jku: string): JWKSResolver {
  return jose.createRemoteJWKSet(new URL(jku));
}
