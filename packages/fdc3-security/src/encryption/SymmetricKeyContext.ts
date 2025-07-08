import { Context } from '@finos/fdc3-context';

export const SYMMETRIC_KEY_RESPONSE_CONTEXT = 'fdc3.security.symmetricKey.response';
export const SYMMETRIC_KEY_REQUEST_CONTEXT = 'fdc3.security.symmetricKey.request';

export type SymmetricKeyResponseContext = Context & {
  type: 'fdc3.security.symmetricKey.response';
  id: {
    publicKeyUrl: string;
  };
  wrappedKey: string;
  algorithm: any;
};

export type SymmetricKeyRequestContext = Context & {
  type: 'fdc3.security.symmetricKey.request';
};
