import { Directory, DirectoryApp, DirectoryIntent } from './DirectoryInterface';

export function genericResultTypeSame(real: string | undefined, required: string | undefined) {
  if (required == undefined) {
    return true;
  } else if (real == required) {
    return true;
  } else if (real == undefined) {
    return false; // required is not undefined, so asking for something
  } else if (real.startsWith('channel<') && required == 'channel') {
    return true;
  } else {
    return false;
  }
}

/**
 * Basic directory implementation that allows queries over a set of apps.
 */
export class BasicDirectory implements Directory {
  allApps: DirectoryApp[];

  constructor(apps: DirectoryApp[]) {
    this.allApps = apps;
  }

  private intentMatches(
    i: DirectoryIntent,
    contextType: string | undefined,
    intentName: string | undefined,
    resultType: string | undefined
  ): boolean {
    const out =
      (intentName == undefined || i.intentName == intentName) &&
      (contextType == undefined || (i.contexts ?? []).includes(contextType)) &&
      genericResultTypeSame(i.resultType, resultType);
    return out;
  }

  private retrieveIntentsForApp(a: DirectoryApp): DirectoryIntent[] {
    const lf = a.interop?.intents?.listensFor ?? {};
    const lfa = Object.entries(lf);
    const lfAugmented = lfa.map(([key, value]) => {
      return {
        intentName: key,
        ...value,
        appId: a.appId,
      };
    });
    return lfAugmented;
  }

  retrieveAllIntents(): DirectoryIntent[] {
    const allIntents = this.retrieveAllApps().flatMap(a => this.retrieveIntentsForApp(a));

    return allIntents;
  }

  retrieveIntents(
    contextType: string | undefined,
    intentName: string | undefined,
    resultType: string | undefined
  ): DirectoryIntent[] {
    const matchingIntents = this.retrieveAllIntents().filter(i =>
      this.intentMatches(i, contextType, intentName, resultType)
    );
    return matchingIntents;
  }

  retrieveApps(
    contextType: string | undefined,
    intentName?: string | undefined,
    resultType?: string | undefined
  ): DirectoryApp[] {
    const result = this.retrieveAllApps().filter(
      a =>
        this.retrieveIntentsForApp(a).filter(i => this.intentMatches(i, contextType, intentName, resultType)).length > 0
    );

    return result;
  }

  retrieveAppsById(appId: string): DirectoryApp[] {
    return this.retrieveAllApps().filter(a => a.appId == appId);
  }

  retrieveAllApps(): DirectoryApp[] {
    return this.allApps;
  }
}
