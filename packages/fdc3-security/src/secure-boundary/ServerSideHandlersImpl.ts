import { WebSocketServer, WebSocket } from 'ws';
import { Server as HttpServer } from 'http';
import { FDC3Handlers } from './FDC3Handlers.js';
import {
  REMOTE_INTENT_HANDLER,
  RemoteIntentHandlerMessage,
  EXCHANGE_DATA,
  ExchangeDataMessage,
  HANDLE_REMOTE_CHANNEL,
  HandleRemoteChannelMessage,
  WsEnvelope,
  CLIENT_MESSAGE,
} from './MessageTypes.js';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketMessaging } from './WebSocketMessaging.js';
import { DefaultChannel } from '@finos/fdc3-agent-proxy/dist/src/channels/DefaultChannel.js';
import { DefaultPrivateChannel } from '@finos/fdc3-agent-proxy/dist/src/channels/DefaultPrivateChannel.js';

export type DisconnectCallback = (ws: WebSocket) => void;

/**
 * Sends a plain envelope to the client.
 */
function send(ws: WebSocket, envelope: WsEnvelope): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(envelope));
  }
}

/**
 * Sends an acknowledgement back to the client for a given request id.
 */
function ack(ws: WebSocket, id: string, payload: unknown): void {
  send(ws, { event: `ack:${id}`, ack: true, payload });
}

/**
 * Sets up a listener so that we can detect when a front-end wants to create a server-side DesktopAgent.
 * In the callback, you should instantiate any context/intent handlers you need.
 */
export function setupWebsocketServer(
  httpServer: HttpServer,
  disconnectCallback: DisconnectCallback,
  createHandlers: (ws: WebSocket) => FDC3Handlers
) {
  const wss = new WebSocketServer({ server: httpServer });

  wss.on('connection', ws => {
    console.log('WebSocket client connected');

    // WebSocketMessaging expects a browser-style WebSocket interface; the `ws` package's
    // WebSocket is structurally compatible for the subset we use, so cast via `any`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messaging = new WebSocketMessaging(ws as any, {
      appId: 'demo-security-implementation',
    });

    const handlers = createHandlers(ws);

    // Map to store dynamic event handlers (e.g. for intent handler calls)
    const dynamicHandlers = new Map<string, (envelope: WsEnvelope) => Promise<void>>();

    ws.on('message', async (raw: Buffer | string) => {
      let envelope: WsEnvelope;
      try {
        envelope = JSON.parse(raw.toString()) as WsEnvelope;
      } catch {
        console.error('Failed to parse WebSocket message');
        return;
      }

      const { event, id, payload } = envelope;

      // Check if it's a dynamic handler registered for this session
      if (dynamicHandlers.has(event)) {
        await dynamicHandlers.get(event)!(envelope);
        return;
      }

      switch (event) {
        case HANDLE_REMOTE_CHANNEL: {
          const data = payload as HandleRemoteChannelMessage;
          if (data.type === 'private') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const channel = new DefaultPrivateChannel(messaging as any, 1000, data.channelId) as any;
            await handlers.handleRemoteChannel(data.purpose, channel);
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const channel = new DefaultChannel(messaging as any, 1000, data.channelId, data.type) as any;
            await handlers.handleRemoteChannel(data.purpose, channel);
          }
          if (id) ack(ws, id, true);
          break;
        }

        case REMOTE_INTENT_HANDLER: {
          const props = payload as RemoteIntentHandlerMessage;
          const ih = await handlers.remoteIntentHandler(props.intent);
          // Create a unique sub-event name the client will use to invoke the handler
          const handlerId = uuidv4();
          // Register dynamic handler
          dynamicHandlers.set(handlerId, async (env2: WsEnvelope) => {
            if (env2.id) {
              const result = await ih(env2.payload.context, env2.payload.metadata);
              ack(ws, env2.id, result);
            }
          });
          if (id) ack(ws, id, handlerId);
          break;
        }

        case EXCHANGE_DATA: {
          const props = payload as ExchangeDataMessage;
          const obj = await handlers.exchangeData(props.purpose, props.o);
          if (id) ack(ws, id, obj);
          break;
        }

        case CLIENT_MESSAGE: {
          // CLIENT_MESSAGE is handled by WebSocketMessaging directly via its own onmessage handler.
          break;
        }

        default:
          // ack:${id} responses are handled by WebSocketMessaging exchange() listeners
          if (typeof event === 'string' && event.startsWith('ack:')) {
            break;
          }
          // Do not log dynamic handler events here even if somehow they fall through
          if (dynamicHandlers.has(event)) {
            break;
          }
          console.log('Unknown event:', event);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      disconnectCallback(ws);
      dynamicHandlers.clear();
    });
  });
}

/**
 * Emit an event to a connected client (server → client push).
 * Used by business logic callbacks (e.g. sending back EXCHANGE_DATA messages).
 */
export function emitToClient(ws: WebSocket, event: string, payload: unknown): void {
  send(ws, { event, payload });
}
