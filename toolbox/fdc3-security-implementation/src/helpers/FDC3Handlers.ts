import { Channel, ContextHandler, ContextMetadata, IntentHandler } from '@finos/fdc3';
import { Context } from '@finos/fdc3-context';

export type ContextOrErrorMetadata = ContextMetadata | { error: string } | undefined;

/**
 * Functions that allow back-end processing of FDC3 requests in order to keep
 * secure / sensitive processing on the server-side.
 */
export interface FDC3Handlers {
  signRequest(ctx: Context, intent: string | null, channelId: string | null): Promise<Context>;

  /**
   * This is called at the other end of the connection when a new remote channel is created
   */
  handleRemoteChannel(purpose: string, channel: Channel): Promise<void>;

  remoteIntentHandler(intent: string): Promise<IntentHandler>;

  exchangeData(ctx: Context): Promise<Context | void>;
}
