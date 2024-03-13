import { DataTable, Then, When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { ConnectionStep2Hello } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { createMeta } from './generic.steps';
import { matchData } from '../support/matching';

When('{string} is opened', function (this: CustomWorld, app: string) {
  const meta = createMeta(this, app)
  this.sc.openApps.push(meta.source)
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
  const apps = await this.sc.getOpenApps()
  matchData(this, apps, dataTable)
});