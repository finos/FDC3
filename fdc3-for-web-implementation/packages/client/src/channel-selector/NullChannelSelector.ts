import { Channel } from "@finos/fdc3";
import { ChannelSelector } from "@kite9/fdc3-common";

export class NullChannelSelector implements ChannelSelector {


    updateChannel(_channelId: string | null, _availableChannels: Channel[]): void {
    }

    setChannelChangeCallback(_callback: (channelId: string) => void): void {
    }


}
