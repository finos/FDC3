import { DataTable, Given, When } from "@cucumber/cucumber";
import { CustomWorld } from "../world";
import { DirectoryApp } from "../../src/directory/DirectoryInterface";
import { APP_FIELD } from "./generic.steps";
import { FindIntentAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { handleResolve } from "../support/matching";
import { contextMap, createMeta } from "./broadcast.steps";

type ListensFor = {
    [key: string]: {
        displayName?: string | undefined;
        contexts: string[];
        resultType?: string | undefined;
    };
}

function convertDataTableToListensFor(dt: DataTable): ListensFor {
    const hashes = dt.hashes()
    const out: { [key: string]: any } = {}
    hashes.forEach(h => {
        out[h["Intent Name"]] = {
            contexts: [h["Context Type"]],
            resultType: h["Result Type"]
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
                listensFor: convertDataTableToListensFor(dt)
            }
        }
    }

    currentApps.push(newApp)

    this.props[APP_FIELD] = currentApps

});

When('{string} finds intents with intent {string} and contextType {string} and result type {string}', function (this: CustomWorld, app: string, intentName: string, contextType: string, resultType: string) {
    const message = {
        meta: createMeta(this, app),
        payload: {
            intent: handleResolve(intentName, this)!!,
            resultType: handleResolve(resultType, this),
            context: contextMap[contextType]
        },
        type: 'findIntentRequest'
    } as FindIntentAgentRequest

    this.server.receive(message)
});