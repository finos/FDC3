import { assert, expect } from 'chai';
import { Channel, Context, DesktopAgent, Listener } from 'fdc3_1_2';
import { ChannelControl, ChannelsAppConfig, ChannelsAppContext } from '../../common/control/channel-control';
import { AppControlContext } from '../../../context-types';
import { closeMockAppWindow, waitForContext } from '../fdc3-1_2-utils';
import constants from '../../../constants';
import { wait } from '../../../utils';

declare let fdc3: DesktopAgent;

export class ChannelControl1_2 implements ChannelControl<Channel, Context, Listener> {
  private readonly testAppChannelName = 'test-channel';

  getNonGlobalUserChannels = async () => {
    const channels = await fdc3.getSystemChannels();
    return channels.filter(channel => channel.id.indexOf('global') === -1);
  };

  leaveChannel = async () => {
    return await fdc3.leaveCurrentChannel();
  };

  getNonGlobalUserChannel = async (): Promise<Channel> => {
    const channels = await this.getNonGlobalUserChannels();
    if (channels.length > 0) {
      return channels[0];
    } else {
      assert.fail('No system channels available for app A');
    }
  };

  joinChannel = async (channel: Channel): Promise<void> => {
    return fdc3.joinChannel(channel.id);
  };

  createRandomTestChannel = async (): Promise<Channel> => {
    const channelName = `${this.testAppChannelName}.${this.getRandomId()}`;
    return await fdc3.getOrCreateChannel(channelName);
  };

  getCurrentChannel = async (): Promise<Channel> => {
    return await fdc3.getCurrentChannel();
  };

  unsubscribeListeners = async (listeners: Listener[]) => {
    listeners.map(listener => {
      listener.unsubscribe();
      listener = undefined;
    });
  };

  initCompleteListener = async (testId: string): Promise<AppControlContext> => {
    const receivedContext = await waitForContext(
      'executionComplete',
      testId,
      await fdc3.getOrCreateChannel('app-control')
    );

    await wait(constants.ShortWait);
    return receivedContext;
  };

  openChannelApp = async (
    testId: string,
    channelId: string | undefined,
    commands: string[],
    historyItems: number = undefined,
    notify: boolean = true,
    contextId?: string
  ): Promise<void> => {
    const channelsAppConfig: ChannelsAppConfig = {
      fdc3ApiVersion: '1.2',
      testId: testId,
      channelId: channelId,
      notifyAppAOnCompletion: notify,
      contextId: contextId,
    };

    if (historyItems) {
      channelsAppConfig.historyItems = historyItems;
    }

    //Open ChannelsApp then execute commands in order
    await fdc3.open('ChannelsApp', buildChannelsAppContext(commands, channelsAppConfig));
  };

  async closeMockApp(testId: string) {
    await closeMockAppWindow(testId);
  }

  setupAndValidateListener = (
    channel: Channel,
    listenContextType: string | null,
    expectedContextType: string | null,
    errorMessage: string,
    onComplete: (ctx: Context) => void
  ): Listener => {
    let listener;
    if (channel) {
      console.log('adding addcontextlistener');
      listener = channel.addContextListener(listenContextType, context => {
        if (expectedContextType != null) {
          expect(context.type).to.be.equals(expectedContextType, errorMessage);
        }
        onComplete(context);
      });
    } else {
      listener = fdc3.addContextListener(listenContextType, context => {
        if (expectedContextType != null) {
          expect(context.type).to.be.equals(expectedContextType, errorMessage);
        }
        onComplete(context);
      });
    }

    validateListenerObject(listener);
    return listener;
  };

  setupContextChecker = async (
    channel: Channel,
    requestedContextType: string,
    expectedContextType: string,
    errorMessage: string,
    onComplete: (ctx: Context) => void
  ): Promise<void> => {
    //Retrieve current context from channel
    const context =
      requestedContextType == undefined
        ? await channel.getCurrentContext()
        : await channel.getCurrentContext(requestedContextType);

    expect(context.type).to.be.equals(expectedContextType, errorMessage);
    onComplete(context);
  };

  getRandomId(): string {
    const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];

    return uint32.toString(16);
  }
}

function validateListenerObject(listenerObject) {
  assert.isTrue(typeof listenerObject === 'object', 'No listener object found');
  expect(typeof listenerObject.unsubscribe).to.be.equals('function', 'Listener does not contain an unsubscribe method');
}

export function buildChannelsAppContext(mockAppCommands: string[], config: ChannelsAppConfig): ChannelsAppContext {
  return {
    type: 'channelsAppContext',
    commands: mockAppCommands,
    config: {
      fdc3ApiVersion: config.fdc3ApiVersion,
      testId: config.testId,
      notifyAppAOnCompletion: config.notifyAppAOnCompletion ?? false,
      historyItems: config.historyItems ?? 1,
      channelId: config.channelId,
      contextId: config.contextId,
    },
  };
}
