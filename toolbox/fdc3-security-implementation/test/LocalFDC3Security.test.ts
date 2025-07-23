import { LocalFDC3Security, JSONWebKeyWithId, JWKSResolver, createLocalFDC3Security } from '../src/LocalFDC3Security';
import { Context } from '@finos/fdc3-context';
import * as jose from 'jose';

const senderPublicKeyUrl = 'https://example.com/keys/sender';
const receiverPublicKeyUrl = 'https://example.com/keys/receiver';

const senderAllowListFunction = (url: string): boolean => {
  return url === receiverPublicKeyUrl;
};

const receiverAllowListFunction = (url: string): boolean => {
  return url === senderPublicKeyUrl;
};

const createJWKSResolver = (keys: JSONWebKeyWithId[]): JWKSResolver => {
  const resolver = async (
    protectedHeader?: jose.JWSHeaderParameters,
    _token?: jose.FlattenedJWSInput
  ): Promise<jose.CryptoKey> => {
    const key = keys.find(
      k => (k.kid === protectedHeader?.kid || protectedHeader?.kid == null) && k.alg === protectedHeader?.alg
    );

    if (key) {
      const cryptoKey = await jose.importJWK(key, protectedHeader?.alg);
      if (cryptoKey instanceof CryptoKey) {
        return cryptoKey;
      }
      throw new Error('Failed to import JWK as CryptoKey');
    } else {
      throw new Error(`No key found for kid: ${protectedHeader?.kid}`);
    }
  };

  // Add the required properties to make it a JWKSResolver
  resolver.coolingDown = false;
  resolver.fresh = true;
  resolver.reloading = false;
  resolver.reload = async () => {};
  resolver.jwks = () => ({ keys: keys });

  return resolver;
};

let sender: LocalFDC3Security;
let receiver: LocalFDC3Security;

const senderPublicKeyResolver = (_url: string): JWKSResolver => {
  return createJWKSResolver(receiver.getPublicKeys());
};

const receiverPublicKeyResolver = (_url: string): JWKSResolver => {
  return createJWKSResolver(sender.getPublicKeys());
};

describe('ClientSideFDC3Security', () => {
  const mockContext: Context = {
    type: 'fdc3.instrument',
    id: { ticker: 'AAPL' },
    name: 'Apple Inc.',
  };

  beforeAll(async () => {
    // Use the factory functions to create instances
    sender = await createLocalFDC3Security(senderPublicKeyUrl, senderPublicKeyResolver, senderAllowListFunction);

    receiver = await createLocalFDC3Security(
      receiverPublicKeyUrl,
      receiverPublicKeyResolver,
      receiverAllowListFunction
    );
  });

  describe('constructor', () => {
    it('should create instance with valid parameters', () => {
      expect(sender).toBeInstanceOf(LocalFDC3Security);
      expect(receiver).toBeInstanceOf(LocalFDC3Security);
    });
  });

  describe('integration', () => {
    it('should sign and then check a context using two instances', async () => {
      const intent = 'test-intent';
      const channelId = 'test-channel';
      const signature = await sender.sign(mockContext, intent, channelId);
      const result = await receiver.check(signature, mockContext, intent, channelId);
      if (result.signed) {
        expect(result.valid).toBe(true);
        expect(result.trusted).toBe(true);
        expect(result.publicKeyUrl).toBe(senderPublicKeyUrl);
      } else {
        throw new Error('Expected a signed result');
      }
    });

    it('should encrypt and then decrypt a context using two instances', async () => {
      const symmetricJWK = await sender.createSymmetricKey();
      const encrypted = await sender.encrypt(mockContext, symmetricJWK);
      const decrypted = await receiver.decrypt(encrypted, symmetricJWK);
      expect(decrypted).toEqual(mockContext);
    });

    it('should wrap and then unwrap a symmetric key using two instances', async () => {
      // Create a symmetric key
      const symmetricJWK = await sender.createSymmetricKey();

      // Sender wraps the symmetric key for the receiver
      const wrappedKeyResponse = await sender.wrapKey(symmetricJWK, receiverPublicKeyUrl);

      // Verify the wrapped key response structure
      expect(wrappedKeyResponse.type).toBe('fdc3.security.symmetricKey.response');
      expect(wrappedKeyResponse.id.pki).toBe(receiverPublicKeyUrl);
      expect(wrappedKeyResponse.wrappedKey).toBeDefined();

      // Receiver unwraps the symmetric key
      const unwrappedKey = await receiver.unwrapKey(wrappedKeyResponse);

      // Verify the unwrapped key matches the original
      expect(unwrappedKey).toEqual(symmetricJWK);
    });
  });
});
