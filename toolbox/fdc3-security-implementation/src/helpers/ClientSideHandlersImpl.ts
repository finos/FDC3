import { Channel, ContextMetadata, DesktopAgent, IntentHandler } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { io, Socket } from 'socket.io-client';
import {
  REMOTE_INTENT_HANDLER,
  RemoteIntentHandlerMessage,
  EXCHANGE_DATA,
  SIGN_REQUEST,
  SignRequestMessage,
  HANDLE_REMOTE_CHANNEL,
  CLIENT_MESSAGE,
  SERVER_MESSAGE,
} from './MessageTypes';
import { FDC3Handlers } from './FDC3Handlers';
import { AppRequestMessage, BroadcastEvent, BroadcastResponse } from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { v4 as uuidv4 } from 'uuid';

/**
 * This class provides a set of helpers for clients to use
 * to move processing of secure FDC3 intents and contexts to the
 * server-side using WebSocket communication.
 */
export class ClientSideHandlersImpl implements FDC3Handlers {
  private readonly socket: Socket;
  private readonly desktopAgent: DesktopAgent;
  private readonly channels: Map<string, Channel> = new Map();

  constructor(socket: Socket, desktopAgent: DesktopAgent) {
    this.socket = socket;
    this.desktopAgent = desktopAgent;

    // listen to messages from the server
    this.socket.on(SERVER_MESSAGE, (data: AppRequestMessage) => {
      console.log('SERVER_MESSAGE', data);
      if (data.type === 'broadcastRequest') {
        const channel = this.channels.get(data.payload.channelId);
        if (channel) {
          channel.broadcast(data.payload.context); // , data.metadata);
        }

        const msg: BroadcastResponse = {
          type: 'broadcastResponse',
          meta: {
            requestUuid: data.meta.requestUuid,
            timestamp: new Date(),
            responseUuid: uuidv4(),
          },
          payload: {
            context: data.payload.context,
          },
        };

        return msg;
      } else {
        console.log('Unknown message type', data);
      }
    });
  }

  async signRequest(ctx: Context, intent: string | null, channelId: string | null): Promise<Context> {
    const msg: SignRequestMessage = {
      ctx,
      intent,
      channelId,
    };

    return await this.socket.emitWithAck(SIGN_REQUEST, msg);
  }

  async createRemoteChannel(purpose: string): Promise<Channel> {
    const channel = await this.desktopAgent.createPrivateChannel();
    this.handleRemoteChannel(purpose, channel);
    this.channels.set(channel.id, channel);
    return channel;
  }

  createMetadata() {
    return {
      requestUuid: uuidv4(),
      timestamp: new Date(),
      eventUuid: uuidv4(),
    };
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    await this.socket.emitWithAck(HANDLE_REMOTE_CHANNEL, {
      purpose,
      channelId: channel.id,
      type: channel.type,
    });

    // forward on broadcast events to the server
    channel.addContextListener(null, async (ctx: Context, _metadata: ContextMetadata | undefined) => {
      const msg: BroadcastEvent = {
        type: 'broadcastEvent',
        meta: this.createMetadata(),
        payload: {
          context: ctx,
          channelId: channel.id,
          // metadata
        },
      };

      await this.socket.emitWithAck(CLIENT_MESSAGE, msg);
    });
  }

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    const msg: RemoteIntentHandlerMessage = {
      intent,
    };

    const id = await this.socket.emitWithAck(REMOTE_INTENT_HANDLER, msg);

    return async (context: Context, metadata?: ContextMetadata | undefined) => {
      const value = await this.socket.emitWithAck(id, {
        context,
        metadata,
      });

      if (value.type === 'private') {
        // in this case, handle a private channel.
        const channel = await this.desktopAgent.createPrivateChannel();
        this.handleRemoteChannel(intent, channel);
        this.channels.set(channel.id, channel);
        return channel;
      } else {
        // it's a context.
        return value;
      }
    };
  }

  async exchangeData(ctx: Context): Promise<Context | void> {
    return await this.socket.emitWithAck(EXCHANGE_DATA, {
      ctx,
    });
  }
}

export async function connectRemoteHandlers(url: string, da: DesktopAgent): Promise<FDC3Handlers> {
  const socket = await io(url, {
    withCredentials: true, // Include cookies and session data
    autoConnect: true,
  });

  return new ClientSideHandlersImpl(socket, da);
}
