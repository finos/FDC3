import { Channel, IntentHandler } from '@finos/fdc3-standard';

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
  exchangeData(purpose: string, o: object): Promise<object | void>;
}

/**
 * A default implementation of FDC3Handlers that does nothing.
 * Extend this class and override only the methods you need.
 */
export class DefaultFDC3Handlers implements FDC3Handlers {
  async handleRemoteChannel(_purpose: string, _channel: Channel): Promise<void> {
    // Default: do nothing
  }

  async remoteIntentHandler(_intent: string): Promise<IntentHandler> {
    // Default: return a no-op handler
    return async () => {
      return;
    };
  }

  async exchangeData(_purpose: string, _o: object): Promise<object | void> {
    // Default: do nothing
    return;
  }
}
