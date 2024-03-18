import { AppIdentifier, DesktopAgent } from "@finos/fdc3";
import { exchange, exchangePostMessage, exchangeForMessagePort } from "./exchange";
import { PrivateChannelOnAddContextListenerAgentRequest, PrivateChannelOnAddContextListenerAgentRequestMeta, PrivateChannelOnUnsubscribeAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";

/** 
 * We need to add options here. 
 */
export type Options = {
    setWindowGlobal?: boolean,
    fireFdc3Ready?: boolean,
    strategies?: Loader[],
    frame?: Window,
    waitForMs?: number
}

export { exchange, exchangePostMessage, exchangeForMessagePort }

export type AppChecker = (o: Window) => AppIdentifier | undefined;

export type Supplier = (
    checker: AppChecker,
    detailsResolver: DesktopAgentDetailResolver,
    portResolver?: DesktopAgentPortResolver) => void;

export type Loader = (options: Options) => Promise<DesktopAgent>

/**
 * These are details such as login information sent from the desktop back to the 
 * app in order to initialise the api.
 */
export type DesktopAgentDetails = { [key: string]: string | number | boolean }

/**
 * Use these to return details specific to the window/app needing a connection
 */
export type DesktopAgentDetailResolver = (o: Window, a: AppIdentifier) => DesktopAgentDetails

/**
 * Return a MessagePort specific to the window/app in question
 */
export type DesktopAgentPortResolver = (o: Window, a: AppIdentifier) => MessagePort | null

/**
 * This is the object that the desktop agent must get back to the App.
 * In the first instance, the only approach to instantiating the desktop
 * agent is via the "message-port" approach.  This may change in the future.
 */
export type APIResponseMessage = {
    type: string,
    method: "message-port",
    uri?: string,           /* Supplied when an embedded iframe should be loaded */
    appIdentifier: AppIdentifier,
    // fdc3Version: string,
    // supportedFDC3Versions: string[],
    // desktopAgentBridgeVersion: string,
    // authRequired: boolean,
    // provider: string,
    // authToken?: string,
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

/** Message Types Not Defined By Bridging, But Needed */
export type OnAddContextListenerAgentRequest = PrivateChannelOnAddContextListenerAgentRequest & {
    type: "onAddContextListener"
}

export type OnUnsubscribeAgentRequest = PrivateChannelOnUnsubscribeAgentRequest & {
    type: "onUnsubscribe"
}

export type OnAddIntentListenerAgentRequest = {
    type: 'onAddIntentListener',
    meta: PrivateChannelOnAddContextListenerAgentRequestMeta,
    payload: {
        intent: string,
    }
}

export type OnUnsubscribeIntentListenerAgentRequest = {
    type: 'onUnsubscribeIntentListener',
    meta: PrivateChannelOnAddContextListenerAgentRequestMeta,
    payload: {
        intent: string,
    }
}
