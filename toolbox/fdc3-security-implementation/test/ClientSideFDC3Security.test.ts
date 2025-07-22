import { ClientSideImplementation, provisionJWKS, JSONWebKeyWithId, JWKSResolver } from '../src/ClientSideFDC3Security';
import { Context } from '@finos/fdc3-context';
import * as jose from 'jose';

describe('ClientSideFDC3Security', () => {
  let senderPrivateJWK: JsonWebKey;
  let senderPublicJWK: JSONWebKeyWithId;
  let receiverPrivateJWK: JsonWebKey;
  let receiverPublicJWK: JSONWebKeyWithId;
  let senderAllowListFunction: jest.MockedFunction<(url: string) => boolean>;
  let receiverAllowListFunction: jest.MockedFunction<(url: string) => boolean>;
  let senderPublicKeyResolver: jest.MockedFunction<(url: string) => JWKSResolver>;
  let receiverPublicKeyResolver: jest.MockedFunction<(url: string) => JWKSResolver>;
  let senderPublicKeyUrl: string;
  let receiverPublicKeyUrl: string;
  let sender: ClientSideImplementation;
  let receiver: ClientSideImplementation;

  const mockContext: Context = {
    type: 'fdc3.instrument',
    id: { ticker: 'AAPL' },
    name: 'Apple Inc.',
  };

  beforeAll(async () => {
    // Generate sender key pair
    const { publicKey: senderPub, privateKey: senderPriv } = await jose.generateKeyPair('RS256', {
      modulusLength: 2048,
    });
    senderPublicJWK = (await jose.exportJWK(senderPub)) as JSONWebKeyWithId;
    senderPrivateJWK = await jose.exportJWK(senderPriv);
    senderPublicJWK.kid = 'sender-key-id';
    senderPublicKeyUrl = 'https://example.com/keys/sender';

    // Generate receiver key pair
    const { publicKey: receiverPub, privateKey: receiverPriv } = await jose.generateKeyPair('RS256', {
      modulusLength: 2048,
    });
    receiverPublicJWK = (await jose.exportJWK(receiverPub)) as JSONWebKeyWithId;
    receiverPrivateJWK = await jose.exportJWK(receiverPriv);
    receiverPublicJWK.kid = 'receiver-key-id';
    receiverPublicKeyUrl = 'https://example.com/keys/receiver';

    senderAllowListFunction = jest.fn().mockReturnValue(true);
    receiverAllowListFunction = jest.fn().mockReturnValue(true);
    senderPublicKeyResolver = jest.fn().mockImplementation((url: string) => provisionJWKS(url));
    receiverPublicKeyResolver = jest.fn().mockImplementation((url: string) => provisionJWKS(url));

    sender = new ClientSideImplementation(
      senderPrivateJWK,
      senderPublicJWK,
      senderPublicKeyUrl,
      senderPublicKeyResolver,
      senderAllowListFunction,
      300
    );
    receiver = new ClientSideImplementation(
      receiverPrivateJWK,
      receiverPublicJWK,
      receiverPublicKeyUrl,
      receiverPublicKeyResolver,
      receiverAllowListFunction,
      300
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with valid parameters', () => {
      expect(sender).toBeInstanceOf(ClientSideImplementation);
      expect(receiver).toBeInstanceOf(ClientSideImplementation);
    });

    it('should throw error when public key lacks kid property', () => {
      const publicKeyWithoutKid = { ...senderPublicJWK } as JsonWebKey;
      delete (publicKeyWithoutKid as any).kid;

      expect(() => {
        new ClientSideImplementation(
          senderPrivateJWK,
          publicKeyWithoutKid,
          senderPublicKeyUrl,
          senderPublicKeyResolver,
          senderAllowListFunction
        );
      }).toThrow("Public key must have a 'kid' (Key ID) property");
    });

    it('should use default validity time limit when not provided', () => {
      const implementation = new ClientSideImplementation(
        senderPrivateJWK,
        senderPublicJWK,
        senderPublicKeyUrl,
        senderPublicKeyResolver,
        senderAllowListFunction
      );
      expect(implementation).toBeInstanceOf(ClientSideImplementation);
    });
  });

  describe('integration', () => {
    it('should sign and then check a context using two instances', async () => {
      const intent = 'test-intent';
      const channelId = 'test-channel';
      // Sender signs
      const signature = await sender.sign(mockContext, intent, channelId);
      // Receiver checks using its own instance
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
      // Use a real symmetric key
      const secret = await jose.generateSecret('A256GCM');
      const symmetricJWK = await jose.exportJWK(secret);
      // Sender encrypts
      const encrypted = await sender.encrypt(mockContext, symmetricJWK);
      // Receiver decrypts
      const decrypted = await receiver.decrypt(encrypted, symmetricJWK);
      expect(decrypted).toEqual(mockContext);
    });
  });
});
