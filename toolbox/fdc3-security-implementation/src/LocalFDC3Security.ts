import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import { FDC3Security, JSONWebEncryption, JSONWebSignature, MessageAuthenticity } from '@finos/fdc3-security';
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
export class LocalFDC3Security implements FDC3Security {
  readonly signingPrivateKey: JsonWebKey;
  readonly signingPublicKey: JSONWebKeyWithId;
  readonly wrappingPrivateKey: JsonWebKey;
  readonly wrappingPublicKey: JSONWebKeyWithId;
  readonly jwksUrl: string;
  readonly allowListFunction: (url: string) => boolean;
  readonly validityTimeLimit: number; // in seconds
  readonly publicKeyResolver: (url: string) => JWKSResolver;

  constructor(
    signingPrivateKey: JsonWebKey,
    signingPublicKey: JsonWebKey,
    wrappingPrivateKey: JsonWebKey,
    wrappingPublicKey: JsonWebKey,
    jwksUrl: string,
    publicKeyResolver: (url: string) => JWKSResolver,
    allowListFunction: (url: string) => boolean,
    validityTimeLimit: number = 5 * 60
  ) {
    this.signingPrivateKey = signingPrivateKey;
    this.wrappingPrivateKey = wrappingPrivateKey;
    this.jwksUrl = jwksUrl;
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
      .setProtectedHeader({ alg: 'RS256', jku: this.jwksUrl, iat: now, kid: this.signingPublicKey.kid })
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
}

export function provisionJWKS(jku: string): JWKSResolver {
  return jose.createRemoteJWKSet(new URL(jku));
}

export async function createSigningKeyPair(id: string): Promise<{ priv: JsonWebKey; pub: JsonWebKey }> {
  const keyPair = await jose.generateKeyPair('RS256', {
    extractable: true,
    modulusLength: 2048,
  });
  const privateKey = await jose.exportJWK(keyPair.privateKey);
  const publicKey = await jose.exportJWK(keyPair.publicKey);
  publicKey.kid = id;
  publicKey.alg = 'RS256';
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
export async function createLocalFDC3Security(
  jwksUrl: string,
  publicKeyResolver: (url: string) => JWKSResolver,
  allowListFunction: (url: string) => boolean,
  validityTimeLimit: number = 5 * 60,
  signingKeyId?: string,
  wrappingKeyId?: string
): Promise<LocalFDC3Security> {
  // Generate unique IDs if not provided
  const finalSigningKeyId = signingKeyId || `signing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const finalWrappingKeyId = wrappingKeyId || `wrapping-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create key pairs
  const signingKeys = await createSigningKeyPair(finalSigningKeyId);
  const wrappingKeys = await createWrappingKeyPair(finalWrappingKeyId);

  // Create and return the instance
  return new LocalFDC3Security(
    signingKeys.priv,
    signingKeys.pub,
    wrappingKeys.priv,
    wrappingKeys.pub,
    jwksUrl,
    publicKeyResolver,
    allowListFunction,
    validityTimeLimit
  );
}
