import { ContextMetadata } from '@finos/fdc3';
import { Context } from '@finos/fdc3-context';

export const SIGN_REQUEST = 'sign-request';
export type SignRequestMessage = {
    ctx: Context;
    intent: string | null;
    channelId: string | null;
};

export const REMOTE_CHANNEL = 'remote-channel';
export type RemoteChannelMessage = {
    purpose: string;
    channelId: string;
    type: 'user' | 'app' | 'private';
};

export const BROADCAST_PREFIX = 'broadcast-';

export type BroadcastMessage = {
    context: Context;
    metadata: ContextMetadata | undefined;
    channelId: string;
};

export const REMOTE_INTENT_HANDLER = 'remote-intent-handler';
export type RemoteIntentHandlerMessage = {
    intent: string;
};

export const EXCHANGE_DATA = 'exchange-data';
export type ExchangeDataMessage = {
    ctx: Context;
};
