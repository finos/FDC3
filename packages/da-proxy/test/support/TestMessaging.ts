import { AppIdentifier, Context, Channel } from "@kite9/fdc3-core";
import { AppRequestMessage, WebConnectionProtocol5ValidateAppIdentitySuccessResponse } from "@kite9/fdc3-core";
import { v4 as uuidv4 } from 'uuid'
import { AbstractMessaging } from "../../src/messaging/AbstractMessaging";
import { RegisterableListener } from "../../src/listeners/RegisterableListener";
import { FindIntent } from "./responses/FindIntent";
import { FindIntentByContext } from "./responses/FindIntentByContext";
import { ICreateLog } from "@cucumber/cucumber/lib/runtime/attachment_manager";
import { RaiseIntent } from "./responses/RaiseIntent";
import { GetAppMetadata } from "./responses/GetAppMetadata";
import { FindInstances } from "./responses/FindInstances";
import { Open } from "./responses/Open";
import { Handshake } from "./responses/Handshake";
import { GetOrCreateChannel } from "./responses/GetOrCreateChannel";
import { ChannelState } from "./responses/ChannelState";
import { GetUserChannels } from "./responses/GetUserChannels";
import { RegisterListeners } from "./responses/RegisterListeners";
import { UnsubscribeListeners } from "./responses/UnsubscribeListeners";
import { CreatePrivateChannel } from "./responses/CreatePrivateChannel";
import { DisconnectPrivateChannel } from "./responses/DisconnectPrivateChannel";
import { IntentResult } from "./responses/IntentResult";
import { RaiseIntentForContext } from "./responses/RaiseIntentForContext";

export interface IntentDetail {
    app?: AppIdentifier,
    intent?: string,
    context?: string,
    resultType?: string,
}

export interface AutomaticResponse {

    filter: (t: string) => boolean,
    action: (input: object, m: TestMessaging) => Promise<void>

}


export interface PossibleIntentResult {
    context?: Context;
    channel?: any;
    error?: string;
    timeout?: boolean
}

function matchStringOrUndefined(expected: string | undefined, actual: string | undefined) {
    if ((expected) && (actual)) {
        return expected == actual
    } else {
        return true
    }
}

function matchString(expected: string | undefined, actual: string | undefined) {
    return expected == actual
}

function removeGenericType(t: string) {
    const startOfGeneric = t.indexOf("<")
    if (startOfGeneric > -1) {
        return t.substring(0, startOfGeneric - 1)
    } else {
        return t
    }
}

function matchResultTypes(expected: string | undefined, actual: string | undefined) {
    if (expected) {
        if (expected.indexOf("<") > -1) {
            // looking for a complete match involving generics
            return expected == actual
        } else if (actual == undefined) {
            // no actual, only expected
            return false;
        } else {
            // expected doesn't have generics, match without
            const actualType = removeGenericType(actual)
            return expected == actualType
        }
    } else {
        return true;
    }
}

export function intentDetailMatches(instance: IntentDetail, template: IntentDetail, contextMustMatch: boolean): boolean {
    return matchStringOrUndefined(template.app?.appId, instance.app?.appId) &&
        matchStringOrUndefined(template.app?.instanceId, instance.app?.instanceId) &&
        matchStringOrUndefined(template.intent, instance.intent) &&
        (contextMustMatch ? matchString(template.context, instance.context) : matchStringOrUndefined(template.context, instance.context)) &&
        matchResultTypes(template.resultType, instance.resultType)
}

export class TestMessaging extends AbstractMessaging {

    readonly allPosts: AppRequestMessage[] = []
    readonly listeners: Map<string, RegisterableListener> = new Map()
    readonly intentDetails: IntentDetail[] = []
    readonly channelState: { [key: string]: Context[] }
    currentChannel: Channel | null = null

    readonly automaticResponses: AutomaticResponse[]

    constructor(channelState: { [key: string]: Context[] }) {
        super({
            timeout: 0,
            channelSelector: false,
            intentResolver: false,
            dontSetWindowFdc3: false
        }, "test", 200)

        this.channelState = channelState
        this.automaticResponses = [
            new FindIntent(),
            new FindIntentByContext(),
            new RaiseIntent(),
            new RaiseIntentForContext(),
            new IntentResult(),
            new GetAppMetadata(),
            new FindInstances(),
            new Open(),
            new Handshake(),
            new GetOrCreateChannel(),
            new ChannelState(this.channelState),
            new GetUserChannels(),
            new RegisterListeners(),
            new UnsubscribeListeners(),
            new CreatePrivateChannel(),
            new DisconnectPrivateChannel()
        ]
    }

    createUUID(): string {
        return uuidv4()
    }


    post(message: AppRequestMessage): Promise<void> {
        this.allPosts.push(message)

        for (let i = 0; i < this.automaticResponses.length; i++) {
            const ar = this.automaticResponses[i]
            if (ar.filter(message.type)) {
                return ar.action(message, this)
            }
        }

        return Promise.resolve();
    }

    addAppIntentDetail(id: IntentDetail) {
        this.intentDetails.push(id)
    }

    register(l: RegisterableListener) {
        if (l.id == null) {
            throw new Error("Listener must have ID set")
        } else {
            this.listeners.set(l.id, l)
        }
    }

    unregister(id: string) {
        this.listeners.delete(id)
    }

    createMeta() {
        return {
            "requestUuid": this.createUUID(),
            "timestamp": new Date(),
            "source": this.getSource()
        }
    }

    /**
     * Used in testing steps
     */
    createResponseMeta() {
        return {
            ...this.createMeta(),
            responseUuid: this.createUUID()
        }
    }

    /**
     * Used in testing steps
     */
    createEventMeta() {
        return {
            ...this.createMeta(),
            eventUuid: this.createUUID()
        }
    }

    receive(m: any, log?: ICreateLog) {
        this.listeners.forEach((v, k) => {
            if (v.filter(m)) {
                log ? log("Processing in " + k) : ""
                v.action(m)
            } else {
                log ? log("Ignoring in " + k) : ""
            }
        })
    }

    private ir: PossibleIntentResult | null = null

    getIntentResult() {
        return this.ir
    }

    setIntentResult(o: PossibleIntentResult) {
        this.ir = o
    }

    retrieveInstanceUuid(): string | undefined {
        return (globalThis as any).instanceUuid as string | undefined
    }

    storeInstanceUuid(validationResponse: WebConnectionProtocol5ValidateAppIdentitySuccessResponse): void {
        (globalThis as any).instanceUuid = validationResponse.payload.instanceUuid
    }
}