import {
  AddContextListenerRequest,
  AddContextListenerResponse,
  AddEventListenerRequest,
  AddEventListenerResponse,
  AddIntentListenerRequest,
  AddIntentListenerResponse,
  AppRequestMessage,
  PrivateChannelAddEventListenerRequest,
  PrivateChannelAddEventListenerResponse,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { AutomaticResponse, TestMessaging } from '../TestMessaging';
import { createResponseMeta } from './support';
import { v4 as uuidv4 } from 'uuid';

type requests =
  | AddContextListenerRequest
  | AddIntentListenerRequest
  | AddEventListenerRequest
  | PrivateChannelAddEventListenerRequest;
type responses =
  | AddContextListenerResponse
  | AddIntentListenerResponse
  | AddEventListenerResponse
  | PrivateChannelAddEventListenerResponse;

export class RegisterListeners implements AutomaticResponse {
  filter(t: string) {
    return (
      t == 'addContextListenerRequest' ||
      t == 'addIntentListenerRequest' ||
      t == 'addEventListenerRequest' ||
      t == 'privateChannelAddEventListenerRequest'
    );
  }

  action(input: AppRequestMessage, m: TestMessaging) {
    const out = this.createResponse(input as requests);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createResponse(i: requests): responses {
    return {
      meta: createResponseMeta(i.meta),
      //TODO: use a typesafe method of creating response messages
      type: i.type.replace('Request', 'Response') as responses['type'],
      payload: {
        listenerUUID: uuidv4(),
      },
    };
  }
}
