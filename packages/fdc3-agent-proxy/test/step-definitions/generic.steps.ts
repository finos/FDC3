import { TestMessaging } from '../support/TestMessaging.js';
import { Given, When } from 'quickpickle';
import { CustomWorld } from '../world/index.js';
import {
  DesktopAgentProxy,
  DefaultAppSupport,
  DefaultChannelSupport,
  DefaultIntentSupport,
  DefaultHeartbeatSupport,
} from '../../src/index.js';
import { SimpleIntentResolver, SimpleChannelSelector, CHANNEL_STATE, setupGenericSteps } from '@finos/testing';
import { HeartbeatEvent } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { LogLevel } from '@finos/fdc3-standard';
import path from 'path';

// Update this to enable debug output when debugging test failures
const logLevel = LogLevel.WARN;

// Register shared generic steps from @finos/testing
const schemaBasePath = path.join(import.meta.dirname, '../../../');
setupGenericSteps(schemaBasePath);

Given('A Desktop Agent in {string}', async (world: CustomWorld, field: string) => {
  if (!world.messaging) {
    world.messaging = new TestMessaging(world.props[CHANNEL_STATE]);
  }

  // n.b. using short timeouts to avoid extending tests unnecessarily
  const cs = new DefaultChannelSupport(world.messaging, new SimpleChannelSelector(world), 1500);
  const hs = new DefaultHeartbeatSupport(world.messaging);
  const is = new DefaultIntentSupport(world.messaging, new SimpleIntentResolver(world), 1500, 3000);
  const as = new DefaultAppSupport(world.messaging, 1500, 3000);

  const da = new DesktopAgentProxy(hs, cs, is, as, [hs], logLevel);
  await da.connect();

  world.props[field] = da;
  world.props['result'] = null;
});

When('messaging receives a heartbeat event', (world: CustomWorld) => {
  world.messaging?.receive({
    type: 'heartbeatEvent',
    meta: world.messaging.createEventMeta(),
    payload: {
      timestamp: new Date(),
    },
  } as HeartbeatEvent);
});
