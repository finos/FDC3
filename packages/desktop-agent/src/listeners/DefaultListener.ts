import { Listener } from "@finos/fdc3";
import { Messaging } from "../Messaging";

export class DefaultListener implements Listener {

    readonly messaging: Messaging

    constructor(messaging: Messaging, filter: any) {
        this.messaging = messaging;
        this.messaging.onmessage(filter).then(m => {



        })
    }

}