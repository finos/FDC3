import { AutomaticResponse, TestMessaging } from '../TestMessaging';
import { createResponseMeta } from './support';
import { AddEventListenerRequest, AddEventListenerResponse } from '@finos/fdc3-schema/generated/api/BrowserTypes.js';

export class AddEventListener implements AutomaticResponse {
  count: number = 0;

  filter(t: string) {
    return t == 'addEventListenerRequest';
  }

  action(input: object, m: TestMessaging) {
    const out = this.createResponse(input as AddEventListenerRequest);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createResponse(i: AddEventListenerRequest): AddEventListenerResponse {
    return {
      meta: createResponseMeta(i.meta),
      type: 'addEventListenerResponse',
      payload: {
        listenerUUID: 'listener-' + this.count++,
      },
    };
  }
}
