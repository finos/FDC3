import { CustomWorld } from "../world";
import { handleChannelSelectorComms, handleEmbeddedIframeComms, handleIntentResolverComms } from "./FrameTypes";
import { EMBED_URL, CHANNEL_SELECTOR_URL, INTENT_RESOLVER_URL } from "./MockFDC3Server";
import { MockWindow } from "./MockWindow";

export class MockIFrame extends MockWindow {

    contentWindow: MockWindow;
    messageChannels: MessageChannel[] = [];
    parent: MockWindow;
    initFn: (() => void) | null = null; 

    constructor(tag: string, cw: CustomWorld, parent: MockWindow, name: string) {
        super(tag, cw, name);
        this.parent = parent;
        this.contentWindow = this;
        if (this.cw.debugLogs) { console.log(`MockIFrame (name: ${name} / parent.name: ${parent.name}): Created`); }
        
    }

    /** Used to simulate the iframe loading. */
    load(): void {
        if (this.cw.debugLogs) {  console.log(`MockIFrame (name: ${this.name}): Dispatching load event`); }
        
        //if we've got an init fn *to simulate comms) call it before we dispatch the load event
        if (this.initFn) {
            this.initFn();
        }

        this.dispatchEvent(new Event("load"));
    }

    setAttribute(name: string, value: string): void {
        this.atts[name] = value;
        const parent = this.parent as MockWindow;

        if (name === 'src') {
            //set the frame up properly along wih a function to initialize comms when it loads
            if (value.startsWith(EMBED_URL)) {
                this.name = "embedded-iframe";
                this.parent.commsIframe = this;
                this.initFn = () => {
                    handleEmbeddedIframeComms(value, parent, this.contentWindow, this.cw);
                };
                if (this.cw.debugLogs) { console.debug(`MockIframe (name: ${this.name}): Created comms iframe with url: ${value}`); }
            } else if (value.startsWith(CHANNEL_SELECTOR_URL)) {
                this.name = "channel-selector";
                this.parent.channelSelectorIframe = this;
                this.initFn = () => {
                    this.messageChannels.push(handleChannelSelectorComms(value, parent, this.contentWindow, this.cw));
                }
                if (this.cw.debugLogs) { console.debug(`MockIframe (name: ${this.name}): Created channel selector iframe with url: ${value}`); }
            } else if (value.startsWith(INTENT_RESOLVER_URL)) {
                this.name = "intent-resolver";
                this.parent.intentResolverIframe = this;
                this.initFn = () => {
                    this.messageChannels.push(handleIntentResolverComms(value, parent, this.contentWindow, this.cw));
                }
                if (this.cw.debugLogs) { console.debug(`MockIframe (name: ${this.name}): Created intent resolver iframe with url: ${value}`); }
            } else {
                if (this.cw.debugLogs) { console.warn(`MockIframe (name: ${this.name}): Set an unrecognized URL: ${value}`); }
            }
        } else if (name === 'name') {
            if (this.cw.debugLogs) { console.debug(`MockIframe (name: ${this.name}): setAttribute() changing iframe name to: ${value}`); }
            this.name = value;
        }
    }

    shutdown() {
        super.shutdown();
        this.messageChannels.forEach(mc => {
            mc.port1.close();
            mc.port2.close();
        });
    }
}
