import { AppIdentifier, DesktopAgent} from '@finos/fdc3'

/** 
 * We need to add options here. 
 */
export type Options = {

}

export type AppIdentifierResolver = (o: Window) => AppIdentifier;


export type Strategy = {
    supply: (url: string, resolver: AppIdentifierResolver) => void
    load: (options: Options) => Promise<DesktopAgent> 
}