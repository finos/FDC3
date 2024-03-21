import { Directory, DirectoryApp } from "./DirectoryInterface"
import { components } from '../directory-schema'

type schemas = components['schemas']
type DirectoryIntent = schemas['Intent'] & { intentName: string, appId: string }

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
                ...value,
                appId: a.appId
            }
        })
        return lfAugmented
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


