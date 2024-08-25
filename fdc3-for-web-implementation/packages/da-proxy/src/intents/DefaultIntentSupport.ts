import { Context, AppIntent, AppIdentifier, IntentResolution, IntentHandler, Listener, ResolveError, IntentResult } from "@finos/fdc3";
import { IntentSupport } from "./IntentSupport";
import { Messaging } from "../Messaging";
import { DefaultIntentResolution } from "./DefaultIntentResolution";
import { DefaultIntentListener } from "../listeners/DefaultIntentListener";
import { IntentResolver } from "@kite9/fdc3-common";
import { DefaultChannel } from "../channels/DefaultChannel";
import { DefaultPrivateChannel } from "../channels/DefaultPrivateChannel";
import { FindIntentRequest, FindIntentResponse, AddContextListenerRequestMeta, FindIntentsByContextRequest, FindIntentsByContextResponse, RaiseIntentRequest, RaiseIntentResultResponse, RaiseIntentResponse } from "@kite9/fdc3-common"

function convertIntentResult(m: RaiseIntentResultResponse, messaging: Messaging): Promise<IntentResult> {
    const result = m.payload.intentResult!!
    if (result.channel) {
        const c = result.channel!!;
        switch (c.type) {
            case 'private':
                return new Promise((resolve) => resolve(new DefaultPrivateChannel(messaging, c.id)))
            case 'app':
            case 'user':
            default:
                return new Promise((resolve) => resolve(new DefaultChannel(messaging, c.id, c.type, c.displayMetadata)))
        }
    } else if (result.context) {
        return new Promise((resolve) => {
            resolve(result.context)
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
        const messageOut: FindIntentRequest = {
            type: "findIntentRequest",
            payload: {
                intent,
                context,
                resultType
            },
            meta: this.messaging.createMeta() as any /* ISSUE: #1275 */
        }

        const result = await this.messaging.exchange(messageOut, "findIntentResponse") as FindIntentResponse
        const appIntent = result.payload.appIntent!!
        if (appIntent.apps.length == 0) {
            throw new Error(ResolveError.NoAppsFound)
        } else {
            return {
                intent: appIntent.intent as any /* ISSUE: 1295 */,
                apps: appIntent.apps
            }
        }
    }

    async findIntentsByContext(context: Context): Promise<AppIntent[]> {
        const messageOut: FindIntentsByContextRequest = {
            type: "findIntentsByContextRequest",
            payload: {
                context
            },
            meta: this.messaging.createMeta() as AddContextListenerRequestMeta /* ISSUE: #1275 */
        }

        const result = await this.messaging.exchange(messageOut, "findIntentsByContextResponse") as FindIntentsByContextResponse
        const appIntents = result.payload.appIntents!!
        if (appIntents.length == 0) {
            throw new Error(ResolveError.NoAppsFound)
        } else {
            return appIntents as any /* ISSUE: 1295 */
        }

    }

    private async createResultPromise(messageOut: RaiseIntentRequest): Promise<IntentResult> {
        const rp = await this.messaging.waitFor<RaiseIntentResultResponse>(m => (
            (m.type == 'raiseIntentResultResponse') &&
            (m.meta.requestUuid == messageOut.meta.requestUuid)))

        if (!rp) {
            // probably a timeout
            return;
        } else {
            const ir = await convertIntentResult(rp, this.messaging)
            this.intentResolver.intentChosen(ir)
            return ir
        }
    }

    private async raiseSpecificIntent(intent: string, context: Context, app: AppIdentifier): Promise<IntentResolution> {
        const messageOut: RaiseIntentRequest = {
            type: "raiseIntentRequest",
            payload: {
                intent,
                context,
                app: app
            },
            meta: this.messaging.createMeta() as AddContextListenerRequestMeta /* ISSUE: #1275 */
        }

        const resultPromise = this.createResultPromise(messageOut)
        const resolution = await this.messaging.exchange(messageOut, "raiseIntentResponse") as RaiseIntentResponse
        const details = resolution.payload.intentResolution!!

        return new DefaultIntentResolution(
            this.messaging,
            resultPromise,
            details.source,
            details.intent
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
        console.log("Matched intents:")

        if (app) {
            // ensure app matches
            matched = this.filterApps(matched, app)

            if ((matched.apps.length == 0) && (app?.instanceId)) {
                // user wanted a specific instance, which doesn't exist
                throw new Error(ResolveError.TargetInstanceUnavailable)
            } else if ((matched.apps.length == 0) && (app?.appId)) {
                // user wanted a specific app, which doesn't support the intent
                throw new Error(ResolveError.TargetAppUnavailable)
            } else {
                return this.raiseSpecificIntent(intent, context, app);
            }
        }

        if (matched.apps.length == 0) {
            // user didn't supply an app, and no intent matches
            throw new Error(ResolveError.NoAppsFound)
        } else if (matched.apps.length == 1) {
            // use the found app
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
        const out = new DefaultIntentListener(this.messaging, intent, handler);
        await out.register()
        return out
    }

}