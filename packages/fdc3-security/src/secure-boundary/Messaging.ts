import { AppIdentifier } from '@finos/fdc3-standard';
import {
  AppRequestMessage,
  AgentEventMessage,
  AgentResponseMessage,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { WsEnvelope } from './MessageTypes';

export interface RegisterableListener {
  id: string;
  filter: (payload: any, event: WsEnvelope['event']) => boolean;
  action: (payload: any, event: WsEnvelope['event'], id?: string) => void;
  unsubscribe?: () => void;
}

/**
 * Minimal Messaging interface required for FDC3 communication across the secure boundary
 * (used by ClientSideHandlersImpl and ServerSideHandlersImpl).
 */
export interface Messaging {
  readonly appIdentifier: AppIdentifier;

  /**
   * Post an outgoing message using the default outgoing event.
   */
  post(message: AppRequestMessage | AgentEventMessage | AgentResponseMessage): Promise<void>;

  /**
   * Post an outgoing message with a specific event name.
   */
  postEvent(event: WsEnvelope['event'], payload: any, id?: string): Promise<void>;

  /**
   * Registers a listener for incoming messages.
   */
  register(l: RegisterableListener): void;

  /**
   * Unregister a listener with the given id.
   */
  unregister(id: string): void;

  /**
   * Create a metadata element to attach to outgoing messages.
   */
  createMeta(): any;

  /**
   * Creates UUIDs used in outgoing messages.
   */
  createUUID(): string;

  /**
   * Disconnects the underlying message transport.
   */
  disconnect(): Promise<void>;

  /**
   * Sends a request message and waits for a response.
   * If eventName is provided, it uses that instead of the default outgoing event.
   */
  exchange<X>(message: any, expectedTypeName: string, timeoutMs: number, eventName?: string): Promise<X>;
}
