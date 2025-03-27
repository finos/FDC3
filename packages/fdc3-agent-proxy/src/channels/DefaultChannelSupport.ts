import {
  Channel,
  ContextHandler,
  Listener,
  PrivateChannel,
  ChannelSelector,
  EventHandler,
  ChannelError,
  ApiEvent,
} from '@finos/fdc3-standard';
import { Messaging } from '../Messaging';
import { ChannelSupport } from './ChannelSupport';
import { DefaultPrivateChannel } from './DefaultPrivateChannel';
import { DefaultChannel } from './DefaultChannel';
import { DefaultContextListener } from '../listeners/DefaultContextListener';
import { UserChannelContextListener } from '../listeners/UserChannelContextListener';
import { EventListener } from '../listeners/EventListener';
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
  ChannelChangedEvent,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';
import { throwIfUndefined } from '../util/throwIfUndefined';
import { Logger } from '../util/Logger';

export class DefaultChannelSupport implements ChannelSupport {
  readonly messaging: Messaging;
  readonly channelSelector: ChannelSelector;
  readonly messageExchangeTimeout: number;
  protected userChannels: Channel[] = [];
  protected userChannelListeners: UserChannelContextListener[] = [];

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

    this.addChannelChangedEventHandler(async (e: ApiEvent) => {
      const cce: ChannelChangedEvent['payload'] = e.details;
      Logger.debug('Desktop Agent reports channel changed: ', cce.newChannelId);

      let theChannel: Channel | null = null;

      // if theres a newChannelId, retrieve details of the channel
      if (cce.newChannelId) {
        theChannel = this.userChannels.find(uc => uc.id == cce.newChannelId) ?? null;
        if (!theChannel) {
          //Channel not found - query user channels in case they have changed for some reason
          Logger.debug('Unknown user channel, querying Desktop Agent for updated user channels: ', cce.newChannelId);
          await this.getUserChannels();
          theChannel = this.userChannels.find(uc => uc.id == cce.newChannelId) ?? null;
          if (!theChannel) {
            Logger.warn(
              'Received user channel update with unknown user channel (user channel listeners will not work): ',
              cce.newChannelId
            );
          }
        }
      }

      this.userChannelListeners.forEach(l => l.changeChannel(theChannel));
      this.channelSelector.updateChannel(theChannel?.id ?? null, this.userChannels);
    });
  }

  async addChannelChangedEventHandler(handler: EventHandler): Promise<Listener> {
    const listener = new EventListener(this.messaging, 'channelChangedEvent', handler);
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
    this.channelSelector.updateChannel(null, this.userChannels);
    for (const l of this.userChannelListeners) {
      await l.changeChannel(null);
    }
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
    this.channelSelector.updateChannel(id, this.userChannels);
    for (const l of this.userChannelListeners) {
      await l.changeChannel(new DefaultChannel(this.messaging, this.messageExchangeTimeout, id, 'user'));
    }
  }

  async addContextListener(handler: ContextHandler, type: string | null): Promise<Listener> {
    /** Utility class used to wrap the DefaultContextListener and ensure it gets removed
     *  when its unsubscribe function is called.
     */
    class UnsubscribingDefaultContextListener extends DefaultContextListener {
      container: DefaultChannelSupport;

      constructor(
        container: DefaultChannelSupport,
        messaging: Messaging,
        messageExchangeTimeout: number,
        channelId: string | null,
        contextType: string | null,
        handler: ContextHandler,
        messageType: string = 'broadcastEvent'
      ) {
        super(messaging, messageExchangeTimeout, channelId, contextType, handler, messageType);
        this.container = container;
      }

      async unsubscribe(): Promise<void> {
        super.unsubscribe();
        this.container.userChannelListeners = this.container.userChannelListeners.filter(l => l != this);
      }
    }

    const currentChannelId = (await this.getUserChannel())?.id ?? null;
    const listener = new UnsubscribingDefaultContextListener(
      this,
      this.messaging,
      this.messageExchangeTimeout,
      currentChannelId,
      type,
      handler
    );
    this.userChannelListeners.push(listener);
    await listener.register();
    return listener;
  }
}
