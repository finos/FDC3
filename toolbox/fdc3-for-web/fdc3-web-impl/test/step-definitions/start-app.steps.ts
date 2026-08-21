import { Then, When } from 'quickpickle';
import { DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../world/index.js';
import { contextMap, createMeta } from './generic.steps.js';
import { matchData } from '@finos/testing';
import { BrowserTypes } from '@finos/fdc3-schema';
import { State } from '../../src/ServerContext.js';
import { GetInfoRequest } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { expect } from 'vitest';

type OpenRequest = BrowserTypes.OpenRequest;
type GetAppMetadataRequest = BrowserTypes.GetAppMetadataRequest;
type FindInstancesRequest = BrowserTypes.FindInstancesRequest;
type WebConnectionProtocol4ValidateAppIdentity = BrowserTypes.WebConnectionProtocol4ValidateAppIdentity;

When('{string} is opened with connection id {string}', (world: CustomWorld, app: string, uuid: string) => {
  const meta = createMeta(world, app);
  world.sc.setInstanceDetails(uuid, {
    appId: meta.source.appId,
    instanceId: meta.source.instanceId!,
    state: State.Connected,
  });
});

When('{string} is closed', (world: CustomWorld, app: string) => {
  const meta = createMeta(world, app);
  world.server.cleanup(meta.source.instanceId!);
});

When('{string} sends validate', (world: CustomWorld, uuid: string) => {
  const identity = world.sc.getInstanceDetails(uuid);
  if (identity) {
    const message: WebConnectionProtocol4ValidateAppIdentity = {
      type: 'WCP4ValidateAppIdentity',
      meta: {
        connectionAttemptUuid: world.sc.createUUID(),
        timestamp: new Date(),
      },
      payload: {
        actualUrl: 'something',
        identityUrl: 'something',
      },
    };
    world.sc.setAppState(identity.instanceId, State.Connected);
    world.server.receive(message, uuid);
  } else {
    throw new Error(`Did not find app identity ${uuid}`);
  }
});

const assertKnownSelfInteractionOption = (option: string) => {
  if (option !== 'receiveOwnBroadcasts' && option !== 'resolveOwnIntents') {
    throw new Error(`Unknown self-interaction option ${option}`);
  }
};

// Sets a self-interaction option (receiveOwnBroadcasts / resolveOwnIntents) directly
// on an already-opened instance's registration, as if it had been supplied via getAgent
// and captured during connection. Used for behaviour tests without the extra handshake post.
When('{string} has opted in to {string}', (world: CustomWorld, app: string, option: string) => {
  assertKnownSelfInteractionOption(option);
  const meta = createMeta(world, app);
  const details = world.sc.getInstanceDetails(meta.source.instanceId!);
  if (!details) {
    throw new Error(`No instance details found for ${app}`);
  }
  (details as Record<string, unknown>)[option] = true;
  world.sc.setInstanceDetails(details.instanceId, details);
});

// Sends a WCP4 identity validation message carrying a self-interaction option, exercising
// the full handshake -> storage path in OpenHandler.handleValidate. Requires a directory app
// so that implementation metadata can be built for the success response.
When('{string} sends validate opting in to {string}', (world: CustomWorld, uuid: string, option: string) => {
  assertKnownSelfInteractionOption(option);
  const identity = world.sc.getInstanceDetails(uuid);
  if (!identity) {
    throw new Error(`Did not find app identity ${uuid}`);
  }
  const payload: WebConnectionProtocol4ValidateAppIdentity['payload'] = {
    actualUrl: 'something',
    identityUrl: 'something',
  };
  if (option === 'receiveOwnBroadcasts') {
    payload.receiveOwnBroadcasts = true;
  } else {
    payload.resolveOwnIntents = true;
  }
  const message: WebConnectionProtocol4ValidateAppIdentity = {
    type: 'WCP4ValidateAppIdentity',
    meta: {
      connectionAttemptUuid: world.sc.createUUID(),
      timestamp: new Date(),
    },
    payload,
  };
  world.sc.setAppState(identity.instanceId, State.Connected);
  world.server.receive(message, uuid);
});

Then(
  'instance {string} has {string} equal to {string}',
  (world: CustomWorld, uuid: string, option: string, expected: string) => {
    assertKnownSelfInteractionOption(option);
    const details = world.sc.getInstanceDetails(uuid);
    expect(details).toBeDefined();
    expect((details as unknown as Record<string, unknown>)[option]).toEqual(expected === 'true');
  }
);

When('{string} revalidates', (world: CustomWorld, uuid: string) => {
  const message: WebConnectionProtocol4ValidateAppIdentity = {
    type: 'WCP4ValidateAppIdentity',
    meta: {
      connectionAttemptUuid: world.sc.createUUID(),
      timestamp: new Date(),
    },
    payload: {
      instanceUuid: uuid,
      actualUrl: 'something',
      identityUrl: 'something',
    },
  };

  world.server.receive(message, uuid);
});

Then('running apps will be', async (world: CustomWorld, dataTable: DataTable) => {
  const apps = await world.sc.getConnectedApps();
  matchData(world, apps, dataTable);
});

Then('no apps are connected', async (world: CustomWorld) => {
  const apps = await world.sc.getConnectedApps();
  expect(apps.length).toEqual(0);
});

When('{string} opens app {string}', (world: CustomWorld, appStr: string, open: string) => {
  const from = createMeta(world, appStr);
  const uuid = world.sc.getInstanceUUID(from.source)!;
  const message: OpenRequest = {
    type: 'openRequest',
    meta: from,
    payload: {
      app: {
        appId: open,
        desktopAgent: 'n/a',
      },
      metadata: {},
    },
  };
  world.server.receive(message, uuid);
});

When(
  '{string} opens app {string} with context data {string}',
  (world: CustomWorld, appStr: string, open: string, context: string) => {
    const from = createMeta(world, appStr);
    const uuid = world.sc.getInstanceUUID(from.source)!;
    const message: OpenRequest = {
      type: 'openRequest',
      meta: from,
      payload: {
        app: {
          appId: open,
          desktopAgent: 'n/a',
        },
        context: contextMap[context],
        metadata: {},
      },
    };
    world.server.receive(message, uuid);
  }
);

When('{string} requests metadata for {string}', (world: CustomWorld, appStr: string, open: string) => {
  const from = createMeta(world, appStr);
  const uuid = world.sc.getInstanceUUID(from.source)!;
  const message: GetAppMetadataRequest = {
    type: 'getAppMetadataRequest',
    meta: from,
    payload: {
      app: {
        appId: open,
        desktopAgent: 'n/a',
      },
    },
  };
  world.server.receive(message, uuid);
});

When('{string} requests info on the DesktopAgent', (world: CustomWorld, appStr: string) => {
  const from = createMeta(world, appStr);
  const uuid = world.sc.getInstanceUUID(from.source)!;
  const message: GetInfoRequest = {
    type: 'getInfoRequest',
    meta: from,
    payload: {},
  };
  world.server.receive(message, uuid);
});

When('{string} requests close', (world: CustomWorld, appStr: string) => {
  const from = createMeta(world, appStr);
  const uuid = world.sc.getInstanceUUID(from.source)!;
  const message: BrowserTypes.CloseRequest = {
    type: 'closeRequest',
    meta: from,
    payload: {},
  };
  world.server.receive(message, uuid);
});

When('{string} requests close before connected', (world: CustomWorld, appStr: string) => {
  const from = createMeta(world, appStr);
  const details = world.sc.getInstanceDetails(from.source.instanceId!);
  if (details) {
    details.state = State.Pending;
  }
  const message: BrowserTypes.CloseRequest = {
    type: 'closeRequest',
    meta: from,
    payload: {},
  };
  world.server.receive(message, from.source.instanceId!);
});

When('{string} findsInstances of {string}', (world: CustomWorld, appStr: string, open: string) => {
  const from = createMeta(world, appStr);
  const uuid = world.sc.getInstanceUUID(from.source)!;
  const message: FindInstancesRequest = {
    type: 'findInstancesRequest',
    meta: from,
    payload: {
      app: {
        appId: open,
      },
    },
  };
  world.server.receive(message, uuid);
});

When('we wait for the listener timeout', () => {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), 3100);
  });
});
