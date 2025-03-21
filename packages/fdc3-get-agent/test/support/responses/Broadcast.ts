import { TestServerContext } from '../TestServerContext';
import { InstanceID } from '@finos/fdc3-web-impl';
import { AutomaticResponse } from './AutomaticResponses';
import { BroadcastRequest, BroadcastResponse } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';
import { createUUID } from '../../../src/util/Uuid';

export class Broadcast implements AutomaticResponse {
  filter(t: string) {
    return t == 'broadcastRequest';
  }

  action(input: object, m: TestServerContext, from: InstanceID) {
    const broadcastRequest = input as BroadcastRequest;
    const request = this.createBroadcastResponseMessage(broadcastRequest);
    setTimeout(() => {
      m.post(request, from);
    }, 100);
    return Promise.resolve();
  }

  private createBroadcastResponseMessage(m: BroadcastRequest): BroadcastResponse {
    const response: BroadcastResponse = {
      meta: {
        requestUuid: m.meta.requestUuid,
        responseUuid: createUUID(),
        timestamp: new Date(),
      },
      type: 'broadcastResponse',
      payload: {},
    };
    return response;
  }
}
