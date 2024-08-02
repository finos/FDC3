import { DataTable, Then, When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { contextMap, createMeta } from './generic.steps';
import { matchData } from '@kite9/testing';
import { OpenRequest, GetAppMetadataRequest, FindInstancesRequest } from '@kite9/fdc3-common';

When('{string} is opened with connection id {string}', function (this: CustomWorld, app: string, uuid: string) {
  const meta = createMeta(this, app)
  this.sc.setInstanceDetails(uuid, meta.source)
  this.sc.setAppConnected(meta.source)
});

When('{string} is closed', function (this: CustomWorld, app: string) {
  const meta = createMeta(this, app)
  this.sc.disconnectApp(meta.source)
});

// When('{string} sends validate', function (this: CustomWorld, app: string) {
//   const meta = createMeta(this, app)
//   const message: WebConnectionProtocol4ValidateAppIdentity = {
//     type: 'WCP4ValidateAppIdentity',
//     meta: {
//       connectionAttemptUuid: this.sc.createUUID(),
//       timestamp: new Date()
//     },
//     payload: {
//       appId: meta.source.appId
//     }
//   }

//   this.server.receive(message, meta.source)
// });

Then('running apps will be', async function (this: CustomWorld, dataTable: DataTable) {
  const apps = await this.sc.getConnectedApps()
  matchData(this, apps, dataTable)
});

When('{string} opens app {string}', function (this: CustomWorld, appStr: string, open: string) {
  const from = createMeta(this, appStr)
  const uuid = this.sc.getInstanceUUID(from.source)!!
  const message: OpenRequest = {
    type: 'openRequest',
    meta: from,
    payload: {
      app: {
        appId: open,
        desktopAgent: "n/a"
      },
    }
  }
  this.server.receive(message, uuid)
});

When('{string} opens app {string} with context data {string}', function (this: CustomWorld, appStr: string, open: string, context: string) {
  const from = createMeta(this, appStr)
  const uuid = this.sc.getInstanceUUID(from.source)!!
  const message: OpenRequest = {
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
  this.server.receive(message, uuid)
});

When('{string} requests metadata for {string}', function (this: CustomWorld, appStr: string, open: string) {
  const from = createMeta(this, appStr)
  const uuid = this.sc.getInstanceUUID(from.source)!!
  const message: GetAppMetadataRequest = {
    type: 'getAppMetadataRequest',
    meta: from,
    payload: {
      app: {
        appId: open,
        desktopAgent: "n/a"
      }
    }
  }
  this.server.receive(message, uuid)
});


When('{string} findsInstances of {string}', function (this: CustomWorld, appStr: string, open: string) {
  const from = createMeta(this, appStr)
  const uuid = this.sc.getInstanceUUID(from.source)!!
  const message: FindInstancesRequest = {
    type: 'findInstancesRequest',
    meta: from,
    payload: {
      app: {
        appId: open
      }
    }
  }
  this.server.receive(message, uuid)
});

When('we wait for the listener timeout', function (this: CustomWorld) {
  return new Promise<void>((resolve, _reject) => {
    setTimeout(() => resolve(), 3100)
  })
});