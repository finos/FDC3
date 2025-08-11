import { Context } from '@finos/fdc3-context';
import {
  PrivateChannelOnAddContextListenerEvent,
  PrivateChannelOnDisconnectEvent,
  PrivateChannelOnUnsubscribeEvent,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { DesktopAgent, Channel, PrivateChannelEventTypes } from '@finos/fdc3-standard';
import { FullAppIdentifier } from './MessageHandler';

export type ContextListenerRegistration = {
  appId: string;
  instanceId: string;
  listenerUuid: string;
  channelId: string | null;
  contextType: string | null;
  userChannelListener: boolean;
};

export type IntentListenerRegistration = {
  appId: string;
  instanceId: string;
  intentName: string;
  listenerUUID: string;
};

export type IntentRequest = {
  intent: string;
  context: Context;
  requestUuid: string;
  from: FullAppIdentifier;
  type: 'raiseIntentResponse' | 'raiseIntentForContextResponse';
};

export type PrivateChannelEvents =
  | PrivateChannelOnAddContextListenerEvent
  | PrivateChannelOnUnsubscribeEvent
  | PrivateChannelOnDisconnectEvent;

export type PrivateChannelEventListener = {
  appId: string;
  instanceId: string;
  channelId: string;
  eventType: PrivateChannelEventTypes | null;
  listenerUuid: string;
};

export interface ServerContext {
  getChannelById(id: string | null): Promise<Channel | null>;
  updateChannelContext(channelId: string, context: Context): Promise<void>;

  getPrivateChannelEventListeners(): Promise<PrivateChannelEventListener[]>;
  registerPrivateChannelEventListener(listener: PrivateChannelEventListener): Promise<void>;
  unregisterPrivateChannelEventListener(id: string): Promise<void>;

  getContextListeners(): Promise<ContextListenerRegistration[]>;
  registerContextListener(listener: ContextListenerRegistration): Promise<void>;
  unregisterContextListener(id: string): Promise<void>;

  /**
   * Post a message to the app.  If no instanceId is provided, the message is posted to
   * the app owning this server context instance.
   */
  post(msg: any, instanceId?: string): Promise<void>;
}
