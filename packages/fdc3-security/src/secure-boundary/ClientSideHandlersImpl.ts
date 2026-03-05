import { Channel, DesktopAgent, IntentHandler, Listener, PrivateChannel } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import {
  REMOTE_INTENT_HANDLER,
  RemoteIntentHandlerMessage,
  EXCHANGE_DATA,
  HANDLE_REMOTE_CHANNEL,
  CLIENT_MESSAGE,
  SERVER_MESSAGE,
  ExchangeDataMessage,
  WsEnvelope,
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
 * server-side using plain WebSocket communication.
 */
export class ClientSideHandlersImpl implements FDC3Handlers {
  private readonly ws: WebSocket;
  private readonly desktopAgent: DesktopAgent;
  private readonly channels: Map<string, Channel> = new Map();
  private readonly contextListeners: Map<string, Listener> = new Map();
  private readonly callback: (ctx: ExchangeDataMessage) => Promise<ExchangeDataMessage | void>;

  /** Pending request/response pairs keyed by correlation id. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly pending: Map<string, (value: any) => void> = new Map();

  constructor(
    ws: WebSocket,
    desktopAgent: DesktopAgent,
    callback: (ctx: ExchangeDataMessage) => Promise<ExchangeDataMessage | void>
  ) {
    this.ws = ws;
    this.desktopAgent = desktopAgent;
    this.callback = callback;

    this.ws.onmessage = async (event: MessageEvent) => {
      let envelope: WsEnvelope;
      try {
        envelope = JSON.parse(event.data) as WsEnvelope;
      } catch {
        console.error('Failed to parse WebSocket message');
        return;
      }

      const { event: evtName, id, ack, payload } = envelope;

      // --- Acknowledgements for our own emitWithAck requests ---
      if (ack && id && evtName.startsWith('ack:')) {
        const resolve = this.pending.get(evtName.slice(4));
        if (resolve) {
          this.pending.delete(evtName.slice(4));
          resolve(payload);
        }
        return;
      }

      // --- Server-push: server-side message (e.g. broadcastRequest) ---
      if (evtName === SERVER_MESSAGE) {
        const out = await this.handleServerMessage(payload as AppRequestMessage);
        if (out) {
          console.log('emitting client message', out);
          this.send({ event: CLIENT_MESSAGE, payload: out });
        }
        return;
      }

      // --- Server-push: exchange-data callback (e.g. price streams) ---
      if (evtName === EXCHANGE_DATA) {
        const out = await this.callback(payload as ExchangeDataMessage);
        if (out) {
          // Send the reply back — server listens for this with its own correlation scheme
          this.send({ event: EXCHANGE_DATA, payload: out });
        }
        return;
      }
    };
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  private send(envelope: WsEnvelope): void {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(envelope));
    }
  }

  /**
   * Send an event to the server and wait for the acknowledgement.
   * Replicates socket.io's `emitWithAck`.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private emitWithAck(eventName: string, payload: unknown): Promise<any> {
    return new Promise(resolve => {
      const id = uuidv4();
      this.pending.set(id, resolve);
      this.send({ event: eventName, id, payload });
    });
  }

  private async handleServerMessage(data: AppRequestMessage) {
    console.log('SERVER_MESSAGE', data);
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
        console.log('Unknown message type', data);
        return null;
    }
  }

  createMetadata() {
    return {
      requestUuid: uuidv4(),
      timestamp: new Date(),
      eventUuid: uuidv4(),
    };
  }

  // ---------------------------------------------------------------------------
  // FDC3Handlers interface
  // ---------------------------------------------------------------------------

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    this.channels.set(channel.id, channel);
    await this.emitWithAck(HANDLE_REMOTE_CHANNEL, {
      purpose,
      channelId: channel.id,
      type: channel.type,
    });
  }

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    const msg: RemoteIntentHandlerMessage = { intent };
    // Ask the server to register a handler; it returns a unique sub-event name
    const handlerId = await this.emitWithAck(REMOTE_INTENT_HANDLER, msg);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (context: Context, metadata?: any) => {
      const value = await this.emitWithAck(handlerId, { context, metadata });

      if (value?.type === 'private') {
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

  async exchangeData(purpose: string, ctx: Context, intent?: string, channelId?: string): Promise<Context | void> {
    return await this.emitWithAck(EXCHANGE_DATA, { purpose, ctx, intent, channelId });
  }

  // ---------------------------------------------------------------------------
  // Private channel / context listener helpers
  // ---------------------------------------------------------------------------

  private async handleBroadcast(br: BroadcastRequest): Promise<BroadcastResponse> {
    const channel = this.channels.get(br.payload.channelId)!!;
    await channel.broadcast(br.payload.context);

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
    console.log('handleAddContextListener', acl);
    const channel = this.channels.get(acl.payload.channelId!); // always has a channelId
    const type = acl.payload.contextType;
    const id = uuidv4();
    if (channel) {
      const cl = await channel.addContextListener(
        type,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (ctx: Context, _metadata: any) => {
          const msg: BroadcastEvent = {
            type: 'broadcastEvent',
            meta: this.createMetadata(),
            payload: {
              context: ctx,
              channelId: channel.id,
            },
          };

          console.log('Received context, sending to server', ctx, id);
          this.send({ event: CLIENT_MESSAGE, payload: msg });
        }
      );

      console.log('context listener added', id, this.contextListeners);
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
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.addEventListener('open', () => {
      resolve(new ClientSideHandlersImpl(ws, da, callback));
    });
    ws.addEventListener('error', err => {
      reject(err);
    });
  });
}
