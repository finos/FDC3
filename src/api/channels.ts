interface Channels {

    /**
     * Retrieve a list of currently known channels
     */
    list(): Promise<string[]>;

    /**
     * Update a particular context value on a particular channel. Context values are indexed by their type.
     */
    update(channelName: string, context: Context): Promise<void>;

    /**
     * Watch for updates to a particular context type on a particular channel.
     */
    watch(channelName: string, type: string, handler: ContextHandler): Listener;
}