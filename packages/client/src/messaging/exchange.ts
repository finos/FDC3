
/**
 * Perform some generalized action and expect a response back via message ports.
 */
export function exchange(p: MessagePort | Window | BroadcastChannel, toType: string, action: () => void, timeoutMs: number): Promise<MessageEvent> {
    return new Promise((resolve, reject) => {
        var done = false;
        const listener = (m: Event) => {
            console.log("Received: " + (m as any)?.data?.type)
            if ((m as any)?.data?.type == toType) {
                done = true;
                p.removeEventListener("message", listener);
                resolve(m as MessageEvent);
            }
        }

        p.addEventListener("message", listener)

        action();

        setTimeout(() => {
            p.removeEventListener("message", listener);
            if (!done) {
                console.log(`Rejecting after ${timeoutMs}ms`)
                reject(new Error(`Didn't receive response ${toType}"`))
            }
        }, timeoutMs);
    })
}

export function exchangeForMessagePort(p: MessagePort | Window | BroadcastChannel, toType: string, action: () => void, timeoutMs: number): Promise<MessagePort> {
    return exchange(p, toType, action, timeoutMs).then(x => {
        return x.ports[0]
    })
}

/**
 * Send a message to on a port and wait for one to come back.
 */
export function exchangePostMessage(p: MessagePort | Window | BroadcastChannel, toType: string, contents: any, timeoutMs: number): Promise<any> {
    return exchange(p, toType, () => {
        console.log("Posting message: " + JSON.stringify(contents))
        p.postMessage(contents);
    }, timeoutMs)
}


