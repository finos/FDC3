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
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { AutomaticResponse, TestMessaging } from '../TestMessaging.js';
import { createResponseMeta } from './support.js';
import { v4 as uuidv4 } from 'uuid';

type Requests =
  | AddContextListenerRequest
  | AddIntentListenerRequest
  | AddEventListenerRequest
  | PrivateChannelAddEventListenerRequest;
type Responses =
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
    const out = this.createResponse(input as Requests);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createResponse(i: Requests): Responses {
    return {
      meta: createResponseMeta(i.meta),
      //TODO: use a typesafe method of creating response messages
      type: i.type.replace('Request', 'Response') as Responses['type'],
      payload: {
        listenerUUID: uuidv4(),
      },
    };
  }
}
