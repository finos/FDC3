/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/**
 * Type defining a basic event object that may be emitted by an FDC3 API interface
 * such as DesktopAgent or PrivateChannel. There are more specific event types
 * defined for each interface.
 */
export interface ApiEvent {
  readonly type: string;
  readonly details: any;
}

/** Type representing a handler function for events from the Desktop Agent
 * or a PrivateChannel.
 * @param event The handler function will be passed an `ApiEvent` (or more specifically
 *  an `FDC3Event` or `PrivateChannelEvent`) Object providing details of the event (such
 * as a change of channel membership for the app, or type of context listener added)
 * as the only parameter.
 */
export type EventHandler = (event: ApiEvent) => void;

/**
 * Type defining valid type strings for DesktopAgent interface events.
 */
export type FDC3EventTypes = 'userChannelChanged';

/**
 * Type defining the format of event objects that may be received
 * via the FDC3 API's `addEventListener` function.
 */
export interface FDC3Event extends ApiEvent {
  readonly string: FDC3EventTypes;
  readonly details: any;
}

/**
 * Type defining the format of event `userChannelChanged` objects
 */
export interface FDC3ChannelChangedEvent extends FDC3Event {
  readonly type: 'userChannelChanged';
  readonly details: {
    currentChannelId: string | null;
  };
}

/**
 * Type defining valid type strings for Private Channel events.
 */
export type PrivateChannelEventTypes = 'addContextListener' | 'unsubscribe' | 'disconnect';

/**
 * Type defining the format of event objects that may be received
 * via a PrivateChannel's `addEventListener` function.
 */
export interface PrivateChannelEvent {
  readonly type: PrivateChannelEventTypes;
  readonly details: any;
}

/**
 * Type defining the format of events representing a context listener being
 * added to the channel (`addContextListener`). Desktop Agents MUST fire this
 * event for each invocation of `addContextListener` on the channel, including
 * those that occurred before this handler was registered (to prevent race
 * conditions).
 * The context type of the listener added is provided as `details.contextType`,
 * which will be `null` if all event types are being listened to.
 */
export interface PrivateChannelAddContextListenerEvent extends PrivateChannelEvent {
  readonly type: 'addContextListener';
  readonly details: {
    contextType: string | null;
  };
}

/**
 * Type defining the format of events representing a context listener
 * removed from the channel (`Listener.unsubscribe()`). Desktop Agents MUST call
 * this when `disconnect()` is called by the other party, for each listener that
 * they had added.
 * The context type of the  listener removed is provided as `details.contextType`,
 * which will be `null` if all event types were being listened to.
 */
export interface PrivateChannelUnsubscribeEvent extends PrivateChannelEvent {
  readonly type: 'unsubscribe';
  readonly details: {
    contextType: string | null;
  };
}

/**
 * Type defining the format of events representing a remote app being terminated
 * or otherwise disconnecting from the PrivateChannel. This event is in addition to
 * unsubscribe events that will also be fired for any context listeners they had added.
 * No details are provided.
 */
export interface PrivateChannelDisconnectEvent extends PrivateChannelEvent {
  readonly type: 'disconnect';
  readonly details: null | undefined;
}
