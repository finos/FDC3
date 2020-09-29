/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

/**
 * Object representing a context channel.
 */
interface Channel {
    /**
     * Constant that uniquely identifies this channel.
     */
    public readonly id: string;
  
    /**
     * Uniquely defines each channel type.
     */
    public readonly type: string;
  
    /**
     * Channels may be visualized and selectable by users. DisplayMetadata may be used to provide hints on how to see them.
     * For app channels, displayMetadata would typically not be present
     */
    public readonly displayMetadata?: DisplayMetadata;
  
     /**
     * Broadcasts the given context on this channel. This is equivalent to joining the channel and then calling the 
     * top-level FDC3 `broadcast` function.
     * 
     * Note that this function can be used without first joining the channel, allowing applications to broadcast on
     * channels that they aren't a member of.
     * 
     * `Error` with a string from the `ChannelError` enumeration.
     */
    public broadcast(context: Context): void;
  
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
    public getCurrentContext(contextType?: string): Promise<Context|null>;
  
    /**
     * Adds a listener for incoming contexts whenever a broadcast happens on this channel.
     */
    public addContextListener(handler: ContextHandler): Listener;
  
    /**
     * Adds a listener for incoming contexts of the specified context type whenever a broadcast happens on this channel.
     */
    public addContextListener(contextType: string, handler: ContextHandler): Listener;
  }
  