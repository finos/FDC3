import { AppIdentifier } from '@finos/fdc3-standard';
import { RegisterableListener } from './listeners/RegisterableListener';
import {
  AppRequestMessage,
  AgentResponseMessage,
  WebConnectionProtocol6Goodbye,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';

export interface Messaging {
  /**
   * Creates UUIDs used in outgoing messages
   */
  createUUID(): string;

  /**
   * Post an outgoing message
   */
  post(message: AppRequestMessage | WebConnectionProtocol6Goodbye): Promise<void>;

  /**
   * Registers a listener for incoming messages.
   */
  register(l: RegisterableListener): void;

  /**
   * Unregister a listener with the given id
   * @param id
   */
  unregister(id: string): void;

  /** Create a metadata element to attach to outgoing messages. */
  createMeta(): AppRequestMessage['meta'];

  /**
   * Waits for a specific matching message
   */
  waitFor<X extends AgentResponseMessage>(filter: (m: X) => boolean, timeoutErrorMessage?: string): Promise<X>;

  /**
   * Sends a request message and waits for a response. If the response contains a payload.error, it is thrown.
   * @param message The request message to send.
   */
  exchange<X extends AgentResponseMessage>(
    message: AppRequestMessage,
    expectedTypeName: string,
    timeoutErrorMessage?: string
  ): Promise<X>;

  /**
   * App identification used to provide source information used in
   * message meta elements, IntentResolution etc..
   */
  getAppIdentifier(): AppIdentifier;

  /** Disconnects the underlying message transport. */
  disconnect(): Promise<void>;
}
