import { ImplementationMetadata, Connectable } from '@kite9/fdc3-standard';

/**
 * Handles messaging around connection and disconnection of the proxy
 * to the server.
 */
export interface HandshakeSupport extends Connectable {
  getImplementationMetadata(): Promise<ImplementationMetadata>;
}
