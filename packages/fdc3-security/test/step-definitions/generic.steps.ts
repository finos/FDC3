import { Given, When } from '@cucumber/cucumber';
import { handleResolve, setupGenericSteps } from '@finos/testing';
import { CustomWorld } from '../world/index';
import { dummyCheck, dummySign, dummyUnwrapKey, dummyWrapKey } from '../support/crypto/DummyCrypto';
import { DesktopAgentSpy } from '../support/DesktopAgentSpy';
import { ClientSideImplementation, Resolver } from '../../src/ClientSideImplementation';
import { UnopinionatedDesktopAgent } from '../../src/delegates/UnopinionatedDesktopAgent';

export const CHANNEL_STATE = 'CHANNEL_STATE';

Given(
  'A Signing Desktop Agent in {string} wrapping {string} with Dummy Signing Middleware',
  async function (this: CustomWorld, field: string, daField: string) {
    const da = this.props[daField];
    const signingDA = new UnopinionatedDesktopAgent(da, dummySign, dummyCheck, dummyWrapKey, dummyUnwrapKey);

    this.props[field] = signingDA;
    this.props['result'] = null;
  }
);

Given(
  'A Signing Desktop Agent in {string} wrapping {string} with Real Middleware using {string}, {string}, {string} and resolver {string}',
  async function (
    this: CustomWorld,
    field: string,
    daField: string,
    spriv: string,
    epriv: string,
    publicUrl: string,
    resolver: string
  ) {
    const da = this.props[daField];
    const csi = new ClientSideImplementation();
    const sprivKey: CryptoKey = handleResolve(spriv, this);
    const eprivKey: CryptoKey = handleResolve(epriv, this);
    const resolverObj: Resolver = handleResolve(resolver, this);

    const signingDA = new UnopinionatedDesktopAgent(
      da,
      csi.initSigner(sprivKey, publicUrl),
      csi.initChecker(resolverObj),
      csi.initWrapKey(resolverObj),
      csi.initUnwrapKey(eprivKey, publicUrl)
    );

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
  '{string} is a invocation counter into {string}',
  function (this: CustomWorld, handlerName: string, field: string) {
    this.props[handlerName] = () => {
      var amount: number = this.props[field];
      amount++;
      this.props[field] = amount;
    };
    this.props[field] = 0;
  }
);

When('we wait for the context to be sent', function (this: CustomWorld) {
  return new Promise<void>((resolve, _reject) => {
    setTimeout(() => resolve(), 200);
  });
});

setupGenericSteps();
