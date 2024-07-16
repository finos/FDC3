import { MockWindow } from "./Mockwindow"


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

export class MockDocument {

    name: string
    window: Window

    constructor(name: string, window: Window) {
        this.name = name
        this.window = window
    }

    createElement(tag: string): HTMLElement {
        if (tag == 'iframe') {
            const mw = new MockWindow("iframe")

            // pass on messages from client to parent
            mw.addEventListener("message", (e) => {
                console.log("iframe received message " + JSON.stringify(e))
                this.window.dispatchEvent(e)
            })

            // communicate back from iframe to parent
            const channel = new MessageChannel()
            channel.port2.start()

            const dir = new BasicDirectory([dummyInstanceId])
            theServer = new DefaultFDC3Server(new TestServerContext(this, channel.port2), dir, "Client Test Server", {})
            channel.port2.onmessage = (event) => {
                theServer?.receive(event.data, dummyInstanceId)
            }

            return mw as any
        } else {
            return new MockElement(tag) as any
        }

    }

    body = new MockElement("body")

    reset() {
        this.body = new MockElement("body")
    }
}