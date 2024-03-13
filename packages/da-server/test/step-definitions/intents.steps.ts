import { DataTable, Given, When } from "@cucumber/cucumber";
import { CustomWorld } from "../world";
import { DirectoryApp } from "../../src/directory/DirectoryInterface";
import { APP_FIELD } from "./generic.steps";
import { FindIntentAgentRequest, RaiseIntentAgentRequest, RaiseIntentAgentResponse, RaiseIntentResultAgentResponse } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { handleResolve } from "../support/matching";
import { createMeta, contextMap } from './generic.steps';

type ListensFor = {
    [key: string]: {
        displayName?: string | undefined;
        contexts: string[];
        resultType?: string | undefined;
    };
}

function convertDataTableToListensFor(cw: CustomWorld, dt: DataTable): ListensFor {
    const hashes = dt.hashes()
    const out: { [key: string]: any } = {}
    hashes.forEach(h => {
        out[h["Intent Name"]] = {
            contexts: [handleResolve(h["Context Type"], cw)],
            resultType: handleResolve(h["Result Type"], cw)
        }
    })

    return out
}

Given('{string} is an app with the following intents', function (this: CustomWorld, appId: string, dt: DataTable) {

    const currentApps = this.props[APP_FIELD] ?? []

    const newApp: DirectoryApp = {
        appId,
        type: "web",
        description: "",
        title: "",
        details: {},
        interop: {
            intents: {
                listensFor: convertDataTableToListensFor(this, dt)
            }
        }
    }

    currentApps.push(newApp)

    this.props[APP_FIELD] = currentApps

});

When('{string} finds intents with intent {string} and contextType {string} and result type {string}', function (this: CustomWorld, appStr: string, intentName: string, contextType: string, resultType: string) {
    const meta = createMeta(this, appStr)
    const message = {
        meta,
        payload: {
            intent: handleResolve(intentName, this)!!,
            resultType: handleResolve(resultType, this),
            context: contextMap[contextType]
        },
        type: 'findIntentRequest'
    } as FindIntentAgentRequest

    this.server.receive(message, meta.source)
});

Given('{string} registers an intent listener for {string} with contextType {string} and result type {string}', function (this: CustomWorld, appStr: string, intentName: string, contextType: string, resultType: string) {
    const meta = createMeta(this, appStr)
    const message = {
        type: 'onAddIntentListener',
        meta,
        payload: {
            intentName: handleResolve(intentName, this),
            contextType: handleResolve(contextType, this),
            resultType: handleResolve(resultType, this),
        }
    }
    this.server.receive(message, meta.source)
});


Given('{string} unsubscribes an intent listener for {string} with contextType {string} and result type {string}', function (this: CustomWorld, appStr: string, intentName: string, contextType: string, resultType: string) {
    const meta = createMeta(this, appStr)
    const message = {
        type: 'onUnsubscribe',
        meta,
        payload: {
            intentName: handleResolve(intentName, this),
            contextType: handleResolve(contextType, this),
            resultType: handleResolve(resultType, this),
        }
    }
    this.server.receive(message, meta.source)
});

function raise(cw: CustomWorld, intentName: string, contextType: string, dest: string, meta: any): RaiseIntentAgentRequest {
    const destMeta = createMeta(cw, dest)
    const message = {
        type: 'raiseIntentRequest',
        meta: {
            ...meta,
            destination: {
                ...destMeta.source,
                desktopAgent: 'n/a'
            }
        },
        payload: {
            intent: handleResolve(intentName, cw),
            context: contextMap[contextType],
            app: destMeta.source
        }
    } as RaiseIntentAgentRequest
    return message;
}

When('{string} raises an intent for {string} with contextType {string} on app {string}', function (this: CustomWorld, appStr: string, intentName: string, contextType: string, dest: string) {
    const meta = createMeta(this, appStr)
    const message = raise(this, intentName, contextType, dest, meta)
    this.server.receive(message, meta.source)
});

When('{string} raises an intent for {string} with contextType {string} on app {string} with requestUuid {string}', function (this: CustomWorld, appStr: string, intentName: string, contextType: string, dest: string, requestUuid: string) {
    const meta = {
        ...createMeta(this, appStr), requestUuid
    }
    const message = raise(this, intentName, contextType, dest, meta)
    this.server.receive(message, meta.source)
})


When('we wait for the intent timeout', function (this: CustomWorld) {
    return new Promise<void>((resolve, _reject) => {
        setTimeout(() => resolve(), 2100)
    })
});

When('{string} sends a raiseIntentResponse for intent {string} with requestUuid {string}', function (this: CustomWorld, appStr: string, intentName: string, requestUuid: string) {
    const meta = createMeta(this, appStr)
    const message = {
        type: 'raiseIntentResponse',
        meta: {
            requestUuid,
            responseUuid: this.sc.createUUID(),
            timestamp: new Date()
        },
        payload: {
            intentResolution: {
                intent: intentName,
                source: {
                    ...meta.source
                }
            }
        }
    } as RaiseIntentAgentResponse
    this.server.receive(message, meta.source)
});

When('{string} sends a raiseIntentResultResponse with requestUuid {string}', function (this: CustomWorld, appStr: string, requestUuid: string) {
    const meta = createMeta(this, appStr)
    const message = {
        type: 'raiseIntentResultResponse',
        meta: {
            requestUuid,
            responseUuid: this.sc.createUUID(),
            timestamp: new Date()
        },
        payload: {
            intentResult: {
                context: {
                    "type": "fdc3.something",
                    "name": "Some Name"
                }
            }
        }
    } as RaiseIntentResultAgentResponse

    this.server.receive(message, meta.source)
});