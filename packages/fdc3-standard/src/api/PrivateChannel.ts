/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2021 FINOS FDC3 contributors - see NOTICE file
 */

import { Listener } from './Listener.js';
import { Channel } from './Channel.js';
import { EventHandler, PrivateChannelEventTypes } from './Events.js';

/**
 * Object representing a private context channel, which is intended to support
 * secure communication between applications, and extends the Channel interface
 * with event handlers which provide information on the connection state of both
 * parties, ensuring that desktop agents do not need to queue or retain messages
 * that are broadcast before a context listener is added and that applications
 * are able to stop broadcasting messages when the other party has disconnected.
 *
 * It is intended that Desktop Agent implementations:
 * - SHOULD restrict external apps from listening or publishing on this channel.
 * - MUST prevent private channels from being retrieved via fdc3.getOrCreateChannel.
 * - MUST provide the `id` value for the channel as required by the Channel interface.
 */
export interface PrivateChannel extends Channel {
  /**
   * Register a handler for events from the PrivateChannel. Whenever the handler function
   * is called it will be passed an event object with details related to the event.
   *
   * ```js
   * // any event type
   * const listener = await myPrivateChannel.addEventListener(null, event => {
   *   console.log(`Received event ${event.type}\n\tDetails: ${event.details}`);
   * });
   *
   * // listener for a specific event type
   * const channelChangedListener = await myPrivateChannel.addEventListener(
   *    "addContextListener",
   *    event => { ... }
   * );
   * ```
   *
   * @param {PrivateChannelEventType | null} type If non-null, only events of the specified type will be received by the handler.
   * @param {EventHandler} handler A function that events received will be passed to.
   *
   */
  addEventListener(type: PrivateChannelEventTypes | null, handler: EventHandler): Promise<Listener>;

  /**
   * May be called to indicate that a participant will no longer interact with this channel.
   *
   * After this function has been called, Desktop Agents SHOULD prevent apps from broadcasting
   * on this channel and MUST automatically call Listener.unsubscribe() for each listener that
   * they've added (causing any "unsubscribe" event handler added by the other party to fire)
   * before triggering any "disconnect" event handler added by the other party.
   */
  disconnect(): Promise<void>;
}
