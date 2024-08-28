export interface CSSPositioning { [key: string]: string }

export const INITIAL_CONTAINER_CSS = {
    width: "0",
    height: "0",
    right: "20px",
    bottom: "20px",
    position: "fixed"
}


export const ALLOWED_CSS_ELEMENTS = [
    "width",
    "height",
    "position",
    "zIndex",
    "left",
    "right",
    "top",
    "bottom",
    "transition",
    "maxHeight",
    "maxWidth",
    "display"
]

export abstract class AbstractUIComponent {

    private container: HTMLDivElement | undefined = undefined
    private iframe: Window | undefined = undefined
    private url: string
    private name: string

    constructor(url: string, name: string) {
        this.url = url
        this.name = name
    }

    async init() {
        const portPromise = this.awaitHello()
        this.openFrame()
        const port = await portPromise
        await this.setupMessagePort(port)
        await this.messagePortReady(port)
    }

    /**
     * Override and extend this method to provide functionality specific to the UI in question
     */
    async setupMessagePort(port: MessagePort): Promise<void> {
        port.addEventListener("message", (e) => {
            const data = e.data
            if (data.type == 'iframeRestyle') {
                console.log(`Restyling ${JSON.stringify(data.payload)}`)
                const css = data.payload.css
                this.themeContainer(css)
            }
        })
    }

    async messagePortReady(port: MessagePort) {
        // tells the iframe it can start posting
        port.postMessage({ type: "iframeHandshake" })
    }

    private awaitHello(): Promise<MessagePort> {
        return new Promise((resolve, _reject) => {
            const ml = (e: MessageEvent) => {
                console.log("Received UI Message: " + JSON.stringify(e.data))
                if ((e.source == this.iframe) && (e.data.type == 'iframeHello')) {
                    const port = e.ports[0]
                    port.start()
                    globalThis.window.removeEventListener("message", ml)
                    resolve(port)
                }
            }

            globalThis.window.addEventListener("message", ml)
        });

    }

    private openFrame(): void {
        this.container = globalThis.document.createElement("div")
        const ifrm = globalThis.document.createElement("iframe")

        this.themeContainer(INITIAL_CONTAINER_CSS)
        this.themeFrame(ifrm)

        ifrm.setAttribute("src", this.url)
        this.container.appendChild(ifrm)
        document.body.appendChild(this.container)
        this.iframe = ifrm.contentWindow!!
    }

    themeContainer(css: CSSPositioning) {
        for (let i = 0; i < ALLOWED_CSS_ELEMENTS.length; i++) {
            const k = ALLOWED_CSS_ELEMENTS[i]
            const value: string | undefined = css[(k as string)]
            if (value != null) {
                this.container?.style.setProperty(k, value)
            } else {
                this.container?.style.removeProperty(k)
            }
        }
    }

    themeFrame(ifrm: HTMLIFrameElement) {
        ifrm.setAttribute("name", this.name)
        ifrm.style.width = "100%"
        ifrm.style.height = "100%"
        ifrm.style.border = "0"
    }

}