import { makeObservable, observable, action, runInAction, toJS } from "mobx";
import fdc3, {
	ContextType,
	IntentResolution,
	Fdc3Listener,
	TargetApp,
	AppMetadata,
	AppIdentifier,
	Channel,
	PrivateChannel,
} from "../utility/Fdc3Api";
import { nanoid } from "nanoid";
import { intentTypes } from "../fixtures/intentTypes";
import systemLogStore from "./SystemLogStore";
import appChannelStore from "./AppChannelStore";
import privateChannelStore from "./PrivateChannelStore";

type IntentItem = { title: string; value: string };

class IntentStore {
	intentsList: IntentItem[] = intentTypes;

	intentListeners: Fdc3Listener[] = [];

	constructor() {
		makeObservable(this, {
			intentsList: observable,
			intentListeners: observable,
			raiseIntent: action,
			addIntentListener: action,
			removeIntentListener: action,
			raiseIntentForContext: action,
		});
	}

	async addIntentListener(
		intent: string,
		resultContext?: ContextType | null,
		channelName?: string | null,
		isPrivate?: boolean,
		channelContexts?: any,
		channelContextDelay?: any
	) {
		try {
			const listenerId = nanoid();

			const intentListener = await fdc3.addIntentListener(intent, async (context: ContextType, metaData?: any) => {
				const currentListener = this.intentListeners.find(({ id }) => id === listenerId);
				let channel: Channel | undefined;
				console.log(context, metaData);
				//app channel
				if (channelName && !isPrivate) {
					channel = await appChannelStore.getOrCreateChannel(channelName);
					console.log(`returning app channel:  ${channel?.id}`);
				}

				//private channel
				if (isPrivate && !channelName) {
					channel = await privateChannelStore.createPrivateChannel();
					privateChannelStore.addChannelListener(<PrivateChannel>channel, "all");
					console.log(`returning private channel: ${channel?.id}`);
					privateChannelStore.onDisconnect(<PrivateChannel>channel, () => privateChannelStore.disconnect(<PrivateChannel>channel));
					privateChannelStore.onUnsubscribe(<PrivateChannel>channel);
					privateChannelStore.onAddContextListener(<PrivateChannel>channel);
				}

				if (channel) {
					if (Object.keys(channelContexts).length !== 0) {
						console.log(channelContexts, channel);
						Object.keys(channelContexts).forEach((key) => {
							console.log("broadcasting...", channelContextDelay[key]);
							let broadcast = setTimeout(async () => {
								console.log(channel);
								if (isPrivate) {
									privateChannelStore.broadcast(<PrivateChannel>channel, channelContexts[key]);
								} else {
									appChannelStore.broadcast(<Channel>channel, channelContexts[key]);
								}
								console.log("done broadcasting");
								clearTimeout(broadcast);
							}, channelContextDelay[key]);
						});
					} else {
						await channel.broadcast(context);
					}
				}

				runInAction(() => {
					if (currentListener) {
						currentListener.lastReceivedContext = context;
						currentListener.metaData = metaData;
					}
				});
				console.log(context, channel);
				if (resultContext) context = resultContext;

				systemLogStore.addLog({
					name: "receivedIntentListener",
					type: "info",
					value: intent,
					variant: "code",
					body: JSON.stringify(context, null, 4),
				});

				return channel || context;
			});

			runInAction(() => {
				systemLogStore.addLog({
					name: "addIntentListener",
					type: "success",
					value: intent,
					variant: "text",
				});
				this.intentListeners.push({ id: listenerId, type: intent, listener: intentListener });
			});
		} catch (e) {
			systemLogStore.addLog({
				name: "addIntentListener",
				type: "error",
				value: intent,
				variant: "code",
				body: JSON.stringify(e, null, 4),
			});
		}
	}

	async removeIntentListener(id: string) {
		const listenerIndex = this.intentListeners.findIndex((listener) => listener.id === id);

		if (listenerIndex !== -1) {
			try {
				(await this.intentListeners[listenerIndex].listener).unsubscribe();

				runInAction(() => {
					systemLogStore.addLog({
						name: "removeIntentListener",
						type: "success",
						value: this.intentListeners[listenerIndex].type,
						variant: "text",
					});
					this.intentListeners.splice(listenerIndex, 1);
				});
			} catch (e) {
				systemLogStore.addLog({
					name: "removeIntentListener",
					type: "error",
					value: this.intentListeners[listenerIndex].type,
					variant: "code",
					body: JSON.stringify(e, null, 4),
				});
			}
		}
	}

	async raiseIntent(intent: string, context: ContextType, app?: AppMetadata) {
		if (!context) {
			systemLogStore.addLog({
				name: "raiseIntent",
				type: "error",
				value: intent,
			});
			return;
		}

		try {
			let resolution: IntentResolution;

			if (app) {
				resolution = await fdc3.raiseIntent(intent, toJS(context), app);
			} else {
				resolution = await fdc3.raiseIntent(intent, toJS(context));
			}

			systemLogStore.addLog({
				name: "raiseIntent",
				type: "success",
				value: intent,
				variant: "code",
				body: JSON.stringify(resolution, null, 4),
			});

			return resolution;
		} catch (e) {
			systemLogStore.addLog({
				name: "raiseIntent",
				type: "error",
				value: intent,
				variant: "code",
				body: JSON.stringify(e, null, 4),
			});
		}
	}

	async raiseIntentForContext(context: ContextType, app?: (TargetApp & (String | AppIdentifier)) | undefined) {
		if (!context) {
			systemLogStore.addLog({
				name: "raiseIntentForContext",
				type: "error",
			});
			return;
		}

		try {
			let resolution: IntentResolution;

			if (app) {
				resolution = await fdc3.raiseIntentForContext(toJS(context), app);
			} else {
				resolution = await fdc3.raiseIntentForContext(toJS(context));
			}
			systemLogStore.addLog({
				name: "raiseIntentForContext",
				type: "success",
			});
			
			return resolution;
		} catch (e) {
			console.log(e);
			systemLogStore.addLog({
				name: "raiseIntentForContext",
				type: "error",
			});
		}
	}
}

const intentStore = new IntentStore();

export default intentStore;
