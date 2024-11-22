import {
  AgentEventMessage,
  AgentResponseMessage,
  AppRequestMessage,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { Messaging } from '../Messaging';
import { RegisterableListener } from './RegisterableListener';

/**
 * Common to all listeners - they need to be registered and unregistered with messaging and also
 * send notification messages when connected and disconnected
 */
export abstract class AbstractListener<X> implements RegisterableListener {
  readonly messaging: Messaging;
  private readonly subscribeRequestType: AppRequestMessage['type'];
  private readonly subscribeResponseType: AgentResponseMessage['type'];
  private readonly unsubscribeRequestType: AppRequestMessage['type'];
  private readonly unsubscribeResponseType: AgentResponseMessage['type'];
  private readonly payloadDetails: Record<string, string | null>;
  id: string | null = null;
  readonly handler: X;

  constructor(
    messaging: Messaging,
    payloadDetails: Record<string, string | null>,
    handler: X,
    subscribeRequestType: AppRequestMessage['type'],
    subscribeResponseType: AgentResponseMessage['type'],
    unsubscribeRequestType: AppRequestMessage['type'],
    unsubscribeResponseType: AgentResponseMessage['type']
  ) {
    this.messaging = messaging;
    this.handler = handler;
    this.payloadDetails = payloadDetails;
    this.subscribeRequestType = subscribeRequestType;
    this.subscribeResponseType = subscribeResponseType;
    this.unsubscribeRequestType = unsubscribeRequestType;
    this.unsubscribeResponseType = unsubscribeResponseType;
  }

  abstract filter(m: AgentEventMessage): boolean;

  abstract action(m: AgentEventMessage): void;

  async listenerNotification(
    requestType: AppRequestMessage['type'],
    responseType: AgentResponseMessage['type']
  ): Promise<string | null> {
    let notificationMessage: AppRequestMessage;
    if (this.id) {
      notificationMessage = {
        meta: this.messaging.createMeta(),
        payload: {
          listenerUUID: this.id,
        },
        type: requestType,
      };
    } else {
      // send subscription notification
      notificationMessage = {
        meta: this.messaging.createMeta(),
        payload: {
          ...this.payloadDetails,
        },
        type: requestType,
      };
    }

    const response = await this.messaging.exchange<AgentResponseMessage>(notificationMessage, responseType!);
    return response?.payload?.listenerUUID ?? null;
  }

  async unsubscribe(): Promise<void> {
    this.messaging.unregister(this.id!);
    await this.listenerNotification(this.unsubscribeRequestType, this.unsubscribeResponseType);
  }

  async register() {
    this.id = await this.listenerNotification(this.subscribeRequestType, this.subscribeResponseType);
    this.messaging.register(this);
  }
}
