import { DesktopAgent} from '@finos/fdc3'
import { strategy } from './strategies/post-message'
import { AppIdentifierResolver, DEFAULT_OPTIONS, Options } from './types';

/**
 * This configures the postMessage listener to respond to requests for desktop agent APIs.
 * Called by the desktop agent
 */
export function supply(url: string, resolver: AppIdentifierResolver) {
    strategy.supply(url, resolver);
}

/**
 * This return an FDC3 API.  Called by Apps.
 */
export function load(options: Options = DEFAULT_OPTIONS) : Promise<DesktopAgent> {
    return strategy.load(options);    
}