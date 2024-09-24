import { AppIdentifier } from "@kite9/fdc3-standard";
import { MessageHandler } from "../BasicFDC3Server";
import { AppRegistration, InstanceID, ServerContext, State } from "../ServerContext";
import { BrowserTypes } from "@kite9/fdc3-schema";

/*
 * Handles heartbeat pings and responses
 */
export class HeartbeatHandler implements MessageHandler {

    private readonly contexts: ServerContext<AppRegistration>[] = []
    private readonly lastHeartbeats: Map<InstanceID, number> = new Map()
    private readonly warnings: Set<InstanceID> = new Set()
    private readonly timerFunction: NodeJS.Timeout

    constructor(pingInterval: number = 1000, warnAfter: number = 5000, deadAfter: number = 10000) {

        this.timerFunction = setInterval(() => {
            this.contexts.forEach(async (sc) => {
                const allAops = await sc.getAllApps()

                console.log(`Last Heartbeats: `, this.heartbeatTimes())

                allAops
                    .filter(app => (app.state == State.Connected) || (app.state == State.NotResponding))
                    .forEach(app => {
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
                                console.error(`No heartbeat from ${app.instanceId} for ${timeSinceLastHeartbeat}ms. App is considered not responding.`)
                                sc.setAppState(app.instanceId!!, State.NotResponding)
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

    heartbeatTimes(): any {
        const now = new Date().getTime()
        return Array.from(this.lastHeartbeats).map(e => {
            return [e[0], now - e[1], this.contexts.map(sc => sc.getInstanceDetails(e[0])).reduce((a, b) => a || b)?.state]
        })
    }

    shutdown(): void {
        clearInterval(this.timerFunction)
    }

    accept(msg: any, sc: ServerContext<AppRegistration>, from: InstanceID): void {
        if (!this.contexts.includes(sc)) {
            this.contexts.push(sc)
        }

        if (msg.type == 'heartbeatAcknowledgementRequest') {
            const app = sc.getInstanceDetails(from)
            if (app) {
                this.lastHeartbeats.set(app.instanceId!!, new Date().getTime())
            }
        }

        if (msg.type == 'WCP5Shutdown') {
            const app = sc.getInstanceDetails(from)
            if (app) {
                sc.setAppState(from, State.Terminated)
            }
        }
    }


    async sendHeartbeat(sc: ServerContext<AppRegistration>, app: AppIdentifier): Promise<void> {
        sc.post({
            type: 'heartbeatEvent',
            meta: {
                timestamp: new Date(),
                eventUuid: sc.createUUID(),
            },
            payload: {
                timestamp: new Date()
            }
        } as BrowserTypes.HeartbeatEvent, app.instanceId!!)
    }

}
