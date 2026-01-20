import { Given, When } from '@cucumber/cucumber';
import { SimpleIntentResolver } from '@finos/fdc3-testing';
import { CustomWorld } from '../world/index';
import { CHANNEL_STATE } from '@finos/fdc3-testing';
import {
  DefaultChannelSupport,
  DefaultHeartbeatSupport,
  DefaultIntentSupport,
  DefaultAppSupport,
  DesktopAgentProxy,
} from '../../src';
import { TestChannelSelector } from '../support/TestChannelSelector';
import { TestMessaging } from '../support/TestMessaging';
import { LogLevel } from '@finos/fdc3-standard';

//Update this to enable debug output when debugging test failures
const logLevel = LogLevel.WARN;

Given(
  'A Channel Selector in {string} and a Desktop Agent in {string}',
  async function (this: CustomWorld, selectorField: string, daField: string) {
    if (!this.messaging) {
      this.messaging = new TestMessaging(this.props[CHANNEL_STATE]);
    }

    const ts = new TestChannelSelector();
    this.props[selectorField] = ts;

    const cs = new DefaultChannelSupport(this.messaging, ts, 10000);
    const hs = new DefaultHeartbeatSupport(this.messaging);
    const is = new DefaultIntentSupport(this.messaging, new SimpleIntentResolver(this), 10000, 100000);
    const as = new DefaultAppSupport(this.messaging, 10000, 100000);

    const da = new DesktopAgentProxy(hs, cs, is, as, [hs], logLevel);
    await da.connect();

    this.props[daField] = da;
    this.props['result'] = null;

    //populate the channel selector
    const channel = await cs.getUserChannel();
    const userChannels = await cs.getUserChannels();
    ts.updateChannel(channel?.id ?? null, userChannels);
  }
);

When(
  'The first channel is selected via the channel selector in {string}',
  async function (this: CustomWorld, selectorField: string) {
    const selector = this.props[selectorField] as TestChannelSelector;
    selector.selectFirstChannel();
  }
);

When(
  'The second channel is selected via the channel selector in {string}',
  async function (this: CustomWorld, selectorField: string) {
    const selector = this.props[selectorField] as TestChannelSelector;
    selector.selectSecondChannel();
  }
);

When(
  'The channel is deselected via the channel selector in {string}',
  async function (this: CustomWorld, selectorField: string) {
    const selector = this.props[selectorField] as TestChannelSelector;
    selector.deselectChannel();
  }
);
