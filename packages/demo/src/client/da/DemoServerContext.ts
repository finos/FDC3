import { AppMetadata } from '@finos/fdc3/dist/bridging/BridgingTypes';
import { Directory, DirectoryApp, ServerContext } from '@kite9/da-server'
import { Socket, io } from 'socket.io-client';
import { v4 as uuid } from 'uuid'
import { APP_HELLO, FDC3_DA_EVENT } from '../../message-types';
import { AppIdentifier, OpenError } from '@finos/fdc3';
import { AppChecker, DesktopAgentDetailResolver, DesktopAgentDetails, DesktopAgentPortResolver } from '@kite9/fdc3-common';
import { link } from './util';

enum Opener { Tab, Frame, Nested }

enum State { Pending, Connected }

type AppRegistration = {
    appId: AppIdentifier,
    window: Window,
    url: string,
    state: State
}

enum Approach { IFRAME, PARENT_POST_MESSAGE }

function getApproach(): Approach {
    const cb = document.getElementById("approach") as HTMLInputElement;
    const val = cb.value
    var out: Approach = Approach[val as keyof typeof Approach]; //Works with --noImplicitAny
    return out;
}

export class DemoServerContext implements ServerContext {

    private readonly socket: Socket
    private readonly directory: Directory
    private readonly desktopAgentUUID: string

    private instances: AppRegistration[] = []

    constructor(socket: Socket, directory: Directory, desktopAgentUUID: string) {
        this.socket = socket
        this.directory = directory
        this.desktopAgentUUID = desktopAgentUUID
    }

    async setAppConnected(app: AppMetadata): Promise<void> {
        const theApp = this.instances.find(i => (i.appId.appId == app.appId) && (i.appId.instanceId == app.instanceId))
        if (theApp) {
            theApp.state = State.Connected
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

    async post(message: object, to: AppMetadata): Promise<void> {
        console.log(`Responding with: ${JSON.stringify(message, null, 2)} to ${JSON.stringify(to, null, 2)}`)
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
        this.instances = this.instances.filter(i => i.appId.instanceId !== id)
        console.log(`Closed ${id} ${JSON.stringify(this.instances.map(i => i.appId.instanceId))} apps open`)
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
        throw new Error("unsupported")
    }

    async open(appId: string): Promise<AppMetadata> {
        const details: DirectoryApp[] = this.directory.retrieveAppsById(appId) as DirectoryApp[]
        if (details.length > 0) {
            const url = (details[0].details as any)?.url ?? undefined
            const window = this.openUrl(url)
            const metadata = {
                appId,
                instanceId: this.createUUID()
            }
            this.instances.push({
                appId: metadata,
                url,
                window,
                state: State.Pending
            })

            return metadata
        }

        throw new Error(OpenError.AppNotFound)
    }

    async getConnectedApps(): Promise<AppMetadata[]> {
        return this.instances
            .filter(i => i.state == State.Connected)
            .map(i => i.appId)
    }

    async isAppConnected(app: AppMetadata): Promise<boolean> {
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

    // for a given window, allows us to determine which app it is (if any)
    appChecker: AppChecker = o => this.instances.find(i => i.window == o)?.appId

    // this is for when the API is using an iframe, and needs to know the address to load
    detailsResolver: DesktopAgentDetailResolver = (o: Window, a: AppIdentifier) => {
        const apiKey = "ABC"
        if (getApproach() == Approach.IFRAME) {
            return {
                apiKey,
                uri: window.location.origin + "/static/da/embed.html",
                desktopAgentId: this.desktopAgentUUID,
                resolverUri: window.location.origin + "/static/da/intent-resolver.html"
            }
        } else {
            return {
                apiKey,
                desktopAgentId: this.desktopAgentUUID,
                resolverUri: window.location.origin + "/static/da/intent-resolver.html"
            } as DesktopAgentDetails
        }
    }

    portResolver: DesktopAgentPortResolver = (o: Window, a: AppIdentifier) => {
        if (getApproach() == Approach.IFRAME) {
            return null;
        } else {
            const channel = new MessageChannel()
            const socket = io()

            socket.on("connect", () => {
                console.log("Server creating socket")
                link(socket, channel, a)
                socket.emit(APP_HELLO, this.desktopAgentUUID, a)
            })

            return channel.port1;
        }
    }
}