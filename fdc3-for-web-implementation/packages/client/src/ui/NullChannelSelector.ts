import { Channel, } from "@finos/fdc3";
import { Connectable } from "@kite9/fdc3-common";
import { ChannelSelector } from "@kite9/fdc3-common";

export class NullChannelSelector implements ChannelSelector, Connectable {

    async disconnect(): Promise<void> {
    }

    async connect(): Promise<void> {
    }

    updateChannel(_channelId: string | null, _availableChannels: Channel[]): void {
    }

    setChannelChangeCallback(_callback: (channelId: string) => void): void {
    }


}
