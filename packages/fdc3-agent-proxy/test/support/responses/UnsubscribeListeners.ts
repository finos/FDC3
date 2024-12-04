import { ContextListenerUnsubscribeRequest, ContextListenerUnsubscribeResponse, EventListenerUnsubscribeRequest, IntentListenerUnsubscribeRequest, IntentListenerUnsubscribeResponse, PrivateChannelUnsubscribeEventListenerRequest, PrivateChannelUnsubscribeEventListenerResponse } from "@kite9/fdc3-schema/generated/api/BrowserTypes";
import { AutomaticResponse, TestMessaging } from "../TestMessaging";
import { createResponseMeta } from "./support";
import { EventListenerUnsubscribeResponse } from "@kite9/fdc3-schema/dist/generated/api/BrowserTypes";

type requests = IntentListenerUnsubscribeRequest | PrivateChannelUnsubscribeEventListenerRequest | ContextListenerUnsubscribeRequest | EventListenerUnsubscribeRequest;
type responses = IntentListenerUnsubscribeResponse | PrivateChannelUnsubscribeEventListenerResponse | ContextListenerUnsubscribeResponse | EventListenerUnsubscribeResponse;
export class UnsubscribeListeners implements AutomaticResponse {

    filter(t: string) {
        return (t == 'intentListenerUnsubscribeRequest') ||
            (t == 'privateChannelUnsubscribeEventListenerRequest') ||
            (t == 'contextListenerUnsubscribeRequest') ||
            (t == 'eventListenerUnsubscribeRequest')
    }

    action(input: object, m: TestMessaging) {
        const out = this.createResponse(input as requests)

        setTimeout(() => { m.receive(out) }, 100)
        return Promise.resolve()
    }

    private createResponse(i: requests): responses {
        return {
            meta: createResponseMeta(i.meta),
            type: i.type.replace('Request', 'Response') as responses['type'],
            payload: {}
        }
    }
}