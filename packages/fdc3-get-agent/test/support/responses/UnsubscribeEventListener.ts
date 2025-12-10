import { AutomaticResponse } from './AutomaticResponses';
import {
  EventListenerUnsubscribeRequest,
  EventListenerUnsubscribeResponse,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { createUUID } from '../../../src/util/Uuid';
import { InstanceID } from '@finos/fdc3-web-impl';
import { MockFDC3Server } from '../MockFDC3Server';

export class UnsubscribeEventListener implements AutomaticResponse {
  filter(t: string) {
    return t == 'eventListenerUnsubscribeRequest';
  }

  action(input: object, m: MockFDC3Server, from: InstanceID) {
    const request = input as EventListenerUnsubscribeRequest;
    const response = this.createResponse(request);
    setTimeout(() => {
      m.post(response, from);
    }, 100);
    return Promise.resolve();
  }

  private createResponse(i: EventListenerUnsubscribeRequest): EventListenerUnsubscribeResponse {
    return {
      meta: {
        requestUuid: i.meta.requestUuid,
        responseUuid: createUUID(),
        timestamp: new Date(),
      },
      type: 'eventListenerUnsubscribeResponse',
      payload: {},
    };
  }
}
