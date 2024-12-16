import { Channel, ContextHandler, Listener, PrivateChannel, ChannelSelector, EventHandler } from '@kite9/fdc3-standard';
import { Messaging } from '../Messaging';
import { ChannelSupport } from './ChannelSupport';
import { DefaultPrivateChannel } from './DefaultPrivateChannel';
import { DefaultChannel } from './DefaultChannel';
import { DefaultContextListener } from '../listeners/DefaultContextListener';
import { BrowserTypes } from '@kite9/fdc3-schema';
import { FollowingContextListener } from '../listeners/FollowingContextListener';
import { EventListener } from '../listeners/EventListener';

type ChannelDetail = BrowserTypes.Channel;
type GetUserChannelsRequest = BrowserTypes.GetUserChannelsRequest;
type GetUserChannelsResponse = BrowserTypes.GetUserChannelsResponse;
type GetOrCreateChannelResponse = BrowserTypes.GetOrCreateChannelResponse;
type GetOrCreateChannelRequest = BrowserTypes.GetOrCreateChannelRequest;
type CreatePrivateChannelRequest = BrowserTypes.CreatePrivateChannelRequest;
type CreatePrivateChannelResponse = BrowserTypes.CreatePrivateChannelResponse;
type JoinUserChannelResponse = BrowserTypes.JoinUserChannelResponse;
type JoinUserChannelRequest = BrowserTypes.JoinUserChannelRequest;
type GetCurrentChannelResponse = BrowserTypes.GetCurrentChannelResponse;
type GetCurrentChannelRequest = BrowserTypes.GetCurrentChannelRequest;
type LeaveCurrentChannelRequest = BrowserTypes.LeaveCurrentChannelRequest;
type LeaveCurrentChannelResponse = BrowserTypes.LeaveCurrentChannelResponse;

export class DefaultChannelSupport implements ChannelSupport {
  protected userChannels: Channel[] | null = null;
  private followingListeners: FollowingContextListener[] = [];

  constructor(
    private readonly messaging: Messaging,
    private readonly channelSelector: ChannelSelector
  ) {
    this.channelSelector.setChannelChangeCallback((channelId: string | null) => {
      if (channelId == null) {
        this.leaveUserChannel();
      } else {
        this.joinUserChannel(channelId);
      }
    });

    this.addChannelChangedEventHandler(e => {
      this.channelSelector.updateChannel(e.details.newChannelId, this.userChannels ?? []);
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
    const response = await this.messaging.exchange<GetCurrentChannelResponse>(request, 'getCurrentChannelResponse');

    if (response.payload?.channel?.id) {
      return new DefaultChannel(
        this.messaging,
        response.payload.channel.id,
        'user',
        response.payload.channel.displayMetadata
      );
    } else {
      return null;
    }
  }

  async getUserChannels(): Promise<Channel[]> {
    if (!this.userChannels) {
      const request: GetUserChannelsRequest = {
        meta: this.messaging.createMeta(),
        type: 'getUserChannelsRequest',
        payload: {},
      };
      const response = await this.messaging.exchange<GetUserChannelsResponse>(request, 'getUserChannelsResponse');

      const channels: ChannelDetail[] = response.payload.userChannels ?? [];
      this.userChannels = channels.map(c => new DefaultChannel(this.messaging, c.id, 'user', c.displayMetadata));
    }
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
    const response = await this.messaging.exchange<GetOrCreateChannelResponse>(request, 'getOrCreateChannelResponse');

    return new DefaultChannel(this.messaging, id, 'app', response.payload.channel?.displayMetadata!!);
  }

  async createPrivateChannel(): Promise<PrivateChannel> {
    const request: CreatePrivateChannelRequest = {
      meta: this.messaging.createMeta(),
      type: 'createPrivateChannelRequest',
      payload: {},
    };
    const response = await this.messaging.exchange<CreatePrivateChannelResponse>(
      request,
      'createPrivateChannelResponse'
    );

    return new DefaultPrivateChannel(this.messaging, response.payload?.privateChannel?.id!!);
  }

  async leaveUserChannel(): Promise<void> {
    const request: LeaveCurrentChannelRequest = {
      meta: this.messaging.createMeta(),
      type: 'leaveCurrentChannelRequest',
      payload: {},
    };
    await this.messaging.exchange<LeaveCurrentChannelResponse>(request, 'leaveCurrentChannelResponse');

    this.channelSelector.updateChannel(null, this.userChannels ?? []);
    this.followingListeners.forEach(l => l.changeChannel(null));
  }

  async joinUserChannel(id: string) {
    const request: JoinUserChannelRequest = {
      meta: this.messaging.createMeta(),
      type: 'joinUserChannelRequest',
      payload: {
        channelId: id,
      },
    };
    await this.messaging.exchange<JoinUserChannelResponse>(request, 'joinUserChannelResponse');

    this.channelSelector.updateChannel(id, this.userChannels ?? []);

    for (const l of this.followingListeners) {
      await l.changeChannel(new DefaultChannel(this.messaging, id, 'user'));
    }
  }

  async addContextListener(handler: ContextHandler, type: string | null): Promise<Listener> {
    const _container = this;

    class UnsubscribingDefaultContextListener extends DefaultContextListener {
      async unsubscribe(): Promise<void> {
        super.unsubscribe();
        _container.followingListeners = _container.followingListeners.filter(l => l != this);
      }
    }

    const currentChannel = await this.getUserChannel();
    const currentChannelId = currentChannel?.id ?? null;
    const listener = new UnsubscribingDefaultContextListener(this.messaging, currentChannelId, type, handler);
    this.followingListeners.push(listener);
    await listener.register();
    return listener;
  }
}
