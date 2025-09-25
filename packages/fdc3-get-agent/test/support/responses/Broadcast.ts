import { TestServerContext } from '../TestServerContext.js';
import { InstanceID } from '@finos/fdc3-web-impl';
import { AutomaticResponse } from './AutomaticResponses.js';
import { BroadcastRequest, BroadcastResponse } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { createUUID } from '../../../src/util/Uuid.js';

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
