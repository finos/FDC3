import { Context } from '@finos/fdc3-context';
import {
  AppRequestMessage,
  AgentEventMessage,
  AgentResponseMessage,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';

/**
 * These types describe the protocol for cross-secure-boundary messaging,
 * used by the ClientSideHandlersImpl and ServerSideHandlersImpl classes.
 *
 * As far as possible, we use the types defined in @finos/fdc3-schema/generated/api/BrowserTypes (DACP protocol).
 */
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

/**
 * Sent as the websocket message type, to indicate client is sending a message
 * to the server.
 */
export const CLIENT_MESSAGE = 'client-message';

/**
 * Sent as the websocket message type, to indicate server is sending a message
 * to the client.
 */
export const SERVER_MESSAGE = 'server-message';

/**
 * The envelope format used for all plain-WebSocket messages.
 * We use a discriminated union to ensure that the `payload` matches the `event` type.
 */
export type WsEnvelope =
  | {
      event: typeof HANDLE_REMOTE_CHANNEL;
      id?: string;
      ack?: boolean;
      payload: HandleRemoteChannelMessage;
    }
  | {
      event: typeof REMOTE_INTENT_HANDLER;
      id?: string;
      ack?: boolean;
      payload: RemoteIntentHandlerMessage;
    }
  | {
      event: typeof EXCHANGE_DATA;
      id?: string;
      ack?: boolean;
      payload: ExchangeDataMessage;
    }
  | {
      event: typeof CLIENT_MESSAGE;
      id?: string;
      ack?: boolean;
      payload: AppRequestMessage | AgentEventMessage | AgentResponseMessage;
    }
  | {
      event: typeof SERVER_MESSAGE;
      id?: string;
      ack?: boolean;
      payload: AppRequestMessage | AgentEventMessage | AgentResponseMessage;
    }
  | {
      event: string; // Dynamic IDs, ACKs, or custom handlers
      id?: string;
      ack?: boolean;
      payload: any;
    };
