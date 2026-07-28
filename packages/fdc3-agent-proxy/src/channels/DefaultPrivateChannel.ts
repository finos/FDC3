import { ContextHandler, EventHandler, Listener, PrivateChannel, PrivateChannelEventTypes } from '@finos/fdc3-standard';
import { DefaultChannel } from './DefaultChannel.js';
import { Messaging } from '../Messaging.js';
import {
  PrivateChannelNullEventListener,
  PrivateChannelAddContextEventListener,
  PrivateChannelDisconnectEventListener,
  PrivateChannelUnsubscribeEventListener,
} from '../listeners/PrivateChannelEventListener.js';
import { DefaultContextListener } from '../listeners/DefaultContextListener.js';
import { RegisterableListener } from '../listeners/RegisterableListener.js';
import {
  PrivateChannelDisconnectRequest,
  PrivateChannelDisconnectResponse,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

export class DefaultPrivateChannel extends DefaultChannel implements PrivateChannel {
  constructor(messaging: Messaging, messageExchangeTimeout: number, id: string) {
    super(messaging, messageExchangeTimeout, id, 'private');

    //bind all functions to allow destructuring
    this.addContextListener = this.addContextListener.bind(this);
    this.addEventListener = this.addEventListener.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  async addEventListener(type: PrivateChannelEventTypes | null, handler: EventHandler): Promise<Listener> {
    let a: RegisterableListener;
    switch (type) {
      case 'addContextListener':
        a = new PrivateChannelAddContextEventListener(this.messaging, this.messageExchangeTimeout, this.id, handler);
        break;
      case 'unsubscribe':
        a = new PrivateChannelUnsubscribeEventListener(this.messaging, this.messageExchangeTimeout, this.id, handler);
        break;
      case 'disconnect':
        a = new PrivateChannelDisconnectEventListener(this.messaging, this.messageExchangeTimeout, this.id, handler);
        break;
      case null:
        a = new PrivateChannelNullEventListener(this.messaging, this.messageExchangeTimeout, this.id, handler);
        break;
      default:
        throw new Error('Unsupported event type: ' + type);
    }
    await a.register();
    return a;
  }

  async disconnect(): Promise<void> {
    const msg: PrivateChannelDisconnectRequest = {
      meta: this.messaging.createMeta(),
      payload: {
        channelId: this.id,
      },
      type: 'privateChannelDisconnectRequest',
    };
    await this.messaging.exchange<PrivateChannelDisconnectResponse>(
      msg,
      'privateChannelDisconnectResponse',
      this.messageExchangeTimeout
    );
  }

  async addContextListenerInner(contextType: string | null, theHandler: ContextHandler): Promise<Listener> {
    const listener = new DefaultContextListener(
      this.messaging,
      this.messageExchangeTimeout,
      this.id,
      contextType,
      theHandler
    );
    await listener.register();
    return listener;
  }
}
