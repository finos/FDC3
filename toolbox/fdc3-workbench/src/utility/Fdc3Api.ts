/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import * as fdc3_2 from '@finos/fdc3';
import * as fdc3_1 from 'fdc3-1.2';

interface fdc3_1IntentResolution extends fdc3_1.IntentResolution {
  getResult?: any;
  resultContext?: any;
}
interface fdc3_2IntentResolution extends fdc3_2.IntentResolution {
  resultContext?: any;
}

interface fdc3_1ImplementationMetadata extends fdc3_1.ImplementationMetadata {
  appMetadata?: any;
}

interface fdc3_2ImplementationMetadata extends fdc3_2.ImplementationMetadata {
  appMetadata: any;
}

export type ContextType = {
  type: string;
  id?: {
    [key: string]: string;
  };
  name?: string;
  [x: string]: any;
};

export interface Fdc3Listener {
  id: string;
  channelId?: string;
  type: string | undefined;
  listener: fdc3_1.Listener | fdc3_2.Listener;
  lastReceivedContext?: ContextType | null;
  metaData?: any;
}

export type IntentResolution = fdc3_1IntentResolution | fdc3_2IntentResolution;

export type TargetApp = fdc3_1.TargetApp;

export type ImplementationMetadata = fdc3_1ImplementationMetadata | fdc3_2ImplementationMetadata;

export type AppMetadata = fdc3_2.AppMetadata;
//  & {
// 	instanceId?: string;
// };

export type AppIntent = fdc3_1.AppIntent | fdc3_2.AppIntent;

export type Context = fdc3_1.Context | fdc3_2.Context;

// export type AppIdentifier = fdc3_1.AppMetadata | fdc3_2.AppIdentifier;

export type PrivateChannel = fdc3_2.PrivateChannel;

export type IntentTargetOption = {
  appId: string;
  metadata: AppMetadata;
  instances: fdc3_2.AppMetadata[];
  launchNew: boolean;
};

export type ContextTargetOption = { intent: string; targetOptions: IntentTargetOption[] };

export async function getTargetOptions(intent: string, context: ContextType): Promise<IntentTargetOption[]> {
  const agent = await fdc3_2.getAgent();

  let appIntent = await agent.findIntent(intent, context);
  if (!appIntent?.apps) {
    return [];
  }

  const groupedApps: IntentTargetOption[] = [];

  if (window.fdc3Version === '2.0') {
    (appIntent as fdc3_2.AppIntent).apps.forEach(currentApp => {
      let foundApp = groupedApps.find(app => app.appId === currentApp.appId);
      if (!foundApp) {
        //separate out the instanceId if present
        // eslint-disable-next-line no-unused-vars
        const { instanceId: _, ...metadata } = currentApp;
        const option: IntentTargetOption = {
          appId: currentApp.appId,
          metadata: metadata,
          instances: [],
          launchNew: false,
        };
        if (currentApp.instanceId) {
          option.instances.push(currentApp);
        } else {
          option.launchNew = true;
        }
        groupedApps.push(option);
      } else {
        if (currentApp.instanceId) {
          foundApp.instances.push(currentApp);
        } else {
          foundApp.launchNew = true;
        }
      }
    });
  } else {
    //no instances in FDC3 < 2
    (appIntent as fdc3_1.AppIntent).apps.forEach(currentApp => {
      //deduplicate results in case a 2.0 implementation returned instances
      let foundApp = groupedApps.find(app => app.appId === currentApp.appId);
      if (!foundApp) {
        groupedApps.push({
          appId: currentApp.appId ?? currentApp.name,
          metadata: currentApp as fdc3_2.AppMetadata, //hack to avoid type error
          instances: [],
          launchNew: true,
        });
      }
    });
  }

  return groupedApps;
}

export async function getTargetOptionsForContext(context: ContextType): Promise<IntentTargetOption[]> {
  const agent = await fdc3_2.getAgent();

  let appIntents = await agent.findIntentsByContext(context);
  if (appIntents.length === 0) {
    return [];
  }

  //We only return apps to target which means we need to deduplicate where they are returned more than once
  const groupedApps: IntentTargetOption[] = [];

  if (window.fdc3Version === '2.0') {
    (appIntents as fdc3_2.AppIntent[]).forEach(currentIntent => {
      currentIntent.apps.forEach(currentApp => {
        let foundApp = groupedApps.find(app => app.appId === currentApp.appId);
        if (!foundApp) {
          //separate out the instanceId if present
          // eslint-disable-next-line no-unused-vars
          const { instanceId: _, ...metadata } = currentApp;
          const option: IntentTargetOption = {
            appId: currentApp.appId,
            metadata: metadata,
            instances: [],
            launchNew: false,
          };
          if (currentApp.instanceId) {
            option.instances.push(currentApp);
          } else {
            option.launchNew = true;
          }
          groupedApps.push(option);
        } else {
          if (currentApp.instanceId) {
            //deduplicate instances
            let foundInstance = foundApp.instances.find(instance => instance.instanceId === currentApp.instanceId);
            if (!foundInstance) {
              foundApp.instances.push(currentApp);
            }
          } else {
            foundApp.launchNew = true;
          }
        }
      });
    });
  } else {
    (appIntents as fdc3_1.AppIntent[]).forEach(currentIntent => {
      currentIntent.apps.forEach(currentApp => {
        //deduplicate in case a 2.0 implementation returned some instances
        let foundApp = groupedApps.find(app => app.appId === currentApp.appId);
        if (!foundApp) {
          groupedApps.push({
            appId: currentApp.appId ?? currentApp.name,
            metadata: currentApp as fdc3_2.AppMetadata, //hack to avoid type error
            instances: [],
            launchNew: true,
          });
        }
      });
    });
  }

  return groupedApps;
}
