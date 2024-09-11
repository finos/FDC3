import { CHANNEL_SELECTOR_URL, EMBED_URL, INTENT_RESPOLVER_URL } from "./MockFDC3Server"
import { CustomWorld } from "../world"
import { DesktopAgent } from "@kite9/fdc3-core"
import { handleChannelSelectorComms, handleEmbeddedIframeComms, handleIntentResolverComms } from "./FrameTypes"

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
    name: string

    constructor(tag: string, cw: CustomWorld, name: string) {
        super(tag)
        this.cw = cw
        this.name = name
    }

    eventHandlers: EventHandler[] = []
    events: any[] = []

    parent: MockWindow | null = null

    location = {
        origin: "https://dummyOrigin.test",
        href: "https://dummyOrigin.test/path"
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
        if (this.cw.mockFDC3Server) {
            this.cw.mockFDC3Server.shutdown()
        }
    }
}

class MockIFrame extends MockWindow {

    contentWindow: Window
    messageChannels: MessageChannel[] = []

    constructor(tag: string, cw: CustomWorld, parent: MockWindow, name: string) {
        super(tag, cw, name)
        this.parent = parent
        this.contentWindow = this as any
    }

    setAttribute(name: string, value: string): void {
        this.atts[name] = value
        const parent = this.parent as MockWindow

        if (name == 'src') {
            if (value.startsWith(EMBED_URL)) {
                this.name = "embedded-iframe"
                handleEmbeddedIframeComms(value, parent, this.cw)
            } else if (value.startsWith(CHANNEL_SELECTOR_URL)) {
                this.name = "channel-selector"
                this.messageChannels.push(handleChannelSelectorComms(value, parent, this.contentWindow, this.cw))
            } else if (value.startsWith(INTENT_RESPOLVER_URL)) {
                this.name = "intent-resolver"
                this.messageChannels.push(handleIntentResolverComms(value, parent, this.contentWindow, this.cw))
            }
        }
    }

    shutdown() {
        super.shutdown()
        this.messageChannels.forEach(mc => {
            mc.port1.close()
            mc.port2.close()
        })
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
            const mw = new MockIFrame("iframe", this.window.cw, this.window, "embedded-iframe")
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