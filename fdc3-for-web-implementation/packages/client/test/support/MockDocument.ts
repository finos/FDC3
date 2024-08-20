import { EMBED_URL, MockFDC3Server, buildConnection } from "./MockFDC3Server"
import { CustomWorld } from "../world"
import { DesktopAgent } from "@finos/fdc3"
import { WebConnectionProtocol3Handshake } from "@kite9/fdc3-common"

class MockCSSStyleDeclaration {

    setProperty(name: string, value: string) {
        (this as any)[name] = value
    }

    removeProperty(name: string) {
        delete (this as any)[name]
    }

}

export class MockElement {

    tag: string
    atts: { [name: string]: any } = {}
    children: HTMLElement[] = []

    constructor(tag: string) {
        this.tag = tag
    }

    style = new MockCSSStyleDeclaration()

    setAttribute(name: string, value: string) {
        this.atts[name] = value
    }

    removeAttribute(name: string) {
        delete this.atts[name]
    }

    appendChild(child: HTMLElement) {
        this.children.push(child)
    }

    removeChild(child: HTMLElement) {
        this.children.splice(this.children.indexOf(child), 1)
    }

}


type EventHandler = {
    type: string,
    callback: (e: Event) => void
}

/**
 * Used for routing of post-message events while running tests
 */
export class MockWindow extends MockElement {

    fdc3: DesktopAgent | undefined
    cw: CustomWorld

    constructor(tag: string, cw: CustomWorld) {
        super(tag)
        this.cw = cw
    }

    eventHandlers: EventHandler[] = []
    events: any[] = []
    serverInstance: MockFDC3Server | null = null

    parent: MockWindow | null = null

    location = {
        origin: "https://dummyOrigin.test"
    }

    addEventListener(type: string, callback: (e: Event) => void): void {
        this.eventHandlers.push({ type, callback })
        console.log("Added event handler " + this.tag)
    }

    removeEventListener(type: string, el: EventListener): void {
        const removeIndex = this.eventHandlers.findIndex(e => e.type === type && e.callback === el)
        if (removeIndex !== -1) {
            this.eventHandlers.splice(removeIndex, 1)
        }
    }

    dispatchEvent(event: Event): void {
        this.events.push({ type: event.type, data: (event as any).data })
        this.eventHandlers.forEach((e) => {
            if (e.type === event.type) {
                e.callback(event)
            }
        })
    }

    postMessage(msg: object, targetOrigin: string, transfer: MessagePort[] | undefined): void {
        this.dispatchEvent({
            type: 'message',
            data: msg,
            origin: targetOrigin,
            ports: transfer,
            source: this.parent ?? this // when posting from client, set source to self
        } as any)
    }

    shutdown() {
        this.eventHandlers = []
        this.fdc3 = undefined
        if (this.serverInstance) {
            this.serverInstance.shutdown()
        }
    }
}

class MockIFrame extends MockWindow {

    contentWindow: Window

    constructor(tag: string, cw: CustomWorld, window: MockWindow) {
        super(tag, cw)
        this.parent = window
        this.contentWindow = this as any
    }

    setAttribute(name: string, value: string): void {
        this.atts[name] = value
        const parent = this.parent as MockWindow

        if ((name == 'src') && (value.startsWith(EMBED_URL))) {
            const paramStr = value.substring(EMBED_URL.length + 1)
            const params = new URLSearchParams(paramStr)
            const connectionAttemptUuid = params.get("connectionAttemptUuid")!!
            const connection = buildConnection(this.cw)
            parent.serverInstance?.instances.push(connection)
            connection.context.setInstanceDetails('uuid', { appId: 'Test App Id', instanceId: '1' })

            try {
                parent.postMessage({
                    type: "WCP3Handshake",
                    meta: {
                        connectionAttemptUuid: connectionAttemptUuid,
                        timestamp: new Date()
                    },
                    payload: {
                        fdc3Version: "2.2",
                        resolver: "https://mock.fdc3.com/resolver",
                        channelSelector: "https://mock.fdc3.com/channelSelector",
                    }
                } as WebConnectionProtocol3Handshake, EMBED_URL, [connection.externalPort])
            } catch (e) {
                console.error(e)
            }
        }
    }
}

export class MockDocument {

    name: string
    window: MockWindow
    iframes: MockIFrame[] = []

    constructor(name: string, window: MockWindow) {
        this.name = name
        this.window = window
    }

    createElement(tag: string): HTMLElement {
        if (tag == 'iframe') {
            const mw = new MockIFrame("iframe", this.window.cw, this.window)
            this.iframes.push(mw)
            return mw as any
        } else {
            return new MockElement(tag) as any
        }
    }

    body = new MockElement("body")

    shutdown() {
        this.window.shutdown()
        this.iframes.forEach(i => i.shutdown())
    }
}