import { DesktopAgent} from '@finos/fdc3'
import { strategy } from './strategies/post-message-load-js'
import { AppIdentifierResolver, DEFAULT_OPTIONS, DesktopAgentDetailResolver, Options } from './types';

/**
 * This configures the postMessage listener to respond to requests for desktop agent APIs.
 * Called by the desktop agent
 */
export function supply(url: string, appIdResolver: AppIdentifierResolver, detailsResolver: DesktopAgentDetailResolver) {
    strategy.supply(url, appIdResolver, detailsResolver);
}


/**
 * This return an FDC3 API.  Called by Apps.
 */
export function load(options: Options = DEFAULT_OPTIONS) : Promise<DesktopAgent> {

    function handleGenericOptions(da: DesktopAgent) {
        if ((options.setWindowGlobal) && (window.fdc3 == null)) {
            window.fdc3 = da;
        }

        return da;
    }

    return strategy
        .load(options)
        .then(da => handleGenericOptions(da)) 
}