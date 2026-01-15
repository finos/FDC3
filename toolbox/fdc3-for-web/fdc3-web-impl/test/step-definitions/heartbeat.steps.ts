import { Given, Then } from 'quickpickle';
import { CustomWorld } from '../world/index.js';
import {
  HeartbeatAcknowledgementRequest,
  WebConnectionProtocol6Goodbye,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { createMeta } from './generic.steps.js';
import { HeartbeatHandler } from '../../src/handlers/HeartbeatHandler.js';

Given(
  '{string} sends a heartbeat response to eventUuid {string}',
  (world: CustomWorld, appStr: string, eventUuid: string) => {
    const meta = createMeta(world, appStr);
    const uuid = world.sc.getInstanceUUID(meta.source)!;

    const message = {
      meta,
      payload: {
        heartbeatEventUuid: eventUuid,
      },
      type: 'heartbeatAcknowledgementRequest',
    } as HeartbeatAcknowledgementRequest;

    world.server.receive(message, uuid);
  }
);

Given('{string} sends a goodbye message', (world: CustomWorld, appStr: string) => {
  const meta = createMeta(world, appStr);
  const uuid = world.sc.getInstanceUUID(meta.source)!;

  const message: WebConnectionProtocol6Goodbye = {
    meta,
    type: 'WCP6Goodbye',
  };

  world.server.receive(message, uuid);
});

Then('I test the liveness of {string}', async (world: CustomWorld, appStr: string) => {
  const out = await world.sc.isAppConnected(createMeta(world, appStr).source.instanceId ?? 'UNKNOWN');
  world.props['result'] = out;
});

Then('I get the heartbeat times', async (world: CustomWorld) => {
  const hbh = world.server.handlers[3];
  const out = (hbh as HeartbeatHandler).heartbeatTimes();
  world.props['result'] = out;
});
