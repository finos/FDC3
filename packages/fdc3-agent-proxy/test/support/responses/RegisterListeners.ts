import { AutomaticResponse, TestMessaging } from '../TestMessaging';
import { createResponseMeta } from './support';
import { v4 as uuidv4 } from 'uuid';

export class RegisterListeners implements AutomaticResponse {
  filter(t: string) {
    return (
      t == 'addContextListenerRequest' ||
      t == 'addIntentListenerRequest' ||
      t == 'privateChannelAddContextListenerRequest' ||
      t == 'privateChannelAddEventListenerRequest'
    );
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
      payload: {
        listenerUUID: uuidv4(),
      },
    };
  }
}
