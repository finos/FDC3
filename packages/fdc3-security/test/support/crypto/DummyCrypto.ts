import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import {
  FDC3Security,
  JSONWebEncryption,
  JSONWebSignature,
  SignedMessageAuthenticity,
} from '../../../src/FDC3Security';
import { canonicalize } from 'json-canonicalize';

export class DummyCrypto implements FDC3Security {
  async encrypt(ctx: Context, symmetricKey: JsonWebKey): Promise<JSONWebEncryption> {
    const text = canonicalize(ctx);
    const key = canonicalize(symmetricKey);
    const rot1 = btoa(text);
    const rot2 = btoa(key);
    return rot1 + '.' + rot2;
  }

  async decrypt(encrypted: JSONWebEncryption, symmetricKey: JsonWebKey): Promise<Context> {
    const parts = encrypted.split('.');
    const text = atob(parts[0]);
    const key = atob(parts[1]);
    const expectedKey = canonicalize(symmetricKey);
    if (key == expectedKey) {
      return JSON.parse(text);
    } else {
      throw new Error(`Keys don't match: ${expectedKey} ${key}`);
    }
  }

  createMessage(ctx: Context, intent: string | null, channelId: string | null): string {
    return canonicalize({
      context: ctx,
      intent: intent,
      channelId: channelId,
    });
  }

  async sign(ctx: Context, intent: string | null, channelId: string | null): Promise<JSONWebSignature> {
    const msg = this.createMessage(ctx, intent, channelId);

    console.log('SIGNING: ' + msg);
    const out = `length-check:${msg.length}:https://dummy.com/pubKey`;
    return out;
  }

  async check(
    sig: JSONWebSignature,
    ctx: Context,
    intent: string | null,
    channelId: string | null
  ): Promise<SignedMessageAuthenticity> {
    const msg = this.createMessage(ctx, intent, channelId);
    const splitSig = sig.split(':');
    const length = splitSig[1];
    splitSig.splice(0, 2);
    const url = splitSig.join(':');

    console.log('CHECKING: ' + msg);
    const out: SignedMessageAuthenticity = {
      valid: length == `${msg.length}`,
      signed: true,
      trusted: true,
      publicKeyUrl: url,
    };

    return out;
  }

  async createSymmetricKey(): Promise<JsonWebKey> {
    return {
      alg: 'dummy',
      k: '123',
    };
  }

  async wrapKey(symmetricKey: JsonWebKey, _publicKeyUrl: string): Promise<SymmetricKeyResponse> {
    return {
      type: 'fdc3.security.symmetricKey.response',
      wrappedKey: JSON.stringify(symmetricKey),
    } as SymmetricKeyResponse;
  }

  async unwrapKey(ctx: SymmetricKeyResponse): Promise<JsonWebKey> {
    return JSON.parse(ctx.wrappedKey);
  }
}
