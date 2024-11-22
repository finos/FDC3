import { GetAgentParams, ImplementationMetadata } from '@kite9/fdc3-standard';
import { RegisterableListener, AbstractMessaging } from '@kite9/fdc3-agent-proxy';
import {
  AppRequestMessage
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';


/**
 * Version of Messaging which is able to store details in the SessionState (i.e. works on the web)
 */
export abstract class AbstractWebMessaging extends AbstractMessaging {
  private readonly options: GetAgentParams;

  constructor(options: GetAgentParams, implMetadata: ImplementationMetadata) {
    super(implMetadata);
    if (!options.timeoutMs) {
      options.timeoutMs = 10016;
    }
    this.options = options;
  }

  abstract post(message: object): Promise<void>;

  abstract register(l: RegisterableListener): void;
  abstract unregister(id: string): void;

  abstract createMeta(): AppRequestMessage['meta'];

  getTimeoutMs(): number {
    return this.options.timeoutMs!;
  }

  /**
   * This handles the verify exchange with the da-server,
   */
  async connect(): Promise<void> {

  }

  async disconnect(): Promise<void> {

  }

}
