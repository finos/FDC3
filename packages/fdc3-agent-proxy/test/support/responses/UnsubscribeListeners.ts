import {
  AppRequestMessage,
  ContextListenerUnsubscribeRequest,
  ContextListenerUnsubscribeResponse,
  EventListenerUnsubscribeRequest,
  IntentListenerUnsubscribeRequest,
  IntentListenerUnsubscribeResponse,
  PrivateChannelUnsubscribeEventListenerRequest,
  PrivateChannelUnsubscribeEventListenerResponse,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { AutomaticResponse, TestMessaging } from '../TestMessaging.js';
import { createResponseMeta } from './support.js';
import { EventListenerUnsubscribeResponse } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

type Requests =
  | IntentListenerUnsubscribeRequest
  | PrivateChannelUnsubscribeEventListenerRequest
  | ContextListenerUnsubscribeRequest
  | EventListenerUnsubscribeRequest;
type Responses =
  | IntentListenerUnsubscribeResponse
  | PrivateChannelUnsubscribeEventListenerResponse
  | ContextListenerUnsubscribeResponse
  | EventListenerUnsubscribeResponse;

export class UnsubscribeListeners implements AutomaticResponse {
  filter(t: string) {
    return (
      t == 'intentListenerUnsubscribeRequest' ||
      t == 'privateChannelUnsubscribeEventListenerRequest' ||
      t == 'contextListenerUnsubscribeRequest' ||
      t == 'eventListenerUnsubscribeRequest'
    );
  }

  action(input: AppRequestMessage, m: TestMessaging) {
    const out = this.createResponse(input as Requests);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createResponse(i: Requests): Responses {
    return {
      meta: createResponseMeta(i.meta),
      type: i.type.replace('Request', 'Response') as Responses['type'],
      payload: {},
    };
  }
}
