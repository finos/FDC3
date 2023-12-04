import { APIResponseMessage, AppChecker, DesktopAgentDetailResolver, Supplier, FDC3_API_RESPONSE_MESSAGE_TYPE, FDC3_API_REQUEST_MESSAGE_TYPE } from 'fdc3-common';

/**
 * This configures the postMessage listener to respond to requests for desktop agent APIs.
 * Called by the server-side desktop agent.
 */
export const supply: Supplier = (checker: AppChecker, detailsResolver: DesktopAgentDetailResolver) => {
    function createResponseMessage(source: Window): APIResponseMessage {
        return {
            type: FDC3_API_RESPONSE_MESSAGE_TYPE,
            details: detailsResolver(source),
            method: "message-port",
            uri: "dfgf",
            appId: {
                appId: 'sasquatch'
            },
            fdc3Version: "2.0",
            provider: "string",
            clientSecret: "abc123",
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

                    source.postMessage(createResponseMessage(source), origin);
                }
            }
        });
}