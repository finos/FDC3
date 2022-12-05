import { makeObservable, observable, action, runInAction, toJS } from "mobx";
import fdc3, {
	ContextType,
	IntentResolution,
	Fdc3Listener,
	TargetApp,
	AppMetadata,
	AppIdentifier,
	Channel,
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

	async addIntentListener(intent: string, channelName?: string | null, isPrivate?: boolean, delay?: number) {
		try {
			const listenerId = nanoid();

			const intentListener = await fdc3.addIntentListener(intent, async (context: ContextType, metaData?: any) => {
				const currentListener = this.intentListeners.find(({ id }) => id === listenerId);
				let channel: Channel | undefined;

				//app channel
				if(channelName && !isPrivate) {
					channel = await appChannelStore.getOrCreateChannel(channelName);
					console.log(`returning app channel:  ${channel?.id}`);
				}

				//private channel
				if(isPrivate && channelName === null) {
					channel = await privateChannelStore.createPrivateChannel();
					console.log(`returning private channel: ${channel?.id}`);
				}

				if(channel) {
					const broadcast = setTimeout(() => {
						channel?.broadcast(context);
					}, delay);
					clearTimeout(broadcast);
				}

				runInAction(() => {
					if (currentListener) {
						currentListener.lastReceivedContext = context;
						currentListener.metaData = metaData;
					}
				});

				systemLogStore.addLog({
					name: "receivedIntentListener",
					type: "info",
					value: intent,
					variant: "code",
					body: JSON.stringify(context, null, 4),
				});

				return {context, channel};
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
			if (app) {
				await fdc3.raiseIntentForContext(toJS(context), app);
			} else {
				await fdc3.raiseIntentForContext(toJS(context));
			}

			systemLogStore.addLog({
				name: "raiseIntentForContext",
				type: "success",
			});
		} catch (e) {
			systemLogStore.addLog({
				name: "raiseIntentForContext",
				type: "error",
			});
		}
	}
}

const intentStore = new IntentStore();

export default intentStore;
