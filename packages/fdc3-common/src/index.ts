import { AppIdentifier } from "@finos/fdc3";
import { DesktopAgent } from "@finos/fdc3";

/** 
 * We need to add options here. 
 */
export type Options = {
    setWindowGlobal?: boolean,
    fireFdc3Ready?: boolean,
    strategies?: Loader[],
    frame?: Window
}

export type AppChecker = (o: Window) => boolean;

export type Supplier = (checker: AppChecker, detailsResolver: DesktopAgentDetailResolver) => void

export type Loader = (options: Options) => Promise<DesktopAgent> 

/**
 * These are details such as login information sent from the desktop back to the 
 * app in order to initialise the api.
 */
export type DesktopAgentDetails = { [key: string] : string | number | boolean }

export type DesktopAgentDetailResolver = (o: Window) => DesktopAgentDetails

export type Method = (r: APIResponseMessage, options: Options) => Promise<DesktopAgent>

/**
 * This is the object that the desktop agent must get back to the App.
 * In the first instance, the only approach to instantiating the desktop
 * agent is via the "message-port" approach.  This may change in the future.
 */
export type APIResponseMessage = {
    type: string,
    method: "message-port",
    uri: string,
    appId: AppIdentifier,
    fdc3Version: string,
    provider: string,
    clientSecret: string,
    details: DesktopAgentDetails
}

export type APIRequestMessage = {
    type: string, 
    methods: string[]
}

export const FDC3_API_REQUEST_MESSAGE_TYPE = 'FDC3-API-Request';
export const FDC3_API_RESPONSE_MESSAGE_TYPE = 'FDC3-API-Response';
export const FDC3_USER_CHANNELS_REQUEST_TYPE = 'FDC3-User-Channels-Request';
export const FDC3_USER_CHANNELS_RESPONSE_TYPE = 'FDC3-User-Channels-Response';
export const FDC3_PORT_TRANSFER_REQUEST_TYPE = 'FDC3-Port-Transfer-Request';
export const FDC3_PORT_TRANSFER_RESPONSE_TYPE = 'FDC3-Port-Transfer-Response';
