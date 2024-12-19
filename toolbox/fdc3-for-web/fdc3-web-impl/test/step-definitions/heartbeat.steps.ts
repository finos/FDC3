import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import {
  HeartbeatAcknowledgementRequest,
  WebConnectionProtocol6Goodbye,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { createMeta } from './generic.steps';
import { HeartbeatHandler } from '../../src/handlers/HeartbeatHandler';

Given(
  '{string} sends a heartbeat response to eventUuid {string}',
  function (this: CustomWorld, appStr: string, eventUuid: string) {
    const meta = createMeta(this, appStr);
    const uuid = this.sc.getInstanceUUID(meta.source)!;

    const message = {
      meta,
      payload: {
        heartbeatEventUuid: eventUuid,
      },
      type: 'heartbeatAcknowledgementRequest',
    } as HeartbeatAcknowledgementRequest;

    this.server.receive(message, uuid);
  }
);

Given('{string} sends a goodbye message', function (this: CustomWorld, appStr: string) {
  const meta = createMeta(this, appStr);
  const uuid = this.sc.getInstanceUUID(meta.source)!;

  const message: WebConnectionProtocol6Goodbye = {
    meta,
    type: 'WCP6Goodbye',
  };

  this.server.receive(message, uuid);
});

Then('I test the liveness of {string}', async function (this: CustomWorld, appStr: string) {
  const out = await this.sc.isAppConnected(createMeta(this, appStr).source.instanceId);
  this.props['result'] = out;
});

Then('I get the heartbeat times', async function (this: CustomWorld) {
  const hbh = this.server.handlers[3];
  const out = (hbh as HeartbeatHandler).heartbeatTimes();
  this.props['result'] = out;
});
