import semver from 'semver';
import { Directory, DirectoryApp, DirectoryIntent } from './DirectoryInterface.js';

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

export function appSupportsFdc3Version(app: DirectoryApp, fdc3Version: string): boolean {
  const appFdc3Version = app.fdc3Version;
  if (appFdc3Version == null) {
    return true;
  }

  const range = semver.validRange(appFdc3Version);
  return range != null && semver.satisfies(fdc3Version, range);
}

/**
 * Basic directory implementation that allows queries over a set of apps.
 */
export class BasicDirectory implements Directory {
  allApps: DirectoryApp[];
  readonly fdc3Version: string;

  constructor(apps: DirectoryApp[], fdc3Version = '3.0') {
    this.fdc3Version = fdc3Version;
    this.allApps = apps.filter(app => appSupportsFdc3Version(app, fdc3Version));
  }

  addApps(apps: DirectoryApp[]): void {
    apps.forEach(app => {
      const existing = this.allApps.find(a => a.appId == app.appId);
      if (!existing && appSupportsFdc3Version(app, this.fdc3Version)) {
        this.allApps.push(app);
      }
    });
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
