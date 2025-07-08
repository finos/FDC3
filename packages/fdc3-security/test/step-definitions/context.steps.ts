import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../world/index';
import { Context, ContextMetadata } from '@finos/fdc3';
import { SIGNATURE_KEY, signedContext } from '../../src/signing/SigningSupport';
import { ClientSideImplementation } from '../../src/ClientSideImplementation';
import { handleResolve } from '../support/matching';

const contextMap: Record<string, any> = {
  'fdc3.instrument': {
    type: 'fdc3.instrument',
    name: 'Apple',
    id: {
      ticker: 'AAPL',
    },
  },
  'fdc3.country': {
    type: 'fdc3.country',
    name: 'Sweden',
    id: {
      COUNTRY_ISOALPHA2: 'SE',
      COUNTRY_ISOALPHA3: 'SWE',
    },
  },
  'fdc3.unsupported': {
    type: 'fdc3.unsupported',
    bogus: true,
  },
  'fdc3.security.symmetricKey.request': {
    type: 'fdc3.security.symmetricKey.request',
  },
};

Given('{string} is a {string} context', function (this: CustomWorld, field: string, type: string) {
  this.props[field] = contextMap[type];
});

Given(
  '{string} is a {string} context with dummy signature field length {int}',
  function (this: CustomWorld, field: string, type: string, length: number) {
    const sigField = {
      digest: 'length: ' + length,
      publicKeyUrl: 'https://dummy.com/pubKey',
      algorithm: 'LENGTH-CHECK',
      date: JSON.stringify(new Date()),
    };

    const copy = JSON.parse(JSON.stringify(contextMap[type]));
    copy[SIGNATURE_KEY] = sigField;
    this.props[field] = copy;
  }
);

Given(
  '{string} is a {string} context signed with {string} and {string} for intent {string}',
  async function (
    this: CustomWorld,
    field: string,
    type: string,
    privateSigningKey: string,
    publicKeyUrl: string,
    intent: string
  ) {
    const privateKey = handleResolve(privateSigningKey, this);
    const sign = new ClientSideImplementation().initSigner(privateKey, publicKeyUrl);

    const copy = JSON.parse(JSON.stringify(contextMap[type]));
    const signedCopy = await signedContext(sign, copy, intent, undefined);

    this.props[field] = signedCopy;
  }
);

Given(
  '{string} pipes context to {string} and metadata to {string}',
  function (this: CustomWorld, contextHandlerName: string, field: string, field2: string) {
    this.props[field] = [];
    this.props[field2] = [];
    this.props[contextHandlerName] = (context: Context, metadata: ContextMetadata) => {
      this.props[field].push(context);
      this.props[field2].push(metadata);
    };
  }
);

Given('{string} echoes the context back to the raiser', function (this: CustomWorld, contextHandlerName: string) {
  this.props[contextHandlerName] = async (context: Context, _metadata: ContextMetadata) => {
    return context;
  };
});
