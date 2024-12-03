import { AutomaticResponse, IntentDetail, intentDetailMatches, TestMessaging } from '../TestMessaging';
import { BrowserTypes } from '@kite9/fdc3-schema';
import { ResolveError } from '@kite9/fdc3-standard';

type RaiseIntentRequest = BrowserTypes.RaiseIntentRequest;
type RaiseIntentResponse = BrowserTypes.RaiseIntentResponse;
type RaiseIntentResultResponse = BrowserTypes.RaiseIntentResultResponse;

export class RaiseIntent implements AutomaticResponse {
  filter(t: string) {
    return t == 'raiseIntentRequest';
  }

  createCannedRaiseIntentResponseMessage(intentRequest: RaiseIntentRequest, m: TestMessaging): RaiseIntentResponse {
    const result = m.getIntentResult()!!;
    if (result.error) {
      const out: RaiseIntentResponse = {
        meta: {
          ...intentRequest.meta,
          responseUuid: m.createUUID(),
        },
        payload: {
          error: result.error as any,
        },
        type: 'raiseIntentResponse',
      };

      return out;
    } else {
      const out: RaiseIntentResponse = {
        meta: {
          ...intentRequest.meta,
          responseUuid: m.createUUID(),
        },
        payload: {
          intentResolution: {
            intent: intentRequest.payload.intent,
            source: {
              appId: 'some-app',
              instanceId: 'abc123',
            },
          },
        },
        type: 'raiseIntentResponse',
      };

      return out;
    }
  }

  private createRaiseIntentResponseMessage(
    intentRequest: RaiseIntentRequest,
    relevant: IntentDetail[],
    m: TestMessaging
  ): RaiseIntentResponse {
    if (relevant.length == 0) {
      return {
        meta: {
          ...intentRequest.meta,
          responseUuid: m.createUUID(),
        },
        type: 'raiseIntentResponse',
        payload: {
          error: ResolveError.NoAppsFound,
        },
      };
    } else if (relevant.length == 1) {
      return {
        meta: {
          ...intentRequest.meta,
          responseUuid: m.createUUID(),
        },
        type: 'raiseIntentResponse',
        payload: {
          intentResolution: {
            intent: relevant[0].intent!!,
            source: relevant[0].app!!,
          },
        },
      };
    } else {
      return {
        meta: {
          ...intentRequest.meta,
          responseUuid: m.createUUID(),
        },
        type: 'raiseIntentResponse',
        payload: {
          appIntent: {
            apps: relevant.map(r => {
              return {
                appId: r?.app?.appId!!,
                instanceId: r?.app?.instanceId,
              };
            }),
            intent: {
              displayName: intentRequest.payload.intent,
              name: intentRequest.payload.intent,
            },
          },
        },
      };
    }
  }

  createRaiseIntentResultResponseMesssage(
    intentRequest: RaiseIntentRequest,
    m: TestMessaging
  ): RaiseIntentResultResponse | undefined {
    const result = m.getIntentResult()!!;
    if (result.error) {
      return undefined;
    } else {
      const out: RaiseIntentResultResponse = {
        meta: {
          ...intentRequest.meta,
          responseUuid: m.createUUID(),
        },
        payload: {
          intentResult: m.getIntentResult()!!,
        },
        type: 'raiseIntentResultResponse',
      };

      return out;
    }
  }

  action(input: object, m: TestMessaging) {
    const intentRequest = input as RaiseIntentRequest;
    const payload = intentRequest.payload;
    const intent = payload.intent;
    const context = payload?.context?.type;

    if (m.getIntentResult() == undefined) {
      // we're going to figure out the right response based on the app details (a la FindIntent)
      const app = payload?.app;
      const using: IntentDetail = {
        intent,
        context,
        app,
      };

      const relevant = m.intentDetails.filter(id => intentDetailMatches(id, using, false));
      const request = this.createRaiseIntentResponseMessage(intentRequest, relevant, m);
      setTimeout(() => {
        m.receive(request);
      }, 100);
    } else if (!m.getIntentResult()?.timeout) {
      // this sends out the pre-set intent resolution
      const out1 = this.createCannedRaiseIntentResponseMessage(intentRequest, m);
      setTimeout(() => {
        m.receive(out1);
      }, 100);

      // next, send the result response
      const out2 = this.createRaiseIntentResultResponseMesssage(intentRequest, m);
      if (out2) {
        setTimeout(() => {
          m.receive(out2);
        }, 300);
      }
    }
    return Promise.resolve();
  }
}
