import { Channel, DesktopAgent, IntentHandler, Listener, PrivateChannel, ContextMetadata } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import {
  REMOTE_INTENT_HANDLER,
  EXCHANGE_DATA,
  HANDLE_REMOTE_CHANNEL,
  CLIENT_MESSAGE,
  SERVER_MESSAGE,
  ExchangeDataMessage,
} from './MessageTypes.js';
import { FDC3Handlers } from './FDC3Handlers.js';
import { BrowserTypes } from '@finos/fdc3-schema';
import { Messaging } from './Messaging.js';
import { WebSocketMessaging } from './WebSocketMessaging.js';

type AppRequestMessage = BrowserTypes.AppRequestMessage;
type AddContextListenerRequest = BrowserTypes.AddContextListenerRequest;
type AddContextListenerResponse = BrowserTypes.AddContextListenerResponse;
type BroadcastEvent = BrowserTypes.BroadcastEvent;
type BroadcastRequest = BrowserTypes.BroadcastRequest;
type BroadcastResponse = BrowserTypes.BroadcastResponse;
type ContextListenerUnsubscribeRequest = BrowserTypes.ContextListenerUnsubscribeRequest;
type ContextListenerUnsubscribeResponse = BrowserTypes.ContextListenerUnsubscribeResponse;
type PrivateChannelDisconnectRequest = BrowserTypes.PrivateChannelDisconnectRequest;
type PrivateChannelDisconnectResponse = BrowserTypes.PrivateChannelDisconnectResponse;

/**
 * Client-side implementation of FDC3 secure boundary handlers.
 */
export class ClientSideHandlersImpl implements FDC3Handlers {
  private readonly messaging: Messaging;
  private readonly desktopAgent: DesktopAgent;
  private readonly channels: Map<string, Channel> = new Map();
  private readonly contextListeners: Map<string, Listener> = new Map();
  private readonly callback: (ctx: ExchangeDataMessage) => Promise<ExchangeDataMessage | void>;

  constructor(
    messaging: Messaging,
    desktopAgent: DesktopAgent,
    callback: (ctx: ExchangeDataMessage) => Promise<ExchangeDataMessage | void>
  ) {
    this.messaging = messaging;
    this.desktopAgent = desktopAgent;
    this.callback = callback;

    // Register listener for FDC3 Proxy messages (SERVER_MESSAGE)
    this.messaging.register({
      id: 'fdc3-proxy-handler',
      filter: (_, event) => event === SERVER_MESSAGE,
      action: async (payload: AppRequestMessage, _event: string, id?: string) => {
        const out = await this.handleServerMessage(payload);
        if (out) {
          if (id) {
            this.messaging.postEvent(`ack:${id}`, out);
          } else {
            this.messaging.post(out);
          }
        }
      },
    });

    // Register listener for exchange-data push messages
    this.messaging.register({
      id: 'exchange-data-handler',
      filter: (_, event) => event === EXCHANGE_DATA,
      action: async (payload: ExchangeDataMessage) => {
        const out = await this.callback(payload);
        if (out) this.messaging.postEvent(EXCHANGE_DATA, out);
      },
    });
  }

  private async handleServerMessage(data: AppRequestMessage) {
    switch (data.type) {
      case 'broadcastRequest':
        return this.handleBroadcast(data as BroadcastRequest);
      case 'addContextListenerRequest':
        return this.handleAddContextListener(data as AddContextListenerRequest);
      case 'contextListenerUnsubscribeRequest':
        return this.handleContextListenerUnsubscribe(data as ContextListenerUnsubscribeRequest);
      case 'privateChannelDisconnectRequest':
        return this.handlePrivateChannelDisconnect(data as PrivateChannelDisconnectRequest);
      default:
        return null;
    }
  }

  /**
   * Closes the WebSocket connection. Call when done with the remote handlers.
   */
  async disconnect(): Promise<void> {
    await this.messaging.disconnect();
  }

  // Security layer messages use exchange with named events
  private async callRemote(eventName: string, payload: unknown): Promise<any> {
    return this.messaging.exchange(payload, `ack:${eventName}`, 5000, eventName);
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    this.channels.set(channel.id, channel);
    await this.callRemote(HANDLE_REMOTE_CHANNEL, {
      purpose,
      channelId: channel.id,
      type: channel.type,
    });
  }

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    const handlerId = await this.callRemote(REMOTE_INTENT_HANDLER, { intent });
    return async (context: Context, metadata?: any) => {
      const value = await this.callRemote(handlerId, { context, metadata });
      if (value?.type === 'private') {
        const channel = await this.desktopAgent.createPrivateChannel();
        await this.handleRemoteChannel(intent, channel);
        return channel;
      }
      return value;
    };
  }

  async exchangeData(purpose: string, o: object): Promise<object | void> {
    return await this.callRemote(EXCHANGE_DATA, { purpose, o });
  }

  private async handleBroadcast(br: BroadcastRequest): Promise<BroadcastResponse> {
    const channel = this.channels.get(br.payload.channelId)!!;
    await channel.broadcast(br.payload.context, br.payload.metadata as any);
    return {
      type: 'broadcastResponse',
      meta: {
        requestUuid: br.meta.requestUuid,
        timestamp: new Date(),
        responseUuid: this.messaging.createUUID(),
      },
      payload: { channelId: channel.id },
    };
  }

  private async handleAddContextListener(acl: AddContextListenerRequest): Promise<AddContextListenerResponse> {
    const channel = this.channels.get(acl.payload.channelId!);
    const id = this.messaging.createUUID();
    if (channel) {
      const cl = await channel.addContextListener(
        acl.payload.contextType,
        async (context: Context, metadata?: ContextMetadata) => {
          const msg: BroadcastEvent = {
            type: 'broadcastEvent',
            meta: {
              requestUuid: this.messaging.createUUID(),
              timestamp: new Date(),
              eventUuid: this.messaging.createUUID(),
            } as any,
            payload: { context, channelId: channel.id, metadata } as any,
          };
          this.messaging.post(msg);
        }
      );
      this.contextListeners.set(id, cl);
      return {
        type: 'addContextListenerResponse',
        meta: { requestUuid: acl.meta.requestUuid, timestamp: new Date(), responseUuid: id },
        payload: { listenerUUID: id },
      };
    }
    return {
      type: 'addContextListenerResponse',
      meta: { requestUuid: acl.meta.requestUuid, timestamp: new Date(), responseUuid: id },
      payload: { error: 'NoChannelFound' },
    };
  }

  private async handleContextListenerUnsubscribe(
    rcl: ContextListenerUnsubscribeRequest
  ): Promise<ContextListenerUnsubscribeResponse> {
    const listener = this.contextListeners.get(rcl.payload.listenerUUID);
    if (listener) await listener.unsubscribe();
    this.contextListeners.delete(rcl.payload.listenerUUID);
    return {
      type: 'contextListenerUnsubscribeResponse',
      meta: { requestUuid: rcl.meta.requestUuid, timestamp: new Date(), responseUuid: this.messaging.createUUID() },
      payload: { listenerUUID: rcl.payload.listenerUUID },
    };
  }

  private async handlePrivateChannelDisconnect(
    pcdr: PrivateChannelDisconnectRequest
  ): Promise<PrivateChannelDisconnectResponse> {
    const channel = this.channels.get(pcdr.payload.channelId) as PrivateChannel;
    if (channel) await channel.disconnect();
    return {
      type: 'privateChannelDisconnectResponse',
      meta: { requestUuid: pcdr.meta.requestUuid, timestamp: new Date(), responseUuid: this.messaging.createUUID() },
      payload: {},
    };
  }
}

export async function connectRemoteHandlers(
  url: string,
  da: DesktopAgent,
  callback: (ctx: ExchangeDataMessage) => Promise<ExchangeDataMessage | void>
): Promise<FDC3Handlers & { disconnect(): Promise<void> }> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.addEventListener('open', () => {
      const messaging = new WebSocketMessaging(
        ws,
        { appId: 'client-security' },
        {
          outgoingEvent: CLIENT_MESSAGE,
          incomingEvent: SERVER_MESSAGE,
        }
      );
      resolve(new ClientSideHandlersImpl(messaging, da, callback));
    });
    ws.addEventListener('error', err => reject(err));
  });
}
