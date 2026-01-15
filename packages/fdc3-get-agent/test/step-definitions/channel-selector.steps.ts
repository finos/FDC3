import { Given } from 'quickpickle';
import { handleResolve } from '@finos/testing';
import { DefaultDesktopAgentChannelSelector } from '../../src/ui/DefaultDesktopAgentChannelSelector.js';
import { CHANNEL_SELECTOR_URL } from '../support/MockFDC3Server.js';
import { USER_CHANNELS } from '../support/responses/UserChannels.js';
import { CustomWorld } from '../world/index.js';
import { Fdc3UserInterfaceChannelSelected } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { Logger } from '../../src/util/Logger.js';
import { loggingSettings } from './desktop-agent.steps.js';

Given(
  'A Channel Selector in {string} with callback piping to {string}',
  async (world: CustomWorld, field: string, cb: string) => {
    Logger.setLogLevel(loggingSettings.connection);

    const cs = new DefaultDesktopAgentChannelSelector(CHANNEL_SELECTOR_URL);

    cs.setChannelChangeCallback((channelId: string | null) => {
      world.props[cb] = channelId;
    });

    world.props[field] = cs;
    await cs.connect();
  }
);

Given('User Channels one, two and three in {string}', (world: CustomWorld, field: string) => {
  world.props[field] = USER_CHANNELS;
});

Given(
  'The channel selector sends a channel change message for channel {string}',
  async (world: CustomWorld, channel: string) => {
    const port = handleResolve('{childDoc.iframes[0].messageChannels[0].port2}', world);
    const msg: Fdc3UserInterfaceChannelSelected = {
      type: 'Fdc3UserInterfaceChannelSelected',
      payload: {
        selected: channel,
      },
    };
    port.postMessage(msg);
  }
);
