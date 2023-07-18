/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { makeObservable, observable, runInAction, action, toJS } from "mobx";
import * as fdc3 from "@finos/fdc3";
import { nanoid } from "nanoid";
import { contexts } from "../fixtures/contexts";
import systemLogStore from "./SystemLogStore";

export type ContextType = {
	type: string;
	id?: {
		[key: string]: string;
	};
	name?: string;
	[x: string]: any;
};

export type ContextItem = {
	id: string;
	template: ContextType | null;
	schemaUrl?: URL;
};

interface Fdc3Listener {
	id: string;
	type: string;
	listener: fdc3.Listener;
	lastReceivedContext?: ContextType | null;
}

class ContextStore {
	contextsList: ContextItem[] = contexts;

	currentContext: ContextType | null = null;

	contextListeners: Fdc3Listener[] = [];

	constructor() {
		makeObservable(this, {
			contextsList: observable,
			currentContext: observable,
			contextListeners: observable,
			createContext: action,
			broadcast: action,
			addContextItem: action,
			saveContextItem: action,
			addContextListener: action,
			removeContextListener: action,
		});
	}

	addContextItem(contextItem: ContextItem) {
		this.contextsList.push(contextItem);
		this.contextsList.sort((a, b) => (a.id > b.id ? 1 : -1));
	}

	saveContextItem(contextItem: ContextItem) {
		const context = this.contextsList.find(({ id }) => id === contextItem.id);

		if (context) {
			context.template = contextItem.template;
		}
	}

	createContext(context: ContextType) {
		this.currentContext = context;
	}

	async broadcast() {
		if (this.currentContext) {
			//check that we're on a channel
			let currentChannel = await fdc3.getCurrentChannel();
			if (!currentChannel) {
				systemLogStore.addLog({
					name: "broadcast",
					type: "warning",
					value: "You are not currently joined to a channel (no-op)",
					variant: "text",
				});
			} else {
				try {
					await fdc3.broadcast(toJS(this.currentContext));
					systemLogStore.addLog({
						name: "broadcast",
						type: "success",
						body: JSON.stringify(this.currentContext, null, 4),
						variant: "code",
					});
				} catch (e) {
					systemLogStore.addLog({
						name: "broadcast",
						type: "error",
						body: JSON.stringify(e, null, 4),
						variant: "code",
					});
				}
			}
		} else {
			systemLogStore.addLog({
				name: "broadcast",
				type: "warning",
				value: "You must set a context before you can broadcast it",
				variant: "text",
			});
		}
	}

	addContextListener(contextType: string) {
		try {
			const listenerId = nanoid();

			// TODO: remove window after fixing https://github.com/finos/FDC3/issues/435
			const contactListener = window.fdc3.addContextListener(contextType === "all" ? null : contextType, (context) => {
				const currentListener = this.contextListeners.find(({ id }) => id === listenerId);

				runInAction(() => {
					if (currentListener) {
						currentListener.lastReceivedContext = context;
					}
				});

				systemLogStore.addLog({
					name: "receivedContextListener",
					type: "info",
					value: contextType,
					variant: "code",
					body: JSON.stringify(context, null, 4),
				});
			});

			runInAction(() => {
				systemLogStore.addLog({
					name: "addContextListener",
					type: "success",
					value: contextType,
					variant: "text",
				});
				this.contextListeners.push({ id: listenerId, type: contextType, listener: contactListener });
			});
		} catch (e) {
			systemLogStore.addLog({
				name: "addContextListener",
				type: "error",
				value: contextType,
				variant: "code",
				body: JSON.stringify(e, null, 4),
			});
		}
	}

	removeContextListener(id: string) {
		const listenerIndex = this.contextListeners.findIndex((listener) => listener.id === id);

		if (listenerIndex !== -1) {
			try {
				this.contextListeners[listenerIndex].listener.unsubscribe();

				runInAction(() => {
					systemLogStore.addLog({
						name: "removeContextListener",
						type: "success",
						value: this.contextListeners[listenerIndex].type,
						variant: "text",
					});
					this.contextListeners.splice(listenerIndex, 1);
				});
			} catch (e) {
				systemLogStore.addLog({
					name: "removeContextListener",
					type: "error",
					value: this.contextListeners[listenerIndex].type,
					variant: "code",
					body: JSON.stringify(e, null, 4),
				});
			}
		}
	}

	isContextListenerExists(type: string) {
		return !!this.contextListeners.find((listener) => listener.type === type);
	}
}

const contextStore = new ContextStore();

export default contextStore;
