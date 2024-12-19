import {
  RaiseIntentForContextRequest,
  RaiseIntentForContextResponse,
  RaiseIntentResultResponse,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { AutomaticResponse, IntentDetail, intentDetailMatches, TestMessaging } from '../TestMessaging';
import { AppIdentifier, AppIntent, ResolveError } from '@kite9/fdc3-standard';
import { createResponseMeta } from './support';

export class RaiseIntentForContext implements AutomaticResponse {
  filter(t: string) {
    return t == 'raiseIntentForContextRequest';
  }

  createCannedRaiseIntentForContextResponseMessage(
    intentRequest: RaiseIntentForContextRequest,
    m: TestMessaging
  ): RaiseIntentForContextResponse {
    const result = m.getIntentResult();
    if (result && result.error) {
      const out: RaiseIntentForContextResponse = {
        meta: {
          ...intentRequest.meta,
          responseUuid: m.createUUID(),
        },
        payload: {
          error: result.error,
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
        meta: createResponseMeta(intentRequest.meta),
        type: 'raiseIntentForContextResponse',
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
        type: 'raiseIntentForContextResponse',
        payload: {
          intentResolution: {
            intent: relevant[0].intent,
            source: relevant[0].app,
          },
        },
      };
    } else if (relevant.length > 0) {
      //get unique intent names
      const relevantIntents = [
        ...new Set<string>(
          relevant.reduce<string[]>((filtered: string[], r) => {
            if (r.intent) {
              filtered.push(r.intent);
            }
            return filtered;
          }, [])
        ),
      ];
      const appIntents = relevantIntents.map<AppIntent>(i => {
        return {
          intent: { name: i, displayName: i },
          apps: relevant.reduce<AppIdentifier[]>((filtered: AppIdentifier[], r) => {
            if (r.intent === i && r.app) {
              filtered.push(r.app);
            }
            return filtered;
          }, []),
        };
      });

      return {
        meta: createResponseMeta(intentRequest.meta),
        type: 'raiseIntentForContextResponse',
        payload: {
          appIntents: appIntents,
        },
      };
    } else {
      throw new Error('createRaiseIntentForContextResponseMessage did not produce a valid result!');
    }
  }

  createRaiseIntentResultResponseMessage(
    intentRequest: RaiseIntentForContextRequest,
    m: TestMessaging
  ): RaiseIntentResultResponse | undefined {
    const result = m.getIntentResult();
    if (result && result.error) {
      return undefined;
    } else if (result) {
      const out: RaiseIntentResultResponse = {
        meta: {
          ...intentRequest.meta,
          responseUuid: m.createUUID(),
        },
        payload: {
          intentResult: result,
        },
        type: 'raiseIntentResultResponse',
      };

      return out;
    } else {
      throw new Error('');
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
