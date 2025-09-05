import { JWKSResolver, JSONWebKeyWithId } from '../src/JosePublicFDC3Security';
import { JosePrivateFDC3Security, createJosePrivateFDC3Security } from '../src/JosePrivateFDC3Security';
import { Context } from '@finos/fdc3-context';
import * as jose from 'jose';

const senderBaseUrl = 'https://sender.example.com';
const receiverBaseUrl = 'https://receiver.example.com';
const senderJWKSUrl = senderBaseUrl + '/.well-known/jwks.json';

const senderAllowListFunction = (url: string): boolean => {
  const result = url.startsWith(receiverBaseUrl);
  console.log('senderAllowListFunction result: ', url, result);
  return result;
};

const receiverAllowListFunction = (url: string): boolean => {
  const result = url.startsWith(senderBaseUrl);
  console.log('receiverAllowListFunction result: ', url, result);
  return result;
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
        console.log('found cryptoKey: ' + cryptoKey);
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
  resolver.reload = async () => { };
  resolver.jwks = () => ({ keys: keys });

  return resolver;
};

let sender: JosePrivateFDC3Security;
let receiver: JosePrivateFDC3Security;

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
    sender = await createJosePrivateFDC3Security(senderBaseUrl, senderPublicKeyResolver, senderAllowListFunction);

    receiver = await createJosePrivateFDC3Security(
      receiverBaseUrl,
      receiverPublicKeyResolver,
      receiverAllowListFunction,
      1 // 1-second validity time limit
    );
  });

  describe('constructor', () => {
    it('should create instance with valid parameters', () => {
      expect(sender).toBeInstanceOf(JosePrivateFDC3Security);
      expect(receiver).toBeInstanceOf(JosePrivateFDC3Security);
    });

    it('should throw error when signing public key has no kid', () => {
      const signingPrivateKey = { kty: 'RSA', n: 'test', e: 'AQAB' };
      const signingPublicKey = { kty: 'RSA', n: 'test', e: 'AQAB' }; // Missing kid
      const wrappingPrivateKey = { kty: 'RSA', n: 'test', e: 'AQAB' };
      const wrappingPublicKey = { kty: 'RSA', n: 'test', e: 'AQAB', kid: 'wrapping-key-id', alg: 'RSA-OAEP-256' };

      expect(() => {
        new JosePrivateFDC3Security(
          signingPrivateKey,
          signingPublicKey,
          wrappingPrivateKey,
          wrappingPublicKey,
          'https://example.com',
          'https://example.com/.well-known/jwks.json',
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
        new JosePrivateFDC3Security(
          signingPrivateKey,
          signingPublicKey,
          wrappingPrivateKey,
          wrappingPublicKey,
          'https://example.com',
          'https://example.com/.well-known/jwks.json',
          () => createJWKSResolver([]),
          () => true
        );
      }).toThrow("Wrapping public key must have a 'kid' (Key ID) property");
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
        expect(result.publicKeyUrl).toBe(senderJWKSUrl);
      } else {
        throw new Error('Expected a signed result');
      }
    });

    it('should encrypt and then decrypt a context using a symmetric key', async () => {
      const symmetricJWK = await sender.createSymmetricKey();
      const encrypted = await sender.encryptSymmetric(mockContext, symmetricJWK);
      const decrypted = await receiver.decryptSymmetric(encrypted, symmetricJWK);
      expect(decrypted).toEqual(mockContext);
    });

    it('should encrypt and then decrypt a context using a public/private key pair between two instances', async () => {
      const encrypted = await sender.encryptPublicKey(mockContext, receiverBaseUrl);
      const decrypted = await receiver.decryptPrivateKey(encrypted);
      expect(decrypted).toEqual(mockContext);
    });

    it('should wrap and then unwrap a symmetric key using two instances', async () => {
      // Create a symmetric key
      const symmetricJWK = await sender.createSymmetricKey();

      // Sender wraps the symmetric key for the receiver
      const wrappedKeyResponse = await sender.wrapKey(symmetricJWK, receiverBaseUrl);

      // Verify the wrapped key response structure
      expect(wrappedKeyResponse.type).toBe('fdc3.security.symmetricKey.response');
      expect(wrappedKeyResponse.id.pki).toBe(receiverBaseUrl);
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

      // Wait for the signature to expire (3 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));

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

    it('should create and verify a JWT token', async () => {
      const token = await sender.createJWTToken(receiverBaseUrl, 'test-subject');
      expect(token).toBeDefined();

      console.log('TOKEN: ' + token);

      const payload = await receiver.verifyJWTToken(token);
      expect(payload).toBeDefined();
      expect(payload.iss).toBe(senderBaseUrl);
      expect(payload.aud).toBe(receiverBaseUrl);
      expect(payload.sub).toBe('test-subject');
      expect(payload.exp).toBeDefined();
      expect(payload.iat).toBeDefined();
      expect(payload.jti).toBeDefined();
    });
  });
});
