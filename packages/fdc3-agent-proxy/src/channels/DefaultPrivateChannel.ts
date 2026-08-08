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
    this.disconnect = this.disconnect.bind(this);
  }

  async addEventListener(type: PrivateChannelEventTypes | null, handler: EventHandler): Promise<Listener> {
    if (type === 'contextCleared') {
      return super.addEventListener(type, handler);
    }

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
        return this.addAllEventListener(handler);
      default:
        throw new Error('Unsupported event type: ' + type);
    }
    await a.register();
    return a;
  }

  private async addAllEventListener(handler: EventHandler): Promise<Listener> {
    const channelListener = await super.addEventListener('contextCleared', handler);
    const privateChannelListener = new PrivateChannelNullEventListener(
      this.messaging,
      this.messageExchangeTimeout,
      this.id,
      handler
    );

    try {
      await privateChannelListener.register();
    } catch (error) {
      await channelListener.unsubscribe();
      throw error;
    }

    return {
      unsubscribe: async () => {
        await Promise.all([channelListener.unsubscribe(), privateChannelListener.unsubscribe()]);
      },
    };
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
