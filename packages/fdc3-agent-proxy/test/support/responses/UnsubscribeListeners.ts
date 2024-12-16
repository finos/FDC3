import { AutomaticResponse, TestMessaging } from '../TestMessaging';
import { createResponseMeta } from './support';

export class UnsubscribeListeners implements AutomaticResponse {
  filter(t: string) {
    return t == 'intentListenerUnsubscribeRequest' || t == 'privateChannelUnsubscribeEventListenerRequest';
  }

  action(input: object, m: TestMessaging) {
    const out = this.createResponse(input);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createResponse(i: any): any {
    return {
      meta: createResponseMeta(i.meta),
      type: i.type.replace('Request', 'Response'),
    };
  }
}
