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

  async unsubscribe(): Promise<void> {
    if (this.id) {
        this.messaging.unregister(this.id!);
        const notificationMessage: AppRequestMessage = {
            meta: this.messaging.createMeta(),
            payload: {
            listenerUUID: this.id,
            },
            type: this.unsubscribeRequestType,
        };
        await this.messaging.exchange<AgentResponseMessage>(notificationMessage, this.unsubscribeResponseType);
        return;
    } else {
        console.error("This listener doesn't have an id and hence can't be removed!");
    }
  }

  async register(): Promise<void> {
    const notificationMessage: AppRequestMessage = {
        meta: this.messaging.createMeta(),
        payload: {
          ...this.payloadDetails,
        },
        type: this.subscribeRequestType,
      };
      const response = await this.messaging.exchange<AgentResponseMessage>(notificationMessage, this.subscribeResponseType);
      this.id = (response?.payload?.listenerUUID) ?? null;

      if (!this.id){
        console.error("The Desktop Agent's response did not include a listenerUUID, which will mean this listener can't be removed!", response);
      }
      this.messaging.register(this);
  }
}
