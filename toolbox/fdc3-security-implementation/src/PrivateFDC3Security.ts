import { Context } from '@finos/fdc3-context';
import { JSONWebEncryption, JSONWebSignature, PublicFDC3Security } from './PublicFDC3Security';

/**
 * This interface extends the PublicFDC3Security interface and provides features for apps to implement
 * signing / encryption functionality.  This is written
 * as an interface to give applications a choice of implementation.
 *
 * Ideally, it should not be run on the web/client-side because this in an untrusted environment.
 */
export interface PrivateFDC3Security extends PublicFDC3Security {
  encrypt(ctx: Context, symmetricKey: JsonWebKey): Promise<JSONWebEncryption>;

  decrypt(encrypted: JSONWebEncryption, symmetricKey: JsonWebKey): Promise<Context>;

  sign(ctx: Context, intent: string | null, channelId: string | null): Promise<JSONWebSignature>;

  getPublicKeys(): JsonWebKey[];

  /**
   * Create a JWT token with the given audience and subject.
   */
  createJWTToken(aud: string, sub: string): Promise<string>;
}
