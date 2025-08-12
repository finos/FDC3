import { ContextHandler, ContextMetadata, IntentHandler, IntentResult } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { io, Socket } from 'socket.io-client';
import {
  REMOTE_CONTEXT_HANDLER,
  REMOTE_INTENT_HANDLER,
  RemoteContextHandlerMessage,
  RemoteIntentHandlerMessage,
  EXCHANGE_DATA,
  SIGN_REQUEST,
  SignRequestMessage,
} from './MessageTypes';
import { FDC3Handlers } from './FDC3Handlers';

/**
 * This class provides a set of helpers for clients to use
 * to move processing of secure FDC3 intents and contexts to the
 * server-side using WebSocket communication.
 */
export class ClientSideHandlersImpl implements FDC3Handlers {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  async signRequest(ctx: Context, intent: string | null, channelId: string | null): Promise<Context> {
    const msg: SignRequestMessage = {
      ctx,
      intent,
      channelId,
    };

    return await this.socket.emitWithAck(SIGN_REQUEST, msg);
  }

  async remoteContextHandler(
    purpose: string,
    channelId: string | null,
    callback: (ctx: Context, metadata: ContextMetadata) => void
  ): Promise<ContextHandler> {
    return async (context: Context, metadata: ContextMetadata | undefined) => {
      const msg: RemoteContextHandlerMessage = {
        purpose,
        channelId,
        context,
        metadata,
      };

      const { success, error } = await this.socket.emitWithAck(REMOTE_CONTEXT_HANDLER, msg);
      if (error) {
        throw new Error(error);
      } else {
        callback(success.context, success.metadata);
      }
    };
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

      return value;
    };
  }

  async exchangeData(ctx: Context): Promise<Context | void> {
    return await this.socket.emitWithAck(EXCHANGE_DATA, {
      ctx,
    });
  }
}

export async function connectRemoteHandlers(url: string): Promise<FDC3Handlers> {
  const socket = await io(url, {
    withCredentials: true, // Include cookies and session data
    autoConnect: true,
  });

  return new ClientSideHandlersImpl(socket);
}
