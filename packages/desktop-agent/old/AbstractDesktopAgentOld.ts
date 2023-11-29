import { AppIdentifier, Context, ContextHandler, ContextMetadata, ImplementationMetadata, Listener } from "@finos/fdc3";
import { DesktopAgentDetails, Options } from "@finos/web-fdc3-common/src";
import { BroadcastAgentRequest, BroadcastAgentRequestMeta, RequestMessageType } from "@finos/fdc3";

class BroadcastListener implements Listener {

    type: string | null;
    handler: ContextHandler

    constructor(type: string | null, handler: ContextHandler) {
        this.type = type;
        this.handler = handler;

    }

    unsubscribe(): void {
        // does nothing yet.
    }

    handle(ctx: Context, metadata: ContextMetadata) {
        if ((this.type == null) || (this.type == ctx.type)) {
            this.handler(ctx, metadata);
        }
    }
}


/**
 * Desktop Agent using DesktopAgentBridging protocol. 
 * As before, just implementing broadcast, addContextListener and getInfo.
 * Abstract since the choice of transport is left to the implementer.
 */
export class AbstractDesktopAgent {

    details: DesktopAgentDetails;
    id: AppIdentifier;
    listeners: BroadcastListener[] = [];
    options: Options

    getIcon() : string {
        return "";
    }

    constructor(details: DesktopAgentDetails, options: Options) {
        this.details = details;
        this.id = {
            appId: this.details.appId as string,
            instanceId: this.details.instanceId as string
        }
        this.options = options;

        const img = document.createElement("img");
        img.setAttribute("width", "70");
        img.setAttribute("height", "70");
        img.setAttribute("src", this.getIcon())
        img.setAttribute("style", "position: absolute; bottom: 0px; right: 0px;")
        document.body.appendChild(img)
    }

    postInternal(_m: object) {
        throw new Error("Abstract method");
    }

    createMeta() : BroadcastAgentRequestMeta {
        return {
            requestUuid: crypto.randomUUID(),
            timestamp: new Date(),
            source: {
                appId: this.id.appId,
                instanceId: this.id.instanceId
            }
        }
    }
  
    broadcast(context: Context): Promise<void> {
        
        const request : BroadcastAgentRequest = {
            meta: this.createMeta(),
            payload: {
                channelId: "MAIN",
                context: context
            },
            type: RequestMessageType.BroadcastRequest
        }

        this.postInternal(request);

        return new Promise((_resolve) => _resolve());
    }


    getInfo(): Promise<ImplementationMetadata> {
        return new Promise((resolve) => {
            resolve({
                fdc3Version: "2.0",
                provider: this.details.dummy as string,
                appMetadata: {
                    appId: this.id.appId,
                    instanceId: this.id.instanceId,
                },
                optionalFeatures: {
                    OriginatingAppMetadata: true,
                    UserChannelMembershipAPIs: false,
                }
            });
        });
    }
   
    addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener> {
        const listo = this.listeners;
        return new Promise((resolve) => {
            const theListener = new BroadcastListener(contextType, handler)
            listo.push(theListener);
            resolve(theListener);
        });
    }
    
}