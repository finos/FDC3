import {
  ContextHandler,
  ContextWithMetadata,
  DisplayMetadata,
  Listener,
  Channel,
  ChannelEventTypes,
  EventHandler,
  AppProvidableContextMetadata,
  ChannelError,
} from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { Messaging } from '../Messaging.js';
import { DefaultContextListener } from '../listeners/DefaultContextListener.js';
import {
  BroadcastRequest,
  BroadcastResponse,
  ClearContextRequest,
  ClearContextResponse,
  GetCurrentContextRequest,
  GetCurrentContextResponse,
} from '@finos/fdc3-schema/generated/api/BrowserTypes.js';
import { RegisterableListener } from '../listeners/RegisterableListener.js';
import { EventListener } from '../listeners/EventListener.js';

function parseCurrentContextResponse(response: GetCurrentContextResponse): ContextWithMetadata | null {
  const { context, metadata } = response.payload;

  if (context === null) {
    if (metadata !== null) {
      throw new Error(ChannelError.MalformedContext);
    }
    return null;
  }

  if (context === undefined || metadata == null) {
    throw new Error(ChannelError.MalformedContext);
  }

  return { context, metadata };
}

export class DefaultChannel implements Channel {
  protected readonly messaging: Messaging;
  protected readonly messageExchangeTimeout;
  readonly id: string;
  readonly type: 'user' | 'app' | 'private';
  readonly displayMetadata?: DisplayMetadata | undefined;

  constructor(
    messaging: Messaging,
    messageExchangeTimeout: number,
    id: string,
    type: 'user' | 'app' | 'private',
    displayMetadata?: DisplayMetadata
  ) {
    this.messaging = messaging;
    this.messageExchangeTimeout = messageExchangeTimeout;
    this.id = id;
    this.type = type;
    this.displayMetadata = displayMetadata;

    //bind all functions to allow destructuring
    this.broadcast = this.broadcast.bind(this);
    this.getCurrentContext = this.getCurrentContext.bind(this);
    this.addContextListener = this.addContextListener.bind(this);
    this.addEventListener = this.addEventListener.bind(this);
  }

  async broadcast(context: Context, metadata?: AppProvidableContextMetadata): Promise<void> {
    if (!context || typeof context.type !== 'string') {
      throw new Error(ChannelError.MalformedContext);
    }

    const request: BroadcastRequest = {
      meta: this.messaging.createMeta(),
      payload: {
        channelId: this.id,
        context,
        // Only include app-provided metadata on the wire when the app supplied it; omit the
        // field entirely otherwise (rather than sending an empty object).
        ...(metadata && { metadata }),
      },
      type: 'broadcastRequest',
    };
    await this.messaging.exchange<BroadcastResponse>(request, 'broadcastResponse', this.messageExchangeTimeout);
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
    const response = await this.messaging.exchange<GetCurrentContextResponse>(
      request,
      'getCurrentContextResponse',
      this.messageExchangeTimeout
    );

    return parseCurrentContextResponse(response)?.context ?? null;
  }

  /**
   * Retrieves the current context along with its metadata.
   * Used by the proxy to deliver metadata to context listeners when replaying
   * context after a channel change.
   */
  async getCurrentContextWithMetadata(contextType?: string): Promise<ContextWithMetadata | null> {
    const request: GetCurrentContextRequest = {
      meta: this.messaging.createMeta(),
      payload: {
        channelId: this.id,
        contextType: contextType ?? null,
      },
      type: 'getCurrentContextRequest',
    };
    const response = await this.messaging.exchange<GetCurrentContextResponse>(
      request,
      'getCurrentContextResponse',
      this.messageExchangeTimeout
    );

    return parseCurrentContextResponse(response);
  }

  addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener>;
  addContextListener(contextTypes: string[], handler: ContextHandler): Promise<Listener>;
  async addContextListener(typeOrTypes: string | string[] | null, handler: ContextHandler): Promise<Listener> {
    if (typeof handler !== 'function') {
      throw new Error(ChannelError.InvalidArguments);
    }

    if (Array.isArray(typeOrTypes)) {
      if (typeOrTypes.length === 0) {
        throw new Error(ChannelError.InvalidArguments);
      }
      // If any null present in array, treat as unfiltered (null) - same as DesktopAgentProxy
      if ((typeOrTypes as (string | null)[]).some(t => t == null)) {
        return await this.addContextListenerInner(null, handler);
      }
      return await this.addContextListenerInner(typeOrTypes, handler);
    }

    if (typeof typeOrTypes === 'string' || typeOrTypes === null) {
      return await this.addContextListenerInner(typeOrTypes as string | null, handler);
    }

    throw new Error(ChannelError.InvalidArguments);
  }

  async addContextListenerInner(contextType: string | string[] | null, theHandler: ContextHandler): Promise<Listener> {
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

  async clearContext(contextType?: string): Promise<void> {
    // first, ensure channel state is up-to-date
    const request: ClearContextRequest = {
      meta: this.messaging.createMeta(),
      payload: {
        channelId: this.id,
        contextType: contextType ?? null,
      },
      type: 'clearContextRequest',
    };
    await this.messaging.exchange<ClearContextResponse>(request, 'clearContextResponse', this.messageExchangeTimeout);
  }

  async addEventListener(type: ChannelEventTypes | null, handler: EventHandler): Promise<Listener> {
    let listener: RegisterableListener;
    switch (type) {
      case 'contextCleared':
        listener = new EventListener(this.messaging, this.messageExchangeTimeout, 'contextCleared', this.id, handler);
        break;
      case null:
        listener = new EventListener(this.messaging, this.messageExchangeTimeout, type, this.id, handler);
        break;
      default:
        throw new Error(ChannelError.InvalidArguments);
    }
    await listener.register();
    return listener;
  }
}
