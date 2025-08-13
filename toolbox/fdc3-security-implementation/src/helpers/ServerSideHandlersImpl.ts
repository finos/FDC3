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
  REMOTE_CHANNEL,
  RemoteChannelMessage,
  BroadcastMessage,
  BROADCAST_PREFIX,
} from './MessageTypes';
import { v4 as uuidv4 } from 'uuid';
import { Channel, ContextHandler, ContextMetadata, DisplayMetadata, Listener } from '@finos/fdc3';

export type DisconnectCallback = (socket: Socket) => void;

class ServerSideChannel implements Channel {

  private readonly listeners: Map<string, (context: Context, metadata: ContextMetadata | undefined) => void> = new Map();
  private readonly socket: Socket;
  private readonly latestContext = new Map<string | undefined, Context>();

  readonly id: string;
  readonly type: 'user' | 'app' | 'private';
  readonly displayMetadata: DisplayMetadata

  constructor(socket: Socket, channelId: string, purpose: string, type: 'user' | 'app' | 'private') {
    this.socket = socket;
    this.id = channelId;
    this.displayMetadata = {
      name: purpose,
    }
    this.type = type;
  }

  async broadcast(context: Context): Promise<void> {
    this.latestContext.set(context.type, context);
    this.latestContext.set(undefined, context);
    this.socket.emit(BROADCAST_PREFIX + this.id, {
      context,
      metadata: undefined,
      channelId: this.id,
    });
  }

  async getCurrentContext(contextType?: string): Promise<Context | null> {
    return this.latestContext.get(contextType) ?? null;
  }

  async addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener> {
    return {
      unsubscribe: () => {
        this.listeners.delete(contextType);
      }


    }

  }
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
      REMOTE_CHANNEL,
      async function (data: RemoteChannelMessage, callback: (success: any, err?: string) => void) {

        const channel = new ServerSideChannel(socket, data.channelId, data.purpose);
        await handlers.handleRemoteChannel(data.purpose, channel);

        socket.on(BROADCAST_PREFIX + channel.id, (data: BroadcastMessage) => {
          channel.broadcast(data.context); // , data.metadata);
        });
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
