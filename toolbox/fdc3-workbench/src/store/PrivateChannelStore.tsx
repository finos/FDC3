import { makeObservable, observable, action, runInAction, toJS } from "mobx";
import fdc3, { ContextType, Channel, Fdc3Listener, PrivateChannel } from "../utility/Fdc3Api";
import systemLogStore from "./SystemLogStore";
import { nanoid } from "nanoid";

interface ListenerOptionType {
	title: string;
	value: string;
	type: string | undefined;
}

export interface Fdc3PrivateChannel {
	id: string;
	channel: PrivateChannel;
	currentListener?: ListenerOptionType | null;
	broadcastError?: string;
	context?: ContextType | null;
	listenerError?: string;
}
class PrivateChannelStore {
	privateChannelsList: Fdc3PrivateChannel[] = [];

	currentPrivateChannel: Fdc3PrivateChannel | null = null;

	privateChannelListeners: Fdc3Listener[] = [];

	constructor() {
		makeObservable(this, {
			privateChannelsList: observable,
			currentPrivateChannel: observable,
			privateChannelListeners: observable,
			createPrivateChannel: action,
			broadcast: action,
		});
	}

	async createPrivateChannel(channelId: string) {
		try {
			const currentPrivateChannel: any = await fdc3.createPrivateChannel();
			const isSuccess = currentPrivateChannel !== null;
			if (isSuccess) {
				this.currentPrivateChannel = {
					id: channelId,
					channel: currentPrivateChannel,
				};
				let foundChannel = this.privateChannelsList.find((channel) => channel.id === channelId);
				if (!foundChannel) {
					this.privateChannelsList.push(this.currentPrivateChannel);
				}
			}

			runInAction(() => {
				systemLogStore.addLog({
					name: "getOrCreateChannel",
					type: isSuccess ? "success" : "error",
					value: isSuccess ? currentPrivateChannel?.id : channelId,
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

	isContextListenerExists(channelId: string, type: string | undefined) {
		return !!this.privateChannelListeners?.find(
			(listener) => listener.type === type && listener.channelId === channelId
		);
	}

	isPrivateChannelExists(channelId: string) {
		return !!this.privateChannelsList.find((channel) => channel.id === channelId);
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
		let currentChannel = this.privateChannelsList.find((channel) => channel.id === channelId);

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

	async addChannelListener(channelId: string, newListener: string | undefined) {
		try {
			let currentChannel = this.privateChannelsList.find((channel) => channel.id === channelId);
			let foundListener = this.privateChannelListeners.find(
				(currentListener) => currentListener.type === newListener && currentListener.channelId === channelId
			);

			if (!foundListener && currentChannel && newListener !== undefined) {
				const listenerId = nanoid();
				const contactListener = await currentChannel.channel.addContextListener(
					newListener?.toLowerCase() === "all" ? null : newListener,
					(context, metaData?: any) => {
						const currentListener = this.privateChannelListeners.find(
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
					this.privateChannelListeners.push({
						id: listenerId,
						type: newListener,
						listener: contactListener,
						channelId,
					});
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
		const listenerIndex = this.privateChannelListeners?.findIndex((listener) => listener.id === id);
		const listener = this.privateChannelListeners[listenerIndex];
		if (listenerIndex !== -1) {
			try {
				this.privateChannelListeners[listenerIndex].listener.unsubscribe();

				runInAction(() => {
					systemLogStore.addLog({
						name: "removeAppChannelContextListener",
						type: "success",
						value: `A context listener for '[${listener.type}]' for channel [${listener.channelId}] has been removed`,
						variant: "text",
					});
					this.privateChannelListeners.splice(listenerIndex, 1);
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

	onAddContextListener(channel: PrivateChannel, handler: (contextType?: string) => void) {
		channel.onAddContextListener(handler);
	}

	onUnsubscribe(channel: PrivateChannel, handler: (contextType?: string) => void) {
		channel.onUnsubscribe(handler);
	}

	onDisconnect(channel: PrivateChannel, handler: () => void) {
		channel.onDisconnect(handler);
	}
}

const privateChannelStore = new PrivateChannelStore();

export default privateChannelStore;
