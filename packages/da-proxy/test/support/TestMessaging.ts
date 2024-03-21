import { AppIdentifier } from "@finos/fdc3";
import { AgentRequestMessage, AgentResponseMessage, ConnectionStep3Handshake, ContextElement, IntentResult } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { v4 as uuidv4 } from 'uuid'
import { AbstractMessaging } from "../../src/messaging/AbstractMessaging";
import { RegisterableListener } from "../listeners/RegisterableListener";
import { FindIntent } from "./responses/FindIntent";
import { FindIntentByContext } from "./responses/FindIntentByContext";
import { ICreateLog } from "@cucumber/cucumber/lib/runtime/attachment_manager";
import { RaiseIntent } from "./responses/RaiseIntent";
import { GetAppMetadata } from "./responses/GetAppMetadata";
import { FindInstances } from "./responses/FindInstances";
import { Open } from "./responses/Open";
import { Handshake } from "./responses/Handshake";

export interface IntentDetail {
    app?: AppIdentifier,
    intent?: string,
    context?: string,
    resultType?: string
}

export interface AutomaticResponse {

    filter: (t: string) => boolean,
    action: (input: object, m: TestMessaging) => Promise<void>

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

    readonly allPosts: AgentRequestMessage[] = []
    readonly listeners: Map<string, RegisterableListener> = new Map()
    readonly intentDetails: IntentDetail[] = []
    readonly channelState: { [key: string]: ContextElement[] }

    readonly automaticResponses: AutomaticResponse[] = [
        new FindIntent(),
        new FindIntentByContext(),
        new RaiseIntent(),
        new GetAppMetadata(),
        new FindInstances(),
        new Open(),
        new Handshake()
    ]

    constructor(channelState: { [key: string]: ContextElement[] }) {
        super()
        this.channelState = channelState
    }

    getSource(): AppIdentifier {
        return {
            appId: "SomeDummyApp",
            instanceId: "some.dummy.instance"
        }
    }

    createUUID(): string {
        return uuidv4()
    }


    post(message: AgentRequestMessage): Promise<void> {
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
        this.listeners.set(l.id, l)
    }

    unregister(id: string) {
        this.listeners.delete(id)
    }

    createMeta() {
        return {
            "requestUuid": this.createUUID(),
            "timestamp": new Date(),
            "source": this.getSource(),
            "responseUuid": this.createUUID()
        }
    }

    receive(m: AgentRequestMessage | AgentResponseMessage | ConnectionStep3Handshake, log?: ICreateLog) {
        this.listeners.forEach((v, k) => {
            if (v.filter(m)) {
                log ? log("Processing in " + k) : ""
                v.action(m)
            } else {
                log ? log("Ignoring in " + k) : ""
            }
        })
    }

    private ir: IntentResult = {

    }

    getIntentResult() {
        return this.ir
    }

    setIntentResult(o: IntentResult) {
        this.ir = o
    }
}