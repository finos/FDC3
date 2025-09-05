import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import { JSONWebEncryption, JSONWebSignature, FDC3JWTPayload, PrivateFDC3Security } from '@finos/fdc3-security';
import * as jose from 'jose';
import { AllowListFunction, JosePublicFDC3Security, JSONWebKeyWithId, JWKSResolver } from './JosePublicFDC3Security';

type ProtectedHeader = {
  alg: string;
  enc: string;
};


/**
 * Implements the FDC3Security interface either in node or the browser.
 * Using the jose library for JSON Web Signatures and Encryption.
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
    validityTimeLimit: number = 5 * 60
  ) {
    super(signingPublicKey, wrappingPublicKey, publicKeyResolver, allowListFunction, validityTimeLimit);
    this.signingPrivateKey = signingPrivateKey;
    this.wrappingPrivateKey = wrappingPrivateKey;
    this.jwksUrl = jwksUrl;
    this.issUrl = issUrl;
  }

  async encryptSymmetric(ctx: Context, symmetricKey: JsonWebKey): Promise<JSONWebEncryption> {
    const encrypted = await new jose.CompactEncrypt(new TextEncoder().encode(JSON.stringify(ctx)))
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(symmetricKey);
    return encrypted;
  }

  async decryptSymmetric(encrypted: JSONWebEncryption, symmetricKey: JsonWebKey): Promise<Context> {
    const decrypted = await jose.compactDecrypt(encrypted, symmetricKey);
    const plaintext = decrypted.plaintext;
    return JSON.parse(new TextDecoder().decode(plaintext));
  }

  private async getPublicKey(publicKeyUrl: string, protectedHeader: ProtectedHeader): Promise<JSONWebKeyWithId> {
    const JWKS = this.publicKeyResolver(publicKeyUrl);
    await JWKS.reload();

    const allKeys = JWKS.jwks()?.keys ?? [];
    const key = allKeys.find(k => k.alg == protectedHeader.alg);

    if (key == undefined) {
      throw new Error(`No key found for algorithm ${protectedHeader.alg}`);
    }

    return key as JSONWebKeyWithId;
  }


  async encryptPublicKey(ctx: Context, publicKeyUrl: string): Promise<JSONWebEncryption> {
    const protectedHeader = { alg: 'RSA-OAEP-256', enc: 'A256GCM' };
    const key = await this.getPublicKey(publicKeyUrl, protectedHeader);
    const encrypted = await new jose.CompactEncrypt(new TextEncoder().encode(JSON.stringify(ctx)))
      .setProtectedHeader(protectedHeader)
      .encrypt(key);
    return encrypted;
  }

  async decryptPrivateKey(encrypted: JSONWebEncryption): Promise<Context> {
    const decrypted = await jose.compactDecrypt(encrypted, this.wrappingPrivateKey);
    const plaintext = decrypted.plaintext;
    return JSON.parse(new TextDecoder().decode(plaintext));
  }

  async sign(ctx: Context, intent: string | null, channelId: string | null): Promise<JSONWebSignature> {
    const data = this.canonicalize(ctx, intent, channelId);
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const jws = await new jose.CompactSign(data)
      .setProtectedHeader({ alg: 'EdDSA', jku: this.jwksUrl, iat: now, kid: this.signingPublicKey.kid })
      .sign(this.signingPrivateKey);
    const parts = jws.split('.');
    const detachedJWS = `${parts[0]}..${parts[2]}`;
    return detachedJWS;
  }

  async createSymmetricKey(): Promise<JsonWebKey> {
    return jose.generateSecret('A256GCM', { extractable: true }).then(secret => jose.exportJWK(secret));
  }

  async wrapKey(symmetricKey: JsonWebKey, publicKeyUrl: string): Promise<SymmetricKeyResponse> {
    const protectedHeader = { alg: 'RSA-OAEP-256', enc: 'A256GCM' };
    const data = this.canonicalizeKey(symmetricKey);
    const key = await this.getPublicKey(publicKeyUrl, protectedHeader);
    const wrapped = await new jose.CompactEncrypt(data).setProtectedHeader(protectedHeader).encrypt(key);

    return {
      type: 'fdc3.security.symmetricKey.response',
      wrappedKey: wrapped,
      id: {
        pki: publicKeyUrl,
        kid: key.kid ?? 'not specified',
      },
    };
  }

  async unwrapKey(ctx: SymmetricKeyResponse): Promise<JsonWebKey> {
    const result = await jose.compactDecrypt(ctx.wrappedKey, this.wrappingPrivateKey);
    const jsonString = new TextDecoder().decode(result.plaintext);
    const decodedKey = JSON.parse(jsonString);
    return decodedKey;
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
export async function createJosePrivateFDC3Security(
  baseUrl: string,
  publicKeyResolver: (url: string) => JWKSResolver,
  allowListFunction: AllowListFunction,
  validityTimeLimit: number = 5 * 60,
  signingKeyId?: string,
  wrappingKeyId?: string
): Promise<JosePrivateFDC3Security> {
  // Generate unique IDs if not provided
  const finalSigningKeyId = signingKeyId || `signing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const finalWrappingKeyId = wrappingKeyId || `wrapping-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create key pairs
  const signingKeys = await createSigningKeyPair(finalSigningKeyId);
  const wrappingKeys = await createWrappingKeyPair(finalWrappingKeyId);

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
    validityTimeLimit
  );
}
