import { Server, Socket } from 'socket.io';
import { Context } from '@finos/fdc3-context';
import { Server as HttpServer } from 'http';
import { FDC3Handlers } from './FDC3Handlers';
import {
  REMOTE_INTENT_HANDLER,
  RemoteIntentHandlerMessage,
  EXCHANGE_DATA,
  ExchangeDataMessage,
  SIGN_REQUEST,
  SignRequestMessage,
  HANDLE_REMOTE_CHANNEL,
  HandleRemoteChannelMessage,
} from './MessageTypes';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketMessaging } from './WebSocketMessaging';
import { DefaultPrivateChannel } from '@finos/fdc3-agent-proxy/src/channels/DefaultPrivateChannel';
import { DefaultChannel } from '@finos/fdc3-agent-proxy';

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
    const messaging = new WebSocketMessaging(socket, {
      appId: 'demo-security-implementation',
    });

    socket.on(SIGN_REQUEST, async (data: SignRequestMessage, callback: (ctx: Context) => void) => {
      const ctx = await handlers.signRequest(data.ctx, data.intent, data.channelId);
      callback(ctx);
    });

    socket.on(
      HANDLE_REMOTE_CHANNEL,
      async function (data: HandleRemoteChannelMessage, callback: (success: any, err?: string) => void) {
        if (data.type === 'private') {
          const channel = new DefaultPrivateChannel(messaging, 1000, data.channelId);
          await handlers.handleRemoteChannel(data.purpose, channel);
        } else {
          const channel = new DefaultChannel(messaging, 1000, data.channelId, data.type);
          await handlers.handleRemoteChannel(data.purpose, channel);
        }
        callback(true);
      }
    );

    socket.on(
      REMOTE_INTENT_HANDLER,
      async function (props: RemoteIntentHandlerMessage, callback1: (success: any, err?: string) => void) {
        const ih = await handlers.remoteIntentHandler(props.intent);
        const id = uuidv4();
        socket.on(id, async (data: any, callback2: (success: any, err?: string) => void) => {
          const result = await ih(data.context, data.metadata);
          callback2(result);
        });

        // todo - add disconnect listener
        callback1(id);
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
