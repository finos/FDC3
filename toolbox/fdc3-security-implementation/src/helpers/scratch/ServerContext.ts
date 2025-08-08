import { Context } from '@finos/fdc3-context';
import {
  PrivateChannelOnAddContextListenerEvent,
  PrivateChannelOnDisconnectEvent,
  PrivateChannelOnUnsubscribeEvent,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { DesktopAgent, Channel, PrivateChannelEventTypes } from '@finos/fdc3-standard';

export type ContextListenerRegistration = {
  appId: string;
  instanceId: string;
  listenerUuid: string;
  channelId: string | null;
  contextType: string | null;
  userChannelListener: boolean;
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

export interface ServerContext extends DesktopAgent {
  getChannelById(id: string | null): Channel | null;
  updateChannelContext(channelId: string, context: Context): void;

  getPrivateChannelEventListeners(): PrivateChannelEventListener[];
  registerPrivateChannelEventListener(listener: PrivateChannelEventListener): void;
  unregisterPrivateChannelEventListener(id: string): void;

  getContextListeners(): ContextListenerRegistration[];
  registerContextListener(listener: ContextListenerRegistration): void;
  unregisterContextListener(id: string): void;

  /**
   * Post a message to the app.  If no instanceId is provided, the message is posted to
   * the app owning this server context instance.
   */
  post(msg: any, instanceId?: string): void;
}
