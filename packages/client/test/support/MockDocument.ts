import { FDC3_PORT_TRANSFER_RESPONSE_TYPE } from "@kite9/fdc3-common"
import { EMBED_URL, ServerDetails, buildFDC3ServerInstance } from "./MockFDC3Server"
import { CustomWorld } from "../world"
import { DesktopAgent } from "@finos/fdc3"

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
    }
}

class MockIFrame extends MockWindow {

    serverInstance: ServerDetails | null = null

    constructor(tag: string, cw: CustomWorld, window: MockWindow) {
        super(tag, cw)
        this.parent = window
    }

    setAttribute(name: string, value: string): void {
        this.atts[name] = value
        const parent = this.parent as MockWindow

        if ((name == 'src') && (value.startsWith(EMBED_URL))) {
            this.serverInstance = buildFDC3ServerInstance(this.cw)

            parent.postMessage({
                type: FDC3_PORT_TRANSFER_RESPONSE_TYPE,
            }, parent.location.origin, [this.serverInstance.externalPort!!])
        }
    }

    shutdown(): void {
        super.shutdown()
        if (this.serverInstance) {
            this.serverInstance.channel.port1.close()
            this.serverInstance.channel.port2.close()
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