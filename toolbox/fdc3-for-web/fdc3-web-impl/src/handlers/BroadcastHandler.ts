import { MessageHandler } from '../BasicFDC3Server.js';
import { AppRegistration, InstanceID, ServerContext } from '../ServerContext.js';
import { AppIdentifier, ChannelError, DisplayMetadata, PrivateChannelEventTypes } from '@finos/fdc3-standard';
import { successResponse, errorResponse, FullAppIdentifier } from './support.js';
import {
  AddContextListenerRequest,
  AddEventListenerRequest,
  AgentResponseMessage,
  AppRequestMessage,
  BroadcastRequest,
  ChannelChangedEvent,
  ContextListenerUnsubscribeRequest,
  CreatePrivateChannelRequest,
  EventListenerUnsubscribeRequest,
  GetCurrentChannelRequest,
  GetCurrentContextRequest,
  GetOrCreateChannelRequest,
  GetUserChannelsRequest,
  JoinUserChannelRequest,
  LeaveCurrentChannelRequest,
  PrivateChannelAddEventListenerRequest,
  PrivateChannelDisconnectRequest,
  PrivateChannelOnAddContextListenerEvent,
  PrivateChannelOnDisconnectEvent,
  PrivateChannelOnUnsubscribeEvent,
  PrivateChannelUnsubscribeEventListenerRequest,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { Context } from '@finos/fdc3-context';

type PrivateChannelEvents =
  | PrivateChannelOnAddContextListenerEvent
  | PrivateChannelOnUnsubscribeEvent
  | PrivateChannelOnDisconnectEvent;

type ContextListenerRegistration = {
  appId: string;
  instanceId: string;
  listenerUuid: string;
  channelId: string | null;
  contextType: string | null;
};

type PrivateChannelEventListener = {
  appId: string;
  instanceId: string;
  channelId: string;
  eventType: PrivateChannelEventTypes | null;
  listenerUuid: string;
};

type DesktopAgentEventListener = {
  appId: string;
  instanceId: string;
  eventType: string | null;
  listenerUuid: string;
};

export enum ChannelType {
  'user',
  'app',
  'private',
}

export type ChannelState = {
  id: string;
  type: ChannelType;
  context: Context[];
  displayMetadata: DisplayMetadata;
};

function onlyUniqueAppIds(value: AppIdentifier, index: number, self: AppIdentifier[]) {
  const fi = self.findIndex(v => v.instanceId === value.instanceId);
  return fi === index;
}

export class BroadcastHandler implements MessageHandler {
  private contextListeners: ContextListenerRegistration[] = [];
  private privateChannelEventListeners: PrivateChannelEventListener[] = [];
  private desktopAgentEventListeners: DesktopAgentEventListener[] = [];
  private readonly state: ChannelState[] = [];
  private readonly currentChannel: { [instanceId: string]: ChannelState } = {};

  constructor(initialChannelState: ChannelState[]) {
    this.state = initialChannelState;
  }

  shutdown(): void {}

  cleanup(instanceId: InstanceID, sc: ServerContext<AppRegistration>): void {
    const toUnsubscribe = this.contextListeners.filter(r => r.instanceId == instanceId);

    //handle privateChannel disconnects
    const privateChannelsToUnsubscribe = toUnsubscribe.filter(
      u => this.state.find(chan => chan.id == u.channelId)?.type == ChannelType.private
    );

    const privateChannelsToDisconnect = new Set<string>();
    privateChannelsToUnsubscribe.forEach(u => {
      this.invokePrivateChannelEventListeners(
        u.channelId,
        'unsubscribe',
        'privateChannelOnUnsubscribeEvent',
        sc,
        u.contextType ?? undefined
      );
      if (u.channelId) {
        privateChannelsToDisconnect.add(u.channelId);
      }
    });

    privateChannelsToDisconnect.forEach(chan => {
      this.invokePrivateChannelEventListeners(chan, 'disconnect', 'privateChannelOnDisconnectEvent', sc);
    });

    //clean up state entries
    this.contextListeners = this.contextListeners.filter(listener => listener.instanceId !== instanceId);
    this.privateChannelEventListeners = this.privateChannelEventListeners.filter(
      listener => listener.instanceId !== instanceId
    );
    this.desktopAgentEventListeners = this.desktopAgentEventListeners.filter(
      listener => listener.instanceId !== instanceId
    );
  }

  getCurrentChannel(from: FullAppIdentifier): ChannelState | null {
    return this.currentChannel[from.instanceId];
  }

  fireChannelChangedEvent(channelId: string | null, sc: ServerContext<AppRegistration>, instanceId: string) {
    const event: ChannelChangedEvent = {
      meta: {
        eventUuid: sc.createUUID(),
        timestamp: new Date(),
      },
      type: 'channelChangedEvent',
      payload: {
        newChannelId: channelId,
      },
    };

    sc.post(event, instanceId);
  }

  getChannelById(id: string | null): ChannelState | null {
    if (id == null) {
      return null;
    }
    return this.state.find(c => c.id == id) ?? null;
  }

  convertChannelTypeToString(type: ChannelType): string {
    switch (type) {
      case ChannelType.app:
        return 'app';
      case ChannelType.user:
        return 'user';
      case ChannelType.private:
        return 'private';
    }
  }

  updateChannelState(channelId: string, context: Context) {
    const cs = this.getChannelById(channelId);
    if (cs) {
      cs.context = cs.context.filter(c => c.type != context.type);
      cs.context.unshift(context);
    }
  }

  async accept(msg: AppRequestMessage, sc: ServerContext<AppRegistration>, uuid: InstanceID) {
    const from = sc.getInstanceDetails(uuid);

    if (from == null) {
      // this handler only deals with connected apps
      return;
    }

    console.log(`BroadcastHandler: accept called with msg: ${JSON.stringify(msg)}`);

    try {
      switch (msg.type as string | null) {
        // app channels registration
        case 'getOrCreateChannelRequest':
          return this.handleGetOrCreateRequest(msg as GetOrCreateChannelRequest, sc, from);

        // user channel management
        case 'getUserChannelsRequest':
          return this.handleGetUserChannelsRequest(msg as GetUserChannelsRequest, sc, from);
        case 'leaveCurrentChannelRequest':
          return this.handleLeaveCurrentChannelRequest(msg as LeaveCurrentChannelRequest, sc, from);
        case 'joinUserChannelRequest':
          return this.handleJoinUserChannelRequest(msg as JoinUserChannelRequest, sc, from);
        case 'getCurrentChannelRequest':
          return this.handleGetCurrentChannelRequest(msg as GetCurrentChannelRequest, sc, from);

        // general broadcast
        case 'broadcastRequest':
          return this.handleBroadcastRequest(msg as BroadcastRequest, sc, from);

        // context listeners
        case 'addContextListenerRequest':
          return this.handleAddContextListenerRequest(msg as AddContextListenerRequest, sc, from);
        case 'contextListenerUnsubscribeRequest':
          return this.handleContextListenerUnsubscribeRequest(msg as ContextListenerUnsubscribeRequest, sc, from);

        // private channels create/disconnect
        case 'createPrivateChannelRequest':
          return this.handleCreatePrivateChannelRequest(msg as CreatePrivateChannelRequest, sc, from);
        case 'privateChannelDisconnectRequest':
          return this.handlePrivateChannelDisconnectRequest(msg as PrivateChannelDisconnectRequest, sc, from);

        // private channel event listeners
        case 'privateChannelAddEventListenerRequest':
          return this.handlePrivateChannelAddEventListenerRequest(
            msg as PrivateChannelAddEventListenerRequest,
            from,
            sc
          );
        case 'privateChannelUnsubscribeEventListenerRequest':
          return this.handlePrivateChannelUnsubscribeEventListenerRequest(
            msg as PrivateChannelUnsubscribeEventListenerRequest,
            sc,
            from
          );

        // handling state synchronization of channels
        case 'getCurrentContextRequest':
          return this.handleGetCurrentContextRequest(msg as GetCurrentContextRequest, sc, from);

        // Handle channel events
        case 'addEventListenerRequest':
          return this.handleAddEventListenerRequest(msg as AddEventListenerRequest, sc, from);
        case 'eventListenerUnsubscribeRequest':
          return this.handleEventListenerUnsubscribeRequest(msg as EventListenerUnsubscribeRequest, sc, from);
      }
    } catch (e) {
      const responseType = msg.type.replace(new RegExp('Request$'), 'Response');
      errorResponse(sc, msg, from, (e as Error).message ?? e, responseType as AgentResponseMessage['type']);
    }
  }

  handleAddEventListenerRequest(
    arg0: AddEventListenerRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ) {
    const lr: DesktopAgentEventListener = {
      appId: from.appId,
      instanceId: from.instanceId ?? 'no-instance-id',
      listenerUuid: sc.createUUID(),
      eventType: arg0.payload.type ?? null,
    };

    this.desktopAgentEventListeners.push(lr);
    successResponse(sc, arg0, from, { listenerUUID: lr.listenerUuid }, 'addEventListenerResponse');
  }

  handleEventListenerUnsubscribeRequest(
    arg0: EventListenerUnsubscribeRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ) {
    const i = this.desktopAgentEventListeners.findIndex(r => r.listenerUuid == arg0.payload.listenerUUID);
    if (i > -1) {
      this.desktopAgentEventListeners.splice(i, 1);
      successResponse(sc, arg0, from, {}, 'eventListenerUnsubscribeResponse');
    } else {
      errorResponse(sc, arg0, from, 'ListenerNotFound', 'eventListenerUnsubscribeResponse');
    }
  }

  handleCreatePrivateChannelRequest(
    arg0: CreatePrivateChannelRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ) {
    const id = sc.createUUID();
    this.state.push({
      id,
      type: ChannelType.private,
      context: [],
      displayMetadata: {},
    });

    successResponse(
      sc,
      arg0,
      from,
      { privateChannel: { id, type: this.convertChannelTypeToString(ChannelType.private) } },
      'createPrivateChannelResponse'
    );
  }

  handleGetCurrentContextRequest(
    arg0: GetCurrentContextRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ) {
    const channel = this.getChannelById(arg0.payload.channelId);
    const type = arg0.payload.contextType;

    if (channel) {
      const context = type ? (channel.context.find(c => c.type == type) ?? null) : (channel.context[0] ?? null);
      successResponse(sc, arg0, from, { context: context }, 'getCurrentContextResponse');
    } else {
      errorResponse(sc, arg0, from, ChannelError.NoChannelFound, 'getCurrentContextResponse');
    }
  }

  handlePrivateChannelUnsubscribeEventListenerRequest(
    arg0: PrivateChannelUnsubscribeEventListenerRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ) {
    const i = this.privateChannelEventListeners.findIndex(r => r.listenerUuid == arg0.payload.listenerUUID);
    if (i > -1) {
      this.privateChannelEventListeners.splice(i, 1);
      successResponse(sc, arg0, from, {}, 'privateChannelUnsubscribeEventListenerResponse');
    } else {
      errorResponse(sc, arg0, from, 'ListenerNotFound', 'privateChannelUnsubscribeEventListenerResponse');
    }
  }

  handlePrivateChannelDisconnectRequest(
    arg0: PrivateChannelDisconnectRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ) {
    const toUnsubscribe = this.contextListeners
      .filter(r => r.appId == from.appId && r.instanceId == from.instanceId)
      .filter(r => r.channelId == arg0.payload.channelId);

    toUnsubscribe.forEach(u => {
      this.invokePrivateChannelEventListeners(
        arg0.payload.channelId,
        'unsubscribe',
        'privateChannelOnUnsubscribeEvent',
        sc,
        u.contextType ?? undefined
      );
    });

    this.contextListeners = this.contextListeners.filter(r => !toUnsubscribe.includes(r));
    this.invokePrivateChannelEventListeners(
      arg0.payload.channelId,
      'disconnect',
      'privateChannelOnDisconnectEvent',
      sc
    );
    successResponse(sc, arg0, from, {}, 'privateChannelDisconnectResponse');
  }

  handleContextListenerUnsubscribeRequest(
    arg0: ContextListenerUnsubscribeRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ) {
    const i = this.contextListeners.findIndex(
      r => r.listenerUuid == arg0.payload.listenerUUID && r.instanceId == from.instanceId
    );

    if (i > -1) {
      const rl = this.contextListeners[i];
      const channel = this.getChannelById(rl.channelId);
      this.invokePrivateChannelEventListeners(
        channel?.id ?? null,
        'unsubscribe',
        'privateChannelOnUnsubscribeEvent',
        sc,
        rl.contextType ?? undefined
      );
      this.contextListeners.splice(i, 1);
      successResponse(sc, arg0, from, {}, 'contextListenerUnsubscribeResponse');
    } else {
      errorResponse(sc, arg0, from, 'ListenerNotFound', 'contextListenerUnsubscribeResponse');
    }
  }

  handleAddContextListenerRequest(
    arg0: AddContextListenerRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ) {
    let channelId = null;

    if (arg0.payload?.channelId) {
      // if channelId is provided, we need to check if it exists
      const channel = this.getChannelById(arg0.payload?.channelId);

      if (channel == null) {
        errorResponse(sc, arg0, from, ChannelError.NoChannelFound, 'addContextListenerResponse');
        return;
      } else {
        channelId = channel.id;
      }
    }

    const lr: ContextListenerRegistration = {
      appId: from.appId,
      instanceId: from.instanceId ?? 'no-instance-id',
      channelId: channelId,
      listenerUuid: sc.createUUID(),
      contextType: arg0.payload.contextType,
    };

    this.contextListeners.push(lr);
    this.invokePrivateChannelEventListeners(
      channelId,
      'addContextListener',
      'privateChannelOnAddContextListenerEvent',
      sc,
      arg0.payload.contextType ?? undefined
    );
    successResponse(sc, arg0, from, { listenerUUID: lr.listenerUuid }, 'addContextListenerResponse');
  }

  handleBroadcastRequest(arg0: BroadcastRequest, sc: ServerContext<AppRegistration>, from: FullAppIdentifier) {
    const matchesExactChannel = (r: ContextListenerRegistration) => {
      return r.channelId == arg0.payload.channelId;
    };

    const matchesUserChannel = (r: ContextListenerRegistration) => {
      const uc = this.currentChannel[r.instanceId];
      const ucId = uc ? uc.id : null;
      return r.channelId == null && ucId == arg0.payload.channelId;
    };

    const matchingListeners = this.contextListeners
      .filter(r => matchesExactChannel(r) || matchesUserChannel(r))
      .filter(r => r.contextType == null || r.contextType == arg0.payload.context.type);

    const matchingApps: FullAppIdentifier[] = matchingListeners
      .map(r => {
        return { appId: r.appId, instanceId: r.instanceId };
      })
      .filter(onlyUniqueAppIds);

    matchingApps.forEach(app => {
      sc.post(
        {
          meta: {
            eventUuid: sc.createUUID(),
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

    this.updateChannelState(arg0.payload.channelId, arg0.payload.context);
    successResponse(sc, arg0, from, {}, 'broadcastResponse');
  }

  handleGetCurrentChannelRequest(
    arg0: GetCurrentChannelRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ) {
    const currentChannel = this.getCurrentChannel(from);
    if (currentChannel) {
      successResponse(
        sc,
        arg0,
        from,
        {
          channel: {
            id: currentChannel.id,
            type: this.convertChannelTypeToString(currentChannel.type),
            displayMetadata: currentChannel.displayMetadata,
          },
        },
        'getCurrentChannelResponse'
      );
    } else {
      successResponse(sc, arg0, from, { channel: null }, 'getCurrentChannelResponse');
    }
  }

  handleJoinUserChannelRequest(
    arg0: JoinUserChannelRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ) {
    // check it's a user channel
    const newChannel = this.getChannelById(arg0.payload.channelId);
    if (newChannel == null || newChannel.type != ChannelType.user) {
      return errorResponse(sc, arg0, from, ChannelError.NoChannelFound, 'joinUserChannelResponse');
    }

    // join it.
    const instanceId = from.instanceId ?? 'no-instance-id';
    this.currentChannel[instanceId] = newChannel;
    this.fireChannelChangedEvent(newChannel?.id, sc, instanceId);
    successResponse(sc, arg0, from, {}, 'joinUserChannelResponse');
  }

  handleLeaveCurrentChannelRequest(
    arg0: LeaveCurrentChannelRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ) {
    const instanceId = from.instanceId ?? 'no-instance-id';
    const currentChannel = this.currentChannel[instanceId];
    if (currentChannel) {
      delete this.currentChannel[instanceId];
    }

    this.fireChannelChangedEvent(null, sc, instanceId);
    successResponse(sc, arg0, from, {}, 'leaveCurrentChannelResponse');
  }

  handleGetOrCreateRequest(
    arg0: GetOrCreateChannelRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ) {
    const id = arg0.payload.channelId;
    let channel = this.getChannelById(id);

    if (!channel) {
      channel = {
        id: id,
        type: ChannelType.app,
        context: [],
        displayMetadata: {},
      };
      this.state.push(channel);
    }

    if (channel.type != ChannelType.app) {
      errorResponse(sc, arg0, from, ChannelError.AccessDenied, 'getOrCreateChannelResponse');
    } else {
      successResponse(
        sc,
        arg0,
        from,
        { channel: { id: channel.id, type: channel.type } },
        'getOrCreateChannelResponse'
      );
    }
  }

  handleGetUserChannelsRequest(
    arg0: GetUserChannelsRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ) {
    const userChannels = this.state.filter(c => c.type == ChannelType.user);
    successResponse(
      sc,
      arg0,
      from,
      {
        userChannels: userChannels.map(c => ({
          id: c.id,
          type: this.convertChannelTypeToString(c.type),
          displayMetadata: c.displayMetadata,
        })),
      },
      'getUserChannelsResponse'
    );
  }

  handlePrivateChannelAddEventListenerRequest(
    arg0: PrivateChannelAddEventListenerRequest,
    from: FullAppIdentifier,
    sc: ServerContext<AppRegistration>
  ) {
    const channel = this.getChannelById(arg0.payload.privateChannelId);

    if (channel == null || channel.type != ChannelType.private) {
      errorResponse(sc, arg0, from, ChannelError.NoChannelFound, 'privateChannelAddEventListenerResponse');
    } else {
      const el = {
        appId: from.appId,
        instanceId: from.instanceId,
        channelId: arg0.payload.privateChannelId,
        eventType: arg0.payload.listenerType,
        listenerUuid: sc.createUUID(),
      } as PrivateChannelEventListener;
      this.privateChannelEventListeners.push(el);
      successResponse(sc, arg0, from, { listenerUUID: el.listenerUuid }, 'privateChannelAddEventListenerResponse');
    }
  }

  invokePrivateChannelEventListeners(
    privateChannelId: string | null,
    eventType: PrivateChannelEventTypes,
    messageType:
      | 'privateChannelOnAddContextListenerEvent'
      | 'privateChannelOnUnsubscribeEvent'
      | 'privateChannelOnDisconnectEvent',
    sc: ServerContext<AppRegistration>,
    contextType?: string
  ) {
    if (privateChannelId) {
      const msg: PrivateChannelEvents = {
        type: messageType,
        meta: {
          eventUuid: sc.createUUID(),
          timestamp: new Date(),
        },
        payload: {
          privateChannelId,
          contextType: contextType,
        },
      } as PrivateChannelEvents; //Typescript doesn't like comparing an object with a union property (messageType) with a union of object types

      console.log('invokePrivateChannelEventListeners msg: ', msg);
      this.privateChannelEventListeners
        .filter(
          listener =>
            listener.channelId == privateChannelId && (listener.eventType == eventType || listener.eventType == null)
        )
        .filter(onlyUniqueAppIds)
        .forEach(e => {
          console.log(`invokePrivateChannelEventListeners: posting to instance ${e.instanceId}`);
          sc.post(msg, e.instanceId);
        });
    }
  }
}
