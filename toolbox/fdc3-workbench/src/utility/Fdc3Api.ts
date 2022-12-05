import * as fdc3_1 from "fdc3-1.2";
import * as fdc3_2 from "fdc3-2.0";

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

export type Channel = fdc3_1.Channel | fdc3_2.Channel;

export type ImplementationMetadata = fdc3_1ImplementationMetadata | fdc3_2ImplementationMetadata;

export type AppMetadata = (fdc3_1.AppMetadata | fdc3_2.AppMetadata) & {
	instanceId?: string;
};

export type AppIntent = fdc3_1.AppIntent | fdc3_2.AppIntent;

export type Context = fdc3_1.Context | fdc3_2.Context;

export type AppIdentifier = fdc3_2.AppIdentifier;

export type PrivateChannel = fdc3_2.PrivateChannel;

type FDC3_2 = typeof fdc3_2 & {
	createPrivateChannel?: any;
};
class Fdc3Api {
	fdc3: typeof fdc3_1 | typeof fdc3_2;

	FDC3_2: FDC3_2;

	constructor() {
		this.fdc3 = window.fdc3Version === "2.0" ? fdc3_2 : fdc3_1;
		this.FDC3_2 = fdc3_2;
	}

	getCurrentChannel() {
		return this.fdc3.getCurrentChannel();
	}

	broadcast(context: fdc3_1.Context | fdc3_2.Context) {
		return this.fdc3.broadcast(context);
	}

	async addIntentListener(intent: string, handler: fdc3_1.ContextHandler | fdc3_2.ContextHandler) {
		return await this.fdc3.addIntentListener(intent, handler);
	}

	async addContextListener(
		contextTypeOrHandler: string | fdc3_1.ContextHandler | fdc3_2.ContextHandler,
		handler?: fdc3_1.ContextHandler | fdc3_2.ContextHandler | undefined
	) {
		return await this.fdc3.addContextListener(contextTypeOrHandler, handler);
	}

	async raiseIntent(intent: string, context: fdc3_1.Context & fdc3_2.Context, app?: AppMetadata | undefined) {
		if (window.fdc3Version === "2.0") {
			return await fdc3_2.raiseIntent(intent, context, {
				appId: app?.appId ? app.appId : "",
				instanceId: app?.instanceId && app.instanceId,
			});
		} else {
			return fdc3_1.raiseIntent(intent, context, app?.appId);
		}
	}

	async raiseIntentForContext(
		context: fdc3_1.Context & fdc3_2.Context,
		app?: (fdc3_1.TargetApp & (String | fdc3_2.AppIdentifier)) | undefined
	) {
		let r = <any>await this.fdc3.raiseIntentForContext(context, app);
		console.log(r);
		console.log(await r.getResult());
		return r;
	}

	getSystemChannels() {
		return this.fdc3.getSystemChannels();
	}

	joinChannel(channelId: string) {
		return this.fdc3.joinChannel(channelId);
	}

	leaveCurrentChannel() {
		return this.fdc3.leaveCurrentChannel();
	}

	fdc3Ready(waitForMs?: number | undefined) {
		return this.fdc3.fdc3Ready(waitForMs);
	}

	async getOrCreateChannel(channelId: string) {
		return await this.fdc3.getOrCreateChannel(channelId);
	}

	async getInfo() {
		return await this.fdc3.getInfo();
	}

	findIntentsByContext(context: Context) {
		return this.fdc3.findIntentsByContext(context);
	}

	async createPrivateChannel() {
		return this.FDC3_2.createPrivateChannel();
	}
}

const fdc3 = new Fdc3Api();

export default fdc3;
