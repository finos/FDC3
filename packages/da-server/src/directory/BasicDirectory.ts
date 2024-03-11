import { Directory, DirectoryApp, DirectoryIntent } from "./DirectoryInterface"

export function genericResultType(rt: string | undefined): string | undefined {
    if (rt == undefined) {
        return undefined;
    } else if (rt.indexOf('channel<') == 0) {
        return 'channel';
    } else {
        return rt;
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
            ((resultType == undefined) || (i.resultType == resultType) || (genericResultType(i.resultType) == resultType))
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


