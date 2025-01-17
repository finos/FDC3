import { ContextHandler, DisplayMetadata, Listener, Channel } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { Messaging } from '../Messaging';
import { DefaultContextListener } from '../listeners/DefaultContextListener';
import {
  BroadcastRequest,
  BroadcastResponse,
  GetCurrentContextRequest,
  GetCurrentContextResponse,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';

export class DefaultChannel implements Channel {
  protected readonly messaging: Messaging;
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
    const request: BroadcastRequest = {
      meta: this.messaging.createMeta(),
      payload: {
        channelId: this.id,
        context,
      },
      type: 'broadcastRequest',
    };
    await this.messaging.exchange<BroadcastResponse>(request, 'broadcastResponse');
  }

  async getCurrentContext(contextType?: string | undefined): Promise<Context | null> {
    // first, ensure channel state is up-to-date
    const request: GetCurrentContextRequest = {
      meta: this.messaging.createMeta(),
      payload: {
        channelId: this.id,
        contextType: contextType ?? null,
      },
      type: 'getCurrentContextRequest',
    };
    const response = await this.messaging.exchange<GetCurrentContextResponse>(request, 'getCurrentContextResponse');

    return response.payload.context ?? null;
  }

  async addContextListener(
    contextTypeOrHandler: string | null | ContextHandler,
    handler?: ContextHandler
  ): Promise<Listener> {
    let theContextType: string | null;
    let theHandler: ContextHandler;

    if (contextTypeOrHandler == null && typeof handler === 'function') {
      theContextType = null;
      theHandler = handler;
    } else if (typeof contextTypeOrHandler === 'string' && typeof handler === 'function') {
      theContextType = contextTypeOrHandler;
      theHandler = handler;
    } else if (typeof contextTypeOrHandler === 'function') {
      // deprecated one-arg version
      theContextType = null;
      theHandler = contextTypeOrHandler as ContextHandler;
    } else {
      //invalid call
      // TODO: Replace with Standardized error when #1490 is resolved
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
