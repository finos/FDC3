import { Given, Then, When } from 'quickpickle';
import { DataTable } from '@cucumber/cucumber';
import { Context } from '@finos/fdc3-context';
import { handleResolve, matchData } from '@finos/testing';
import { CustomWorld } from '../world/index.js';
import { CHANNEL_STATE } from '@finos/testing';
import { ApiEvent } from '@finos/fdc3-standard';
import {
  BroadcastEvent,
  ChannelChangedEvent,
  PrivateChannelOnAddContextListenerEvent,
  PrivateChannelOnDisconnectEvent,
  PrivateChannelOnUnsubscribeEvent,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

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

Given('{string} is a {string} context', (world: CustomWorld, field: string, type: string) => {
  world.props[field] = contextMap[type];
});

Given(
  '{string} is a BroadcastEvent message on channel {string} with context {string}',
  (world: CustomWorld, field: string, channel: string, context: string) => {
    const message = {
      meta: {
        ...world.messaging!.createEventMeta(),
      },
      payload: {
        channelId: handleResolve(channel, world),
        context: contextMap[context],
      },
      type: 'broadcastEvent',
    } as BroadcastEvent;

    world.props[field] = message;
  }
);

Given(
  '{string} is a {string} message on channel {string}',
  (world: CustomWorld, field: string, type: string, channel: string) => {
    const message = {
      meta: world.messaging!.createEventMeta(),
      payload: {
        privateChannelId: handleResolve(channel, world),
      },
      type,
    } as PrivateChannelOnDisconnectEvent;

    world.props[field] = message;
  }
);

Given(
  '{string} is a {string} message on channel {string} with listenerType as {string}',
  (world: CustomWorld, field: string, type: string, channel: string, listenerType: string) => {
    const message = {
      meta: world.messaging!.createMeta(),
      payload: {
        channelId: handleResolve(channel, world),
        listenerType,
      },
      type,
    };

    world.props[field] = message;
  }
);

Given(
  '{string} is a channelChangedEvent message on channel {string}',
  (world: CustomWorld, field: string, channel: string) => {
    const message: ChannelChangedEvent = {
      meta: {
        eventUuid: world.messaging!.createUUID(),
        timestamp: new Date(),
      },
      payload: {
        newChannelId: handleResolve(channel, world),
      },
      type: 'channelChangedEvent',
    };

    world.props[field] = message;
  }
);

Given(
  '{string} is a PrivateChannelOnUnsubscribeEvent message on channel {string} with contextType as {string}',
  (world: CustomWorld, field: string, channel: string, contextType: string) => {
    const message = {
      meta: world.messaging!.createEventMeta(),
      payload: {
        privateChannelId: handleResolve(channel, world),
        contextType,
      },
      type: 'privateChannelOnUnsubscribeEvent',
    } as PrivateChannelOnUnsubscribeEvent;

    world.props[field] = message;
  }
);

Given(
  '{string} is a PrivateChannelOnAddContextListenerEvent message on channel {string} with contextType as {string}',
  (world: CustomWorld, field: string, channel: string, contextType: string) => {
    const message = {
      meta: world.messaging!.createEventMeta(),
      payload: {
        privateChannelId: handleResolve(channel, world),
        contextType,
      },
      type: 'privateChannelOnAddContextListenerEvent',
    } as PrivateChannelOnAddContextListenerEvent;

    world.props[field] = message;
  }
);

Given(
  '{string} is a PrivateChannelOnDisconnectEvent message on channel {string}',
  (world: CustomWorld, field: string, channel: string) => {
    const message = {
      meta: world.messaging!.createEventMeta(),
      payload: {
        privateChannelId: handleResolve(channel, world),
      },
      type: 'privateChannelOnDisconnectEvent',
    } as PrivateChannelOnDisconnectEvent;

    world.props[field] = message;
  }
);

Given('{string} pipes types to {string}', (world: CustomWorld, typeHandlerName: string, field: string) => {
  world.props[field] = [];
  world.props[typeHandlerName] = (s?: string) => {
    world.props[field].push(s);
  };
});

Given('{string} pipes events to {string}', (world: CustomWorld, typeHandlerName: string, field: string) => {
  world.props[field] = [];
  world.props[typeHandlerName] = (s?: ApiEvent) => {
    world.props[field].push(s?.details);
  };
});

Given('{string} pipes context to {string}', (world: CustomWorld, contextHandlerName: string, field: string) => {
  world.props[field] = [];
  world.props[contextHandlerName] = (context: Context) => {
    world.props[field].push(context);
  };
});

When('messaging receives {string}', (world: CustomWorld, field: string) => {
  const message = handleResolve(field, world);
  console.log(`Sending: `, message);
  world.messaging!.receive(message, console.log);
});

Then('messaging will have posts', (world: CustomWorld, dt: DataTable) => {
  // just take the last few posts and match those
  const matching = dt.rows().length;
  let toUse = world.messaging!.allPosts!;
  if (toUse.length > matching) {
    toUse = toUse.slice(toUse.length - matching, toUse.length);
  }
  matchData(world, toUse, dt);
});

Given('channel {string} has context {string}', (world: CustomWorld, channel: string, context: string) => {
  const ctxObject = handleResolve(context, world);
  const state = world.props[CHANNEL_STATE] ?? {};
  world.props[CHANNEL_STATE] = state;

  const cs = state[channel] ?? [];
  cs.push(ctxObject);
  state[channel] = cs;
});

Given('User Channels one, two and three', (world: CustomWorld) => {
  world.props[CHANNEL_STATE] = {
    one: [],
    two: [],
    three: [],
  };
});

When(
  'I destructure methods {string}, {string} from {string}',
  (world: CustomWorld, method1: string, method2: string, objectField: string) => {
    const object = handleResolve(objectField, world);
    world.props[`destructured_${method1}`] = object[method1];
    world.props[`destructured_${method2}`] = object[method2];
  }
);

When('I destructure method {string} from {string}', (world: CustomWorld, methodName: string, objectField: string) => {
  const object = handleResolve(objectField, world);
  const destructuredMethod = object[methodName];
  world.props[`destructured_${methodName}`] = destructuredMethod;
});

When('I call destructured {string}', async (world: CustomWorld, methodName: string) => {
  const destructuredMethod = world.props[`destructured_${methodName}`];
  try {
    const result = await destructuredMethod();
    world.props['result'] = result;
  } catch (error) {
    world.props['error'] = error;
    world.props['result'] = null;
  }
});

When(
  'I call destructured {string} with parameter {string}',
  async (world: CustomWorld, methodName: string, param: string) => {
    const destructuredMethod = world.props[`destructured_${methodName}`];
    const resolvedParam = handleResolve(param, world);
    try {
      const result = await destructuredMethod(resolvedParam);
      world.props['result'] = result;
    } catch (error) {
      world.props['error'] = error;
      world.props['result'] = null;
    }
  }
);

When(
  'I call destructured {string} with parameters {string} and {string}',
  async (world: CustomWorld, methodName: string, param1: string, param2: string) => {
    const destructuredMethod = world.props[`destructured_${methodName}`];
    const resolvedParam1 = handleResolve(param1, world);
    const resolvedParam2 = handleResolve(param2, world);
    try {
      const result = await destructuredMethod(resolvedParam1, resolvedParam2);
      world.props['result'] = result;
    } catch (error) {
      world.props['error'] = error;
      world.props['result'] = null;
    }
  }
);

When(
  'I call destructured {string} with parameters {string} and {string} and {string}',
  async (world: CustomWorld, methodName: string, param1: string, param2: string, param3: string) => {
    const destructuredMethod = world.props[`destructured_${methodName}`];
    const resolvedParam1 = handleResolve(param1, world);
    const resolvedParam2 = handleResolve(param2, world);
    const resolvedParam3 = handleResolve(param3, world);
    try {
      const result = await destructuredMethod(resolvedParam1, resolvedParam2, resolvedParam3);
      world.props['result'] = result;
    } catch (error) {
      world.props['error'] = error;
      world.props['result'] = null;
    }
  }
);
