import { AppIdentifier, DesktopAgent} from '@finos/fdc3'

/** 
 * We need to add options here. 
 */
export type Options = {
    setWindowGlobal: boolean
}

export const DEFAULT_OPTIONS : Options = {
    setWindowGlobal: false
}

export type AppIdentifierResolver = (o: Window) => AppIdentifier | undefined;

export type Strategy = {
    supply: (url: string, idResolver: AppIdentifierResolver, detailsResolver: DesktopAgentDetailResolver) => void
    load: (options: Options) => Promise<DesktopAgent> 
}

/**
 * These are details such as login information sent from the desktop back to the 
 * app in order to initialise the api.
 */
export type DesktopAgentDetails = { [key: string] : string | number | boolean }

export type DesktopAgentDetailResolver = (a: AppIdentifier) => DesktopAgentDetails

/**
 * When writing an FDC3 implementation, this is the shape of the function
 * that should be returned by the DesktopAgent's supply url.
 */
export type FDC3Initialiser = (id: AppIdentifier, daDetails: DesktopAgentDetails) => DesktopAgent

/**
 * This is the object that the desktop agent must get back to the App.
 */
export type APIResponseMessage = {
    type: string,
    url: string,
    appIdentifier: AppIdentifier,
    daDetails: DesktopAgentDetails
}