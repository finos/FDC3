import { AutomaticResponse, IntentDetail, intentDetailMatches, TestMessaging } from '../TestMessaging';
import { BrowserTypes } from '@kite9/fdc3-schema';
import { ResolveError } from '@kite9/fdc3-standard';

type RaiseIntentForContextRequest = BrowserTypes.RaiseIntentForContextRequest;
type RaiseIntentForContextResponse = BrowserTypes.RaiseIntentForContextResponse;
type RaiseIntentResultResponse = BrowserTypes.RaiseIntentResultResponse;

export class RaiseIntentForContext implements AutomaticResponse {
  filter(t: string) {
    return t == 'raiseIntentForContextRequest';
  }

  createCannedRaiseIntentForContextResponseMessage(
    intentRequest: RaiseIntentForContextRequest,
    m: TestMessaging
  ): RaiseIntentForContextResponse {
    const result = m.getIntentResult()!!;
    if (result.error) {
      const out: RaiseIntentForContextResponse = {
        meta: {
          ...intentRequest.meta,
          responseUuid: m.createUUID(),
        },
        payload: {
          error: result.error as any,
        },
        type: 'raiseIntentForContextResponse',
      };

      return out;
    } else {
      const out: RaiseIntentForContextResponse = {
        meta: {
          ...intentRequest.meta,
          responseUuid: m.createUUID(),
        },
        payload: {
          intentResolution: {
            intent: 'some-canned-intent',
            source: {
              appId: 'some-app',
              instanceId: 'abc123',
            },
          },
        },
        type: 'raiseIntentForContextResponse',
      };

      return out;
    }
  }

  private createRaiseIntentForContextResponseMessage(
    intentRequest: RaiseIntentForContextRequest,
    relevant: IntentDetail[],
    m: TestMessaging
  ): RaiseIntentForContextResponse {
    if (relevant.length == 0) {
      return {
        meta: {
          ...intentRequest.meta,
          responseUuid: m.createUUID(),
        },
        type: 'raiseIntentForContextResponse',
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
        type: 'raiseIntentForContextResponse',
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
        type: 'raiseIntentForContextResponse',
        payload: {
          appIntents: relevant.map(r => {
            return {
              apps: [r.app!!],
              intent: {
                name: r.intent!!,
              },
            };
          }),
        },
      };
    }
  }

  createRaiseIntentResultResponseMesssage(
    intentRequest: RaiseIntentForContextRequest,
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
    const intentRequest = input as RaiseIntentForContextRequest;
    const payload = intentRequest.payload;
    const context = payload?.context?.type;

    if (m.getIntentResult() == undefined) {
      // we're going to figure out the right response based on the app details (a la FindIntent)
      const app = payload?.app;
      const using: IntentDetail = {
        context,
        app,
      };

      const relevant = m.intentDetails.filter(id => intentDetailMatches(id, using, false));
      const request = this.createRaiseIntentForContextResponseMessage(intentRequest, relevant, m);
      setTimeout(() => {
        m.receive(request);
      }, 100);
    } else if (!m.getIntentResult()?.timeout) {
      // this sends out the pre-set intent resolution
      const out1 = this.createCannedRaiseIntentForContextResponseMessage(intentRequest, m);
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
