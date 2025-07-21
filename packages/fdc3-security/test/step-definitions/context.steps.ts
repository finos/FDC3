import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../world/index';
import { Context } from '@finos/fdc3-context';
import { ContextMetadata } from '@finos/fdc3-standard';

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
    const sigField = `length-check:${length}:https://dummy.com/pubKey`;

    const copy = JSON.parse(JSON.stringify(contextMap[type]));
    copy['__signature'] = sigField;
    this.props[field] = copy;
  }
);

Given(
  '{string} is a {string} context with broken signature field',
  function (this: CustomWorld, field: string, type: string) {
    const copy = JSON.parse(JSON.stringify(contextMap[type]));
    copy['__signature'] = 'broken-signature';
    this.props[field] = copy;
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
