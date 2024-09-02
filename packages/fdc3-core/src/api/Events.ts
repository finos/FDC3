/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/** Type representing a handler function for events from the Desktop Agent. 
 * @param {FDC3Event} event The handler function will be passed an `FDC3Event` Object 
 * providing details of the event (such as a change of channel membership for the app) as the only 
 * parameter.
 */
export type EventHandler = (event: FDC3Event) => void;

/**
 * Enumeration defining the types of (non-context and non-intent) events that may be received
   via the FDC3 API's `addEventListener` function. 
 */
export enum FDC3EventType {
  USER_CHANNEL_CHANGED = "USER_CHANNEL_CHANGED"
}

/**
 * Type representing the format of event objects that may be received
   via the FDC3 API's `addEventListener` function. 
 */
export interface FDC3Event {
  readonly type: FDC3EventType;
  readonly details: any;
}

/**
 * Type representing the format of event USER_CHANNEL_CHANGED objects
 */
export interface FDC3ChannelChangedEvent extends FDC3Event {
  readonly type: FDC3EventType.USER_CHANNEL_CHANGED;
  readonly details: {
    currentChannelId: string | null
  };
}