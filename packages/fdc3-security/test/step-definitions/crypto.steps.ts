import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { handleResolve } from '@finos/testing';
import { ClientSideImplementation } from '../../src/ClientSideImplementation';
import { createSymmetricKey } from '../../src/encryption/EncryptionSupport';
import { ContextMetadata, IntentHandler, IntentResult } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { DesktopAgentSpy } from '../support/DesktopAgentSpy';
import { SecuredDesktopAgent } from '../../src/SecuredDesktopAgent';

Given(
  'A New Signing Keypair loaded into {string} and {string}',
  async function (this: CustomWorld, pub: string, priv: string) {
    const kp = await new ClientSideImplementation().createSigningKeys();
    this.props[pub] = kp.publicKey;
    this.props[priv] = kp.privateKey;
  }
);

Given(
  'A New Encryption Keypair loaded into {string} and {string}',
  async function (this: CustomWorld, pub: string, priv: string) {
    const kp = await new ClientSideImplementation().createWrappingKeys();
    this.props[pub] = kp.publicKey;
    this.props[priv] = kp.privateKey;
  }
);

Given('A Symmetric key loaded into {string}', async function (this: CustomWorld, pub: string) {
  const k = await createSymmetricKey();
  this.props[pub] = k;
});

Given('A Client Side Implementation in {string}', function (this: CustomWorld, field: string) {
  this.props[field] = new ClientSideImplementation();
});

Given('A timestamp in {string}', function (this: CustomWorld, field: string) {
  this.props[field] = new Date();
});

Given(
  'A Local URL Resolver in {string} resolving {string} to {string} and {string}',
  async function (this: CustomWorld, field: string, url: string, field2: string, field3: string) {
    const out = async (x: string) => {
      if (x == url) {
        const key1: CryptoKey = handleResolve(field2, this);
        const jwk1 = await crypto.subtle.exportKey('jwk', key1);

        const key2: CryptoKey = handleResolve(field3, this);
        const jwk2 = await crypto.subtle.exportKey('jwk', key2);

        return [jwk1, jwk2];
      } else {
        throw new Error(`Can't resolve ${x}`);
      }
    };

    this.props[field] = out;
  }
);

Given(
  '{string} is an intent handler which returns {string}',
  function (this: CustomWorld, field: string, resultField: string) {
    const result = handleResolve(resultField, this) as IntentResult;
    const out: IntentHandler = async (_ctx: Context, _meta: ContextMetadata | undefined) => {
      return result;
    };
    this.props[field] = out;
  }
);

Given(
  'I use {string} wrapped with {string} to create a pair of connected, wrapped private channels, {string} and {string}',
  async function (this: CustomWorld, mock: string, api: string, channel1Name: string, channel2Name: string) {
    const theMock = handleResolve(mock, this) as DesktopAgentSpy;
    const da = handleResolve(api, this) as SecuredDesktopAgent;
    const channel1 = await da.createPrivateChannel();
    const channel2 = await da.createPrivateChannel();
    this.props[channel1Name] = channel1;
    this.props[channel2Name] = channel2;

    theMock.connectChannels((channel1 as any).delegate.delegate, (channel2 as any).delegate.delegate);
  }
);
