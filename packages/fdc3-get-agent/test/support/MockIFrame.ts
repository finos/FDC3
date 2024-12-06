import { CustomWorld } from "../world";
import { handleEmbeddedIframeComms, handleChannelSelectorComms, handleIntentResolverComms } from "./FrameTypes";
import { EMBED_URL, CHANNEL_SELECTOR_URL, INTENT_RESOLVER_URL } from "./MockFDC3Server";
import { MockWindow } from "./MockWindow";

export class MockIFrame extends MockWindow {

    contentWindow: Window;
    messageChannels: MessageChannel[] = [];

    constructor(tag: string, cw: CustomWorld, parent: MockWindow, name: string) {
        super(tag, cw, name);
        this.parent = parent;
        this.contentWindow = this as any;
        if (this.cw.debugLogs) { console.log(`MockIFrame created with tag ${tag}, name: ${name} and parent.name ${parent.name}`); }
    }

    setAttribute(name: string, value: string): void {
        this.atts[name] = value;
        const parent = this.parent as MockWindow;

        if (name == 'src') {
            if (value.startsWith(EMBED_URL)) {
                this.name = "embedded-iframe";
                handleEmbeddedIframeComms(value, parent, this.cw);
            } else if (value.startsWith(CHANNEL_SELECTOR_URL)) {
                this.name = "channel-selector";
                this.messageChannels.push(handleChannelSelectorComms(value, parent, this.contentWindow, this.cw));
            } else if (value.startsWith(INTENT_RESOLVER_URL)) {
                this.name = "intent-resolver";
                this.messageChannels.push(handleIntentResolverComms(value, parent, this.contentWindow, this.cw));
            }
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
