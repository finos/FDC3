import { Given, When } from 'quickpickle';
import { SimpleIntentResolver } from '@finos/testing';
import { CustomWorld } from '../world/index.js';
import { CHANNEL_STATE } from '@finos/testing';
import {
  DefaultChannelSupport,
  DefaultHeartbeatSupport,
  DefaultIntentSupport,
  DefaultAppSupport,
  DesktopAgentProxy,
} from '../../src/index.js';
import { TestChannelSelector } from '../support/TestChannelSelector.js';
import { TestMessaging } from '../support/TestMessaging.js';
import { LogLevel } from '@finos/fdc3-standard';

//Update this to enable debug output when debugging test failures
const logLevel = LogLevel.WARN;

Given(
  'A Channel Selector in {string} and a Desktop Agent in {string}',
  async (world: CustomWorld, selectorField: string, daField: string) => {
    if (!world.messaging) {
      world.messaging = new TestMessaging(world.props[CHANNEL_STATE]);
    }

    const ts = new TestChannelSelector();
    world.props[selectorField] = ts;

    const cs = new DefaultChannelSupport(world.messaging, ts, 10000);
    const hs = new DefaultHeartbeatSupport(world.messaging);
    const is = new DefaultIntentSupport(world.messaging, new SimpleIntentResolver(world), 10000, 100000);
    const as = new DefaultAppSupport(world.messaging, 10000, 100000);

    const da = new DesktopAgentProxy(hs, cs, is, as, [hs], logLevel);
    await da.connect();

    world.props[daField] = da;
    world.props['result'] = null;

    //populate the channel selector
    const channel = await cs.getUserChannel();
    const userChannels = await cs.getUserChannels();
    ts.updateChannel(channel?.id ?? null, userChannels);
  }
);

When(
  'The first channel is selected via the channel selector in {string}',
  async (world: CustomWorld, selectorField: string) => {
    const selector = world.props[selectorField] as TestChannelSelector;
    selector.selectFirstChannel();
  }
);

When(
  'The second channel is selected via the channel selector in {string}',
  async (world: CustomWorld, selectorField: string) => {
    const selector = world.props[selectorField] as TestChannelSelector;
    selector.selectSecondChannel();
  }
);

When(
  'The channel is deselected via the channel selector in {string}',
  async (world: CustomWorld, selectorField: string) => {
    const selector = world.props[selectorField] as TestChannelSelector;
    selector.deselectChannel();
  }
);
