import { Directory, DirectoryApp, DirectoryIntent } from "./DirectoryInterface"

export function genericResultTypeSame(a: string | undefined, b: string | undefined) {
    if (a == b) {
        return true;
    } else if (a == undefined) {
        return true;
    } else if (b == undefined) {
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

    /** For retrieving intents */

    retrieveIntents(contextType: string | undefined, intentName: string | undefined, resultType: string | undefined): DirectoryIntent[] {
        return this.retrieveAllIntents().filter(i => this.intentMatches(i, contextType, intentName, resultType))
    }

    intentMatches(i: DirectoryIntent, contextType: string | undefined, intentName: string | undefined, resultType: string | undefined): boolean {
        return ((intentName == undefined) || (i.intentName == intentName)) &&
            ((contextType == undefined) || (i.contexts.includes(contextType))) &&
            (genericResultTypeSame(i.resultType, resultType))
    }

    retrieveAllIntents(): DirectoryIntent[] {
        return this.allApps.flatMap(a => this.retrieveIntentsForApp(a))
    }

    retrieveIntentsForApp(a: DirectoryApp): DirectoryIntent[] {
        const lf = a.interop?.intents?.listensFor ?? {}
        const lfa = Object.entries(lf)
        const lfAugmented = lfa.map(([key, value]) => {
            return {
                intentName: key,
                ...value,
                appId: a.appId
            }
        })
        return lfAugmented
    }


    /** For retrieving apps */

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

    /**
     * For FDC3 1.2, retreives by the name of the app
     */
    retrieveAppsByName(name: string): DirectoryApp[] {
        return this.retrieveAllApps().filter(a => a.name == name)
    }
}


