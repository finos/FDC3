import { Channel, ContextHandler, ContextMetadata, DesktopAgent, IntentHandler, IntentResult } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { io, Socket } from 'socket.io-client';
import {
    REMOTE_INTENT_HANDLER,
    RemoteIntentHandlerMessage,
    EXCHANGE_DATA,
    SIGN_REQUEST,
    SignRequestMessage,
    REMOTE_CHANNEL,
    BROADCAST_PREFIX,
    BroadcastMessage,
} from './MessageTypes';
import { FDC3Handlers } from './FDC3Handlers';

/**
 * This class provides a set of helpers for clients to use
 * to move processing of secure FDC3 intents and contexts to the
 * server-side using WebSocket communication.
 */
export class ClientSideHandlersImpl implements FDC3Handlers {
    private readonly socket: Socket;
    private readonly desktopAgent: DesktopAgent;

    constructor(socket: Socket, desktopAgent: DesktopAgent) {
        this.socket = socket;
        this.desktopAgent = desktopAgent;
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
        return channel;
    }

    async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
        await this.socket.emitWithAck(REMOTE_CHANNEL, {
            purpose,
            channelId: channel.id,
            type: channel.type,
        });

        channel.addContextListener(null, async (ctx: Context, metadata: ContextMetadata | undefined) => {
            const value = await this.socket.emitWithAck(BROADCAST_PREFIX + channel.id, {
                context: ctx,
                metadata,
                channelId: channel.id,
            });

            return value;
        });

        this.socket.on(BROADCAST_PREFIX + channel.id, (data: BroadcastMessage) => {
            channel.broadcast(data.context); // , data.metadata);
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

            return value;
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
