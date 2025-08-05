import { Context } from '@finos/fdc3-context';

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
 * This interface provides features that could be included on the client-side
 * for checking tokens.   This is written
 * as an interface to give applications a choice of implementation
 * (e.g. it could call server-side apis).
 */
export interface PublicFDC3Security {
  check(
    sig: JSONWebSignature,
    ctx: Context,
    intent: string | null,
    channelId: string | null
  ): Promise<MessageAuthenticity>;

  getPublicKeys(): JsonWebKey[];

  /**
   * Verify a JWT token and return the payload.  If the token is not valid, an error is thrown.
   */
  verifyJWTToken(token: string): Promise<FDC3JWTPayload>;
}
