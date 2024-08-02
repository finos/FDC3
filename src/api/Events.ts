/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/** Type representing a handler function for events from the Desktop Agent
 * or a PrivateChannel. 
 * @param event The handler function will be passed an `FDC3Event` or
 * `PrivateChannelEvent` Object providing details of the event (such as a
 * change of channel membership for the app, or type of context listener added)
 * as the only parameter.
 */
export type EventHandler = (event: FDC3Event | PrivateChannelEvent ) => void;

/**
 * Enumeration defining the types of (non-context and non-intent) events that may be received
   via the FDC3 API's `addEventListener` function. 
 */
export enum FDC3EventType {
  USER_CHANNEL_CHANGED = "USER_CHANNEL_CHANGED"
}

/**
 * Type defining the format of event objects that may be received
   via the FDC3 API's `addEventListener` function.
 */
export interface FDC3Event {
  readonly type: FDC3EventType;
  readonly details: any;
}

/**
 * Type defining the format of event USER_CHANNEL_CHANGED objects
 */
export interface FDC3ChannelChangedEvent extends FDC3Event {
  readonly type: FDC3EventType.USER_CHANNEL_CHANGED;
  readonly details: {
    currentChannelId: string | null
  };
}

/**
 * Enumeration defining the types of events that may be received
   via a PrivateChannel's `addEventListener` function.
 */
  export enum PrivateChannelEventType {
  ADD_CONTEXT_LISTENER = "addContextListener",
  UNSUBSCRIBE = "unsubscribe",
  DISCONNECT = "disconnect"
}
  
  
/**
 * Type defining the format of event objects that may be received
 * via a PrivateChannel's `addEventListener` function.
 */
export interface PrivateChannelEvent {
  readonly type: PrivateChannelEventType;
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
  readonly type: PrivateChannelEventType.ADD_CONTEXT_LISTENER;
  readonly details: {
    contextType: string | null
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
  readonly type: PrivateChannelEventType.UNSUBSCRIBE;
  readonly details: {
    contextType: string | null
  };
}

/**
 * Type defining the format of events representing a remote app being terminated
 * or otherwise disconnecting from the PrivateChannel. This event is in addition to 
 * unsubscribe events that will also be fired for any context listeners they had added.
 * No details are provided.
 */
export interface PrivateChannelDisconnectEvent extends PrivateChannelEvent {
  readonly type: PrivateChannelEventType.DISCONNECT;
  readonly details: null | undefined;
}
