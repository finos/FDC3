import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'expect';
import { doesRowMatch, handleResolve, matchData } from '../support/matching';
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

When('I call {string} with {string}', async function (this: CustomWorld, field: string, fnName: string) {
  try {
    const fn = this.props[field][fnName];
    const result = await fn.call(this.props[field]);
    this.props['result'] = result;
  } catch (error) {
    this.props['result'] = error;
  }
});

When(
  'I call {string} with {string} with parameter {string}',
  async function (this: CustomWorld, field: string, fnName: string, param: string) {
    try {
      const fn = this.props[field][fnName];
      const result = await fn.call(this.props[field], handleResolve(param, this));
      this.props['result'] = result;
    } catch (error) {
      this.props['result'] = error;
    }
  }
);

When('I call {string} with parameter {string}', async function (this: CustomWorld, fnName: string, param: string) {
  try {
    const fn = handleResolve(fnName, this);
    const result = await fn(handleResolve(param, this));
    this.props['result'] = result;
  } catch (error) {
    this.log(JSON.stringify(error));
    this.props['result'] = error;
  }
});

When(
  'I call {string} with parameters {string} and {string}',
  async function (this: CustomWorld, fnName: string, param1: string, param2: string) {
    try {
      const fn = handleResolve(fnName, this);
      const result = await fn(handleResolve(param1, this), handleResolve(param2, this));
      this.props['result'] = result;
    } catch (error) {
      this.log(JSON.stringify(error));
      this.props['result'] = error;
    }
  }
);

When(
  'I call {string} with parameters {string}, {string} and {string}',
  async function (this: CustomWorld, fnName: string, param1: string, param2: string, param3: string) {
    try {
      const fn = handleResolve(fnName, this);
      const result = await fn(handleResolve(param1, this), handleResolve(param2, this), handleResolve(param3, this));
      this.props['result'] = result;
    } catch (error) {
      this.log(JSON.stringify(error));
      this.props['result'] = error;
    }
  }
);

When(
  'I call {string} with {string} with parameters {string} and {string}',
  async function (this: CustomWorld, field: string, fnName: string, param1: string, param2: string) {
    try {
      const fn = this.props[field][fnName];
      const result = await fn.call(this.props[field], handleResolve(param1, this), handleResolve(param2, this));
      this.props['result'] = result;
    } catch (error) {
      this.props['result'] = error;
    }
  }
);

When(
  'I call {string} with {string} with parameters {string} and {string} and {string}',
  async function (this: CustomWorld, field: string, fnName: string, param1: string, param2: string, param3: string) {
    try {
      const fn = this.props[field][fnName];
      const result = await fn.call(
        this.props[field],
        handleResolve(param1, this),
        handleResolve(param2, this),
        handleResolve(param3, this)
      );
      this.props['result'] = result;
    } catch (error) {
      this.props['result'] = error;
    }
  }
);

When('I refer to {string} as {string}', async function (this: CustomWorld, from: string, to: string) {
  this.props[to] = this.props[from];
});

Then(
  '{string} is an array of objects with the following contents',
  function (this: CustomWorld, field: string, dt: DataTable) {
    matchData(this, handleResolve(field, this), dt);
  }
);

Then(
  '{string} is an array of strings with the following values',
  function (this: CustomWorld, field: string, dt: DataTable) {
    const values = this.props[field].map((s: string) => {
      return { value: s };
    });
    matchData(this, values, dt);
  }
);

Then(
  '{string} is an object with the following contents',
  function (this: CustomWorld, field: string, params: DataTable) {
    const table = params.hashes();
    expect(doesRowMatch(this, table[0], handleResolve(field, this))).toBeTruthy();
  }
);

Then('{string} is null', function (this: CustomWorld, field: string) {
  expect(handleResolve(field, this)).toBeNull();
});

Then('{string} is undefined', function (this: CustomWorld, field: string) {
  expect(handleResolve(field, this)).toBeUndefined();
});

Then('{string} is empty', function (this: CustomWorld, field: string) {
  expect(handleResolve(field, this)).toHaveLength(0);
});

Then('{string} is {string}', function (this: CustomWorld, field: string, expected: string) {
  const fVal = handleResolve(field, this);
  const eVal = handleResolve(expected, this);
  expect('' + fVal).toEqual('' + eVal);
});

Then('{string} is an error with message {string}', function (this: CustomWorld, field: string, errorType: string) {
  expect(handleResolve(field, this)['message']).toBe(errorType);
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
