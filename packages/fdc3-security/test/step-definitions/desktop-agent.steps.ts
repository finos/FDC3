import { Given } from '@cucumber/cucumber';
import { handleResolve, setupGenericSteps } from '@finos/testing';
import { CustomWorld } from '../world/index';
import { DummyCrypto } from '../support/crypto/DummyCrypto';
import { DesktopAgentSpy } from '../support/DesktopAgentSpy';
import { SecuredDesktopAgentDelegate } from '../../src/delegates/SecuredDesktopAgentDelegate';
import { ContextHandler, ContextMetadata, IntentHandler, IntentResult } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { EncryptingPrivateChannel } from '../../src/encryption/EncryptingPrivateChannel';
import { ContextMetadataWithAuthenticity } from '../../src/signing/SigningSupport';

export const CHANNEL_STATE = 'CHANNEL_STATE';

setupGenericSteps();

Given(
  'A Signing Desktop Agent in {string} wrapping {string} with Dummy Signing Middleware',
  async function (this: CustomWorld, field: string, daField: string) {
    const da = handleResolve(daField, this);
    const signingDA = new SecuredDesktopAgentDelegate(da, new DummyCrypto());

    this.props[field] = signingDA;
    this.props['result'] = null;
  }
);

Given('A Mock Desktop Agent in {string}', async function (this: CustomWorld, field: string) {
  const da = new DesktopAgentSpy();

  this.props[field] = da;
  this.props['result'] = null;
});

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
    const da = handleResolve(api, this) as SecuredDesktopAgentDelegate;
    const channel1 = await da.createPrivateChannel();
    const channel2 = await da.createPrivateChannel();
    this.props[channel1Name] = channel1;
    this.props[channel2Name] = channel2;

    theMock.connectChannels((channel1 as any).delegate.delegate, (channel2 as any).delegate.delegate);
  }
);

Given(
  '{string} responds to all requests for symmetric keys on private channel {string}',
  async function (this: CustomWorld, name: string, channelName: string) {
    const ch: ContextHandler = async (_c: Context, m: ContextMetadata | undefined) => {
      const channel: EncryptingPrivateChannel = handleResolve(channelName, this);
      const auth = (m as ContextMetadataWithAuthenticity)?.authenticity;
      if (auth?.verified == true) {
        const publicKey = (m as any).authenticity.publicKeyUrl;
        channel.broadcastKey(publicKey);
      }
    };

    this.props[name] = ch;
  }
);

Given('{string} is a function which returns {string}', function (this: CustomWorld, fnName: string, value: string) {
  this.props[fnName] = () => {
    return handleResolve(value, this);
  };
});
