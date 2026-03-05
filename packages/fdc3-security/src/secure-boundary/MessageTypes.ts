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
  intent?: string;
  channelId?: string;
};

export const CLIENT_MESSAGE = 'client-message';

export const SERVER_MESSAGE = 'server-message';

/**
 * The envelope format used for all plain-WebSocket messages.
 *
 * - `event`   – named event (replaces Socket.IO event names)
 * - `id`      – optional correlation ID for request/response pairs
 * - `ack`     – true when this message is an acknowledgement of a previous request
 * - `payload` – the event data
 */
export type WsEnvelope = {
  event: string;
  id?: string;
  ack?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
};
