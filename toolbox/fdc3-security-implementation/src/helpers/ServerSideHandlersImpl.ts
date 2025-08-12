import { Server, Socket } from 'socket.io';
import { Context } from '@finos/fdc3-context';
import { Server as HttpServer } from 'http';
import { ContextOrErrorMetadata, FDC3Handlers } from './FDC3Handlers';
import {
  REMOTE_CONTEXT_HANDLER,
  REMOTE_INTENT_HANDLER,
  RemoteContextHandlerMessage,
  RemoteIntentHandlerMessage,
  EXCHANGE_DATA,
  ExchangeDataMessage,
  SIGN_REQUEST,
  SignRequestMessage,
} from './MessageTypes';

export type DisconnectCallback = (socket: Socket) => void;

/**
 * Sets up a listener so that we can detect when a front-end wants to create a server-side DesktopAgent.
 * In the callback, you should instantiate any context/intent handlers you need.
 */
export function setupWebsocketServer(
  httpServer: HttpServer,
  disconnectCallback: DisconnectCallback,
  handlers: FDC3Handlers
) {
  const io = new Server(httpServer);

  io.on('connection', socket => {
    socket.on(SIGN_REQUEST, async (data: SignRequestMessage, callback: (ctx: Context) => void) => {
      const ctx = await handlers.signRequest(data.ctx, data.intent, data.channelId);
      callback(ctx);
    });

    socket.on(
      REMOTE_CONTEXT_HANDLER,
      async function (data: RemoteContextHandlerMessage, callback: (success: any, err?: string) => void) {
        handlers.remoteContextHandler(data.purpose, data.channelId, (c: Context | null, m: ContextOrErrorMetadata) => {
          if (m && 'error' in m) {
            callback(null, m.error);
          } else {
            callback({ context: c, metadata: m });
          }
        });
      }
    );

    socket.on(
      REMOTE_INTENT_HANDLER,
      async function (props: RemoteIntentHandlerMessage, callback: (success: any, err?: string) => void) {
        const result = await handlers.remoteIntentHandler(props.intent);
        callback(result);
      }
    );

    socket.on(
      EXCHANGE_DATA,
      async function (props: ExchangeDataMessage, callback: (success: any, err?: string) => void) {
        const obj = await handlers.exchangeData(props.ctx);
        callback(obj);
      }
    );

    socket.on('disconnect', () => {
      console.log('WebSocket client disconnected');
      disconnectCallback(socket);
    });
  });
}
