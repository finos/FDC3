import { JoseFDC3Security, JSONWebKeyWithId, JWKSResolver, createJoseFDC3Security } from '../src/JoseFDC3Security';
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

let sender: JoseFDC3Security;
let receiver: JoseFDC3Security;

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
    sender = await createJoseFDC3Security(senderPublicKeyUrl, senderPublicKeyResolver, senderAllowListFunction);

    receiver = await createJoseFDC3Security(
      receiverPublicKeyUrl,
      receiverPublicKeyResolver,
      receiverAllowListFunction,
      1 // 1-second validity time limit
    );
  });

  describe('constructor', () => {
    it('should create instance with valid parameters', () => {
      expect(sender).toBeInstanceOf(JoseFDC3Security);
      expect(receiver).toBeInstanceOf(JoseFDC3Security);
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

    it('should handle malformed signatures gracefully', async () => {
      const intent = 'test-intent';
      const channelId = 'test-channel';

      // Test with an invalid JWS format (not three parts separated by dots)
      const malformedSignature = 'invalid.jws.format';
      const result = await receiver.check(malformedSignature, mockContext, intent, channelId);

      expect(result.signed).toBe(false);
      // When signed is false, error may be present but other properties should not exist
      expect('error' in result).toBe(true);
      expect('valid' in result).toBe(false);
      expect('trusted' in result).toBe(false);
      expect('publicKeyUrl' in result).toBe(false);
    });

    it('should reject signatures that are too old', async () => {
      const intent = 'test-intent';
      const channelId = 'test-channel';

      // Create a signature
      const signature = await sender.sign(mockContext, intent, channelId);

      // Wait for the signature to expire (1.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Verify it's rejected as too old
      const expiredResult = await receiver.check(signature, mockContext, intent, channelId);
      expect(expiredResult.signed).toBe(false);
      expect('error' in expiredResult).toBe(true);
      if (!expiredResult.signed && 'error' in expiredResult) {
        expect(expiredResult.error).toContain('Signature is too old');
      }
    });

    it('should reject signatures with header missing required fields', async () => {
      const intent = 'test-intent';
      const channelId = 'test-channel';

      // Create a header with just iat field (missing kid, alg, etc.)
      const headerWithJustIat = { iat: Math.floor(Date.now() / 1000) };
      const headerBase64 = btoa(JSON.stringify(headerWithJustIat));

      // Create a malformed signature with header missing required fields
      const malformedSignature = `${headerBase64}.dummy.payload`;

      const result = await receiver.check(malformedSignature, mockContext, intent, channelId);

      expect(result.signed).toBe(false);
      expect('error' in result).toBe(true);
      if (!result.signed && 'error' in result) {
        expect(result.error).toContain('Signature does not contain a public key URL / Key ID / Issued At timestamp');
      }
    });
  });

  describe('constructor validation', () => {
    it('should throw error when signing public key has no kid', () => {
      const signingPrivateKey = { kty: 'RSA', n: 'test', e: 'AQAB' };
      const signingPublicKey = { kty: 'RSA', n: 'test', e: 'AQAB' }; // Missing kid
      const wrappingPrivateKey = { kty: 'RSA', n: 'test', e: 'AQAB' };
      const wrappingPublicKey = { kty: 'RSA', n: 'test', e: 'AQAB', kid: 'wrapping-key-id', alg: 'RSA-OAEP-256' };

      expect(() => {
        new JoseFDC3Security(
          signingPrivateKey,
          signingPublicKey,
          wrappingPrivateKey,
          wrappingPublicKey,
          'https://example.com/keys',
          () => createJWKSResolver([]),
          () => true
        );
      }).toThrow("Signing public key must have a 'kid' (Key ID) property");
    });

    it('should throw error when wrapping public key has no kid', () => {
      const signingPrivateKey = { kty: 'RSA', n: 'test', e: 'AQAB' };
      const signingPublicKey = { kty: 'RSA', n: 'test', e: 'AQAB', kid: 'signing-key-id', alg: 'RS256' };
      const wrappingPrivateKey = { kty: 'RSA', n: 'test', e: 'AQAB' };
      const wrappingPublicKey = { kty: 'RSA', n: 'test', e: 'AQAB' }; // Missing kid

      expect(() => {
        new JoseFDC3Security(
          signingPrivateKey,
          signingPublicKey,
          wrappingPrivateKey,
          wrappingPublicKey,
          'https://example.com/keys',
          () => createJWKSResolver([]),
          () => true
        );
      }).toThrow("Wrapping public key must have a 'kid' (Key ID) property");
    });
  });
});
