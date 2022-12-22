import { makeObservable, observable, action, runInAction } from "mobx";
import fdc3, { Channel } from "../utility/Fdc3Api";
import systemLogStore from "./SystemLogStore";

class ChannelStore {
	userChannels: Channel[] = [];

	currentUserChannel: Channel | null = null;

	constructor() {
		makeObservable(this, {
			userChannels: observable,
			currentUserChannel: observable,
			getUserChannels: action,
			joinUserChannel: action,
			leaveUserChannel: action,
			getCurrentUserChannel: action,
		});

		this.getUserChannels();
	}

	async getCurrentUserChannel() {
		try {
			const userChannel = await fdc3.getCurrentChannel();
			runInAction(() => {
				systemLogStore.addLog({
					name: "getCurrentChannel",
					type: "success",
					value: userChannel ? userChannel.id : "none",
					variant: "text",
				});
				this.currentUserChannel = userChannel;
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

	async getUserChannels() {
		//defer retrieving channels until fdc3 API is ready
		fdc3
			.fdc3Ready(5000)
			.then(async () => {
				try {
					const userChannels = await fdc3.getSystemChannels();
					const currentUserChannel = await fdc3.getCurrentChannel();

					runInAction(() => {
						systemLogStore.addLog({
							name: "getChannels",
							type: "success",
						});
						this.userChannels = userChannels;
						this.currentUserChannel = currentUserChannel;
					});
				} catch (e) {
					systemLogStore.addLog({
						name: "getChannels",
						type: "error",
						variant: "code",
						body: JSON.stringify(e, null, 4),
					});
				}
			})
			.catch((reason) => {
				systemLogStore.addLog({
					name: "getFdc3",
					type: "error",
					variant: "text",
					value: reason,
				});
			});
	}

	async joinUserChannel(channelId: string) {
		try {
			await fdc3.joinChannel(channelId);
			const currentUserChannel = await fdc3.getCurrentChannel();
			const isSuccess = currentUserChannel !== null;

			runInAction(() => {
				systemLogStore.addLog({
					name: "joinUserChannel",
					type: isSuccess ? "success" : "error",
					value: isSuccess ? currentUserChannel?.id : channelId,
					variant: "text",
				});
				this.currentUserChannel = currentUserChannel;
			});
		} catch (e) {
			systemLogStore.addLog({
				name: "joinUserChannel",
				type: "error",
				value: channelId,
				variant: "code",
				body: JSON.stringify(e, null, 4),
			});
		}
	}

	async leaveUserChannel() {
		try {
			//check that we're on a channel
			let currentUserChannel = await fdc3.getCurrentChannel();
			if (!currentUserChannel) {
				systemLogStore.addLog({
					name: "leaveChannel",
					type: "warning",
					value: "",
					variant: "text",
				});
			} else {
				await fdc3.leaveCurrentChannel();
				currentUserChannel = await fdc3.getCurrentChannel();
				const isSuccess = currentUserChannel === null;

				runInAction(() => {
					systemLogStore.addLog({
						name: "leaveChannel",
						type: isSuccess ? "success" : "error",
						value: this.currentUserChannel?.id,
						variant: "text",
					});

					if (isSuccess) {
						this.currentUserChannel = null;
					}
				});
			}
		} catch (e) {
			systemLogStore.addLog({
				name: "leaveChannel",
				type: "error",
				value: this.currentUserChannel?.id,
				variant: "code",
				body: JSON.stringify(e, null, 4),
			});
		}
	}
}

const channelStore = new ChannelStore();

export default channelStore;
