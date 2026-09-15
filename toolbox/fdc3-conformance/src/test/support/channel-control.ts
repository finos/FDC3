import { Context, ContextMetadata, Channel, Listener, FDC3ContextClearedEvent } from '@finos/fdc3';

/**
 * This interface wraps channel functionality
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
    onComplete: (ctx: Context, metadata?: ContextMetadata) => void
  ): Promise<Listener>;

  setupContextChecker(
    channel: Channel,
    requestedContextType: string | null,
    expectedContextType: string,
    errorMessage: string,
    onComplete: (ctx: Context) => void
  ): Promise<void>;

  setupContextClearedEventListener(
    channel: Channel | null,
    errorMessage: string,
    onComplete: (event: FDC3ContextClearedEvent) => void
  ): Promise<Listener>;

  // helpers
  getRandomId(): string;
}

export type ChannelsAppContext = Context & {
  commands: string[];
  config: {
    testId: string;
    notifyAppAOnCompletion: boolean;
    historyItems: number;
    channelId: string;
    contextId?: string;
  };
};

export type ChannelsAppConfig = {
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
  broadcastInstrumentWithTraceId: 'broadcastInstrumentWithTraceId',
  broadcastInstrumentWithSignatureCustom: 'broadcastInstrumentWithSignatureCustom',
  clearContext: 'clearContext',
  clearContextForType: 'clearContextForType',
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

export const JOIN_AND_BROADCAST_WITH_TRACE_ID = [
  commands.joinRetrievedUserChannel,
  commands.broadcastInstrumentWithTraceId,
];

export const JOIN_AND_BROADCAST_WITH_SIGNATURE_CUSTOM = [
  commands.joinRetrievedUserChannel,
  commands.broadcastInstrumentWithSignatureCustom,
];

export const APP_CHANNEL_AND_BROADCAST_WITH_TRACE_ID = [
  commands.retrieveTestAppChannel,
  commands.broadcastInstrumentWithTraceId,
];

export const APP_CHANNEL_AND_BROADCAST_WITH_SIGNATURE_CUSTOM = [
  commands.retrieveTestAppChannel,
  commands.broadcastInstrumentWithSignatureCustom,
];

export const APP_CHANNEL_AND_BROADCAST_TWICE_THEN_CLEAR = [
  commands.retrieveTestAppChannel,
  commands.broadcastInstrumentContext,
  commands.broadcastContactContext,
  commands.clearContext,
];

export const APP_CHANNEL_AND_BROADCAST_TWICE_THEN_CLEAR_TYPE = [
  commands.retrieveTestAppChannel,
  commands.broadcastInstrumentContext,
  commands.broadcastContactContext,
  commands.clearContextForType,
];

export const JOIN_AND_BROADCAST_TWICE_THEN_CLEAR = [
  commands.joinRetrievedUserChannel,
  commands.broadcastInstrumentContext,
  commands.broadcastContactContext,
  commands.clearContext,
];

export const JOIN_AND_BROADCAST_TWICE_THEN_CLEAR_TYPE = [
  commands.joinRetrievedUserChannel,
  commands.broadcastInstrumentContext,
  commands.broadcastContactContext,
  commands.clearContextForType,
];
