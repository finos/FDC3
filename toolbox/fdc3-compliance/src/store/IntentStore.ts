import { makeObservable, observable, action, runInAction, toJS } from "mobx";
import * as fdc3 from "@finos/fdc3";
import { nanoid } from "nanoid";
import contextStore, { ContextType } from "./ContextStore";
import { intentTypes } from "../fixtures/intentTypes";
import systemLogStore from "./SystemLogStore";

type IntentItem = { title: string; value: string };

interface Fdc3Listener {
	id: string;
	type: string;
	listener: fdc3.Listener;
	lastReceivedContext?: ContextType | null;
}

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

	addIntentListener(intent: string) {
		try {
			const listenerId = nanoid();

			const intentListener = fdc3.addIntentListener(intent, (context) => {
				const currentListener = this.intentListeners.find(({ id }) => id === listenerId);

				runInAction(() => {
					if (currentListener) {
						currentListener.lastReceivedContext = context;
					}
				});

				systemLogStore.addLog({
					name: "receivedIntentListener",
					type: "info",
					value: intent,
					variant: "code",
					body: JSON.stringify(context, null, 4),
				});
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

	removeIntentListener(id: string) {
		const listenerIndex = this.intentListeners.findIndex((listener) => listener.id === id);

		if (listenerIndex !== -1) {
			try {
				this.intentListeners[listenerIndex].listener.unsubscribe();

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

	async raiseIntent(intent: string) {
		if (contextStore.currentContext) {
			try {
				const appIntent = await fdc3.raiseIntent(intent, toJS(contextStore.currentContext));

				systemLogStore.addLog({
					name: "raiseIntent",
					type: "success",
					value: intent,
					variant: "code",
					body: JSON.stringify(appIntent, null, 4),
				});
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
	}

	async raiseIntentForContext() {
		if (contextStore.currentContext) {
			try {
				await fdc3.raiseIntentForContext(toJS(contextStore.currentContext));

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
}

const intentStore = new IntentStore();

export default intentStore;
