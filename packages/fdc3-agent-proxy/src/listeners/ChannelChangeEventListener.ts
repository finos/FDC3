import { EventHandler, FDC3ChannelChangedEvent } from "@finos/fdc3-standard";
import { EventListener } from "./EventListener";
import { AgentEventMessage, ChannelChangedEvent } from "@finos/fdc3-schema/generated/api/BrowserTypes";
import { Messaging } from "../Messaging";


export class ChannelChangeEventListener extends EventListener {

    constructor(messaging: Messaging, handler: EventHandler) {
        super(messaging, 'channelChangedEvent', handler);
    }

    action(m: AgentEventMessage): void {
        if (m.type === 'channelChangedEvent') {
            const cm: ChannelChangedEvent = m;
            const restructured: FDC3ChannelChangedEvent = {
                type: 'userChannelChanged',
                details: {
                    currentChannelId: cm.payload.newChannelId,
                },
                string: 'userChannelChanged' // ISSUE:  #1585

            }

            this.handler(restructured);
        }
    }
}