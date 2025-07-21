import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';

export type JSONWebSignature = string; // compact form

export type JSONWebEncryption = string; // compact form

export type MessageAuthenticity =
  | {
      verified: true;
      valid: boolean;
      publicKeyUrl: string;
    }
  | {
      verified: false;
      error: any;
    };

/**
 * This interface provides all of the features needed for the SecuredDesktopAgent
 * to provide its signing / encryption functionality.  This is written
 * as an interface to give applications the choice of whether to implement
 * security on the client or server side.
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
}
