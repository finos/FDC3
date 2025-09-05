import { Context } from '@finos/fdc3-context';

export const HANDLE_REMOTE_CHANNEL = 'handle-remote-channel';
export type HandleRemoteChannelMessage = {
  purpose: string;
  channelId: string;
  type: 'user' | 'app' | 'private';
};

export const REMOTE_INTENT_HANDLER = 'remote-intent-handler';
export type RemoteIntentHandlerMessage = {
  intent: string;
};

export const EXCHANGE_DATA = 'exchange-data';
export type ExchangeDataMessage = {
  purpose: string;
  ctx: Context;
};

export const CLIENT_MESSAGE = 'client-message';

export const SERVER_MESSAGE = 'server-message';
