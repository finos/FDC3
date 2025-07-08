import { Check, Sign, MessageSignature, MessageAuthenticity } from '../../../src/signing/SigningSupport';
import { UnwrapKey, WrapKey } from '../../../src/encryption/EncryptionSupport';
import { SymmetricKeyResponseContext } from '../../../src/encryption/SymmetricKeyContext';

export const dummySign: Sign = async (msg: string, date: Date) => {
  console.log('SIGNING: ' + msg);
  const out = {
    digest: 'length: ' + msg.length,
    publicKeyUrl: 'https://dummy.com/pubKey',
    algorithm: 'LENGTH-CHECK',
    date: date.toISOString(),
  } as MessageSignature;
  return out;
};

export const dummyCheck: Check = async (p: MessageSignature, msg: string) => {
  console.log('CHECKING: ' + msg);
  const out = {
    valid: p.digest == 'length: ' + msg.length,
    verified: true,
    publicKeyUrl: p.publicKeyUrl,
  } as MessageAuthenticity;

  return out;
};

export const dummyWrapKey: WrapKey = async (toWrap: CryptoKey, publicKeyUrl: string) => {
  return {
    type: 'fdc3.security.symmetricKey.response',
    id: {
      publicKeyUrl,
    },
    algorithm: 'DUMMY WRAPPING',
    wrappedKey: '[[[' + toWrap + ']]]',
  } as SymmetricKeyResponseContext;
};

export const dummyUnwrapKey: UnwrapKey = async (_key: SymmetricKeyResponseContext) => {
  // return a Crypto key here.
  return {
    algorithm: 'DUMMY CRYPTO',
    extractable: false,
    type: 'gkak',
    usages: ['encrypt', 'decrypt'],
  } as unknown as CryptoKey;
};
