import { DesktopAgent } from "@finos/fdc3"



type EventHandler = {
    type: string,
    callback: (e: Event) => void
}

/**
 * Used for routing of post-message events while running tests
 */
export class MockWindow {

    name: string
    fdc3: DesktopAgent | undefined

    constructor(name: string) {
        this.name = name
    }

    eventHandlers: EventHandler[] = []

    parent: MockWindow | null = null

    location = {
        origin: "https://dummyOrigin.test"
    }

    addEventListener(type: string, callback: (e: Event) => void): void {
        this.eventHandlers.push({ type, callback })
        console.log("Added event handler")
    }

    removeEventListener(type: string, el: EventListener): void {
        const removeIndex = this.eventHandlers.findIndex(e => e.type === type && e.callback === el)
        if (removeIndex !== -1) {
            this.eventHandlers.splice(removeIndex, 1)
        }
    }

    dispatchEvent(event: Event): void {
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

    reset() {
        this.eventHandlers = []
        this.fdc3 = undefined
    }
}

// for the purposes of testing, this sets up one window 
// object to listen for all messages from both the da-client and da-server.
export const mockWindow = new MockWindow("mockWindow")