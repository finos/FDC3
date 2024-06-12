import { AppIdentifier } from '@finos/fdc3';
import { APIResponseMessage, AppChecker, DesktopAgentDetailResolver, Supplier, FDC3_API_RESPONSE_MESSAGE_TYPE, FDC3_API_REQUEST_MESSAGE_TYPE, DesktopAgentPortResolver } from '@kite9/fdc3-common';

/**
 * This configures the postMessage listener to respond to requests for desktop agent APIs.
 * Called by the server-side desktop agent.
 */
export const supply: Supplier = (
    checker: AppChecker,
    detailsResolver: DesktopAgentDetailResolver,
    portResolver: DesktopAgentPortResolver = () => null) => {

    function createResponseMessage(source: Window, appId: AppIdentifier): APIResponseMessage {
        return {
            type: FDC3_API_RESPONSE_MESSAGE_TYPE,
            ...detailsResolver(source, appId),

            method: "message-port",

            appIdentifier: {
                appId: appId.appId,
                instanceId: appId.instanceId,
                desktopAgent: appId.desktopAgent
            }
        } as APIResponseMessage
    }

    function createTransferrableArray(source: Window, appId: AppIdentifier): Transferable[] {
        const port = portResolver(source, appId);
        if (port) {
            return [port]
        } else {
            return []
        }
    }

    window.addEventListener(
        "message",
        (event) => {
            const data = event.data;
            console.log("Received: " + JSON.stringify(event.data));
            if (data.type == FDC3_API_REQUEST_MESSAGE_TYPE) {
                const origin = event.origin;
                const source = event.source as Window
                const appDetails = checker(source)
                if (appDetails) {
                    console.log(`API Request Origin:  ${origin}`);
                    const message = createResponseMessage(source, appDetails)
                    const transferrables = createTransferrableArray(source, appDetails)
                    source.postMessage(message, {
                        targetOrigin: origin,
                        transfer: transferrables
                    })
                }
            }
        });
}