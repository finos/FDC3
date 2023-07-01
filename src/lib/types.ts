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

export type AppIdentifierResolver = (o: Window) => AppIdentifier;


export type Strategy = {
    supply: (url: string, resolver: AppIdentifierResolver) => void
    load: (options: Options) => Promise<DesktopAgent> 
}

/**
 * When writing an FDC3 implementation, this is the shape of the function
 * that should be returned by the DesktopAgent's supply url.
 */
export type FDC3Initialiser = (id: AppIdentifier) => DesktopAgent

/**
 * This is the object that the desktop agent must get back to the App.
 */
export type APIResponseMessage = {
    type: string,
    url: string,
    appIdentifier: AppIdentifier
}