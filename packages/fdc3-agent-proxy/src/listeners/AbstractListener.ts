import { AgentEventMessage } from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { Messaging } from '../Messaging';
import { RegisterableListener } from './RegisterableListener';

/**
 * Common to all listeners - they need to be registered and unregistered with messaging and also
 * send notification messsages when connected and disconnected
 */
export abstract class AbstractListener<X> implements RegisterableListener {
  readonly messaging: Messaging;
  readonly handler: X;
  id: string | null = null;

  constructor(
    messaging: Messaging,
    private readonly payloadDetails: Record<string, string | null>,
    handler: X,
    private readonly subscribeType: string,
    private readonly unsubscribeType: string
  ) {
    this.messaging = messaging;
    this.handler = handler;
  }

  abstract filter(m: AgentEventMessage): boolean;

  abstract action(m: AgentEventMessage): void;

  async listenerNotification(type: string): Promise<string | null> {
    const requestType = `${type}Request`;
    const responseType = `${type}Response`;
    const notificationMessage = {
      meta: this.messaging.createMeta(),
      payload: this.id ? { listenerUUID: this.id } : { ...this.payloadDetails },
      type: requestType,
    };

    const response = await this.messaging.exchange<any>(notificationMessage, responseType);
    return response?.payload?.listenerUUID ?? null;
  }

  async unsubscribe(): Promise<void> {
    if (!this.id) {
      throw new Error("Can't unsubscribe from a listener that has not been registered.");
    }

    this.messaging.unregister(this.id);
    await this.listenerNotification(this.unsubscribeType);
  }

  async register() {
    this.id = await this.listenerNotification(this.subscribeType);
    this.messaging.register(this);
  }
}
