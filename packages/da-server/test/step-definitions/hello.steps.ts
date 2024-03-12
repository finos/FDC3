import { When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { ConnectionStep2Hello } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { createMeta } from './generic.steps';

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