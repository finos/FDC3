import { AppIdentifier } from '@finos/fdc3';
import { APIResponseMessage, AppChecker, DesktopAgentDetailResolver, Supplier, FDC3_API_RESPONSE_MESSAGE_TYPE, FDC3_API_REQUEST_MESSAGE_TYPE, DesktopAgentDetails } from 'fdc3-common';

/**
 * This configures the postMessage listener to respond to requests for desktop agent APIs.
 * Called by the server-side desktop agent.
 */
export const supply: Supplier = (checker: AppChecker, detailsResolver: DesktopAgentDetailResolver, staticDetails: DesktopAgentDetails) => {
    
    function createResponseMessage(source: Window, appId: AppIdentifier): APIResponseMessage {
        return {
            provider: "string",
            authRequired: true,
            authToken: "secret",
            desktopAgentBridgeVersion: "demo",
            supportedFDC3Versions: [ '2.0'],
            fdc3Version: "2.0",
            type: FDC3_API_RESPONSE_MESSAGE_TYPE,
            ...staticDetails, 
            ...detailsResolver(source, appId),

            method: "message-port",

            appIdentifier: {
                appId: appId.appId,
                instanceId: appId.instanceId,
                desktopAgent: appId.desktopAgent
            }
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
                const appDetails = checker(source)
                if (appDetails) {
                    console.log(`API Request Origin:  ${origin}`);

                    source.postMessage(createResponseMessage(source,appDetails), origin);
                }
            }
        });
}