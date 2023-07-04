import { DesktopAgent} from '@finos/fdc3'
import { loader as loader1 } from './strategies/post-message-load-js'
import { loader as loader2 } from './strategies/electron-event';

import { DEFAULT_OPTIONS, Options } from './types';

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

    const strategies = [ loader1(options), loader2(options) ];

    return Promise.any(strategies)
        .then(da => handleGenericOptions(da)) 
}