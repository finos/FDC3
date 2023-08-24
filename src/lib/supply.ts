import { APIResponseMessage, AppChecker, DesktopAgentDetailResolver, DesktopAgentDetailResolverMap, Supplier, FDC3_API_RESPONSE_MESSAGE_TYPE, FDC3_API_REQUEST_MESSAGE_TYPE } from './types';

/**
 * This configures the postMessage listener to respond to requests for desktop agent APIs.
 * Called by the desktop agent
 */
export const supply: Supplier = (checker: AppChecker, detailsResolvers: DesktopAgentDetailResolverMap) => {
    function createResponseMessage(source: Window, method: string, detailsResolver: DesktopAgentDetailResolver): APIResponseMessage {
        return {
            type: FDC3_API_RESPONSE_MESSAGE_TYPE,
            method: method,
            details: detailsResolver(source)
        }
    }

    window.addEventListener(
        "message",
        (event) => {
            console.log("Received: " + JSON.stringify(event));
            const data = event.data;
            if (data.type == FDC3_API_REQUEST_MESSAGE_TYPE) {
                const origin = event.origin;
                const source = event.source as Window
                if (checker(source)) {
                    console.log(`API Request Origin:  ${origin}`);

                    const methods = event.data.methods;
                    for(let i=0; i < methods.length; i++) {
                        const currentMethod = methods[i];
                        const detailsResolver = detailsResolvers[currentMethod];
                        if (detailsResolver) {
                            source.postMessage(createResponseMessage(source, currentMethod, detailsResolver), origin);
                            return; 
                        }
                    }
                }
            }
        });
}