/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { Context } from '@finos/fdc3-context';
import { ContextHandler } from './Types';
import { DisplayMetadata } from './DisplayMetadata';
import { Listener } from './Listener';
import { EventHandler } from './Events';

/**
 * Represents a context channel that applications can use to send and receive
 * context data.
 *
 * Please note that There are differences in behavior when you interact with a
 * User channel via the `DesktopAgent` interface and the `Channel` interface.
 * Specifically, when 'joining' a User channel or adding a context listener
 * when already joined to a channel via the `DesktopAgent` interface, existing
 * context (matching the type of the context listener) on the channel is
 * received by the context listener immediately. Whereas, when a context
 * listener is added via the Channel interface, context is not received
 * automatically, but may be retrieved manually via the `getCurrentContext()`
 * function.
 */
export interface Channel {
  /**
   * Constant that uniquely identifies this channel.
   */
  readonly id: string;

  /**
   * Uniquely defines each channel type.
   * Can be "user", "app" or "private".
   */
  readonly type: 'user' | 'app' | 'private';

  /**
   * Channels may be visualized and selectable by users. DisplayMetadata may be used to provide hints on how to see them.
   * For App channels, displayMetadata would typically not be present.
   */
  readonly displayMetadata?: DisplayMetadata;

  /**
   * Broadcasts a context on the channel. This function can be used without first joining the channel, allowing applications to broadcast on both App Channels and User Channels that they aren't a member of.
   *
   * If the broadcast is denied by the channel or the channel is not available, the promise will be rejected with an `Error` with a `message` string from the `ChannelError` enumeration.
   *
   * Channel implementations should ensure that context messages broadcast by an application on a channel should not be delivered back to that same application if they are joined to the channel.
   *
   * If you are working with complex context types composed of other simpler types (as recommended by the FDC3 Context Data specification) then you should broadcast each individual type (starting with the simpler types, followed by the complex type) that you want other apps to be able to respond to. Doing so allows applications to filter the context types they receive by adding listeners for specific context types.
   *
   * If an application attempts to broadcast an invalid context argument the Promise returned by this function should reject with the `ChannelError.MalformedContext` error.
   */
  broadcast(context: Context): Promise<void>;

  /**
   * When a `contextType`_` is provided, the most recent context matching the type will be returned, or `null` if no matching context is found.
   *
   * If no `contextType` is provided, the most recent context that was broadcast on the channel - regardless of type - will be returned.  If no context has been set on the channel, it will return `null`.
   *
   * It is up to the specific Desktop Agent implementation whether and how recent contexts are stored. For example, an implementation could store context history for a channel in a single array and search through the array for the last context matching a provided type, or context could be maintained as a dictionary keyed by context types. An implementation could also choose not to support context history, in which case this method will return `null` for any context type not matching the type of the most recent context.
   *
   * If getting the current context fails, the promise will be rejected with an `Error` with a `message` string from the `ChannelError` enumeration.
   */
  getCurrentContext(contextType?: string): Promise<Context | null>;

  /**
   * Adds a listener for incoming contexts of the specified _context type_ whenever a broadcast happens on this channel.
   *
   * If, when this function is called, the channel already contains context that would be passed to the listener it is NOT called or passed this context automatically (this behavior differs from that of the [`fdc3.addContextListener`](DesktopAgent#addcontextlistener) function). Apps wishing to access to the current context of the channel should instead call the `getCurrentContext(contextType)` function.
   *
   * Optional metadata about each context message received, including the app that originated the message, SHOULD be provided by the desktop agent implementation.
   */
  addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener>;

  /**
   * Clears context from the channel, and broadcasts an `fdc3.nothing` context to notify existing listeners that the context was cleared. Listeners added to the channel and calls to [`getCurrentContext`](#getcurrentcontext) will not receive any existing context until new context is broadcast to the channel. 
   * 
   * If a `contextType` is provided, only contexts of that type will be cleared and the `contextType` of the `fdc3.nothing` context will be set to that type name. 
   * 
   * If no `contextType` is provided, all contexts will be cleared and the `contextType` of the `fdc3.nothing` context will be omitted.
   */
  clearContext(contextType?: string): Promise<void>;
  
  /**
   * Register a handler for events from the Channel. Whenever the handler function
   * is called it will be passed an event object with details related to the event.
   *
   * ```js
   * // any event type
   * const listener = await myChannel.addEventListener(null, event => {
   *   console.log(`Received event ${event.type}\n\tDetails: ${event.details}`);
   * });
   *
   * // listener for a specific event type
   * const contextClearedListener = await myChannel.addEventListener(
   *    "contextCleared",
   *    event => { ... }
   * );
   * ```
   *
   * @param {string | null} type If non-null, only events of the specified type will be received by the handler.
   * @param {EventHandler} handler A function that events received will be passed to.
   *
   */
  addEventListener(type: string | null, handler: EventHandler): Promise<Listener>;  

  /**
   * @deprecated use `addContextListener(null, handler)` instead of `addContextListener(handler)`.
   */
  addContextListener(handler: ContextHandler): Promise<Listener>;
}
