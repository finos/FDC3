import type { Application, AppDirectoryIntent, WebAppDetails } from '@finos/fdc3-standard';

export type DirectoryIntent = AppDirectoryIntent & { intentName: string; appId: string };
export type DirectoryApp = Application;
export type { AppDirectoryIntent, WebAppDetails };

/**
 * This interface wraps the functionality of the FDC3 Directory structure (stored in JSON),
 * providing lookup calls to functions that would be handled by inspecting the directory/directories JSON definitions.
 */

export interface Directory {
  retrieveAllApps(): DirectoryApp[];

  retrieveApps(
    contextType: string | undefined,
    intentName: string | undefined,
    resultType: string | undefined
  ): DirectoryApp[];

  retrieveAllIntents(): DirectoryIntent[];

  retrieveIntents(
    contextType: string | undefined,
    intentName?: string | undefined,
    resultType?: string
  ): DirectoryIntent[];

  retrieveAppsById(appId: string): DirectoryApp[];
}
