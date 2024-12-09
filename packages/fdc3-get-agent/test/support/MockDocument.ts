import { MockWindow } from "./MockWindow"
import { MockIFrame } from "./MockIFrame"
import { MockElement } from "./MockElement"

export class MockDocument {
    name: string;
    window: MockWindow;
    iframes: MockIFrame[] = [];
    static allDocuments: MockDocument[] = [];

    constructor(name: string, window: MockWindow) {
        this.name = name;
        this.window = window;
        if (this.window.cw.debugLogs) { console.log(`MockDocument created with name: ${name} in window.name: ${this.window.name}`); }
        MockDocument.allDocuments.push(this);
    }

    createElement(tag: string): HTMLElement {
        if (tag == 'iframe') {
            if (this.window.cw.debugLogs) { console.log(`MockDocument ${this.name} creating iframe in window.name ${this.window.name}`); }
            const mw = new MockIFrame("iframe", this.window.cw, this.window, "embedded-iframe");
            //make sure the parent doc is aware of the iframe for attributing postMessage
            //TODO: set a different variable for UI iframes
            this.window.commsIframe = mw;
      
            this.iframes.push(mw);
            return mw as unknown as HTMLElement;
        } else {
            return new MockElement(tag) as unknown as HTMLElement;
        }
    }

    getElementById(/*_id: string*/): HTMLElement | null {
        return new MockElement("div") as unknown as HTMLElement;
    }

    body = new MockElement("body");

    shutdown() {
        this.window.shutdown();
        this.iframes.forEach(i => i.shutdown());
    }

    static shutdownAllDocuments() {
        MockDocument.allDocuments.forEach((doc: MockDocument) => {
            doc.shutdown();
        })
    }
}