import { ContextHandler, DisplayMetadata, Listener, Channel } from '@kite9/fdc3-standard';
import { Context } from '@kite9/fdc3-context';
import { Messaging } from '../Messaging';
import { DefaultContextListener } from '../listeners/DefaultContextListener';
import {
  BroadcastRequest,
  BroadcastResponse,
  GetCurrentContextRequest,
  GetCurrentContextResponse,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';

export class DefaultChannel implements Channel {
  readonly messaging: Messaging;
  readonly id: string;
  readonly type: 'user' | 'app' | 'private';
  readonly displayMetadata?: DisplayMetadata | undefined;

  constructor(messaging: Messaging, id: string, type: 'user' | 'app' | 'private', displayMetadata?: DisplayMetadata) {
    this.messaging = messaging;
    this.id = id;
    this.type = type;
    this.displayMetadata = displayMetadata;
  }

  async broadcast(context: Context): Promise<void> {
    const done = await this.messaging.exchange<BroadcastResponse>(
      {
        meta: this.messaging.createMeta(),
        payload: {
          channelId: this.id,
          context,
        },
        type: 'broadcastRequest',
      } as BroadcastRequest,
      'broadcastResponse'
    );
    console.log('broadcast done', done);
  }

  async getCurrentContext(contextType?: string | undefined): Promise<Context | null> {
    // first, ensure channel state is up-to-date
    const response = await this.messaging.exchange<GetCurrentContextResponse>(
      {
        meta: this.messaging.createMeta(),
        payload: {
          channelId: this.id,
          contextType: contextType ?? null,
        },
        type: 'getCurrentContextRequest',
      } as GetCurrentContextRequest,
      'getCurrentContextResponse'
    );

    return response.payload.context ?? null;
  }

  async addContextListener(
    contextTypeOrHandler: string | null | ContextHandler,
    handler?: ContextHandler
  ): Promise<Listener> {
    let theContextType: string | null;
    let theHandler: ContextHandler;

    if (contextTypeOrHandler == null && handler) {
      theContextType = null;
      theHandler = handler;
    } else if (typeof contextTypeOrHandler === 'string' && handler) {
      theContextType = contextTypeOrHandler;
      theHandler = handler;
    } else if (contextTypeOrHandler) {
      // deprecated one-arg version
      theContextType = null;
      theHandler = contextTypeOrHandler as ContextHandler;
    } else {
      //invalid call
      throw new Error('Invalid arguments passed to addContextListener!');
    }

    return await this.addContextListenerInner(theContextType, theHandler);
  }

  async addContextListenerInner(contextType: string | null, theHandler: ContextHandler): Promise<Listener> {
    const listener = new DefaultContextListener(this.messaging, this.id, contextType, theHandler);
    await listener.register();
    return listener;
  }
}
