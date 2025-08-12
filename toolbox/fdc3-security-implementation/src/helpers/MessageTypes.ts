import { ContextMetadata } from '@finos/fdc3';
import { Context } from '@finos/fdc3-context';

export const SIGN_REQUEST = 'sign-request';
export type SignRequestMessage = {
  ctx: Context;
  intent: string | null;
  channelId: string | null;
};

export const REMOTE_CONTEXT_HANDLER = 'remote-context-handler';
export type RemoteContextHandlerMessage = {
  channelId: string | null;
  purpose: string;
  context: Context;
  metadata: ContextMetadata | undefined;
};

export const REMOTE_INTENT_HANDLER = 'remote-intent-handler';
export type RemoteIntentHandlerMessage = {
  intent: string;
};

export const EXCHANGE_DATA = 'exchange-data';
export type ExchangeDataMessage = {
  ctx: Context;
};
