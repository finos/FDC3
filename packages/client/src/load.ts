import { DesktopAgent} from '@finos/fdc3'
import { Options } from '../../common/src';

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


export const DEFAULT_OPTIONS : Options = {
    setWindowGlobal: false,
    fireFdc3Ready: false,
    methods: DEFAULT_METHODS,
    strategies: [postMessage, electronEvent],
    frame: window.opener ?? window.parent
}


/**
 * This return an FDC3 API.  Called by Apps.
 */
export function load(optionsOverride: Options = DEFAULT_OPTIONS) : Promise<DesktopAgent> {

    const options = {
        ...DEFAULT_OPTIONS,
        ...optionsOverride
    }

    function handleGenericOptions(da: DesktopAgent) {
        if ((options.setWindowGlobal) && (window.fdc3 == null)) {
            window.fdc3 = da;
        }
        
        return da;
    }

    const strategies = options.strategies!!.map(s => s(options));

    return Promise.any(strategies)
        .then(da => handleGenericOptions(da)) 
}