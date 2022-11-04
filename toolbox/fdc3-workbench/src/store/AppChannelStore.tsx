import { makeObservable, observable, action, runInAction, toJS } from "mobx";
import * as fdc3 from "@finos/fdc3";
import systemLogStore from "./SystemLogStore";
import { nanoid } from "nanoid";
import { ContextType } from "./ContextStore";

interface Fdc3Listener {
	id: string;
    channelId: string;
	type: string;
	listener: fdc3.Listener;
	lastReceivedContext?: ContextType | null;
}

interface ListenerOptionType {
	title: string;
	value: string;
	type: string | undefined;
}

interface Fdc3Channel {
    id: string;
    channel: fdc3.Channel;
    currentListener?:ListenerOptionType|null;
    broadcastError?: string;
    context?: ContextType|null;
    listenerError? : string;
}
class AppChannelStore {
	appChannelsList: Fdc3Channel[] = [];

	currentAppChannel: Fdc3Channel | null = null;

    appChannelListeners: Fdc3Listener[] = [];

	constructor() {
		makeObservable(this, {
			appChannelsList: observable,
			currentAppChannel: observable,
            appChannelListeners: observable,
            getOrCreateChannel: action,
			leaveChannel: action,
			broadcast: action,
		});

	}

    async getOrCreateChannel(channelId: string) {
		try {
			const currentAppChannel = await fdc3.getOrCreateChannel(channelId);
			const isSuccess = currentAppChannel !== null;
            if (isSuccess) {
                this.currentAppChannel = {
                    id: channelId,
                    channel: currentAppChannel
                };
                let foundChannel = this.appChannelsList.find((channel)=>channel.id === channelId);
                if (!foundChannel) {
                    this.appChannelsList.push(this.currentAppChannel);
                }
            }
           
			runInAction(() => {
				systemLogStore.addLog({
					name: "getOrCreateChannel",
					type: isSuccess ? "success" : "error",
					value: isSuccess ? currentAppChannel?.id : channelId,
					variant: "text",
				});
			});
		} catch (e) {
			systemLogStore.addLog({
				name: "getOrCreateChannel",
				type: "error",
				value: channelId,
				variant: "code",
				body: JSON.stringify(e, null, 4),
			});
		}
	}

    isContextListenerExists(channelId: string, type: string) {
        return !!this.appChannelListeners?.find((listener) => listener.type === type && listener.channelId === channelId);
	}

    isAppChannelExists(channelId: string) {
		return !!this.appChannelsList.find((channel) => channel.id === channelId);
	}

    async broadcast(channelId: string, context: ContextType) {
		if (context) {
			//check that we're on a channel
            let currentChannel = this.appChannelsList.find((channel)=>channel.id === channelId);
			if (!currentChannel) {
				systemLogStore.addLog({
					name: "appbroadcast",
					type: "warning",
					value: "You are not currently joined to a channel (no-op)",
					variant: "text",
				});
			} else {
				try {
					await currentChannel.channel.broadcast(toJS(context));
					systemLogStore.addLog({
						name: "appbroadcast",
						type: "success",
						body: JSON.stringify(context, null, 4),
						variant: "code",
                        value: channelId
					});
				} catch (e) {
					systemLogStore.addLog({
						name: "appbroadcast",
						type: "error",
						body: JSON.stringify(e, null, 4),
						variant: "code",
                        value: channelId
					});
				}
			}
		} else {
			systemLogStore.addLog({
				name: "appbroadcast",
				type: "warning",
				value: `You must set a context before you can broadcast it to channel: ${channelId}`,
				variant: "text",
			});
		}
	}

	async leaveChannel() {
		try {
			//check that we're on a channel
			let currentChannel = await fdc3.getCurrentChannel();
			if (!currentChannel) {
				systemLogStore.addLog({
					name: "leaveChannel",
					type: "warning",
					value: "",
					variant: "text",
				});
			} else {
				await fdc3.leaveCurrentChannel();
				currentChannel = await fdc3.getCurrentChannel();
				const isSuccess = currentChannel === null;

				runInAction(() => {
					systemLogStore.addLog({
						name: "leaveChannel",
						type: isSuccess ? "success" : "error",
						value: this.currentAppChannel?.id,
						variant: "text",
					});

					if (isSuccess) {
						this.currentAppChannel = null;
					}
				});
			}
		} catch (e) {
			systemLogStore.addLog({
				name: "leaveChannel",
				type: "error",
				value: this.currentAppChannel?.id,
				variant: "code",
				body: JSON.stringify(e, null, 4),
			});
		}
	}

    addChannelListener(channelId: string, newListener: string ){
        try{
            let currentChannel = this.appChannelsList.find((channel)=>channel.id === channelId);
            let foundListener = this.appChannelListeners.find((currentListener)=>currentListener.type === newListener && currentListener.channelId === channelId);

            if (!foundListener && currentChannel) {
                const listenerId = nanoid();
                const contactListener = currentChannel.channel.addContextListener(newListener === "all" ? null : newListener, (context) => {
                    const currentListener = this.appChannelListeners.find((listener)=>listener.type === newListener && listener.channelId === channelId);

                    runInAction(() => {
                        if (currentListener) {
                            currentListener.lastReceivedContext = context;
                        }
                    });

                    systemLogStore.addLog({
                        name: "receivedAppContextListener",
                        type: "info",
                        value: `Channel [${channelId}] Received context via '[${newListener}]' listener`,
                        variant: "code",
                        body: JSON.stringify(context, null, 4),
                    });
                });

                runInAction(() => {
                    systemLogStore.addLog({
                        name: "addAppContextListener",
                        type: "success",
                        value: `A context listener for '[${newListener}]' has been added on channel [${channelId}]`,
                        variant: "text",
                    });
                    this.appChannelListeners.push({ id: listenerId, type: newListener, listener: contactListener, channelId});
                });
            }

        } catch(e) {
            systemLogStore.addLog({
				name: "addAppContextListener",
				type: "error",
				value: `Failed to add a context listener for '[${newListener}]' on channel [${channelId}]`,
				variant: "code",
				body: JSON.stringify(e, null, 4),
			});
        }
        
    }

    removeContextListener(id: string) {
		const listenerIndex = this.appChannelListeners?.findIndex((listener) => listener.id === id);
        const listener = this.appChannelListeners[listenerIndex];
		if (listenerIndex !== -1) {
			try {
				this.appChannelListeners[listenerIndex].listener.unsubscribe();

				runInAction(() => {
					systemLogStore.addLog({
						name: "removeAppChannelContextListener",
						type: "success",
						value: `A context listener for '[${listener.type}]' for channel [${listener.channelId}] has been removed`,
						variant: "text",
					});
					this.appChannelListeners.splice(listenerIndex, 1);
				});
			} catch (e) {
				systemLogStore.addLog({
					name: "removeAppChannelContextListener",
					type: "error",
					value: `Failed to remove a context listener for '[${listener.type}]' on channel [${listener.channelId}]`,
					variant: "code",
					body: JSON.stringify(e, null, 4),
				});
			}
		}
	}
}

const appChannelStore = new AppChannelStore();

export default appChannelStore;
