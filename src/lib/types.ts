import { DesktopAgent} from '@finos/fdc3'
import electronEvent from './strategies/electron-event'
import postMessage from './strategies/post-message';

/* 
 * this part is the different ways that we can use to talk with the
 * desktop agent once we have a reference to it.
 */
export const JS_INJECT = "js-inject" 
export const POST_MESSAGE_PROTOCOL = "post-message-protocol";

/**
 * This is in preference order, chosen by the app.
 */
export const DEFAULT_METHODS = [ POST_MESSAGE_PROTOCOL, JS_INJECT];

/** 
 * We need to add options here. 
 */
export type Options = {
    setWindowGlobal: boolean,
    fireFdc3Ready: boolean,
    methods: string[],
    strategies: Loader[]
}

export const DEFAULT_OPTIONS : Options = {
    setWindowGlobal: false,
    fireFdc3Ready: false,
    methods: DEFAULT_METHODS,
    strategies: [postMessage, electronEvent]
}

export type AppChecker = (o: Window) => boolean;

export type Supplier = (checker: AppChecker, detailsResolvers: DesktopAgentDetailResolverMap) => void

export type Loader = (options: Options) => Promise<DesktopAgent> 

/**
 * These are details such as login information sent from the desktop back to the 
 * app in order to initialise the api.
 */
export type DesktopAgentDetails = { [key: string] : string | number | boolean }

export type DesktopAgentDetailResolver = (o: Window) => DesktopAgentDetails

/**
 * This maps DesktopAgentDetailResolver implementations to different method names
 */
export type DesktopAgentDetailResolverMap = { [key: string] : DesktopAgentDetailResolver }

export type Method = (r: APIResponseMessage) => Promise<DesktopAgent>

/**
 * This is the object that the desktop agent must get back to the App.
 */
export type APIResponseMessage = {
    type: string,
    method: string,
    details: DesktopAgentDetails
}

export type APIRequestMessage = {
    type: string, 
    methods: string[]
}

export const FDC3_API_REQUEST_MESSAGE_TYPE = 'FDC3-API-Request';
export const FDC3_API_RESPONSE_MESSAGE_TYPE = 'FDC3-API-Response';
