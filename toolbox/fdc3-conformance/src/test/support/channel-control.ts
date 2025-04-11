import { Context, Channel, Listener } from '@finos/fdc3';

/**
 * This interface wraps channel functionality in FDC3 2.0
 */
export interface ChannelControl {
  // channels
  getNonGlobalUserChannels(): Promise<Channel[]>;
  leaveChannel(): Promise<void>;
  getNonGlobalUserChannel(): Promise<Channel>;
  joinChannel(channel: Channel): Promise<void>;
  createRandomTestChannel(): Promise<Channel>;
  getCurrentChannel(): Promise<Channel | null>;

  // test control
  unsubscribeListeners(listeners: Listener[]): void;
  openChannelApp(
    testId: string,
    channelId: string,
    commands: string[],
    historyItems?: number,
    notify?: boolean,
    contextId?: string
  ): Promise<void>;
  closeMockApp(testId: string): Promise<void>;

  // listening
  initCompleteListener(testId: string): Promise<Context>;

  setupAndValidateListener(
    channel: Channel | null,
    listenContextType: string | null,
    expectedContextType: string | null,
    errorMessage: string,
    onComplete: (ctx: Context) => void
  ): Promise<Listener>;

  setupContextChecker(
    channel: Channel,
    requestedContextType: string | null,
    expectedContextType: string,
    errorMessage: string,
    onComplete: (ctx: Context) => void
  ): Promise<void>;

  // helpers
  getRandomId(): string;
}

export type ChannelsAppContext = Context & {
  commands: string[];
  config: {
    testId: string;
    notifyAppAOnCompletion: boolean;
    historyItems: number;
    fdc3ApiVersion: string;
    channelId: string;
    contextId?: string;
  };
};

export type ChannelsAppConfig = {
  fdc3ApiVersion: string;
  testId: string;
  notifyAppAOnCompletion?: boolean;
  historyItems?: number;
  channelId: string;
  contextId?: string;
};

export const commands = {
  joinRetrievedUserChannel: 'joinRetrievedUserChannel',
  retrieveTestAppChannel: 'retrieveTestAppChannel',
  broadcastInstrumentContext: 'broadcastInstrumentContext',
  broadcastContactContext: 'broadcastContactContext',
};

export const APP_CHANNEL_AND_BROADCAST = [commands.retrieveTestAppChannel, commands.broadcastInstrumentContext];

export const APP_CHANNEL_AND_BROADCAST_TWICE = [
  commands.retrieveTestAppChannel,
  commands.broadcastInstrumentContext,
  commands.broadcastContactContext,
];

export const JOIN_AND_BROADCAST = [commands.joinRetrievedUserChannel, commands.broadcastInstrumentContext];

export const JOIN_AND_BROADCAST_TWICE = [
  commands.joinRetrievedUserChannel,
  commands.broadcastInstrumentContext,
  commands.broadcastContactContext,
];
