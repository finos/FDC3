import { MessageHandler } from '../BasicFDC3Server';
import { AppRegistration, InstanceID, ServerContext } from '../ServerContext';
import { Context } from '@finos/fdc3-context';
import {
  AppIdentifier,
  ChannelError,
  DisplayMetadata,
  FDC3EventTypes,
  PrivateChannelEventTypes,
} from '@finos/fdc3-standard';
import { successResponse, errorResponse, FullAppIdentifier, onlyUnique } from './support';
import {
  AddContextListenerRequest,
  AddEventListenerRequest,
  AgentResponseMessage,
  AppRequestMessage,
  BroadcastRequest,
  ChannelChangedEvent,
  ClearContextRequest,
  ContextClearedEvent,
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
  PrivateChannelOnAddContextListenerEvent,
  PrivateChannelOnDisconnectEvent,
  PrivateChannelOnUnsubscribeEvent,
  PrivateChannelUnsubscribeEventListenerRequest,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';

type PrivateChannelEvents =
  | PrivateChannelOnAddContextListenerEvent
  | PrivateChannelOnUnsubscribeEvent
  | PrivateChannelOnDisconnectEvent;

type FDC3Events = ChannelChangedEvent | ContextClearedEvent;

type ContextListenerRegistration = {
  appId: string;
  instanceId: string;
  listenerUuid: string;
  channelId: string | null;
  contextType: string | null;
  userChannelListener: boolean;
};

type PrivateChannelEventListener = {
  appId: string;
  instanceId: string;
  channelId: string;
  eventType: PrivateChannelEventTypes | null;
  listenerUuid: string;
};

type fdc3EventListener = {
  appId: string;
  instanceId: string;
  eventType: FDC3EventTypes | null;
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

export class BroadcastHandler implements MessageHandler {
  private contextListeners: ContextListenerRegistration[] = [];
  private privateChannelEventListeners: PrivateChannelEventListener[] = [];
  private fdc3EventListeners: fdc3EventListener[] = [];
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
    this.fdc3EventListeners = this.fdc3EventListeners.filter(listener => listener.instanceId !== instanceId);
  }

  getCurrentChannel(from: FullAppIdentifier): ChannelState | null {
    return this.currentChannel[from.instanceId];
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

  getListeners(appId: AppIdentifier) {
    return this.contextListeners.filter(r => r.instanceId == appId.instanceId);
  }

  moveUserChannelListenersAndNotify(app: AppIdentifier, channelId: string | null, sc: ServerContext<AppRegistration>) {
    this.getListeners(app)
      .filter(l => l.userChannelListener)
      .forEach(l => {
        l.channelId = channelId;
      });

    this.invokeFDC3EventListeners('userChannelChanged', sc, channelId);
  }

  /**
   * Updates the channel state (used to return the 'current' or most recent
   * context on the channel) to include context that has been broadcast onto
   * a channel, replacing any existing context of that type.
   *
   * @param channelId The id of the channel to update.
   * @param context The context to include in the channel's state.
   */
  updateChannelState(channelId: string, context: Context) {
    const cs = this.getChannelById(channelId);
    if (cs) {
      // null is used to mark the fact that a context was cleared - remove it if present
      // and remove any existing context of the type we've received
      cs.context = cs.context.filter(c => c.type != context.type);
      cs.context.unshift(context);
    }
  }

  /**
   * Updates the channel state (used to return the 'current' or most recent
   * context on the channel) to remove or clear context (of a specific type
   * or all types).
   * @param channelId The id of the channel to update.
   * @param context The context type to remove from the channel's state, or
   * null to remove all types.
   */
  clearChannelState(channelId: string, contextType: string | null) {
    const cs = this.getChannelById(channelId);
    if (cs) {
      if (contextType !== null) {
        //clear only that type (and any nulls from previous clears)
        cs.context = cs.context.filter(c => c.type != contextType);
      } else {
        //clear all types
        cs.context = [];
      }
    }
  }

  async accept(msg: AppRequestMessage, sc: ServerContext<AppRegistration>, uuid: InstanceID) {
    const from = sc.getInstanceDetails(uuid);

    if (from == null) {
      // this handler only deals with connected apps
      return;
    }

    try {
      switch (msg.type) {
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
            sc,
            from
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

        case 'addEventListenerRequest':
          return this.handleAddEventListenerRequest(msg as AddEventListenerRequest, sc, from);

        case 'clearContextRequest':
          return this.handleClearContextRequest(msg as ClearContextRequest, sc, from);
      }
    } catch (e) {
      const responseType = msg.type.replace(new RegExp('Request$'), 'Response');
      errorResponse(sc, msg, from, (e as Error).message ?? e, responseType as AgentResponseMessage['type']);
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
      let context: Context | null;

      // if context was cleared or none has ever been received,  return null
      if (type) {
        context = channel.context.find(c => c.type == type) ?? null;
      } else {
        context = channel.context[0] ?? null;
      }
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
    let channelType = ChannelType.user;

    if (arg0.payload?.channelId) {
      const channel = this.getChannelById(arg0.payload?.channelId);
      channelType = channel?.type ?? ChannelType.user;

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
      userChannelListener: channelType == ChannelType.user,
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
    const matchingListeners = this.contextListeners
      .filter(r => r.channelId == arg0.payload.channelId)
      .filter(r => r.contextType == null || r.contextType == arg0.payload.context.type);

    const matchingApps: FullAppIdentifier[] = matchingListeners
      .map(r => {
        return { appId: r.appId, instanceId: r.instanceId };
      })
      .filter(onlyUnique);

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
    this.moveUserChannelListenersAndNotify(from, newChannel.id, sc);
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
      this.moveUserChannelListenersAndNotify(from, null, sc);
    }
    successResponse(sc, arg0, from, {}, 'leaveCurrentChannelResponse');
  }

  handleGetOrCreateRequest(
    arg0: GetOrCreateChannelRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ) {
    const id = arg0.payload.channelId;
    let channel = this.getChannelById(id);
    if (channel) {
      if (channel.type != ChannelType.app) {
        errorResponse(sc, arg0, from, ChannelError.AccessDenied, 'getOrCreateChannelResponse');
        return;
      }
    }

    channel = {
      id: id,
      type: ChannelType.app,
      context: [],
      displayMetadata: {},
    };
    this.state.push(channel);
    successResponse(sc, arg0, from, { channel: { id: channel.id, type: channel.type } }, 'getOrCreateChannelResponse');
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
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
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
        .forEach(e => {
          console.log(`invokePrivateChannelEventListeners: posting to instance ${e.instanceId}`);
          sc.post(msg, e.instanceId);
        });
    }
  }

  handleAddEventListenerRequest(
    arg0: AddEventListenerRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ) {
    const el = {
      appId: from.appId,
      instanceId: from.instanceId,
      eventType: arg0.payload.type,
      listenerUuid: sc.createUUID(),
    } as fdc3EventListener;
    this.fdc3EventListeners.push(el);
    successResponse(sc, arg0, from, { listenerUUID: el.listenerUuid }, 'addEventListenerResponse');
  }

  invokeFDC3EventListeners(
    eventType: FDC3EventTypes,
    sc: ServerContext<AppRegistration>,
    channelId: string | null,
    contextType?: string | null
  ) {
    let msg: FDC3Events;
    if (eventType == 'userChannelChanged') {
      msg = {
        type: 'channelChangedEvent',
        meta: {
          eventUuid: sc.createUUID(),
          timestamp: new Date(),
        },
        payload: {
          currentChannelId: channelId,
        },
      };
    } else if (eventType == 'contextCleared') {
      if (contextType === undefined) {
        console.warn(
          'invokeFDC3EventListeners received an invalid call where contextType was undefined while eventType was contextCleared'
        );
        contextType = null;
      }
      msg = {
        type: 'contextClearedEvent',
        meta: {
          eventUuid: sc.createUUID(),
          timestamp: new Date(),
        },
        payload: {
          channelId: channelId,
          contextType: contextType,
        },
      };
    } else {
      console.warn(
        'invokeFDC3EventListeners received an invalid call with an unknown and unsupported event type: ' + eventType
      );
      return;
    }

    console.log('invokeFDC3EventListeners msg: ', msg);
    this.fdc3EventListeners
      .filter(listener => listener.eventType == eventType || listener.eventType == null)
      .forEach(e => {
        console.log(`invokeFDC3EventListeners: posting to instance ${e.instanceId}`);
        sc.post(msg, e.instanceId);
      });
  }

  handleClearContextRequest(arg0: ClearContextRequest, sc: ServerContext<AppRegistration>, from: FullAppIdentifier) {
    const channelId = arg0.payload.channelId;
    const contextType = arg0.payload.contextType;

    // clear the context on the channel for new joiners
    this.clearChannelState(channelId, contextType);

    // let any event subscribers know about the clear
    this.invokeFDC3EventListeners('contextCleared', sc, channelId, contextType);

    successResponse(sc, arg0, from, {}, 'clearContextResponse');
  }
}
