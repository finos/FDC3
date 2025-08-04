import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';

export type JSONWebSignature = string; // compact form, with detached payload

export type JSONWebEncryption = string; // compact form

export type SignedMessageAuthenticity = {
  signed: true; // means a correct signature was provided
  valid: boolean; // true if the signature is valid
  trusted: boolean; // true if the public key is from a trusted source
  publicKeyUrl: string;
};

export type UnsignedMessageAuthenticity = {
  signed: false; // signature not provided or badly formed
  error?: string; // if signed is false, this may contain an error message
};

/**
 * Standard JWT fields, made required for FDC3 JWT tokens
 */
export interface FDC3JWTPayload extends Record<string, unknown> {
  iss: string; // Issuer
  sub: string; // Subject
  aud: string; // Audience
  jti: string; // JWT ID
  iat: number; // Issued At
  exp: number; // Expiration
}

export type MessageAuthenticity = SignedMessageAuthenticity | UnsignedMessageAuthenticity;

/**
 * This interface provides all of the features needed for your apps to implement
 * signing / encryption functionality.  This is written
 * as an interface to give applications a choice of implementation,
 * but JoseFDC3Security is provided as the default.
 */
export interface FDC3Security {
  encrypt(ctx: Context, symmetricKey: JsonWebKey): Promise<JSONWebEncryption>;

  decrypt(encrypted: JSONWebEncryption, symmetricKey: JsonWebKey): Promise<Context>;

  sign(ctx: Context, intent: string | null, channelId: string | null): Promise<JSONWebSignature>;

  check(
    sig: JSONWebSignature,
    ctx: Context,
    intent: string | null,
    channelId: string | null
  ): Promise<MessageAuthenticity>;

  createSymmetricKey(): Promise<JsonWebKey>;

  wrapKey(symmetricKey: JsonWebKey, publicKeyUrl: string): Promise<SymmetricKeyResponse>;

  unwrapKey(ctx: SymmetricKeyResponse): Promise<JsonWebKey>;

  getPublicKeys(): JsonWebKey[];

  /**
   * Create a JWT token with the given audience and subject.
   */
  createJWTToken(aud: string, sub: string): Promise<string>;

  /**
   * Verify a JWT token and return the payload.  If the token is not valid, an error is thrown.
   */
  verifyJWTToken(token: string): Promise<FDC3JWTPayload>;
}
