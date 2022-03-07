import { makeObservable, observable, action, runInAction } from "mobx";
import * as fdc3 from "@finos/fdc3";
import systemLogStore from "./SystemLogStore";
import { fdc3Ready } from "@finos/fdc3";

class ChannelStore {
	systemChannels: fdc3.Channel[] = [];

	currentChannel: fdc3.Channel | null = null;

	constructor() {
		makeObservable(this, {
			systemChannels: observable,
			currentChannel: observable,
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
				this.currentChannel = channel;
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
					this.systemChannels = systemChannels;
					this.currentChannel = currentChannel;
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
				this.currentChannel = currentChannel;
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
						value: this.currentChannel?.id,
						variant: "text",
					});

					if (isSuccess) {
						this.currentChannel = null;
					}
				});
			}
		} catch (e) {
			systemLogStore.addLog({
				name: "leaveChannel",
				type: "error",
				value: this.currentChannel?.id,
				variant: "code",
				body: JSON.stringify(e, null, 4),
			});
		}
	}
}

const channelStore = new ChannelStore();

export default channelStore;
