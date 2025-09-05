import { Channel, ContextMetadata, IntentHandler } from '@finos/fdc3';
import { Context } from '@finos/fdc3-context';

export type ContextOrErrorMetadata = ContextMetadata | { error: string } | undefined;

/**
 * Functions that allow back-end processing of FDC3 requests in order to keep
 * secure / sensitive processing on the server-side.
 */
export interface FDC3Handlers {
  /**
   * Call this on the client side to export a channel to the server-side.
   */
  handleRemoteChannel(purpose: string, channel: Channel): Promise<void>;

  /**
   * This is called at the other end of the connection when a new remote intent is created.
   * On the client side, you should call this function to allow the server-side to
   * have access to the intent.
   */
  remoteIntentHandler(intent: string): Promise<IntentHandler>;

  /**
   * This function allows server-side and client-side to exchange data with one another.
   */
  exchangeData(purpose: string, ctx: Context, intent?: string, channelId?: string): Promise<Context | void>;
}
