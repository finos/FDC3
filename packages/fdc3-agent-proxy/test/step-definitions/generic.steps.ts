import { Given, Then, When } from 'quickpickle';
import { CustomWorld } from '../world/index.js';
import {
  DesktopAgentProxy,
  DefaultAppSupport,
  DefaultChannelSupport,
  DefaultIntentSupport,
  DefaultHeartbeatSupport,
} from '../../src/index.js';
import { SimpleIntentResolver, SimpleChannelSelector, CHANNEL_STATE } from '../support/agentDoubles.js';
import { TestMessaging } from '../support/TestMessaging.js';
import { HeartbeatEvent } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { LogLevel } from '@finos/fdc3-standard';
import { setupSchemaSteps } from '@finos/fdc3-schema/test/setupSchemaSteps.js';
import { registerFdc3SchemaMatchers } from '@finos/fdc3-schema/test/fdc3SchemaMatchers.js';
import { setupGenericSteps, quickpickleWrapStep } from '@robmoffat/standard-cucumber-steps';

const logLevel = LogLevel.WARN;

setupSchemaSteps();
registerFdc3SchemaMatchers();
setupGenericSteps({ Given, When, Then, wrapStep: quickpickleWrapStep });

function createDesktopAgent(world: CustomWorld, field: string, initialChannelId?: string) {
  if (!world.messaging) {
    world.messaging = new TestMessaging(world.props[CHANNEL_STATE], initialChannelId);
  }

  const cs = new DefaultChannelSupport(world.messaging, new SimpleChannelSelector(world), 1500);
  const hs = new DefaultHeartbeatSupport(world.messaging);
  const is = new DefaultIntentSupport(world.messaging, new SimpleIntentResolver(world), 1500, 3000);
  const as = new DefaultAppSupport(world.messaging, 1500, 3000);

  return new DesktopAgentProxy(hs, cs, is, as, [hs, cs], logLevel);
}

Given('A Desktop Agent in {string}', async (world: CustomWorld, field: string) => {
  const da = createDesktopAgent(world, field);
  await da.connect();

  world.props[field] = da;
  world.props['result'] = null;
});

Given(
  'A Desktop Agent in {string} that puts apps on channel {string}',
  async (world: CustomWorld, field: string, channelId: string) => {
    const da = createDesktopAgent(world, field, channelId);
    await da.connect();

    world.props[field] = da;
    world.props['result'] = null;
  }
);

When('messaging receives a heartbeat event', (world: CustomWorld) => {
  world.messaging?.receive({
    type: 'heartbeatEvent',
    meta: world.messaging.createEventMeta(),
    payload: {
      timestamp: new Date(),
    },
  } as HeartbeatEvent);
});
