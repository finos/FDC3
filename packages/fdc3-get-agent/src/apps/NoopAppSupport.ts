import { AppIdentifier, AppMetadata } from "@kite9/fdc3-core";
import { Messaging } from "@kite9/da-proxy";
import { DefaultAppSupport } from "@kite9/da-proxy";

export class NoopAppSupport extends DefaultAppSupport {

    constructor(messaging: Messaging) {
        super(messaging);
    }

    async getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
        return {
            appId: app.appId
        }
    }


}