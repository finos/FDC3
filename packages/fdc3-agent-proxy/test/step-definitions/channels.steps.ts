import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { Context } from '@finos/fdc3-context';
import { handleResolve, matchData } from '@finos/testing';
import { CustomWorld } from '../world/index';
import { CHANNEL_STATE } from '@finos/testing';
import { ApiEvent } from '@finos/fdc3-standard';
import {
  BroadcastEvent,
  ChannelChangedEvent,
  PrivateChannelOnAddContextListenerEvent,
  PrivateChannelOnDisconnectEvent,
  PrivateChannelOnUnsubscribeEvent,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';

const contextMap: Record<string, Context> = {
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
  'fdc3.cancel-me': {
    type: 'fdc3.cancel-me',
  },
};

Given('{string} is a {string} context', function (this: CustomWorld, field: string, type: string) {
  this.props[field] = contextMap[type];
});

Given(
  '{string} is a BroadcastEvent message on channel {string} with context {string}',
  function (this: CustomWorld, field: string, channel: string, context: string) {
    const message = {
      meta: {
        ...this.messaging!.createEventMeta(),
      },
      payload: {
        channelId: handleResolve(channel, this),
        context: contextMap[context],
      },
      type: 'broadcastEvent',
    } as BroadcastEvent;

    this.props[field] = message;
  }
);

Given(
  '{string} is a {string} message on channel {string}',
  function (this: CustomWorld, field: string, type: string, channel: string) {
    const message = {
      meta: this.messaging!.createEventMeta(),
      payload: {
        privateChannelId: handleResolve(channel, this),
      },
      type,
    } as PrivateChannelOnDisconnectEvent;

    this.props[field] = message;
  }
);

Given(
  '{string} is a {string} message on channel {string} with listenerType as {string}',
  function (this: CustomWorld, field: string, type: string, channel: string, listenerType: string) {
    const message = {
      meta: this.messaging!.createMeta(),
      payload: {
        channelId: handleResolve(channel, this),
        listenerType,
      },
      type,
    };

    this.props[field] = message;
  }
);

Given(
  '{string} is a channelChangedEvent message on channel {string}',
  function (this: CustomWorld, field: string, channel: string) {
    const message: ChannelChangedEvent = {
      meta: {
        eventUuid: this.messaging!.createUUID(),
        timestamp: new Date(),
      },
      payload: {
        newChannelId: handleResolve(channel, this),
      },
      type: 'channelChangedEvent',
    };

    this.props[field] = message;
  }
);

Given(
  '{string} is a PrivateChannelOnUnsubscribeEvent message on channel {string} with contextType as {string}',
  function (this: CustomWorld, field: string, channel: string, contextType: string) {
    const message = {
      meta: this.messaging!.createEventMeta(),
      payload: {
        privateChannelId: handleResolve(channel, this),
        contextType,
      },
      type: 'privateChannelOnUnsubscribeEvent',
    } as PrivateChannelOnUnsubscribeEvent;

    this.props[field] = message;
  }
);

Given(
  '{string} is a PrivateChannelOnAddContextListenerEvent message on channel {string} with contextType as {string}',
  function (this: CustomWorld, field: string, channel: string, contextType: string) {
    const message = {
      meta: this.messaging!.createEventMeta(),
      payload: {
        privateChannelId: handleResolve(channel, this),
        contextType,
      },
      type: 'privateChannelOnAddContextListenerEvent',
    } as PrivateChannelOnAddContextListenerEvent;

    this.props[field] = message;
  }
);

Given(
  '{string} is a PrivateChannelOnDisconnectEvent message on channel {string}',
  function (this: CustomWorld, field: string, channel: string) {
    const message = {
      meta: this.messaging!.createEventMeta(),
      payload: {
        privateChannelId: handleResolve(channel, this),
      },
      type: 'privateChannelOnDisconnectEvent',
    } as PrivateChannelOnDisconnectEvent;

    this.props[field] = message;
  }
);

Given('{string} pipes types to {string}', function (this: CustomWorld, typeHandlerName: string, field: string) {
  this.props[field] = [];
  this.props[typeHandlerName] = (s?: string) => {
    this.props[field].push(s);
  };
});

Given('{string} pipes events to {string}', function (this: CustomWorld, typeHandlerName: string, field: string) {
  this.props[field] = [];
  this.props[typeHandlerName] = (s?: ApiEvent) => {
    this.props[field].push(s?.details);
  };
});

Given('{string} pipes context to {string}', function (this: CustomWorld, contextHandlerName: string, field: string) {
  this.props[field] = [];
  this.props[contextHandlerName] = (context: Context) => {
    this.props[field].push(context);
  };
});

When('messaging receives {string}', function (this: CustomWorld, field: string) {
  const message = handleResolve(field, this);
  console.log(`Sending: `, message);
  this.messaging!.receive(message, console.log);
});

Then('messaging will have posts', function (this: CustomWorld, dt: DataTable) {
  // just take the last few posts and match those
  const matching = dt.rows().length;
  let toUse = this.messaging!.allPosts!;
  if (toUse.length > matching) {
    toUse = toUse.slice(toUse.length - matching, toUse.length);
  }
  matchData(this, toUse, dt);
});

Given('channel {string} has context {string}', function (this: CustomWorld, channel: string, context: string) {
  const ctxObject = handleResolve(context, this);
  const state = this.props[CHANNEL_STATE] ?? {};
  this.props[CHANNEL_STATE] = state;

  const cs = state[channel] ?? [];
  cs.push(ctxObject);
  state[channel] = cs;
});

Given('User Channels one, two and three', function (this: CustomWorld) {
  this.props[CHANNEL_STATE] = {
    one: [],
    two: [],
    three: [],
  };
});

When(
  'I destructure methods {string}, {string} from {string}',
  function (this: CustomWorld, method1: string, method2: string, objectField: string) {
    const object = handleResolve(objectField, this);
    this.props[`destructured_${method1}`] = object[method1];
    this.props[`destructured_${method2}`] = object[method2];
  }
);

When(
  'I destructure method {string} from {string}',
  function (this: CustomWorld, methodName: string, objectField: string) {
    const object = handleResolve(objectField, this);
    const destructuredMethod = object[methodName];
    this.props[`destructured_${methodName}`] = destructuredMethod;
  }
);

When('I call destructured {string}', async function (this: CustomWorld, methodName: string) {
  const destructuredMethod = this.props[`destructured_${methodName}`];
  try {
    const result = await destructuredMethod();
    this.props['result'] = result;
  } catch (error) {
    this.props['error'] = error;
    this.props['result'] = null;
  }
});

When(
  'I call destructured {string} with parameter {string}',
  async function (this: CustomWorld, methodName: string, param: string) {
    const destructuredMethod = this.props[`destructured_${methodName}`];
    const resolvedParam = handleResolve(param, this);
    try {
      const result = await destructuredMethod(resolvedParam);
      this.props['result'] = result;
    } catch (error) {
      this.props['error'] = error;
      this.props['result'] = null;
    }
  }
);

When(
  'I call destructured {string} with parameters {string} and {string}',
  async function (this: CustomWorld, methodName: string, param1: string, param2: string) {
    const destructuredMethod = this.props[`destructured_${methodName}`];
    const resolvedParam1 = handleResolve(param1, this);
    const resolvedParam2 = handleResolve(param2, this);
    try {
      const result = await destructuredMethod(resolvedParam1, resolvedParam2);
      this.props['result'] = result;
    } catch (error) {
      this.props['error'] = error;
      this.props['result'] = null;
    }
  }
);

When(
  'I call destructured {string} with parameters {string} and {string} and {string}',
  async function (this: CustomWorld, methodName: string, param1: string, param2: string, param3: string) {
    const destructuredMethod = this.props[`destructured_${methodName}`];
    const resolvedParam1 = handleResolve(param1, this);
    const resolvedParam2 = handleResolve(param2, this);
    const resolvedParam3 = handleResolve(param3, this);
    try {
      const result = await destructuredMethod(resolvedParam1, resolvedParam2, resolvedParam3);
      this.props['result'] = result;
    } catch (error) {
      this.props['error'] = error;
      this.props['result'] = null;
    }
  }
);
