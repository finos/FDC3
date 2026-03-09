import { JWKSResolver, JSONWebKeyWithId } from '../src/impl/JosePublicFDC3Security';
import { JosePrivateFDC3Security, createJosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { Context } from '@finos/fdc3-context';
import { BrowserTypes } from '@finos/fdc3-schema';
import { FDC3SecurityTimeLimits } from '../src/impl/FDC3SecurityTimeLimits';
import { PublicFDC3Security } from '../src/impl/PublicFDC3Security';
import { PrivateFDC3Security } from '../src/impl/PrivateFDC3Security';
import * as jose from 'jose';

type DetachedSignature = BrowserTypes.DetachedSignature;

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
  ): Promise<CryptoKey> => {
    const key = keys.find(
      k => (k.kid === protectedHeader?.kid || protectedHeader?.kid == null) && k.alg === protectedHeader?.alg
    );

    if (key) {
      const cryptoKey = await jose.importJWK(key as jose.JWK, protectedHeader?.alg);
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
  resolver.reload = async () => {};
  resolver.jwks = () => ({ keys: keys as jose.JWK[] });

  return resolver as JWKSResolver;
};

// Keep concrete type references for resolver functions (need JSONWebKeyWithId[])
let senderImpl: JosePrivateFDC3Security;
let receiverImpl: JosePrivateFDC3Security;
// Expose as interfaces for coverage attribution of inherited methods
let sender: PrivateFDC3Security;
let receiver: PrivateFDC3Security;
let senderPublic: PublicFDC3Security;
let receiverPublic: PublicFDC3Security;

const senderPublicKeyResolver = (_url: string): JWKSResolver => {
  return createJWKSResolver(receiverImpl.getPublicKeys());
};

const receiverPublicKeyResolver = (_url: string): JWKSResolver => {
  return createJWKSResolver(senderImpl.getPublicKeys());
};

describe('JosePrivateFDC3Security', () => {
  const mockContext: Context = {
    type: 'fdc3.instrument',
    id: { ticker: 'AAPL' },
    name: 'Apple Inc.',
  };

  // Time limits for testing expiry scenarios
  const strictTimeLimits: FDC3SecurityTimeLimits = {
    signatureFreshnessSeconds: 1, // 1-second signature freshness
    contextValiditySeconds: 1, // 1-second context validity
  };

  beforeAll(async () => {
    // Use the factory functions to create instances
    senderImpl = await createJosePrivateFDC3Security(senderBaseUrl, senderPublicKeyResolver, senderAllowListFunction);
    sender = senderImpl;
    senderPublic = senderImpl;

    receiverImpl = await createJosePrivateFDC3Security(
      receiverBaseUrl,
      receiverPublicKeyResolver,
      receiverAllowListFunction,
      strictTimeLimits
    );
    receiver = receiverImpl;
    receiverPublic = receiverImpl;
  });

  describe('constructor', () => {
    it('should create instance with valid parameters', () => {
      expect(senderImpl).toBeInstanceOf(JosePrivateFDC3Security);
      expect(receiverImpl).toBeInstanceOf(JosePrivateFDC3Security);
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
      const { signature, antiReplay } = await sender.sign(mockContext);
      // Use PublicFDC3Security interface for coverage attribution
      const result = await receiverPublic.verifySignature(signature, mockContext, antiReplay);
      if (result.signed) {
        expect(result.valid).toBe(true);
        expect(result.trusted).toBe(true);
        expect(result.jku).toBe(senderJWKSUrl);
        expect(result.alg).toBe('EdDSA');
        expect(result.kid).toBeDefined();
        expect(result.antiReplayClaims).toEqual(antiReplay);
      } else {
        throw new Error('Expected a signed result: ' + JSON.stringify(result));
      }
    });

    it('should encrypt and then decrypt a context using a symmetric key', async () => {
      const symmetricJWK = await sender.createSymmetricKey();
      // Use PublicFDC3Security interface for coverage attribution
      const encrypted = await senderPublic.encryptSymmetric(mockContext, symmetricJWK);
      const decrypted = await receiverPublic.decryptSymmetric(encrypted, symmetricJWK);
      expect(decrypted).toEqual(mockContext);
    });

    it('should wrap and then unwrap a symmetric key using two instances', async () => {
      // Create a symmetric key
      const symmetricJWK = await sender.createSymmetricKey();

      // Sender wraps the symmetric key for the receiver
      const wrappedKeyResponse = await sender.wrapSymmetricKey(symmetricJWK, receiverBaseUrl);

      // Verify the wrapped key response structure
      expect(wrappedKeyResponse.type).toBe('fdc3.security.symmetricKeyResponse');
      expect(wrappedKeyResponse.id.pki).toBe(receiverBaseUrl);
      expect(wrappedKeyResponse.wrappedKey).toBeDefined();

      // Receiver unwraps the symmetric key
      const unwrappedKey = await receiver.unwrapSymmetricKey(wrappedKeyResponse);

      // Verify the unwrapped key matches the original
      expect(unwrappedKey).toEqual(symmetricJWK);
    });

    it('should handle malformed signatures gracefully', async () => {
      // Test with an invalid DetachedSignature format
      const malformedSignature: DetachedSignature = {
        protected: 'invalid',
        signature: 'jws',
      };
      const dummyAntiReplay = { iat: 0, exp: 0, jti: 'dummy' };
      const result = await receiverPublic.verifySignature(malformedSignature, mockContext, dummyAntiReplay);

      expect(result.signed).toBe(false);
      // When signed is false, errors array may be present but other properties should not exist
      expect('errors' in result).toBe(true);
      expect('valid' in result).toBe(false);
      expect('trusted' in result).toBe(false);
      expect('jku' in result).toBe(false);
    });

    it('should reject stale signatures (signature freshness)', async () => {
      // Create a signature
      const { signature, antiReplay } = await sender.sign(mockContext);

      // Wait for the signature to become stale (2 seconds, receiver has 1-second freshness limit)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify it's rejected due to stale signature (signed=true per schema, valid=false when rejecting)
      const result = await receiverPublic.verifySignature(signature, mockContext, antiReplay);
      expect(result.signed).toBe(true);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      if (result.errors) {
        const hasStaleSignatureError = result.errors.some(e => e.includes('Signature is too old'));
        expect(hasStaleSignatureError).toBe(true);
      }
    });

    it('should reject expired contexts (context validity)', async () => {
      // Use senderImpl but sign with a manual antiReplay that has exp in the past.
      // We cannot use sign() with modified antiReplay (signature would not verify), so we
      // create a receiver with short context validity and use a signature whose antiReplay
      // has already naturally expired by waiting.
      const contextExpiryLimits: FDC3SecurityTimeLimits = {
        signatureFreshnessSeconds: 60,
        contextValiditySeconds: 1,
      };

      // Create a sender with same keys as senderImpl (so resolver works) but short validity
      const shortValiditySender = new JosePrivateFDC3Security(
        senderImpl.signingPrivateKey,
        senderImpl.signingPublicKey,
        senderImpl.wrappingPrivateKey,
        senderImpl.wrappingPublicKey,
        senderBaseUrl,
        senderJWKSUrl,
        senderPublicKeyResolver,
        senderAllowListFunction,
        contextExpiryLimits
      );

      // Sign the context (antiReplay will have exp = now + 1)
      const { signature, antiReplay } = await shortValiditySender.sign(mockContext);

      // Immediately verify it works
      const immediateResult = await receiverPublic.verifySignature(signature, mockContext, antiReplay);
      if (immediateResult.signed) {
        expect(immediateResult.valid).toBe(true);
      }

      // Wait for the context to expire
      await new Promise(resolve => setTimeout(resolve, 2000));

      const contextExpiryReceiver: PublicFDC3Security = await createJosePrivateFDC3Security(
        receiverBaseUrl,
        receiverPublicKeyResolver,
        receiverAllowListFunction,
        contextExpiryLimits
      );

      // Verify it's rejected due to context expiry (signed=true per schema, valid=false when rejecting)
      const result = await contextExpiryReceiver.verifySignature(signature, mockContext, antiReplay);
      expect(result.signed).toBe(true);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      if (result.errors) {
        const hasExpiryError = result.errors.some(e => e.includes('Context has expired'));
        expect(hasExpiryError).toBe(true);
      }
    });

    it('should reject signatures with header missing required fields', async () => {
      // Create a header with just iat field (missing kid, alg, etc.)
      const headerWithJustIat = { iat: Math.floor(Date.now() / 1000) };
      const headerBase64 = btoa(JSON.stringify(headerWithJustIat));

      // Create a malformed DetachedSignature with header missing required fields
      const malformedSignature: DetachedSignature = {
        protected: headerBase64,
        signature: 'dummy',
      };
      const dummyAntiReplay = { iat: 0, exp: 0, jti: 'dummy' };
      const result = await receiverPublic.verifySignature(malformedSignature, mockContext, dummyAntiReplay);

      expect(result.signed).toBe(false);
      expect('errors' in result).toBe(true);
      if (!result.signed && result.errors) {
        expect(result.errors.some(e => e.includes('Signature does not contain required header fields'))).toBe(true);
      }
    });

    it('should create and verify a JWT token', async () => {
      const token = await sender.createJWTToken(receiverBaseUrl, 'test-subject');
      expect(token).toBeDefined();

      console.log('TOKEN: ' + token);

      const payload = await receiverPublic.verifyJWTToken(token);
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
