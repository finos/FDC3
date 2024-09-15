import { AppIdentifier } from "@kite9/fdc3-standard";
import { MessageHandler } from "../BasicFDC3Server";
import { InstanceID, ServerContext } from "../ServerContext";
import { HeartbeatEvent } from "@kite9/fdc3-schema/generated/api/BrowserTypes";

/*
 * Handles heartbeat pings and responses
 */
export class HeartbeatHandler implements MessageHandler {

    private readonly contexts: ServerContext<AppIdentifier>[] = []
    private readonly lastHeartbeats: Map<InstanceID, number> = new Map()
    private readonly warnings: Set<InstanceID> = new Set()
    private readonly timeerFunction: NodeJS.Timeout

    constructor(pingInterval: number = 1000, warnAfter: number = 5000, deadAfter: number = 10000) {


        this.timeerFunction = setInterval(() => {
            this.contexts.forEach(async (sc) => {
                (await sc.getConnectedApps()).forEach(app => {
                    const now = new Date().getTime()
                    this.sendHeartbeat(sc, app)

                    // check when the last heartbeat happened
                    const lastHeartbeat = this.lastHeartbeats.get(app.instanceId!!)

                    if (lastHeartbeat != undefined) {
                        const timeSinceLastHeartbeat = now - lastHeartbeat

                        if (timeSinceLastHeartbeat < warnAfter) {
                            this.warnings.delete(app.instanceId!!)
                        } else if ((timeSinceLastHeartbeat > warnAfter) && (!this.warnings.has(app.instanceId!!))) {
                            console.warn(`No heartbeat from ${app.instanceId} for ${timeSinceLastHeartbeat}ms`)
                            this.warnings.add(app.instanceId!!)
                        } else if (timeSinceLastHeartbeat > deadAfter) {
                            console.error(`No heartbeat from ${app.instanceId} for ${timeSinceLastHeartbeat}ms. App is considered dead.`)
                            sc.setAppDisconnected(app)
                        } else {
                            // no action
                        }

                    } else {
                        // start the clock
                        this.lastHeartbeats.set(app.instanceId!!, now)
                    }
                })
            })
        }, pingInterval)
    }

    shutdown(): void {
        clearInterval(this.timeerFunction)
    }

    accept(msg: any, sc: ServerContext<AppIdentifier>, from: InstanceID): void {
        if (!this.contexts.includes(sc)) {
            this.contexts.push(sc)
        }

        if (msg.type == 'heartbeatAcknowledgementRequest') {
            const app = sc.getInstanceDetails(from)
            if (app) {
                this.lastHeartbeats.set(app.instanceId!!, new Date().getTime())
            }
        }
    }


    async sendHeartbeat(sc: ServerContext<AppIdentifier>, app: AppIdentifier): Promise<void> {
        sc.post({
            type: 'heartbeatEvent',
            meta: {
                timestamp: new Date(),
                eventUuid: sc.createUUID(),
            },
            payload: {
                timestamp: new Date()
            }
        } as HeartbeatEvent, app.instanceId!!)
    }

}
