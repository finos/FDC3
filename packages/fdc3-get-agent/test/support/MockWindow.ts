import { DesktopAgent } from "@kite9/fdc3-standard";
import { CustomWorld } from "../world";
import { EventHandler } from "./EventHandler";
import { MockElement } from "./MockElement";

/**
 * Used for routing of post-message events while running tests
 */

export class MockWindow extends MockElement {

    fdc3: DesktopAgent | undefined;
    cw: CustomWorld;
    name: string;

    constructor(tag: string, cw: CustomWorld, name: string) {
        super(tag);
        this.cw = cw;
        this.name = name;
        if (cw.debugLogs) { console.debug(`MockWindow created with name: ${this.name} / tag: ${this.tag}`); } 
    }

    eventHandlers: EventHandler[] = [];
    events: {type: string, data: MessageEvent}[] = [];

    parent: MockWindow | null = null;
    child: MockWindow | null = null;
    commsIframe: MockWindow | null = null;

    location = {
        origin: "https://dummyOrigin.test",
        href: "https://dummyOrigin.test/path"
    };

    addEventListener(type: string, callback: (e: Event) => void): void {
        this.eventHandlers.push({ type, callback });
        if (this.cw.debugLogs) { console.log(`MockWindow ${this.name} / ${this.tag}: added event handler: ${type}`); }
    }

    removeEventListener(type: string, el: EventListener): void {
        const removeIndex = this.eventHandlers.findIndex(e => e.type === type && e.callback === el);
        if (removeIndex !== -1) {
            this.eventHandlers.splice(removeIndex, 1);
            if (this.cw.debugLogs) { console.debug(`MockWindow ${this.name} / ${this.tag}: removed event handler: ${type}`); }
        }
    }

    dispatchEvent(event: Event): void {
        this.events.push({ type: event.type, data: (event as unknown as MessageEvent).data });
        this.eventHandlers.forEach((e) => {
            if (e.type === event.type) {
                e.callback(event);
            }
        });
    }

    postMessage(msg: object, targetOrigin: string, transfer: MessagePort[] | undefined): void {
        const event = {
            type: 'message',
            data: msg,
            origin: targetOrigin,
            ports: transfer,
            //TODO: set source for UI iframes, comms iframe, parent DA or child app depending on message type
            source: this.commsIframe ?? this.child ?? this.parent ?? this
        } as unknown as MessageEvent;
        if (this.cw.debugLogs) { console.debug(`MockWindow ${this.name} / ${this.tag}: postMessage with source: ${(event.source as WindowProxy)?.name ?? "UNKNOWN"}`); }
        this.dispatchEvent(event);
    }

    shutdown() {
        this.eventHandlers = [];
        this.fdc3 = undefined;
        if (this.cw.mockFDC3Server) {
            this.cw.mockFDC3Server.shutdown();
        }
    }
}
