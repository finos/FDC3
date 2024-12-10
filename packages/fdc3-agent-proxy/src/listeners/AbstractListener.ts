import {
  AgentEventMessage,
  AddContextListenerRequest,
  AddIntentListenerRequest,
  AddEventListenerRequest,
  PrivateChannelAddEventListenerRequest,
  AddIntentListenerResponse,
  AddContextListenerResponse,
  AddEventListenerResponse,
  ContextListenerUnsubscribeRequest,
  IntentListenerUnsubscribeRequest,
  EventListenerUnsubscribeRequest,
  PrivateChannelAddEventListenerResponse,
  PrivateChannelUnsubscribeEventListenerRequest,
  ContextListenerUnsubscribeResponse,
  IntentListenerUnsubscribeResponse,
  EventListenerUnsubscribeResponse,
  PrivateChannelUnsubscribeEventListenerResponse,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { Messaging } from '../Messaging';
import { RegisterableListener } from './RegisterableListener';

type SubscriptionRequest =
  | AddContextListenerRequest
  | AddIntentListenerRequest
  | AddEventListenerRequest
  | PrivateChannelAddEventListenerRequest;
type SubscriptionResponse =
  | AddContextListenerResponse
  | AddIntentListenerResponse
  | AddEventListenerResponse
  | PrivateChannelAddEventListenerResponse;
type UnsubscribeRequest =
  | ContextListenerUnsubscribeRequest
  | IntentListenerUnsubscribeRequest
  | EventListenerUnsubscribeRequest
  | PrivateChannelUnsubscribeEventListenerRequest;
type UnsubscribeResponse =
  | ContextListenerUnsubscribeResponse
  | IntentListenerUnsubscribeResponse
  | EventListenerUnsubscribeResponse
  | PrivateChannelUnsubscribeEventListenerResponse;

/**
 * Common to all listeners - they need to be registered and unregistered with messaging and also
 * send notification messages when connected and disconnected
 */
export abstract class AbstractListener<X, Y extends SubscriptionRequest> implements RegisterableListener {
  readonly messaging: Messaging;
  private readonly subscribeRequestType: Y['type'];
  private readonly subscribeResponseType: SubscriptionResponse['type'];
  private readonly unsubscribeRequestType: UnsubscribeRequest['type'];
  private readonly unsubscribeResponseType: UnsubscribeResponse['type'];
  private readonly subscriptionPayload: Y['payload'];
  id: string | null = null;
  readonly handler: X;

  constructor(
    messaging: Messaging,
    subscriptionPayload: Y['payload'],
    handler: X,
    subscribeRequestType: Y['type'],
    subscribeResponseType: SubscriptionResponse['type'],
    unsubscribeRequestType: UnsubscribeRequest['type'],
    unsubscribeResponseType: UnsubscribeResponse['type']
  ) {
    this.messaging = messaging;
    this.handler = handler;
    this.subscriptionPayload = subscriptionPayload;
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
      const unsubscribeMessage: UnsubscribeRequest = {
        meta: this.messaging.createMeta(),
        payload: {
          listenerUUID: this.id,
        },
        type: this.unsubscribeRequestType,
      };
      await this.messaging.exchange<UnsubscribeResponse>(unsubscribeMessage, this.unsubscribeResponseType);
      return;
    } else {
      console.error("This listener doesn't have an id and hence can't be removed!");
    }
  }

  async register(): Promise<void> {
    const subscribeMessage: Y = {
      meta: this.messaging.createMeta(),
      payload: this.subscriptionPayload,
      type: this.subscribeRequestType,
    } as Y;

    const response = await this.messaging.exchange<SubscriptionResponse>(subscribeMessage, this.subscribeResponseType);
    this.id = response?.payload?.listenerUUID ?? null;

    if (!this.id) {
      console.error(
        "The Desktop Agent's response did not include a listenerUUID, which will mean this listener can't be removed!",
        response
      );
    }
    this.messaging.register(this);
  }
}
