/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2021 FINOS FDC3 contributors - see NOTICE file
 */

import { Listener } from './Listener';
import { Channel } from './Channel';

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
   * Adds a listener that will be called each time that the remote app invokes 
   * addContextListener on this channel.
   * 
   * Desktop Agents MUST call this for each invokation of addContextListener on this 
   * channel, including those that occurred before this handler was registered 
   * (to prevent race conditions).
	 */
  onAddContextListener(handler : (contextType ?: string) => void): Listener;

	/** 
   * Adds a listener that will be called whenever the remote app invokes 
   * Listener.unsubscribe() on a context listener that it previously added.
   * 
   * Desktop Agents MUST call this when disconnect() is called by the other party, for
   * each listner that they had added.
   */
  onUnsubscribe(handler : (contextType ?: string) => void): Listener;

	/** 
   * Adds a listener that will be called when the remote aoo terminates, for example  
   * when its window is closed or because disconnect was called. This is in addition
   * to calls that will be made to an onUnsubscribe listeners.
   */
  onDisconnect(handler : () => void): Listener;

	/** 
   * May be called to indicate that a participant will no longer interact with this channel.
   * 
   * After this function has been called, Desktop Agents SHOULD prevent apps from broadcasting 
   * on this channel and MUST automatically call Listener.unsubscribe() for each listener that
   * they've added (causing any onUnsubscribe handler added by the other party to be called) 
   * before triggering any onDisconnect handler added by the other party.
   */
  disconnect(): void;
}
