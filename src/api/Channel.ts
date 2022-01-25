/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

import { Context } from '../context/ContextTypes';
import { ContextHandler } from './Types';
import { DisplayMetadata } from './DisplayMetadata';
import { Listener } from './Listener';

/**
 * Object representing a context channel.
 */
export interface Channel {
  /**
   * Constant that uniquely identifies this channel.
   */
  readonly id: string;

  /**
   * Uniquely defines each channel type.
   */
  readonly type: string;

  /**
   * Channels may be visualized and selectable by users. DisplayMetadata may be used to provide hints on how to see them.
   * For App channels, displayMetadata would typically not be present.
   */
  readonly displayMetadata?: DisplayMetadata;

  /**
   * Broadcasts the given context on this channel. This is equivalent to joining the channel and then calling the
   * top-level FDC3 `broadcast` function.
   *
   * Note that this function can be used without first joining the channel, allowing applications to broadcast on
   * User channels that they aren't a member of.
   *
   * Channel implementations should ensure that context messages broadcast by an application on a channel should
   * not be delivered back to that same application if they are joined to the channel.
   *
   * `Error` with a string from the `ChannelError` enumeration.
   */
  broadcast(context: Context): Promise<void>;

  /**
   * Returns the last context that was broadcast on this channel. All channels initially have no context, until a
   * context is broadcast on the channel. If there is not yet any context on the channel, this method
   * will return `null`.
   *
   * The context of a channel will be captured regardless of how the context is broadcasted on this channel - whether
   * using the top-level FDC3 `broadcast` function, or using the channel-level {@link broadcast} function on this
   * object.
   *
   * Optionally a {@link contextType} can be provided, in which case the current context of the matching type will
   * be returned (if any). Desktop agent implementations may decide to record contexts by type, in which case it will
   * be possible to get the most recent context of the type specified, but this is not guaranteed.
   *
   * `Error` with a string from the `ChannelError` enumeration.
   */
  getCurrentContext(contextType?: string): Promise<Context | null>;

  /**
   * Adds a listener for incoming contexts whenever a broadcast happens on this channel.
   * @deprecated use `addContextListener(null, handler)` instead of `addContextListener(handler)`.
   */
  addContextListener(handler: ContextHandler): Promise<Listener>;

  /**
   * Adds a listener for incoming contexts of the specified context type whenever a broadcast happens on this channel.
   */
  addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener>;
}
