import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import { JSONWebEncryption, JSONWebSignature, PublicFDC3Security } from './PublicFDC3Security';

/**
 * This interface extends the PublicFDC3Security interface and provides features for apps to implement
 * signing / encryption functionality.  This is written
 * as an interface to give applications a choice of implementation.
 *
 * Ideally, it should not be run on the web/client-side because this in an untrusted environment.
 */
export interface PrivateFDC3Security extends PublicFDC3Security {

  encryptSymmetric(ctx: Context, symmetricKey: JsonWebKey): Promise<JSONWebEncryption>;
  decryptSymmetric(encrypted: JSONWebEncryption, symmetricKey: JsonWebKey): Promise<Context>;

  encryptPublicKey(ctx: Context, publicKeyUrl: string): Promise<JSONWebEncryption>;
  decryptPrivateKey(encrypted: JSONWebEncryption): Promise<Context>;

  sign(ctx: Context, intent: string | null, channelId: string | null): Promise<JSONWebSignature>;

  createSymmetricKey(): Promise<JsonWebKey>;

  wrapKey(symmetricKey: JsonWebKey, publicKeyUrl: string): Promise<SymmetricKeyResponse>;

  unwrapKey(ctx: SymmetricKeyResponse): Promise<JsonWebKey>;

  /**
   * Create a JWT token with the given audience and subject.
   */
  createJWTToken(aud: string, sub: string): Promise<string>;
}
