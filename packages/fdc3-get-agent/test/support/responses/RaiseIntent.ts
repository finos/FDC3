import { TestServerContext } from '../TestServerContext';
import { InstanceID } from '@finos/fdc3-web-impl';
import { AutomaticResponse } from './AutomaticResponses';
import { RaiseIntentRequest, RaiseIntentResponse } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';

export class RaiseIntent implements AutomaticResponse {
  filter(t: string) {
    return t == 'raiseIntentRequest';
  }

  createRaiseIntentAgentResponseMessage(intentRequest: RaiseIntentRequest, m: TestServerContext): RaiseIntentResponse {
    const out: RaiseIntentResponse = {
      meta: {
        ...intentRequest.meta,
        responseUuid: m.createUUID(),
      },
      payload: {
        intentResolution: {
          intent: intentRequest.payload.intent,
          source: intentRequest.payload.app!!,
        },
      },
      type: 'raiseIntentResponse',
    };

    return out;
  }

  action(input: object, m: TestServerContext, from: InstanceID) {
    const intentRequest = input as RaiseIntentRequest;
    // this sends out the intent resolution
    const out1 = this.createRaiseIntentAgentResponseMessage(intentRequest, m);
    setTimeout(() => {
      m.post(out1, from);
    }, 100);
    return Promise.resolve();
  }
}
