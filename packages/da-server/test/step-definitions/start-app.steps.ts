import { DataTable, Then, When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { ConnectionStep2Hello, FindInstancesAgentRequest, GetAppMetadataAgentRequest, OpenAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { contextMap, createMeta } from './generic.steps';
import { matchData } from '../support/matching';

When('{string} is opened', function (this: CustomWorld, app: string) {
  const meta = createMeta(this, app)
  this.sc.connectedApps.push(meta.source)
});

When('{string} sends hello', function (this: CustomWorld, app: string) {
  const meta = createMeta(this, app)
  const message: ConnectionStep2Hello = {
    type: 'hello',
    meta: {
      timestamp: new Date()
    },
    payload: {
      authRequired: false,
      desktopAgentBridgeVersion: "1.0",
      supportedFDC3Versions: ["2.0", "2.1"]
    }
  }

  this.server.receive(message, meta.source)
});

Then('running apps will be', async function (this: CustomWorld, dataTable: DataTable) {
  const apps = await this.sc.getConnectedApps()
  matchData(this, apps, dataTable)
});

When('{string} opens app {string}', function (this: CustomWorld, appStr: string, open: string) {
  const from = createMeta(this, appStr)
  const message: OpenAgentRequest = {
    type: 'openRequest',
    meta: from,
    payload: {
      app: {
        appId: open,
        desktopAgent: "n/a"
      },
    }
  }
  this.server.receive(message, from.source)
});

When('{string} opens app {string} with context data {string}', function (this: CustomWorld, appStr: string, open: string, context: string) {
  const from = createMeta(this, appStr)
  const message: OpenAgentRequest = {
    type: 'openRequest',
    meta: from,
    payload: {
      app: {
        appId: open,
        desktopAgent: "n/a"
      },
      context: contextMap[context]
    }
  }
  this.server.receive(message, from.source)
});

When('{string} requests metadata for {string}', function (this: CustomWorld, appStr: string, open: string) {
  const from = createMeta(this, appStr)
  const message: GetAppMetadataAgentRequest = {
    type: 'getAppMetadataRequest',
    meta: from,
    payload: {
      app: {
        appId: open,
        desktopAgent: "n/a"
      }
    }
  }
  this.server.receive(message, from.source)
});


When('{string} findsInstances of {string}', function (this: CustomWorld, appStr: string, open: string) {
  const from = createMeta(this, appStr)
  const message: FindInstancesAgentRequest = {
    type: 'findInstancesRequest',
    meta: from,
    payload: {
      app: {
        appId: open
      }
    }
  }
  this.server.receive(message, from.source)
});

When('we wait for the listener timeout', function (this: CustomWorld) {
  return new Promise<void>((resolve, _reject) => {
    setTimeout(() => resolve(), 3100)
  })
});