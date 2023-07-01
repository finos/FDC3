import { AppIdentifier, DesktopAgent} from '@finos/fdc3'
import { AppIdentifierResolver, Strategy } from '../types'

const FDC3_API_REQUEST_MESSAGE_TYPE = 'FDC3-API-Request';
const FDC3_API_RESPONSE_MESSAGE_TYPE = 'FDC3-API-Response';

type APIResponseMessage = {
    type: string,
    url: string,
    appIdentifier: AppIdentifier
}

export const strategy : Strategy = {

 supply : (url: string, resolver: AppIdentifierResolver) => {
    function createResponseMessage(appIdentifier: AppIdentifier) : APIResponseMessage {
        return {
            type: FDC3_API_RESPONSE_MESSAGE_TYPE,
            url, 
            appIdentifier : {
                appId: appIdentifier.appId,
                instanceId: appIdentifier.instanceId
            }
        }
    }
    window.addEventListener(
        "message",
        (event) => {
          console.log("Received: "+JSON.stringify(event));
          const data = event.data;
          if (data == FDC3_API_REQUEST_MESSAGE_TYPE) {
            const origin = event.origin;
            const source = event.source as Window
            const appIdentifier = resolver(source);
            if (appIdentifier != null) {
                console.log(`API Request Origin:  ${origin} Source: ${source}`);
                source.postMessage(createResponseMessage(appIdentifier), origin);
            }
          }
        });
    },

    load : (options: any) => {

        const out = new Promise<DesktopAgent>((resolve, reject) => {
            // setup listener for message and retrieve JS URL from it
            window.addEventListener("message", (event) => {
                const data : APIResponseMessage = event.data ;
                if (data.type == FDC3_API_RESPONSE_MESSAGE_TYPE) {
                    // next, load the javascript into a script
                    const script = document.createElement('script');
                    script.onload = function () {
                        console.log(`FDC3 API Initialised ${JSON.stringify(data)}`);
                        resolve(window.fdc3);
                        document.head.removeChild(script);
                    };
                    script.src=data.url;
                    document.head.appendChild(script);
                }
            });
        });
 
        const da = window.opener;

        if (da != null) {
            window.opener.postMessage(FDC3_API_REQUEST_MESSAGE_TYPE, "*");
        }

        return out;
    }

}