import { makeObservable, observable, action, runInAction, toJS } from "mobx";
import fdc3, { ContextType, Channel, Fdc3Listener } from "../utility/Fdc3Api";
import systemLogStore from "./SystemLogStore";
import { nanoid } from "nanoid";

interface ListenerOptionType {
	title: string;
	value: string;
	type: string | undefined;
}

export interface Fdc3Channel {
	id: string;
	channel: Channel;
	currentListener?: ListenerOptionType | null;
	broadcastError?: string;
	context?: ContextType | null;
	listenerError?: string;
}
class AppChannelStore {
	appChannelsList: Fdc3Channel[] = [];

	currentAppChannel: Fdc3Channel | null = null;

	channelListeners: Fdc3Listener[] = [];

	constructor() {
		makeObservable(this, {
			appChannelsList: observable,
			currentAppChannel: observable,
			channelListeners: observable,
			getOrCreateChannel: action,
			leaveChannel: action,
			broadcast: action,
		});
	}

	async getOrCreateChannel(channelId: string) {
		try {
			console.log('getcreate', channelId)
			const currentAppChannel = await fdc3.getOrCreateChannel(channelId);
			const isSuccess = currentAppChannel !== null;
			if (isSuccess) {
				this.currentAppChannel = {
					id: channelId,
					channel: currentAppChannel,
				};
				let foundChannel = this.appChannelsList.find((channel) => channel.id === channelId);
				if (!foundChannel) {
					this.appChannelsList.push(this.currentAppChannel);
				}
			}
			console.log(this.appChannelsList);
			runInAction(() => {
				systemLogStore.addLog({
					name: "getOrCreateChannel",
					type: isSuccess ? "success" : "error",
					value: isSuccess ? currentAppChannel?.id : channelId,
					variant: "text",
				});
			});
			return currentAppChannel;
		} catch (e) {
			systemLogStore.addLog({
				name: "getOrCreateChannel",
				type: "error",
				value: channelId,
				variant: "code",
				body: JSON.stringify(e, null, 4),
			});
			return;
		}
	}

	isContextListenerExists(channelId: string, type: string | undefined) {
		return !!this.channelListeners?.find((listener) => listener.type === type && listener.channelId === channelId);
	}

	isAppChannelExists(channelId: string) {
		return !!this.appChannelsList.find((channel) => channel.id === channelId);
	}

	async broadcast(channelId: string, context: ContextType) {
		if (!context) {
			systemLogStore.addLog({
				name: "appbroadcast",
				type: "warning",
				value: `You must set a context before you can broadcast it to channel: ${channelId}`,
				variant: "text",
			});
		}

		//check that we're on a channel
		let currentChannel = this.appChannelsList.find((channel) => channel.id === channelId);

		if (!currentChannel) {
			systemLogStore.addLog({
				name: "appbroadcast",
				type: "warning",
				value: "You are not currently joined to a channel (no-op)",
				variant: "text",
			});
			return;
		}

		try {
			await currentChannel.channel.broadcast(toJS(context));
			systemLogStore.addLog({
				name: "appbroadcast",
				type: "success",
				body: JSON.stringify(context, null, 4),
				variant: "code",
				value: channelId,
			});
		} catch (e) {
			systemLogStore.addLog({
				name: "appbroadcast",
				type: "error",
				body: JSON.stringify(e, null, 4),
				variant: "code",
				value: channelId,
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

	async addChannelListener(channelId: string, newListener: string | undefined) {
		try {
			let currentChannel = this.appChannelsList.find((channel) => channel.id === channelId);
			let foundListener = this.channelListeners.find(
				(currentListener) => currentListener.type === newListener && currentListener.channelId === channelId
			);
			console.log(currentChannel, foundListener, this.appChannelsList)
			if (!foundListener && currentChannel && newListener !== undefined) {
				const listenerId = nanoid();
				const contactListener = await currentChannel.channel.addContextListener(
					newListener?.toLowerCase() === "all" ? null : newListener,
					(context, metaData?: any) => {
						console.log(metaData);
						const currentListener = this.channelListeners.find(
							(listener) => listener.type === newListener && listener.channelId === channelId
						);

						runInAction(() => {
							if (currentListener) {
								currentListener.lastReceivedContext = context;
								currentListener.metaData = metaData;
							}
						});

						systemLogStore.addLog({
							name: "receivedAppContextListener",
							type: "info",
							value: `Channel [${channelId}] Received context via '[${newListener}]' listener`,
							variant: "code",
							body: JSON.stringify(context, null, 4),
						});
					}
				);

				runInAction(() => {
					systemLogStore.addLog({
						name: "addAppContextListener",
						type: "success",
						value: `A context listener for '[${newListener}]' has been added on channel [${channelId}]`,
						variant: "text",
					});
					this.channelListeners.push({ id: listenerId, type: newListener, listener: contactListener, channelId });
				});
			}
		} catch (e) {
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
		const listenerIndex = this.channelListeners?.findIndex((listener) => listener.id === id);
		const listener = this.channelListeners[listenerIndex];
		if (listenerIndex !== -1) {
			try {
				this.channelListeners[listenerIndex].listener.unsubscribe();

				runInAction(() => {
					systemLogStore.addLog({
						name: "removeAppChannelContextListener",
						type: "success",
						value: `A context listener for '[${listener.type}]' for channel [${listener.channelId}] has been removed`,
						variant: "text",
					});
					this.channelListeners.splice(listenerIndex, 1);
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
