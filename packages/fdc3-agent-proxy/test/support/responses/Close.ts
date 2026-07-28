import { CloseRequest, CloseResponse } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { CloseError } from '@finos/fdc3-standard';
import { AutomaticResponse, TestMessaging } from '../TestMessaging.js';
import { createResponseMeta } from './support.js';

export class Close implements AutomaticResponse {
  filter(t: string) {
    return t == 'closeRequest';
  }

  action(input: object, m: TestMessaging) {
    const out = this.createCloseResponse(input as CloseRequest, m);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createCloseResponse(m: CloseRequest, tm: TestMessaging): CloseResponse {
    if (tm.closeShouldFail) {
      return {
        meta: createResponseMeta(m.meta),
        type: 'closeResponse',
        payload: {
          error: CloseError.ErrorOnClose,
        },
      } as unknown as CloseResponse;
    }

    return {
      meta: createResponseMeta(m.meta),
      type: 'closeResponse',
      payload: {},
    } as unknown as CloseResponse;
  }
}
