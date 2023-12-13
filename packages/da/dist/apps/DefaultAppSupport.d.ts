import { AppIdentifier, AppMetadata, Context } from "@finos/fdc3";
import { AppSupport } from "./AppSupport";
import { Messaging } from "../Messaging";
export declare class DefaultAppSupport implements AppSupport {
    readonly messaging: Messaging;
    readonly appIdentifier: AppIdentifier;
    private thisAppMetadata;
    constructor(messaging: Messaging, appIdentifier: AppIdentifier);
    hasDesktopAgentBridging(): boolean;
    hasOriginatingAppMetadata(): boolean;
    findInstances(_app: AppIdentifier): Promise<AppIdentifier[]>;
    getAppMetadata(app: AppIdentifier): Promise<AppMetadata>;
    open(_app: AppIdentifier, _context?: Context | undefined): Promise<AppIdentifier>;
    getThisAppMetadata(): Promise<AppMetadata>;
}
