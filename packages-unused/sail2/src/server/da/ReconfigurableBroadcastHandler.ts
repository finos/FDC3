import { BroadcastHandler, ChannelState } from "da-server/src/handlers/BroadcastHandler";
import { ChannelMetadata } from "./message-types";


export class ReconfigurableBroadcastHandler extends BroadcastHandler {

    private channelMetadata: ChannelMetadata[]

    constructor(name: string, cm: ChannelMetadata[]) {
        const state: ChannelState = {}
        cm.forEach(item => {
            state[item.id] = []
        })

        super(name, state)
        this.channelMetadata = cm
    }

    updateChannels(cm: ChannelMetadata[]) {
        cm.forEach(item => {
            if (!this.state[item.id]) {
                // create the new channel
                this.state[item.id] = []
            }
        })

        this.channelMetadata = cm
    }

    getChannelMetadata(): ChannelMetadata[] {
        return this.channelMetadata
    }

}