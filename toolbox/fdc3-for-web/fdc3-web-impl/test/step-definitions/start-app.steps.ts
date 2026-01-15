import { Then, When } from 'quickpickle';
import { DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../world/index.js';
import { contextMap, createMeta } from './generic.steps.js';
import { matchData } from '@finos/testing';
import { BrowserTypes } from '@finos/fdc3-schema';
import { State } from '../../src/ServerContext.js';
import { GetInfoRequest } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

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
