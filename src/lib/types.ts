import { DesktopAgent} from '@finos/fdc3'

/** 
 * We need to add options here. 
 */
export type Options = {
    setWindowGlobal: boolean,
    fireFdc3Ready: boolean
}

export const DEFAULT_OPTIONS : Options = {
    setWindowGlobal: false,
    fireFdc3Ready: false
}

export type AppChecker = (o: Window) => boolean;

export type Supplier = (url: string, checker: AppChecker, detailsResolver: DesktopAgentDetailResolver) => void
export type Loader = (options: Options) => Promise<DesktopAgent> 

/**
 * These are details such as login information sent from the desktop back to the 
 * app in order to initialise the api.
 */
export type DesktopAgentDetails = { [key: string] : string | number | boolean }

export type DesktopAgentDetailResolver = (o: Window) => DesktopAgentDetails

/**
 * When writing an FDC3 implementation, this is the shape of the function
 * that should be returned by the DesktopAgent's supply url.
 */
export type FDC3Initialiser = (details: DesktopAgentDetails) => DesktopAgent

/**
 * This is the object that the desktop agent must get back to the App.
 */
export type APIResponseMessage = {
    type: string,
    url: string,
    details: DesktopAgentDetails
}