import { AppIdentifier, AppMetadata } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { DefaultAppSupport } from "./DefaultAppSupport";

export class NoopAppSupport extends DefaultAppSupport {

    constructor(messaging: Messaging, appIdentifier: AppIdentifier, desktopAgent: string) {
        super(messaging, appIdentifier, desktopAgent);
    }

    async getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
        return {
            appId: app.appId
        }
    }
}