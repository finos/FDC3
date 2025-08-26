import { Channel, ContextMetadata, DesktopAgent, IntentHandler, Listener, PrivateChannel } from '@finos/fdc3-standard';
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
  ExchangeDataMessage,
} from './MessageTypes';
import { FDC3Handlers } from './FDC3Handlers';
import {
  AddContextListenerRequest,
  AddContextListenerResponse,
  AppRequestMessage,
  BroadcastEvent,
  BroadcastRequest,
  BroadcastResponse,
  ContextListenerUnsubscribeRequest,
  ContextListenerUnsubscribeResponse,
  PrivateChannelDisconnectRequest,
  PrivateChannelDisconnectResponse,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';
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
  private readonly contextListeners: Map<string, Listener> = new Map();
  private readonly callback: (ctx: ExchangeDataMessage) => Promise<ExchangeDataMessage | void>;

  constructor(
    socket: Socket,
    desktopAgent: DesktopAgent,
    callback: (ctx: ExchangeDataMessage) => Promise<ExchangeDataMessage | void>
  ) {
    this.socket = socket;
    this.desktopAgent = desktopAgent;
    this.callback = callback;
    // listen to messages from the server
    this.socket.on(SERVER_MESSAGE, async (data: AppRequestMessage) => {
      const out = await this.handleServerMessage(data);
      if (out) {
        console.log('emitting', out);
        this.socket.emit(CLIENT_MESSAGE, out);
      }
    });

    this.socket.on(EXCHANGE_DATA, async (m: ExchangeDataMessage, listener: (m: ExchangeDataMessage) => void) => {
      const out = await this.callback(m);
      if (out) {
        listener(out);
      }
    });
  }

  private async handleServerMessage(data: AppRequestMessage) {
    console.log('SERVER_MESSAGE', data);
    switch (data.type) {
      case 'broadcastRequest':
        const br: BroadcastRequest = data;
        return this.handleBroadcast(br);
      case 'addContextListenerRequest':
        const acl: AddContextListenerRequest = data;
        return this.handleAddContextListener(acl);
      case 'contextListenerUnsubscribeRequest':
        const rcl: ContextListenerUnsubscribeRequest = data;
        return this.handleContextListenerUnsubscribe(rcl);
      case 'privateChannelDisconnectRequest':
        const pcdr: PrivateChannelDisconnectRequest = data;
        return this.handlePrivateChannelDisconnect(pcdr);
      default:
        console.log('Unknown message type', data);
        return null;
    }
  }

  async signRequest(ctx: Context, intent: string | null, channelId: string | null): Promise<Context> {
    const msg: SignRequestMessage = {
      ctx,
      intent,
      channelId,
    };

    return await this.socket.emitWithAck(SIGN_REQUEST, msg);
  }

  createMetadata() {
    return {
      requestUuid: uuidv4(),
      timestamp: new Date(),
      eventUuid: uuidv4(),
    };
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    this.channels.set(channel.id, channel);
    await this.socket.emitWithAck(HANDLE_REMOTE_CHANNEL, {
      purpose,
      channelId: channel.id,
      type: channel.type,
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
        await this.handleRemoteChannel(intent, channel);
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

  private async handleBroadcast(br: BroadcastRequest): Promise<BroadcastResponse> {
    const channel = this.channels.get(br.payload.channelId)!!;
    await channel.broadcast(br.payload.context); // , data.metadata);

    return {
      type: 'broadcastResponse',
      meta: {
        requestUuid: br.meta.requestUuid,
        timestamp: new Date(),
        responseUuid: uuidv4(),
      },
      payload: {
        channelId: channel.id,
      },
    };
  }

  private async handleAddContextListener(acl: AddContextListenerRequest): Promise<AddContextListenerResponse> {
    const channel = this.channels.get(acl.payload.channelId!); // always has a channelId
    const type = acl.payload.contextType;
    const id = uuidv4();
    if (channel) {
      const cl = await channel.addContextListener(
        type,
        async (ctx: Context, _metadata: ContextMetadata | undefined) => {
          const msg: BroadcastEvent = {
            type: 'broadcastEvent',
            meta: this.createMetadata(),
            payload: {
              context: ctx,
              channelId: channel.id,
              // metadata
            },
          };

          console.log('Received context, sending to server', ctx);

          await this.socket.emitWithAck(CLIENT_MESSAGE, msg);
        }
      );

      console.log('context listener added', id);

      this.contextListeners.set(id, cl);
      return {
        type: 'addContextListenerResponse',
        meta: {
          requestUuid: acl.meta.requestUuid,
          timestamp: new Date(),
          responseUuid: id,
        },
        payload: {
          listenerUUID: id,
        },
      };
    } else {
      return {
        type: 'addContextListenerResponse',
        meta: {
          requestUuid: acl.meta.requestUuid,
          timestamp: new Date(),
          responseUuid: id,
        },
        payload: {
          error: 'NoChannelFound',
        },
      };
    }
  }

  private async handleContextListenerUnsubscribe(
    rcl: ContextListenerUnsubscribeRequest
  ): Promise<ContextListenerUnsubscribeResponse> {
    const listener = this.contextListeners.get(rcl.payload.listenerUUID);
    if (listener) {
      await listener.unsubscribe();
    }
    this.contextListeners.delete(rcl.payload.listenerUUID);
    return {
      type: 'contextListenerUnsubscribeResponse',
      meta: {
        requestUuid: rcl.meta.requestUuid,
        timestamp: new Date(),
        responseUuid: uuidv4(),
      },
      payload: {
        listenerUUID: rcl.payload.listenerUUID,
      },
    };
  }

  private async handlePrivateChannelDisconnect(
    pcdr: PrivateChannelDisconnectRequest
  ): Promise<PrivateChannelDisconnectResponse> {
    const channel = this.channels.get(pcdr.payload.channelId) as PrivateChannel;
    if (channel) {
      await channel.disconnect();
    }
    return {
      type: 'privateChannelDisconnectResponse',
      meta: {
        requestUuid: pcdr.meta.requestUuid,
        timestamp: new Date(),
        responseUuid: uuidv4(),
      },
      payload: {},
    };
  }
}

export async function connectRemoteHandlers(
  url: string,
  da: DesktopAgent,
  callback: (ctx: ExchangeDataMessage) => Promise<ExchangeDataMessage | void>
): Promise<FDC3Handlers> {
  const socket = await io(url, {
    withCredentials: true, // Include cookies and session data
    autoConnect: true,
  });

  return new ClientSideHandlersImpl(socket, da, callback);
}
