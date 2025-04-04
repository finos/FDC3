/**
 * This interface contains everything you need to do to control channels/context listeners in either 1.2 or 2.0 FDC3
 */
export interface ChannelControl<X, Y, Z> {
  // channels
  getNonGlobalUserChannels(): Promise<X[]>;
  leaveChannel(): Promise<void>;
  getNonGlobalUserChannel(): Promise<X>;
  joinChannel(channel: X): Promise<void>;
  createRandomTestChannel(): Promise<X>;
  getCurrentChannel(): Promise<X>;

  // test control
  unsubscribeListeners(listeners: Z[]): void;
  openChannelApp(
    testId: string,
    channelId: string | undefined,
    commands: string[],
    historyItems?: number,
    notify?: boolean,
    contextId?: string
  ): Promise<void>;
  closeMockApp(testId: string): Promise<void>;

  // listening
  initCompleteListener(testId: string): Promise<Y>;
  setupAndValidateListener(
    channel: X | null,
    listenContextType: string | null,
    expectedContextType: string | null,
    errorMessage: string,
    onComplete: (ctx: Y) => void
  ): Z | Promise<Z>;
  setupContextChecker(
    channel: X,
    requestedContextType: string,
    expectedContextType: string,
    errorMessage: string,
    onComplete: (ctx: Y) => void
  ): Promise<void>;

  // helpers
  getRandomId(): string;
}

/** same in 1.2 and 2.0 */
export interface CommonContext {
  id?: {
    [key: string]: string;
  };
  name?: string;
  type: string;
}

export type ChannelsAppContext = CommonContext & {
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
