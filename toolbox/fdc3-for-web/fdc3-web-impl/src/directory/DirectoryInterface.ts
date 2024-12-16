import { components } from '../directory-schema';

type schemas = components['schemas'];

export type DirectoryIntent = schemas['Intent'] & { intentName: string; appId: string };
export type DirectoryApp = schemas['Application'];
export type WebAppDetails = schemas['WebAppDetails'];

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
    intentName: string | undefined,
    resultType: string | undefined
  ): DirectoryIntent[];

  retrieveAppsById(appId: string): DirectoryApp[];
}
