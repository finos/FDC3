import { IframeHello, WebConnectionProtocol3Handshake } from "@kite9/fdc3-standard"
import { CustomWorld } from "../world"
import { MockWindow } from "./MockDocument"
import { CHANNEL_SELECTOR_URL, EMBED_URL, INTENT_RESPOLVER_URL } from "./MockFDC3Server"


/**
 * This handles the frame communications when we're using the embedded iframe approach
 */
export function handleEmbeddedIframeComms(value: string, parent: MockWindow, cw: CustomWorld) {
    const paramStr = value.substring(EMBED_URL.length + 1)
    const params = new URLSearchParams(paramStr)
    const connectionAttemptUuid = params.get("connectionAttemptUuid")!!
    const connection = cw.mockContext.getFirstInstance()
    try {
        parent.postMessage({
            type: "WCP3Handshake",
            meta: {
                connectionAttemptUuid: connectionAttemptUuid,
                timestamp: new Date()
            },
            payload: {
                fdc3Version: "2.2",
                resolver: INTENT_RESPOLVER_URL,
                channelSelector: CHANNEL_SELECTOR_URL,
            }
        } as WebConnectionProtocol3Handshake, EMBED_URL, [connection!!.externalPort])
    } catch (e) {
        console.error(e)
    }
}

export function handleChannelSelectorComms(_value: string, parent: MockWindow, source: Window, cw: CustomWorld): MessageChannel {
    const connection = new MessageChannel();
    try {
        parent.dispatchEvent({
            type: "message",
            data: {
                type: "iframeHello"
            } as IframeHello,
            origin: CHANNEL_SELECTOR_URL,
            source,
            ports: [connection.port1]
        } as any as Event)


        connection.port2.onmessage = (e) => {
            if (e.data.type == 'iframeHandshake') {
                setTimeout(() => {
                    connection.port2.postMessage({
                        type: 'iframeRestyle',
                        payload: {
                            css: {
                                "width": "100px"
                            }
                        }
                    })
                }, 100)
            }
            cw.props['lastChannelSelectorMessage'] = e.data
        }
    } catch (e) {
        console.error(e)
    }

    return connection
}

export function handleIntentResolverComms(_value: string, parent: MockWindow, source: Window, cw: CustomWorld): MessageChannel {
    const connection = new MessageChannel();
    try {
        parent.dispatchEvent({
            type: "message",
            data: {
                type: "iframeHello"
            } as IframeHello,
            origin: INTENT_RESPOLVER_URL,
            source,
            ports: [connection.port1]
        } as any as Event)

        connection.port2.onmessage = (e) => {
            if (e.type == 'iframeHandshake') {
                setTimeout(() => {
                    connection.port2.postMessage({
                        type: 'iframeRestyle',
                        payload: {
                            css: {
                                "width": "100px"
                            }
                        }
                    })
                }, 100)
            }

            cw.props['lastIntentResolverMessage'] = e
        }
    } catch (e) {
        console.error(e)
    }

    return connection
}