import { ContextHandler, ContextMetadata, IntentHandler } from '@finos/fdc3';
import { Context } from '@finos/fdc3-context';

export type ContextOrErrorMetadata = ContextMetadata | { error: string } | undefined;

/**
 * Functions that allow back-end processing of FDC3 requests in order to keep
 * secure / sensitive processing on the server-side.
 */
export interface FDC3Handlers {
  signRequest(ctx: Context, intent: string | null, channelId: string | null): Promise<Context>;

  remoteContextHandler(
    purpose: string,
    channelId: string | null,
    callback: (ctx: Context | null, metadata: ContextOrErrorMetadata) => void
  ): Promise<ContextHandler>;

  remoteIntentHandler(intent: string): Promise<IntentHandler>;

  exchangeData(ctx: Context): Promise<Context | void>;
}
