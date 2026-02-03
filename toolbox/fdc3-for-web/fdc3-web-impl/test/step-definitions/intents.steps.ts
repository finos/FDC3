import { Given, When } from 'quickpickle';
import { DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../world/index.js';
import { DirectoryApp } from '../../src/directory/DirectoryInterface.js';
import { APP_FIELD, contextMap, createMeta } from './generic.steps.js';
import { handleResolve } from '@finos/testing';
import { BrowserTypes } from '@finos/fdc3-schema';

type FindIntentRequest = BrowserTypes.FindIntentRequest;
type FindIntentsByContextRequest = BrowserTypes.FindIntentsByContextRequest;
type AddIntentListenerRequest = BrowserTypes.AddIntentListenerRequest;
type IntentListenerUnsubscribeRequest = BrowserTypes.IntentListenerUnsubscribeRequest;
type RaiseIntentRequest = BrowserTypes.RaiseIntentRequest;
type RaiseIntentForContextRequest = BrowserTypes.RaiseIntentForContextRequest;
type IntentResultRequest = BrowserTypes.IntentResultRequest;

type ListensFor = {
  [key: string]: {
    displayName?: string | undefined;
    contexts: string[];
    resultType?: string | undefined;
  };
};

function decamelize(str: string, separator: string) {
  separator = typeof separator === 'undefined' ? '_' : separator;

  return str
    .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
    .toLowerCase();
}

function convertDataTableToListensFor(cw: CustomWorld, dt: DataTable): ListensFor {
  const hashes = dt.hashes();
  const out: ListensFor = {};
  hashes.forEach(h => {
    out[h['Intent Name']] = {
      displayName: decamelize(h['Intent Name'], ' '),
      contexts: [handleResolve(h['Context Type'], cw)],
      resultType: handleResolve(h['Result Type'], cw),
    };
  });

  return out;
}

Given('{string} is an app with the following intents', (world: CustomWorld, appId: string, dt: DataTable) => {
  const currentApps = world.props[APP_FIELD] ?? [];

  const newApp: DirectoryApp = {
    appId,
    type: 'web',
    description: '',
    title: '',
    details: {},
    interop: {
      intents: {
        listensFor: convertDataTableToListensFor(world, dt),
      },
    },
  };

  currentApps.push(newApp);

  world.props[APP_FIELD] = currentApps;
});

When(
  '{string} finds intents with intent {string} and contextType {string} and result type {string}',
  async (world: CustomWorld, appStr: string, intentName: string, contextType: string, resultType: string) => {
    const meta = createMeta(world, appStr);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = {
      meta,
      payload: {
        intent: handleResolve(intentName, world)!,
        resultType: handleResolve(resultType, world),
        context: contextMap[contextType],
      },
      type: 'findIntentRequest',
    } as FindIntentRequest;

    await world.server.receive(message, uuid);
  }
);

When(
  '{string} finds intents with contextType {string}',
  async (world: CustomWorld, appStr: string, contextType: string) => {
    const meta = createMeta(world, appStr);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = {
      meta,
      payload: {
        context: contextMap[contextType],
      },
      type: 'findIntentsByContextRequest',
    } as FindIntentsByContextRequest;

    await world.server.receive(message, uuid);
  }
);

Given(
  '{string} registers an intent listener for {string}',
  async (world: CustomWorld, appStr: string, intent: string) => {
    const meta = createMeta(world, appStr);
    const uuid = world.sc.getInstanceUUID(meta.source)!;

    const message = {
      type: 'addIntentListenerRequest',
      meta,
      payload: {
        intent: handleResolve(intent, world),
      },
    } as AddIntentListenerRequest;
    await world.server.receive(message, uuid);
  }
);

Given(
  '{string} registers an intent listener for {string} with contextType {string}',
  async (world: CustomWorld, appStr: string, intent: string, contextType: string) => {
    const meta = createMeta(world, appStr);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = {
      type: 'addIntentListenerRequest',
      meta,
      payload: {
        intent: handleResolve(intent, world),
        contextType: handleResolve(contextType, world),
      },
    } as AddIntentListenerRequest;
    await world.server.receive(message, uuid);
  }
);

Given(
  '{string} unsubscribes an intent listener with id {string}',
  async (world: CustomWorld, appStr: string, id: string) => {
    const meta = createMeta(world, appStr);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = {
      type: 'intentListenerUnsubscribeRequest',
      meta,
      payload: {
        listenerUUID: handleResolve(id, world),
      },
    } as IntentListenerUnsubscribeRequest;
    await world.server.receive(message, uuid);
  }
);

function raise(
  cw: CustomWorld,
  intentName: string,
  contextType: string,
  dest: string | null,
  meta: RaiseIntentRequest['meta']
): RaiseIntentRequest {
  const destMeta = dest != null ? createMeta(cw, dest) : null;
  const message = {
    type: 'raiseIntentRequest',
    meta: {
      ...meta,
    },
    payload: {
      intent: handleResolve(intentName, cw),
      context: contextMap[contextType],
      app: dest ? destMeta!.source : null,
    },
  } as RaiseIntentRequest;
  return message;
}

function raiseWithContext(
  cw: CustomWorld,
  contextType: string,
  dest: string | null,
  meta: RaiseIntentForContextRequest['meta']
): RaiseIntentForContextRequest {
  const destMeta = dest != null ? createMeta(cw, dest) : null;
  const message = {
    type: 'raiseIntentForContextRequest',
    meta: {
      ...meta,
    },
    payload: {
      context: contextMap[contextType],
      app: dest ? destMeta!.source : null,
    },
  } as RaiseIntentForContextRequest;
  return message;
}

function raiseWithInvalidTarget(
  cw: CustomWorld,
  intentName: string,
  contextType: string,
  meta: RaiseIntentRequest['meta']
): RaiseIntentRequest {
  const message = {
    type: 'raiseIntentRequest',
    meta: {
      ...meta,
    },
    payload: {
      intent: handleResolve(intentName, cw),
      context: contextMap[contextType],
      app: 'SPOON',
    },
  } as unknown as RaiseIntentRequest;
  return message;
}

function raiseWithContextAnInvalidTarget(
  contextType: string,
  meta: RaiseIntentForContextRequest['meta']
): RaiseIntentForContextRequest {
  const message = {
    type: 'raiseIntentForContextRequest',
    meta: {
      ...meta,
    },
    payload: {
      context: contextMap[contextType],
      app: 'SPOON',
    },
  } as unknown as RaiseIntentForContextRequest;
  return message;
}

When(
  '{string} raises an intent with contextType {string}',
  async (world: CustomWorld, appStr: string, contextType: string) => {
    const meta = createMeta(world, appStr);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = raiseWithContext(world, contextType, null, meta);
    await world.server.receive(message, uuid);
  }
);

When(
  '{string} raises an intent with contextType {string} on app {string}',
  async (world: CustomWorld, appStr: string, contextType: string, dest: string) => {
    const meta = createMeta(world, appStr);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = raiseWithContext(world, contextType, dest, meta);
    await world.server.receive(message, uuid);
  }
);

When(
  '{string} raises an intent for {string} with contextType {string}',
  async (world: CustomWorld, appStr: string, intentName: string, contextType: string) => {
    const meta = createMeta(world, appStr);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = raise(world, intentName, contextType, null, meta);
    await world.server.receive(message, uuid);
  }
);

When(
  '{string} raises an intent for {string} with contextType {string} on app {string}',
  async (world: CustomWorld, appStr: string, intentName: string, contextType: string, dest: string) => {
    const meta = createMeta(world, appStr);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = raise(world, intentName, contextType, dest, meta);
    await world.server.receive(message, uuid);
  }
);

When(
  '{string} raises an intent for {string} with contextType {string} on an invalid app instance',
  async (world: CustomWorld, appStr: string, intentName: string, contextType: string) => {
    const meta = createMeta(world, appStr);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = raiseWithInvalidTarget(world, intentName, contextType, meta);
    await world.server.receive(message, uuid);
  }
);

When(
  '{string} raises an intent with contextType {string} on an invalid app instance',
  async (world: CustomWorld, appStr: string, contextType: string) => {
    const meta = createMeta(world, appStr);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = raiseWithContextAnInvalidTarget(contextType, meta);
    await world.server.receive(message, uuid);
  }
);

When(
  '{string} raises an intent for {string} with contextType {string} on app {string} with requestUuid {string}',
  async (
    world: CustomWorld,
    appStr: string,
    intentName: string,
    contextType: string,
    dest: string,
    requestUuid: string
  ) => {
    const meta = {
      ...createMeta(world, appStr),
      requestUuid,
    };
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message = raise(world, intentName, contextType, dest, meta);
    await world.server.receive(message, uuid);
  }
);

When('we wait for the intent timeout', (world: CustomWorld) => {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), 2100);
  });
});

When(
  '{string} sends a intentResultRequest with eventUuid {string} and contextType {string} and raiseIntentUuid {string}',
  async (world: CustomWorld, appStr: string, eventUuid: string, contextType: string, raiseIntentUuid: string) => {
    const meta = createMeta(world, appStr);
    const uuid1 = world.sc.getInstanceUUID(meta.source)!;
    const message: IntentResultRequest = {
      type: 'intentResultRequest',
      meta: {
        ...meta,
      },
      payload: {
        intentResult: {
          context: contextMap[contextType],
        },
        intentEventUuid: eventUuid,
        raiseIntentRequestUuid: raiseIntentUuid,
      },
    };
    await world.server.receive(message, uuid1);
  }
);

When(
  '{string} sends a intentResultRequest with eventUuid {string} and void contents and raiseIntentUuid {string}',
  async (world: CustomWorld, appStr: string, eventUuid: string, raiseIntentUuid: string) => {
    const meta = createMeta(world, appStr);
    const uuid = world.sc.getInstanceUUID(meta.source)!;
    const message: IntentResultRequest = {
      type: 'intentResultRequest',
      meta: {
        ...meta,
      },
      payload: {
        intentResult: {},
        intentEventUuid: eventUuid,
        raiseIntentRequestUuid: raiseIntentUuid,
      },
    };
    await world.server.receive(message, uuid);
  }
);

When(
  '{string} sends a intentResultRequest with eventUuid {string} and private channel {string} and raiseIntentUuid {string}',
  async (world: CustomWorld, appStr: string, eventUuid: string, channelId: string, raiseIntentUuid: string) => {
    const meta = createMeta(world, appStr);
    const uuid = world.sc.getInstanceUUID(meta.source)!;

    const message: IntentResultRequest = {
      type: 'intentResultRequest',
      meta: {
        ...meta,
      },
      payload: {
        intentResult: {
          channel: {
            type: 'private',
            id: channelId,
          },
        },
        intentEventUuid: eventUuid,
        raiseIntentRequestUuid: raiseIntentUuid,
      },
    };
    await world.server.receive(message, uuid);
  }
);
