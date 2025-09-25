import {
  Channel,
  ContextHandler,
  Listener,
  PrivateChannel,
  ChannelSelector,
  EventHandler,
  ChannelError,
  ApiEvent,
  FDC3ChannelChangedEvent,
  FDC3EventTypes,
} from '@finos/fdc3-standard';
import { Messaging } from '../Messaging.js';
import { ChannelSupport } from './ChannelSupport.js';
import { DefaultPrivateChannel } from './DefaultPrivateChannel.js';
import { DefaultChannel } from './DefaultChannel.js';
import { DefaultContextListener } from '../listeners/DefaultContextListener.js';
import { UserChannelContextListener } from '../listeners/UserChannelContextListener.js';
import { DesktopAgentEventListener } from '../listeners/DesktopAgentEventListener.js';
import {
  GetCurrentChannelResponse,
  GetCurrentChannelRequest,
  GetUserChannelsResponse,
  GetUserChannelsRequest,
  GetOrCreateChannelResponse,
  GetOrCreateChannelRequest,
  CreatePrivateChannelResponse,
  CreatePrivateChannelRequest,
  LeaveCurrentChannelResponse,
  LeaveCurrentChannelRequest,
  JoinUserChannelResponse,
  JoinUserChannelRequest,
  BroadcastEvent,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { throwIfUndefined } from '../util/throwIfUndefined.js';
import { Logger } from '../util/Logger.js';

export class DefaultChannelSupport implements ChannelSupport {
  readonly messaging: Messaging;
  readonly channelSelector: ChannelSelector;
  readonly messageExchangeTimeout: number;
  protected userChannels: Channel[] | null = null;
  protected userChannelListeners: UserChannelContextListener[] = [];
  private currentChannel: Channel | null = null;

  constructor(messaging: Messaging, channelSelector: ChannelSelector, messageExchangeTimeout: number) {
    this.messaging = messaging;
    this.channelSelector = channelSelector;
    this.messageExchangeTimeout = messageExchangeTimeout;
    this.channelSelector.setChannelChangeCallback((channelId: string | null) => {
      Logger.debug('Channel selector reports channel changed: ', channelId);
      if (channelId == null) {
        this.leaveUserChannel();
      } else {
        this.joinUserChannel(channelId);
      }
    });

    this.addEventListener(async (e: ApiEvent) => {
      const cce = e as FDC3ChannelChangedEvent;
      const newChannelId = cce.details.currentChannelId;
      Logger.debug('Desktop Agent reports channel changed: ', newChannelId);

      let theChannel: Channel | null = null;

      // if theres a newChannelId, retrieve details of the channel
      if (newChannelId != null) {
        theChannel = (await this.getUserChannelsCached()).find(uc => uc.id == newChannelId) ?? null;
        if (!theChannel) {
          // Channel not found - query user channels in case they have changed for some reason
          Logger.debug('Unknown user channel, querying Desktop Agent for updated user channels: ', newChannelId);
          await this.getUserChannels();
          theChannel = (await this.getUserChannelsCached()).find(uc => uc.id == newChannelId) ?? null;
          if (!theChannel) {
            Logger.warn(
              'Received user channel update with unknown user channel (user channel listeners will not work): ',
              newChannelId
            );
          }
        }
      }

      this.currentChannel = theChannel;
      this.channelSelector.updateChannel(theChannel?.id ?? null, await this.getUserChannelsCached());
    }, 'userChannelChanged');
  }

  async addEventListener(handler: EventHandler, type: FDC3EventTypes | null): Promise<Listener> {
    const listener = new DesktopAgentEventListener(this.messaging, this.messageExchangeTimeout, type, handler);
    await listener.register();
    return listener;
  }

  async getUserChannel(): Promise<Channel | null> {
    const request: GetCurrentChannelRequest = {
      meta: this.messaging.createMeta(),
      type: 'getCurrentChannelRequest',
      payload: {},
    };
    const response = await this.messaging.exchange<GetCurrentChannelResponse>(
      request,
      'getCurrentChannelResponse',
      this.messageExchangeTimeout
    );

    throwIfUndefined(
      response.payload.channel,
      'Invalid response from Desktop Agent to getCurrentChannel (channel should be explicitly null if no channel is set)!',
      response,
      ChannelError.NoChannelFound
    );

    //handle successful responses - errors will already have been thrown by exchange above
    /* istanbul ignore else */
    if (response.payload.channel) {
      return new DefaultChannel(
        this.messaging,
        this.messageExchangeTimeout,
        response.payload.channel.id,
        'user',
        response.payload.channel.displayMetadata
      );
    } else if (response.payload.channel === null) {
      //this is a valid response if no channel is set
      return null;
    } else {
      //Should not reach here as we will throw in exchange or throwIfNotFound
      return null;
    }
  }

  async getUserChannelsCached(): Promise<Channel[]> {
    if (this.userChannels) {
      return this.userChannels;
    } else {
      this.userChannels = await this.getUserChannels();
      return this.userChannels;
    }
  }

  async getUserChannels(): Promise<Channel[]> {
    const request: GetUserChannelsRequest = {
      meta: this.messaging.createMeta(),
      type: 'getUserChannelsRequest',
      payload: {},
    };
    const response = await this.messaging.exchange<GetUserChannelsResponse>(
      request,
      'getUserChannelsResponse',
      this.messageExchangeTimeout
    );

    //handle successful responses
    const channels = response.payload.userChannels!;
    this.userChannels = channels.map(
      c => new DefaultChannel(this.messaging, this.messageExchangeTimeout, c.id, 'user', c.displayMetadata)
    );
    return this.userChannels;
  }

  async getOrCreate(id: string): Promise<Channel> {
    const request: GetOrCreateChannelRequest = {
      meta: this.messaging.createMeta(),
      type: 'getOrCreateChannelRequest',
      payload: {
        channelId: id,
      },
    };
    const response = await this.messaging.exchange<GetOrCreateChannelResponse>(
      request,
      'getOrCreateChannelResponse',
      this.messageExchangeTimeout
    );

    throwIfUndefined(
      response.payload.channel,
      'Invalid response from Desktop Agent to getOrCreate!',
      response,
      ChannelError.CreationFailed
    );

    const out = new DefaultChannel(
      this.messaging,
      this.messageExchangeTimeout,
      id,
      'app',
      response.payload.channel!.displayMetadata
    );
    return out;
  }

  async createPrivateChannel(): Promise<PrivateChannel> {
    const request: CreatePrivateChannelRequest = {
      meta: this.messaging.createMeta(),
      type: 'createPrivateChannelRequest',
      payload: {},
    };
    const response = await this.messaging.exchange<CreatePrivateChannelResponse>(
      request,
      'createPrivateChannelResponse',
      this.messageExchangeTimeout
    );

    throwIfUndefined(
      response.payload.privateChannel,
      'Invalid response from Desktop Agent to createPrivateChannel!',
      response,
      ChannelError.CreationFailed
    );

    return new DefaultPrivateChannel(this.messaging, this.messageExchangeTimeout, response.payload.privateChannel!.id);
  }

  async leaveUserChannel(): Promise<void> {
    const request: LeaveCurrentChannelRequest = {
      meta: this.messaging.createMeta(),
      type: 'leaveCurrentChannelRequest',
      payload: {},
    };
    await this.messaging.exchange<LeaveCurrentChannelResponse>(
      request,
      'leaveCurrentChannelResponse',
      this.messageExchangeTimeout
    );
    this.currentChannel = null;
    this.channelSelector.updateChannel(null, await this.getUserChannelsCached());
  }

  async joinUserChannel(id: string) {
    const request: JoinUserChannelRequest = {
      meta: this.messaging.createMeta(),
      type: 'joinUserChannelRequest',
      payload: {
        channelId: id,
      },
    };
    await this.messaging.exchange<JoinUserChannelResponse>(
      request,
      'joinUserChannelResponse',
      this.messageExchangeTimeout
    );

    const userChannels = await this.getUserChannelsCached();
    this.currentChannel = userChannels.find(c => c.id == id) ?? null;
    if (this.currentChannel == null) {
      throw new Error(ChannelError.NoChannelFound);
    }
    this.channelSelector.updateChannel(id, userChannels);
    for (const l of this.userChannelListeners) {
      await l.changeChannel();
    }
  }

  async addContextListener(handler: ContextHandler, type: string | null): Promise<Listener> {
    /**
     *  Utility class used to wrap the DefaultContextListener to match the internal channel id
     *  and ensure it gets removed when its unsubscribe function is called.
     */
    class UnsubscribingDefaultContextListener extends DefaultContextListener implements UserChannelContextListener {
      container: DefaultChannelSupport;

      constructor(
        container: DefaultChannelSupport,
        messaging: Messaging,
        messageExchangeTimeout: number,
        contextType: string | null,
        handler: ContextHandler,
        messageType: string = 'broadcastEvent'
      ) {
        super(messaging, messageExchangeTimeout, null, contextType, handler, messageType);
        this.container = container;
      }

      async unsubscribe(): Promise<void> {
        super.unsubscribe();
        this.container.userChannelListeners = this.container.userChannelListeners.filter(l => l != this);
      }

      async register(): Promise<void> {
        await super.register();
        await this.changeChannel();
      }

      async changeChannel(): Promise<void> {
        if (this.container.currentChannel != null) {
          const context = await this.container.currentChannel?.getCurrentContext(this.contextType ?? undefined);
          if (context) {
            this.handler(context);
          }
        }
      }

      onAMatchingChannel(m: BroadcastEvent): boolean {
        return this.container.currentChannel != null && m.payload.channelId == this.container.currentChannel.id;
      }

      openBroadcastEvent(m: BroadcastEvent): boolean {
        return m.payload.channelId == null;
      }

      filter(m: BroadcastEvent): boolean {
        return (
          m.type == this.messageType &&
          (this.onAMatchingChannel(m) || this.openBroadcastEvent(m)) &&
          (m.payload.context?.type == this.contextType || this.contextType == null)
        );
      }
    }

    const listener = new UnsubscribingDefaultContextListener(
      this,
      this.messaging,
      this.messageExchangeTimeout,
      type,
      handler
    );
    this.userChannelListeners.push(listener);
    await listener.register();
    return listener;
  }
}
