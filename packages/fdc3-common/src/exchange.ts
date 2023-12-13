
/**
 * Perform some generalized action and expect a response back via message ports.
 */
export function exchange(p: MessagePort | Window | BroadcastChannel, toType: string, action: () => void) : Promise<MessageEvent> {
    return new Promise((resolve, reject) => {
        var done = false;
        const listener = (m: Event) => {
            if (m instanceof MessageEvent) {
                console.log("Received: "+m.data.type)
                if (m.data.type == toType) {
                    done = true;
                    resolve(m);
                }
            }
        } 
        p.addEventListener("message", listener)

        action();
        
        setTimeout(() => {
            p.removeEventListener("message", listener);
            if (!done) {
                reject(new Error(`Didn't receive response ${toType}"`))
            }
        }, 60000);
    })
}

export function exchangeForMessagePort(p: MessagePort | Window | BroadcastChannel, toType: string, action: () => void) : Promise<MessagePort> {
    return exchange(p, toType, action).then(x => {
        return x.ports[0]
    })
}

/**
 * Send a message to on a port and wait for one to come back.
 */
export function exchangePostMessage(p: MessagePort | Window | BroadcastChannel, fromType: any, toType: string, payload?: any) : Promise<any> {
    return exchange(p, toType, () => {
        console.log("Posting message: "+fromType)
        p.postMessage({
            type: fromType,
            payload
        });
    })
}


