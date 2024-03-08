import { components } from '../directory-schema'

type schemas = components['schemas']

export type DirectoryIntent = schemas['Intent'] & { intentName: string, appId: string }
export type DirectoryApp = schemas['Application'];


/**
 * This interface wraps the functionality of the FDC3 Directory structure (stored in JSON),
 * providing lookup calls to functions that would be handled by inspecting the directory/directories JSON definitions.
 */

export interface Directory {

    /** For retrieving intents */

    //retrieveIntents(contextType: string | undefined, intentName: string | undefined, resultType: string | undefined): DirectoryIntent[]

    retrieveAllIntents(): DirectoryIntent[]


    /** For retrieving apps */

    retrieveApps(contextType: string | undefined, intentName: string | undefined, resultType: string | undefined): DirectoryApp[]

    retrieveAppsById(appId: string): DirectoryApp[]

    retrieveAllApps(): DirectoryApp[]

    /**
     * For FDC3 1.2, retreives by the name of the app
     */
    retrieveAppsByName(name: string): DirectoryApp[]

}
