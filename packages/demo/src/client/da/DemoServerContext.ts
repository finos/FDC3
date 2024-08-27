import { Directory, DirectoryApp, InstanceID, ServerContext } from '@kite9/da-server'
import { Socket } from 'socket.io-client';
import { v4 as uuid } from 'uuid'
import { FDC3_DA_EVENT } from '../../message-types';
import { AppIdentifier, OpenError } from '@finos/fdc3';

enum Opener { Tab, Frame, Nested }

enum State { Pending, Connected }

type AppRegistration = AppIdentifier & {
    window: Window,
    url: string,
    state: State
}


export class DemoServerContext implements ServerContext<AppRegistration> {

    private readonly socket: Socket
    private readonly directory: Directory
    private connections: AppRegistration[] = []

    constructor(socket: Socket, directory: Directory) {
        this.socket = socket
        this.directory = directory
    }

    /**
     * Sets the appId and instanceId for a given connection UUID
     */
    setInstanceDetails(uuid: InstanceID, meta: AppRegistration): void {
        console.log(`Setting ${uuid} to ${meta.appId}`)
        this.connections.push({
            ...meta,
            instanceId: uuid
        })
    }

    getInstanceForWindow(window: Window): AppRegistration | undefined {
        return this.connections.find(i => i.window == window)
    }

    /**
     * Returns the UUID for a particular instance of an app.
     * This is used in situations where an app is reconnecting to the same desktop agent.
     */
    getInstanceDetails(uuid: InstanceID): AppRegistration | undefined {
        return this.connections.find(i => i.instanceId == uuid)
    }

    async setAppConnected(app: AppIdentifier): Promise<void> {
        const theApp = this.connections.find(i => i.instanceId == app.instanceId)
        if (theApp) {
            theApp.state = State.Connected
        } else {
            throw new Error("No app found with id " + app.instanceId)
        }
    }

    getOpener(): Opener {
        const cb = document.getElementById("opener") as HTMLInputElement;
        const val = cb.value
        var out: Opener = Opener[val as keyof typeof Opener]; //Works with --noImplicitAny
        return out;
    }

    createUUID(): string {
        return uuid()
    }

    /**
     * Post an outgoing message to a particular app
     */
    async post(message: object, to: InstanceID): Promise<void> {
        console.log(`Responding with: ${JSON.stringify(message, null, 2)} to ${to}`)
        this.socket.emit(FDC3_DA_EVENT, message, to)
    }

    openFrame(url: string): Window {
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", url);
        ifrm.style.width = "640px";
        ifrm.style.height = "480px";
        document.body.appendChild(ifrm);
        return ifrm.contentWindow!!;
    }

    goodbye(id: string) {
        this.connections = this.connections.filter(i => i.instanceId !== id)
        console.log(`Closed ${id} ${JSON.stringify(this.connections.map(i => i.instanceId))} apps open`)
    }

    openTab(url: string): Window {
        return window.open(url, "_blank")!!;
    }

    openNested(url: string): Window {
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", "nested.html?url=" + url);
        ifrm.style.width = "640px";
        ifrm.style.height = "480px";
        document.body.appendChild(ifrm);
        return ifrm.contentWindow!!;
    }

    openUrl(url: string): Window {
        const opener = this.getOpener();
        switch (opener) {
            case Opener.Tab:
                return this.openTab(url);
            case Opener.Nested:
                return this.openNested(url);
            case Opener.Frame:
                return this.openFrame(url);
        }
    }

    async open(appId: string): Promise<InstanceID> {
        const details: DirectoryApp[] = this.directory.retrieveAppsById(appId) as DirectoryApp[]
        if (details.length > 0) {
            const url = (details[0].details as any)?.url ?? undefined
            const window = this.openUrl(url)
            const instanceId: InstanceID = this.createUUID()
            const metadata = {
                appId,
                instanceId,
                window,
                url,
                state: State.Pending
            }

            this.setInstanceDetails(instanceId, metadata)
            return instanceId
        }

        throw new Error(OpenError.AppNotFound)
    }

    async getConnectedApps(): Promise<AppIdentifier[]> {
        return this.connections.map(c => {
            return {
                appId: c.appId,
                instanceId: c.instanceId
            }
        })
    }

    async isAppConnected(app: AppIdentifier): Promise<boolean> {
        const out = (await this.getConnectedApps()).filter(ai =>
            (ai.appId == app.appId) && (ai.instanceId == app.instanceId)).length > 0

        console.log(`Checking ${app.instanceId} = ${out}`)
        return out
    }

    log(message: string): void {
        console.log(message);
    }

    provider(): string {
        return "FDC3-Web-Demo"
    }

    providerVersion(): string {
        return "0.1"
    }

    fdc3Version(): string {
        return "2.0"
    }
}