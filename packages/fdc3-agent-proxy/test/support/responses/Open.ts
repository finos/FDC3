import { AutomaticResponse, IntentDetail, TestMessaging } from '../TestMessaging';
import { BrowserTypes } from '@kite9/fdc3-schema';

type OpenRequest = BrowserTypes.OpenRequest;
type OpenResponse = BrowserTypes.OpenResponse;

export class Open implements AutomaticResponse {
  filter(t: string) {
    return t == 'openRequest';
  }

  action(input: object, m: TestMessaging) {
    const out = this.createOpenResponse(input as OpenRequest, m.intentDetails[0], m);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createOpenResponse(m: OpenRequest, id: IntentDetail, tm: TestMessaging): OpenResponse {
    const found = tm.intentDetails.find(id => id.app?.appId == m.payload.app.appId);

    if (found) {
      return {
        meta: m.meta as any,
        type: 'openResponse',
        payload: {
          appIdentifier: {
            appId: id.app?.appId!!,
            instanceId: 'abc123',
          },
        },
      } as OpenResponse;
    } else {
      return {
        meta: m.meta as any,
        type: 'openResponse',
        payload: {
          error: 'AppNotFound',
        },
      } as OpenResponse;
    }
  }
}
