import { Context, AppIntent, AppIdentifier, IntentResolution, IntentHandler, Listener, ResolveError, IntentResult } from "@finos/fdc3";
import { IntentSupport } from "./IntentSupport";
import { Messaging } from "../Messaging";
import { AppDestinationIdentifier, FindIntentAgentRequest, FindIntentAgentRequestMeta, FindIntentAgentResponse, FindIntentsByContextAgentRequest, FindIntentsByContextAgentRequestMeta, FindIntentsByContextAgentResponse, RaiseIntentAgentRequest, RaiseIntentAgentRequestMeta, RaiseIntentAgentResponse, RaiseIntentResultAgentResponse } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { DefaultIntentResolution } from "./DefaultIntentResolution";
import { DefaultIntentListener } from "../listeners/DefaultIntentListener";
import { IntentResolver } from "@kite9/fdc3-common";
import { DefaultChannel } from "../channels/DefaultChannel";
import { DefaultPrivateChannel } from "../channels/DefaultPrivateChannel";

function convertIntentResult(m: RaiseIntentResultAgentResponse, messaging: Messaging): Promise<IntentResult> {
    if (m.payload?.intentResult?.channel) {
        const c = m.payload.intentResult.channel!!;
        switch (c.type) {
            case 'app':
            case 'user':
                return new Promise((resolve) => resolve(new DefaultChannel(messaging, c.id, c.type, c.displayMetadata)))
            case 'private':
                return new Promise((resolve) => resolve(new DefaultPrivateChannel(messaging, c.id)))
        }
    } else if (m.payload?.intentResult?.context) {
        return new Promise((resolve) => {
            resolve(m.payload.intentResult.context)
        })
    } else {
        return new Promise((resolve) => (resolve()))
    }
}

export class DefaultIntentSupport implements IntentSupport {

    readonly messaging: Messaging
    readonly intentResolver: IntentResolver

    constructor(messaging: Messaging, intentResolver: IntentResolver) {
        this.messaging = messaging
        this.intentResolver = intentResolver
    }

    async findIntent(intent: string, context: Context, resultType: string | undefined): Promise<AppIntent> {
        const messageOut: FindIntentAgentRequest = {
            type: "findIntentRequest",
            payload: {
                intent,
                context,
                resultType
            },
            meta: this.messaging.createMeta() as FindIntentAgentRequestMeta
        }

        const result = await this.messaging.exchange(messageOut, "findIntentResponse") as FindIntentAgentResponse

        if (result.payload.appIntent.apps.length == 0) {
            throw new Error(ResolveError.NoAppsFound)
        }

        return {
            intent: result.payload.appIntent.intent,
            apps: result.payload.appIntent.apps
        }
    }

    async findIntentsByContext(context: Context): Promise<AppIntent[]> {
        const messageOut: FindIntentsByContextAgentRequest = {
            type: "findIntentsByContextRequest",
            payload: {
                context
            },
            meta: this.messaging.createMeta() as FindIntentsByContextAgentRequestMeta
        }

        const result = await this.messaging.exchange(messageOut, "findIntentsByContextResponse") as FindIntentsByContextAgentResponse

        if (result.payload.appIntents.length == 0) {
            throw new Error(ResolveError.NoAppsFound)
        }

        return result.payload.appIntents
    }

    private async raiseSpecificIntent(intent: string, context: Context, app: AppIdentifier): Promise<IntentResolution> {
        const messageOut: RaiseIntentAgentRequest = {
            type: "raiseIntentRequest",
            payload: {
                intent: intent as any, // raised #1157
                context: context,
                app: (app as AppDestinationIdentifier)
            },
            meta: this.messaging.createMeta() as RaiseIntentAgentRequestMeta
        }

        const resultPromise = this.messaging.waitFor<RaiseIntentResultAgentResponse>(m => (
            (m.meta.requestUuid == messageOut.meta.requestUuid) &&
            (m.type == 'raiseIntentResultResponse')))
            .then(ir => convertIntentResult(ir, this.messaging))
            .then(ir => this.intentResolver.intentChosen(ir))

        const resolution = await this.messaging.exchange(messageOut, "raiseIntentResponse") as RaiseIntentAgentResponse
        const details = resolution.payload.intentResolution

        return new DefaultIntentResolution(
            this.messaging,
            resultPromise,
            details.source,
            details.intent,
            details.version
        )
    }

    private matchAppId(found: AppIdentifier, req: AppIdentifier) {
        return (found.appId == req.appId) &&
            (((found.instanceId == null) && (req.instanceId == null)) // request was not for a particular instance
                ||
                (found.instanceId == req.instanceId))    // requested exact instance.
    }

    private filterApps(appIntent: AppIntent, app: AppIdentifier): AppIntent {
        return {
            apps: appIntent.apps.filter(a => this.matchAppId(a, app)),
            intent: appIntent.intent
        }
    }

    async raiseIntent(intent: string, context: Context, app?: AppIdentifier | undefined): Promise<IntentResolution> {
        var matched = await this.findIntent(intent, context, undefined)

        if (app) {
            // ensure app matches
            matched = this.filterApps(matched, app)

            if (matched.apps.length == 0) {
                if (app.instanceId) {
                    throw new Error(ResolveError.TargetInstanceUnavailable)
                } else {
                    throw new Error(ResolveError.TargetAppUnavailable)
                }
            }
        } else if (matched.apps.length == 0) {
            throw new Error(ResolveError.NoAppsFound)
        }

        if (matched.apps.length == 1) {
            return this.raiseSpecificIntent(intent, context, matched.apps[0])
        } else {
            // need to do the intent resolver
            const chosentIntent = await this.intentResolver.chooseIntent([matched], this.messaging.getSource())
            return this.raiseSpecificIntent(chosentIntent.intent.name, context, chosentIntent.chosenApp)
        }
    }

    async raiseIntentForContext(context: Context, app?: AppIdentifier | undefined): Promise<IntentResolution> {
        var matched = await this.findIntentsByContext(context)

        if (app) {
            matched = matched.map(m => this.filterApps(m, app))
            matched = matched.filter(m => m.apps.length > 0)
        }

        if (matched.length == 0) {
            throw new Error(ResolveError.NoAppsFound)
        } else if ((matched.length == 1) && (matched[0].apps.length == 1)) {
            return this.raiseSpecificIntent(matched[0].intent.name, context, matched[0].apps[0])
        } else {
            // need to do the intent resolver
            const chosentIntent = await this.intentResolver.chooseIntent(matched, this.messaging.getSource())
            return this.raiseSpecificIntent(chosentIntent.intent.name, context, chosentIntent.chosenApp)
        }
    }

    async addIntentListener(intent: string, handler: IntentHandler): Promise<Listener> {
        return new DefaultIntentListener(this.messaging, intent, handler);
    }

}