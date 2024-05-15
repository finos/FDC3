import { Directory, DirectoryApp, DirectoryIntent } from "./DirectoryInterface"

export function genericResultTypeSame(a: string | undefined, b: string | undefined) {
    if (a == b) {
        return true;
    } else if ((a == undefined) || (b == undefined)) {
        return true;
    } else if (a.startsWith("channel<") && b == "channel") {
        return true;
    } else if (b.startsWith("channel<") && a == "channel") {
        return true;
    } else {
        return false;
    }
}

/**
 * Basic directory implementation that allows queries over a set of apps.
 */
export class BasicDirectory implements Directory {

    allApps: DirectoryApp[]

    constructor(apps: DirectoryApp[]) {
        this.allApps = apps
    }

    private intentMatches(i: DirectoryIntent, contextType: string | undefined, intentName: string | undefined, resultType: string | undefined): boolean {
        return ((intentName == undefined) || (i.intentName == intentName)) &&
            ((contextType == undefined) || (i.contexts == null) || (i.contexts.includes(contextType))) &&
            (genericResultTypeSame(i.resultType, resultType))
    }

    private retrieveIntentsForApp(a: DirectoryApp): DirectoryIntent[] {
        const lf = a.interop?.intents?.listensFor ?? {}
        const lfa = Object.entries(lf)
        const lfAugmented = lfa.map(([key, value]) => {
            return {
                intentName: key,
                ...(value as any),
                appId: a.appId
            }
        })
        return lfAugmented as DirectoryIntent[]
    }

    retrieveAllIntents(): DirectoryIntent[] {
        const allIntents = this.retrieveAllApps()
            .flatMap(a => this.retrieveIntentsForApp(a))

        return allIntents
    }

    retrieveIntents(contextType: string | undefined, intentName: string | undefined, resultType: string | undefined): DirectoryIntent[] {
        const matchingIntents = this.retrieveAllIntents()
            .filter(i => this.intentMatches(i, contextType, intentName, resultType))
        return matchingIntents
    }

    retrieveApps(contextType: string | undefined, intentName: string | undefined, resultType: string | undefined): DirectoryApp[] {
        return this.retrieveAllApps()
            .filter(a => this.retrieveIntentsForApp(a)
                .filter(i => this.intentMatches(i, contextType, intentName, resultType))
                .length > 0)
    }


    retrieveAppsById(appId: string): DirectoryApp[] {
        return this.retrieveAllApps().filter(a => a.appId == appId)
    }

    retrieveAllApps(): DirectoryApp[] {
        return this.allApps
    }
}


