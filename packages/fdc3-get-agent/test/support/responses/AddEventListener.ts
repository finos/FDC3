import { AutomaticResponse } from './AutomaticResponses';
import { AddEventListenerRequest, AddEventListenerResponse } from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { createUUID } from '../../../src/util/Uuid';
import { InstanceID } from '@finos/fdc3-web-impl';
import { TestServerContext } from '../TestServerContext';

export class AddEventListener implements AutomaticResponse {
  private count: number = 0;

  filter(t: string) {
    return t == 'addEventListenerRequest';
  }

  action(input: object, m: TestServerContext, from: InstanceID) {
    const request = input as AddEventListenerRequest;
    const response = this.createResponse(request);
    setTimeout(() => {
      m.post(response, from);
    }, 100);
    return Promise.resolve();
  }

  private createResponse(i: AddEventListenerRequest): AddEventListenerResponse {
    return {
      meta: {
        requestUuid: i.meta.requestUuid,
        responseUuid: createUUID(),
        timestamp: new Date(),
      },
      type: 'addEventListenerResponse',
      payload: {
        listenerUUID: 'listener-' + this.count++,
      },
    };
  }
}
