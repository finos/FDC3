import { RaiseIntentRequest, RaiseIntentResponse, RaiseIntentResultResponse } from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { AutomaticResponse, IntentDetail, intentDetailMatches, TestMessaging } from '../TestMessaging';
import { AppMetadata, ResolveError } from '@kite9/fdc3-standard';
import { createResponseMeta } from './support';

export class RaiseIntent implements AutomaticResponse {
  filter(t: string) {
    return t == 'raiseIntentRequest';
  }

  createCannedRaiseIntentResponseMessage(intentRequest: RaiseIntentRequest, m: TestMessaging): RaiseIntentResponse {
    const result = m.getIntentResult();

    if (result && result.error) {
      const out: RaiseIntentResponse = {
        meta: {
          ...intentRequest.meta,
          responseUuid: m.createUUID(),
        },
        payload: {
          error: result.error,
        },
        type: 'raiseIntentResponse',
      };

      return out;
    } else if (result) {
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
    } else {
        throw new Error("TestMessaging did not return an IntentResult")
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
    } else if (relevant.length == 1 && relevant[0].intent && relevant[0].app) {
      return {
        meta: {
          ...intentRequest.meta,
          responseUuid: m.createUUID(),
        },
        type: 'raiseIntentResponse',
        payload: {
          intentResolution: {
            intent: relevant[0].intent,
            source: relevant[0].app,
          },
        },
      };
    } else if (relevant.length > 0) {
      return {
        meta: createResponseMeta(intentRequest.meta),
        type: 'raiseIntentResponse',
        payload: {
          appIntent: {
            apps: relevant.reduce<AppMetadata[]>((filtered, r) => {
                if (r.app?.appId){
                    filtered.push({
                        appId: r.app.appId,
                        instanceId: r.app.instanceId,
                      });
                }
              return filtered;
            }, []),
            intent: {
              displayName: intentRequest.payload.intent,
              name: intentRequest.payload.intent,
            },
          },
        },
      };
    } else {
        throw new Error("createRaiseIntentResponseMessage did not produce a valid result!")
    }
  }

  createRaiseIntentResultResponseMessage(
    intentRequest: RaiseIntentRequest,
    m: TestMessaging
  ): RaiseIntentResultResponse | undefined {
    const result = m.getIntentResult();
    if (result?.error) {
      return undefined;
    } else if (result) {
      const out: RaiseIntentResultResponse = {
        meta: createResponseMeta(intentRequest.meta),
        payload: {
          intentResult: result,
        },
        type: 'raiseIntentResultResponse',
      };

      return out;
    } else {
        return;
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
      const out2 = this.createRaiseIntentResultResponseMessage(intentRequest, m);
      if (out2) {
        setTimeout(() => {
          m.receive(out2);
        }, 300);
      }
    }
    return Promise.resolve();
  }
}
