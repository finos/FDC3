import { makeObservable, observable, action, runInAction } from "mobx";
import * as fdc3 from "@finos/fdc3";
import systemLogStore from "./SystemLogStore";
import { fdc3Ready } from "@finos/fdc3";

class AppChannelStore {
	appChannels: fdc3.Channel[] = [];

	currentAppChannel: fdc3.Channel | null = null;

	constructor() {
		makeObservable(this, {
			appChannels: observable,
			currentAppChannel: observable,
			getChannels: action,
			joinChannel: action,
			leaveChannel: action,
			getCurrentChannel: action,
		});

		this.getChannels();
	}

	async getCurrentChannel() {
		try {
			const channel = await fdc3.getCurrentChannel();
			runInAction(() => {
				systemLogStore.addLog({
					name: "getCurrentChannel",
					type: "success",
					value: channel ? channel.id : "none",
					variant: "text",
				});
				this.currentAppChannel = channel;
			});
		} catch (e) {
			runInAction(() => {
				systemLogStore.addLog({
					name: "getCurrentChannel",
					type: "error",
					variant: "text",
				});
			});
		}
	}

	async getChannels() {
		//defer retrieving channels until fdc3 API is ready
		fdc3Ready(5000).then(async () => {
			try {
			
				const systemChannels = await fdc3.getSystemChannels();
				const currentChannel = await fdc3.getCurrentChannel();
	
				runInAction(() => {
					systemLogStore.addLog({
						name: "getChannels",
						type: "success",
					});
					this.appChannels = systemChannels;
					this.currentAppChannel = currentChannel;
				});
			} catch (e) {
				systemLogStore.addLog({
					name: "getChannels",
					type: "error",
					variant: "code",
					body: JSON.stringify(e, null, 4),
				});
			}
		}).catch((reason) => {
			systemLogStore.addLog({
				name: "getFdc3",
				type: "error",
				variant: "text",
				value: reason,
			});
		});
	}

    async getOrCreateChannel(channelId: string) {
		try {
            debugger;
			const currentAppChannel = await fdc3.getOrCreateChannel(channelId);
			const isSuccess = currentAppChannel !== null;

			runInAction(() => {
				systemLogStore.addLog({
					name: "getOrCreateChannel",
					type: isSuccess ? "success" : "error",
					value: isSuccess ? currentAppChannel?.id : channelId,
					variant: "text",
				});
				this.currentAppChannel = currentAppChannel;
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

	async joinChannel(channelId: string) {
		try {
			await fdc3.joinChannel(channelId);
			const currentChannel = await fdc3.getCurrentChannel();
			const isSuccess = currentChannel !== null;

			runInAction(() => {
				systemLogStore.addLog({
					name: "joinChannel",
					type: isSuccess ? "success" : "error",
					value: isSuccess ? currentChannel?.id : channelId,
					variant: "text",
				});
				this.currentAppChannel = currentChannel;
			});
		} catch (e) {
			systemLogStore.addLog({
				name: "joinChannel",
				type: "error",
				value: channelId,
				variant: "code",
				body: JSON.stringify(e, null, 4),
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
}

const appChannelStore = new AppChannelStore();

export default appChannelStore;
