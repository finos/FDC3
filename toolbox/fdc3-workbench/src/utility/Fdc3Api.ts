/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import * as fdc3_2 from "@finos/fdc3";
import * as fdc3_1 from "fdc3-1.2";
import { fdc3Ready } from "@finos/fdc3";

const fdc3ReadyPromise = fdc3Ready();
interface fdc3_1IntentResolution extends fdc3_1.IntentResolution {
	getResult?: any;
	resultContext?: any;
}
interface fdc3_2IntentResolution extends fdc3_2.IntentResolution {
	resultContext?: any;
}

interface fdc3_1ImplementationMetadata extends fdc3_1.ImplementationMetadata {
	appMetadata?: any;
}

interface fdc3_2ImplementationMetadata extends fdc3_2.ImplementationMetadata {
	appMetadata: any;
}

export type ContextType = {
	type: string;
	id?: {
		[key: string]: string;
	};
	name?: string;
	[x: string]: any;
};

export interface Fdc3Listener {
	id: string;
	channelId?: string;
	type: string | undefined;
	listener: fdc3_1.Listener | fdc3_2.Listener;
	lastReceivedContext?: ContextType | null;
	metaData?: any;
}

export type IntentResolution = fdc3_1IntentResolution | fdc3_2IntentResolution;

export type TargetApp = fdc3_1.TargetApp;

export type Channel = fdc3_2.Channel | fdc3_1.Channel;

export type ImplementationMetadata = fdc3_1ImplementationMetadata | fdc3_2ImplementationMetadata;

export type AppMetadata = fdc3_2.AppMetadata;
//  & {
// 	instanceId?: string;
// };

export type AppIntent = fdc3_1.AppIntent | fdc3_2.AppIntent;

export type Context = fdc3_1.Context | fdc3_2.Context;

// export type AppIdentifier = fdc3_1.AppMetadata | fdc3_2.AppIdentifier;

export type PrivateChannel = fdc3_2.PrivateChannel;

export type IntentTargetOption = {
	appId: string;
	metadata: AppMetadata;
	instances: fdc3_2.AppMetadata[];
	launchNew: boolean;
};

export type ContextTargetOption = { intent: string; targetOptions: IntentTargetOption[] };

class Fdc3Api {
	fdc3Methods: typeof fdc3_1 | typeof fdc3_2;

	constructor() {
		this.fdc3Methods = window.fdc3Version === "2.0" ? fdc3_2 : fdc3_1;
	}

	getCurrentChannel() {
		return this.fdc3Methods.getCurrentChannel();
	}

	broadcast(context: fdc3_1.Context | fdc3_2.Context) {
		return this.fdc3Methods.broadcast(context);
	}

	async addIntentListener(intent: string, handler: fdc3_1.ContextHandler | fdc3_2.ContextHandler) {
		return await this.fdc3Methods.addIntentListener(intent, handler);
	}

	async addContextListener(contextTypeOrNull: string | null, handler: fdc3_1.ContextHandler | fdc3_2.ContextHandler) {
		if (window.fdc3Version === "2.0") {
			return await fdc3_2.addContextListener(contextTypeOrNull, handler);
		} else {
			if (contextTypeOrNull === null) {
				return await fdc3_1.addContextListener(handler);
			} else {
				return await fdc3_1.addContextListener(contextTypeOrNull, handler);
			}
		}
	}

	async raiseIntent(intent: string, context: fdc3_1.Context | fdc3_2.Context, app?: AppMetadata | undefined) {
		if (window.fdc3Version === "2.0") {
			return await fdc3_2.raiseIntent(
				intent,
				context,
				app
					? {
						appId: app?.appId ? app.appId : "",
						instanceId: (app as fdc3_2.AppMetadata)?.instanceId,
					}
					: undefined
			);
		} else {
			return fdc3_1.raiseIntent(intent, context, app?.appId ?? app?.name ?? undefined);
		}
	}

	async raiseIntentForContext(context: fdc3_1.Context & fdc3_2.Context, app?: AppMetadata) {
		if (window.fdc3Version === "2.0") {
			return await fdc3_2.raiseIntentForContext(context, app as fdc3_2.AppMetadata);
		} else {
			return await fdc3_1.raiseIntentForContext(context, app as fdc3_1.AppMetadata);
		}
	}

	getUserChannels() {
		if (window.fdc3Version === "2.0") {
			return fdc3_2.getUserChannels();
		} else {
			return fdc3_1.getSystemChannels();
		}
	}

	joinUserChannel(channelId: string) {
		if (window.fdc3Version === "2.0") {
			return fdc3_2.joinUserChannel(channelId);
		} else {
			return fdc3_1.joinChannel(channelId);
		}
	}

	leaveCurrentChannel() {
		return this.fdc3Methods.leaveCurrentChannel();
	}

	fdc3Ready(waitForMs?: number | undefined) {
		return fdc3ReadyPromise;
	}

	async getOrCreateChannel(channelId: string) {
		return await this.fdc3Methods.getOrCreateChannel(channelId);
	}

	getInfo() {
		return this.fdc3Methods.getInfo();
	}

	findIntent(intent: string, context: Context) {
		return this.fdc3Methods.findIntent(intent, context);
	}

	findIntentsByContext(context: Context) {
		return this.fdc3Methods.findIntentsByContext(context);
	}

	async createPrivateChannel() {
		return fdc3_2.createPrivateChannel();
	}

	async findInstances(targetApp: any) {
		return await fdc3_2.findInstances(targetApp);
	}

	async getTargetOptions(intent: string, context: ContextType): Promise<IntentTargetOption[]> {
		let appIntent = await this.findIntent(intent, context);
		if (!appIntent?.apps) {
			return [];
		}

		const groupedApps: IntentTargetOption[] = [];

		if (window.fdc3Version === "2.0") {
			appIntent = appIntent as fdc3_2.AppIntent;
			appIntent.apps.forEach((currentApp) => {
				let foundApp = groupedApps.find((app) => app.appId === currentApp.appId);
				if (!foundApp) {
					//separate out the instanceId if present
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { instanceId: _, ...metadata } = currentApp;
					const option: IntentTargetOption = {
						appId: currentApp.appId,
						metadata: metadata,
						instances: [],
						launchNew: false,
					};
					if (currentApp.instanceId) {
						option.instances.push(currentApp);
					} else {
						option.launchNew = true;
					}
					groupedApps.push(option);
				} else {
					if (currentApp.instanceId) {
						foundApp.instances.push(currentApp);
					} else {
						foundApp.launchNew = true;
					}
				}
			});
		} else {
			//no instances in FDC3 < 2
			appIntent = appIntent as fdc3_1.AppIntent;
			appIntent.apps.forEach((currentApp) => {
				//deduplicate results in case a 2.0 implementation returned instances
				let foundApp = groupedApps.find((app) => app.appId === currentApp.appId);
				if (!foundApp) {
					groupedApps.push({
						appId: currentApp.appId ?? currentApp.name,
						metadata: currentApp as fdc3_2.AppMetadata, //hack to avoid type error
						instances: [],
						launchNew: true,
					});
				}
			});
		}

		return groupedApps;
	}

	async getTargetOptionsForContext(context: ContextType): Promise<IntentTargetOption[]> {
		let appIntents = await this.findIntentsByContext(context);
		if (appIntents.length === 0) {
			return [];
		}

		//We only return apps to target which means we need to deduplicate where they are returned more than once
		const groupedApps: IntentTargetOption[] = [];

		if (window.fdc3Version === "2.0") {
			appIntents = appIntents as fdc3_2.AppIntent[];

			appIntents.forEach((currentIntent) => {
				currentIntent.apps.forEach((currentApp) => {
					let foundApp = groupedApps.find((app) => app.appId === currentApp.appId);
					if (!foundApp) {
						//separate out the instanceId if present
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						const { instanceId: _, ...metadata } = currentApp;
						const option: IntentTargetOption = {
							appId: currentApp.appId,
							metadata: metadata,
							instances: [],
							launchNew: false,
						};
						if (currentApp.instanceId) {
							option.instances.push(currentApp);
						} else {
							option.launchNew = true;
						}
						groupedApps.push(option);
					} else {
						if (currentApp.instanceId) {
							//deduplicate instances
							let foundInstance = foundApp.instances.find((instance) => instance.instanceId === currentApp.instanceId);
							if (!foundInstance) {
								foundApp.instances.push(currentApp);
							}
						} else {
							foundApp.launchNew = true;
						}
					}
				});
			});
		} else {
			appIntents = appIntents as fdc3_1.AppIntent[];
			appIntents.forEach((currentIntent) => {
				currentIntent.apps.forEach((currentApp) => {
					//deduplicate in case a 2.0 implementation returned some instances
					let foundApp = groupedApps.find((app) => app.appId === currentApp.appId);
					if (!foundApp) {
						groupedApps.push({
							appId: currentApp.appId ?? currentApp.name,
							metadata: currentApp as fdc3_2.AppMetadata, //hack to avoid type error
							instances: [],
							launchNew: true,
						});
					}
				});
			});
		}

		return groupedApps;
	}
}

const fdc3 = new Fdc3Api();

export default fdc3;
