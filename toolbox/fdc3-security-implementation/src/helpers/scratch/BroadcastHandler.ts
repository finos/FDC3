import { ChannelError, DesktopAgent, PrivateChannelEventTypes } from '@finos/fdc3-standard';
import {
  AddContextListenerRequest,
  AgentResponseMessage,
  AppRequestMessage,
  BroadcastRequest,
  ContextListenerUnsubscribeRequest,
  CreatePrivateChannelRequest,
  GetCurrentChannelRequest,
  GetCurrentContextRequest,
  GetOrCreateChannelRequest,
  GetUserChannelsRequest,
  JoinUserChannelRequest,
  LeaveCurrentChannelRequest,
  PrivateChannelAddEventListenerRequest,
  PrivateChannelDisconnectRequest,
  PrivateChannelUnsubscribeEventListenerRequest,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';
import { AbstractHandler } from './AbstractHandler';
import {
  ContextListenerRegistration,
  PrivateChannelEventListener,
  PrivateChannelEvents,
  ServerContext,
} from './ServerContext';
import { FullAppIdentifier } from './MessageHandler';
import { EventListener } from '@finos/fdc3-agent-proxy/src/listeners/EventListener';

export class BroadcastHandler extends AbstractHandler {
  constructor(da: DesktopAgent) {
    super(da);
  }

  shutdown(): void {}

  async accept(msg: AppRequestMessage) {
    try {
      switch (msg.type as string | null) {
        // app channels registration
        case 'getOrCreateChannelRequest':
          return this.handleGetOrCreateRequest(msg as GetOrCreateChannelRequest);
        // user channel management
        case 'getUserChannelsRequest':
          return this.handleGetUserChannelsRequest(msg as GetUserChannelsRequest);
        case 'leaveCurrentChannelRequest':
          return this.handleLeaveCurrentChannelRequest(msg as LeaveCurrentChannelRequest);
        case 'joinUserChannelRequest':
          return this.handleJoinUserChannelRequest(msg as JoinUserChannelRequest);
        case 'getCurrentChannelRequest':
          return this.handleGetCurrentChannelRequest(msg as GetCurrentChannelRequest);

        // general broadcast
        case 'broadcastRequest':
          return this.handleBroadcastRequest(msg as BroadcastRequest);

        // context listeners
        case 'addContextListenerRequest':
          return this.handleAddContextListenerRequest(msg as AddContextListenerRequest);
        case 'contextListenerUnsubscribeRequest':
          return this.handleContextListenerUnsubscribeRequest(msg as ContextListenerUnsubscribeRequest);

        // private channels create/disconnect
        case 'createPrivateChannelRequest':
          return this.handleCreatePrivateChannelRequest(msg as CreatePrivateChannelRequest);
        case 'privateChannelDisconnectRequest':
          return this.handlePrivateChannelDisconnectRequest(msg as PrivateChannelDisconnectRequest);

        // private channel event listeners
        case 'privateChannelAddEventListenerRequest':
          return this.handlePrivateChannelAddEventListenerRequest(msg as PrivateChannelAddEventListenerRequest);
        case 'privateChannelUnsubscribeEventListenerRequest':
          return this.handlePrivateChannelUnsubscribeEventListenerRequest(
            msg as PrivateChannelUnsubscribeEventListenerRequest
          );

        // handling state synchronization of channels
        case 'getCurrentContextRequest':
          return this.handleGetCurrentContextRequest(msg as GetCurrentContextRequest);
      }
    } catch (e) {
      const responseType = msg.type.replace(new RegExp('Request$'), 'Response');
      this.errorResponse(msg, (e as Error).message ?? e, responseType as AgentResponseMessage['type']);
    }
  }

  async handleCreatePrivateChannelRequest(arg0: CreatePrivateChannelRequest) {
    try {
      const privateChannel = await this.da.createPrivateChannel();
      const id = privateChannel.id;

      this.successResponse(arg0, { privateChannel: { id, type: 'private' } }, 'createPrivateChannelResponse');
    } catch (error) {
      this.errorResponse(arg0, (error as Error).message, 'createPrivateChannelResponse');
    }
  }

  async handleGetCurrentContextRequest(arg0: GetCurrentContextRequest) {
    try {
      const channel = await this.da.getCurrentChannel();

      if (channel) {
        const currentContext = channel?.getCurrentContext(arg0?.payload?.contextType ?? undefined);
        this.successResponse(arg0, { context: currentContext }, 'getCurrentContextResponse');
      } else {
        this.errorResponse(arg0, ChannelError.NoChannelFound, 'getCurrentContextResponse');
      }
    } catch (error) {
      this.errorResponse(arg0, (error as Error).message, 'getCurrentContextResponse');
    }
  }

  async handlePrivateChannelUnsubscribeEventListenerRequest(arg0: PrivateChannelUnsubscribeEventListenerRequest) {
    try {
      const el: EventListener;
      el.unsubscribe();
      const el = this.da.getPrivateChannelEventListeners();
      const i = el.findIndex(r => r.listenerUuid == arg0.payload.listenerUUID);
      if (i > -1) {
        this.da.unregisterPrivateChannelEventListener(arg0.payload.listenerUUID);
        this.successResponse(arg0, {}, 'privateChannelUnsubscribeEventListenerResponse');
      } else {
        this.errorResponse(arg0, 'ListenerNotFound', 'privateChannelUnsubscribeEventListenerResponse');
      }
    } catch (error) {
      this.errorResponse(arg0, (error as Error).message, 'privateChannelUnsubscribeEventListenerResponse');
    }
  }

  async handlePrivateChannelDisconnectRequest(arg0: PrivateChannelDisconnectRequest) {
    try {
      const toUnsubscribe = this.da.getContextListeners().filter(r => r.channelId == arg0.payload.channelId);

      toUnsubscribe.forEach(u => {
        this.invokePrivateChannelEventListeners(
          arg0.payload.channelId,
          'unsubscribe',
          'privateChannelOnUnsubscribeEvent',
          u.contextType ?? undefined
        );
      });

      const cl = this.da.getContextListeners().filter(r => !toUnsubscribe.includes(r));
      cl.forEach(item => this.da.unregisterContextListener(item.listenerUuid));

      this.invokePrivateChannelEventListeners(arg0.payload.channelId, 'disconnect', 'privateChannelOnDisconnectEvent');
      this.successResponse(arg0, {}, 'privateChannelDisconnectResponse');
    } catch (error) {
      this.errorResponse(arg0, (error as Error).message, 'privateChannelDisconnectResponse');
    }
  }

  async handleContextListenerUnsubscribeRequest(arg0: ContextListenerUnsubscribeRequest) {
    try {
      const cl = this.da.getContextListeners();
      const i = cl.findIndex(r => r.listenerUuid == arg0.payload.listenerUUID);

      if (i > -1) {
        const rl = cl[i];
        const channel = this.da.getChannelById(rl.channelId);
        this.invokePrivateChannelEventListeners(
          channel?.id ?? null,
          'unsubscribe',
          'privateChannelOnUnsubscribeEvent',
          rl.contextType ?? undefined
        );
        this.da.unregisterContextListener(rl.listenerUuid);
        this.successResponse(arg0, {}, 'contextListenerUnsubscribeResponse');
      } else {
        this.errorResponse(arg0, 'ListenerNotFound', 'contextListenerUnsubscribeResponse');
      }
    } catch (error) {
      this.errorResponse(arg0, (error as Error).message, 'contextListenerUnsubscribeResponse');
    }
  }

  async handleAddContextListenerRequest(arg0: AddContextListenerRequest) {
    try {
      let channelId = null;
      let channelType = 'user';

      if (arg0.payload?.channelId) {
        const channel = this.da.getChannelById(arg0.payload?.channelId);
        channelType = channel?.type ?? 'user';

        if (channel == null) {
          this.errorResponse(arg0, ChannelError.NoChannelFound, 'addContextListenerResponse');
          return;
        } else {
          channelId = channel.id;
        }
      }

      const info = await this.da.getInfo();

      const lr: ContextListenerRegistration = {
        channelId: channelId,
        listenerUuid: 'listener-' + Math.random().toString(36).substr(2, 9),
        contextType: arg0.payload.contextType,
        userChannelListener: channelType == 'user',
        appId: info.appMetadata.appId,
        instanceId: info.appMetadata.instanceId!,
      };

      this.da.registerContextListener(lr);
      this.invokePrivateChannelEventListeners(
        channelId,
        'addContextListener',
        'privateChannelOnAddContextListenerEvent',
        arg0.payload.contextType ?? undefined
      );
      this.successResponse(arg0, { listenerUUID: lr.listenerUuid }, 'addContextListenerResponse');
    } catch (error) {
      this.errorResponse(arg0, (error as Error).message, 'addContextListenerResponse');
    }
  }

  async handleBroadcastRequest(arg0: BroadcastRequest) {
    try {
      // Delegate to DesktopAgent
      await this.da.broadcast(arg0.payload.context);

      const matchingListeners = this.da
        .getContextListeners()
        .filter(r => r.channelId == arg0.payload.channelId)
        .filter(r => r.contextType == null || r.contextType == arg0.payload.context.type);

      const matchingApps: FullAppIdentifier[] = matchingListeners
        .map(r => {
          return { appId: r.appId, instanceId: r.instanceId };
        })
        .filter(this.onlyUnique);

      matchingApps.forEach(app => {
        this.da.post(
          {
            meta: {
              eventUuid: this.createUUID(),
              timestamp: new Date(),
            },
            type: 'broadcastEvent',
            payload: {
              channelId: arg0.payload.channelId,
              context: arg0.payload.context,
            },
          },
          app.instanceId
        );
      });
      this.da.updateChannelContext(arg0.payload.channelId, arg0.payload.context);
      this.successResponse(arg0, {}, 'broadcastResponse');
    } catch (error) {
      this.errorResponse(arg0, (error as Error).message, 'broadcastResponse');
    }
  }

  async handleGetCurrentChannelRequest(arg0: GetCurrentChannelRequest) {
    try {
      // Delegate to DesktopAgent
      const currentChannel = await this.da.getCurrentChannel();

      if (currentChannel) {
        this.successResponse(
          arg0,
          {
            channel: {
              id: currentChannel.id,
              type: 'user',
              displayMetadata: currentChannel.displayMetadata,
            },
          },
          'getCurrentChannelResponse'
        );
      } else {
        this.successResponse(arg0, { channel: null }, 'getCurrentChannelResponse');
      }
    } catch (error) {
      this.errorResponse(arg0, (error as Error).message, 'getCurrentChannelResponse');
    }
  }

  async handleJoinUserChannelRequest(arg0: JoinUserChannelRequest) {
    try {
      // check it's a user channel
      const newChannel = this.da.getChannelById(arg0.payload.channelId);
      if (newChannel == null || newChannel.type != 'user') {
        return this.errorResponse(arg0, ChannelError.NoChannelFound, 'joinUserChannelResponse');
      }

      // Delegate to DesktopAgent
      await this.da.joinUserChannel(arg0.payload.channelId);
      this.successResponse(arg0, {}, 'joinUserChannelResponse');
    } catch (error) {
      this.errorResponse(arg0, (error as Error).message, 'joinUserChannelResponse');
    }
  }

  async handleLeaveCurrentChannelRequest(arg0: LeaveCurrentChannelRequest) {
    try {
      // Delegate to DesktopAgent
      await this.da.leaveCurrentChannel();
      this.successResponse(arg0, {}, 'leaveCurrentChannelResponse');
    } catch (error) {
      this.errorResponse(arg0, (error as Error).message, 'leaveCurrentChannelResponse');
    }
  }

  async handleGetOrCreateRequest(arg0: GetOrCreateChannelRequest) {
    try {
      const id = arg0.payload.channelId;
      let channel = await this.da.getOrCreateChannel(id);
      if (channel) {
        if (channel.type != 'app') {
          this.errorResponse(arg0, ChannelError.AccessDenied, 'getOrCreateChannelResponse');
          return;
        }
      }

      this.successResponse(arg0, { channel: { id: channel.id, type: channel.type } }, 'getOrCreateChannelResponse');
    } catch (error) {
      this.errorResponse(arg0, (error as Error).message, 'getOrCreateChannelResponse');
    }
  }

  async handleGetUserChannelsRequest(arg0: GetUserChannelsRequest) {
    try {
      // Delegate to DesktopAgent
      const userChannels = await this.da.getUserChannels();

      this.successResponse(
        arg0,
        {
          userChannels: userChannels.map(c => ({
            id: c.id,
            type: 'user',
            displayMetadata: c.displayMetadata,
          })),
        },
        'getUserChannelsResponse'
      );
    } catch (error) {
      this.errorResponse(arg0, (error as Error).message, 'getUserChannelsResponse');
    }
  }

  async handlePrivateChannelAddEventListenerRequest(arg0: PrivateChannelAddEventListenerRequest) {
    try {
      const channel = this.da.getChannelById(arg0.payload.privateChannelId);

      if (channel == null || channel.type != 'private') {
        this.errorResponse(arg0, ChannelError.NoChannelFound, 'privateChannelAddEventListenerResponse');
      } else {
        const el = {
          channelId: arg0.payload.privateChannelId,
          eventType: arg0.payload.listenerType,
          listenerUuid: 'listener-' + Math.random().toString(36).substr(2, 9),
        } as PrivateChannelEventListener;
        this.da.registerPrivateChannelEventListener(el);
        this.successResponse(arg0, { listenerUUID: el.listenerUuid }, 'privateChannelAddEventListenerResponse');
      }
    } catch (error) {
      this.errorResponse(arg0, (error as Error).message, 'privateChannelAddEventListenerResponse');
    }
  }

  invokePrivateChannelEventListeners(
    privateChannelId: string | null,
    eventType: PrivateChannelEventTypes,
    messageType:
      | 'privateChannelOnAddContextListenerEvent'
      | 'privateChannelOnUnsubscribeEvent'
      | 'privateChannelOnDisconnectEvent',
    contextType?: string
  ) {
    if (privateChannelId) {
      const msg: PrivateChannelEvents = {
        type: messageType,
        meta: {
          eventUuid: 'event-' + Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
        },
        payload: {
          privateChannelId,
          contextType: contextType,
        },
      } as PrivateChannelEvents; //Typescript doesn't like comparing an object with a union property (messageType) with a union of object types

      console.log('invokePrivateChannelEventListeners msg: ', msg);
      this.da
        .getPrivateChannelEventListeners()
        .filter(
          listener =>
            listener.channelId == privateChannelId && (listener.eventType == eventType || listener.eventType == null)
        )
        .forEach(e => {
          console.log(`invokePrivateChannelEventListeners: posting to instance ${e.instanceId}`);
          this.da.post(msg, e.instanceId);
        });
    }
  }
}
