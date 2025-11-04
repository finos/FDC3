import { MessageHandler } from './MessageHandler';
import { FDC3ServerInstance, IntentListenerRegistration } from '../FDC3ServerInstance';
import { AppRegistration, InstanceID, State } from '../AppRegistration';
import { DirectoryIntent } from '../directory/DirectoryInterface';
import { Context } from '@finos/fdc3-context';
import { AppIntent, ResolveError, AppIdentifier } from '@finos/fdc3-standard';
import {
  errorResponse,
  errorResponseId,
  FullAppIdentifier,
  isFullAppIdentifier,
  successResponse,
  successResponseId,
} from './support';
import {
  IntentEvent,
  FindIntentsByContextRequest,
  FindIntentRequest,
  AddIntentListenerRequest,
  IntentListenerUnsubscribeRequest,
  RaiseIntentRequest,
  RaiseIntentForContextRequest,
  IntentResultRequest,
  AppRequestMessage,
  AgentResponseMessage,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';

type IntentRequest = {
  intent: string;
  context: Context;
  requestUuid: string;
  from: FullAppIdentifier;
  type: 'raiseIntentResponse' | 'raiseIntentForContextResponse';
};

/**
 * Re-writes the request to forward it on to the target application
 */
async function forwardRequest(arg0: IntentRequest, to: FullAppIdentifier, sc: FDC3ServerInstance): Promise<void> {
  const out: IntentEvent = {
    type: 'intentEvent',
    payload: {
      context: arg0.context,
      intent: arg0.intent,
      originatingApp: {
        appId: arg0.from.appId,
        instanceId: arg0.from.instanceId,
      },
      raiseIntentRequestUuid: arg0.requestUuid,
    },
    meta: {
      eventUuid: sc.createUUID(),
      timestamp: new Date(),
    },
  };

  // register the resolution destination
  sc.addPendingResolution(arg0.requestUuid, arg0.from);
  await sc.post(out, to.instanceId);
  successResponseId(
    sc,
    arg0.requestUuid,
    arg0.from,
    {
      intentResolution: {
        intent: arg0.intent,
        source: { appId: to.appId, instanceId: to.instanceId }, //make sure we're not carrying any excess fields from internal state
      },
    },
    arg0.type
  );
}

/**
 * A pending intent is one for an app that hasn't registered it's intent listener yet.
 * (Possibly it is being opened)
 *
 * Pending intents wait for that registration and then message the app.
 */
class PendingIntent {
  complete: boolean = false;
  r: IntentRequest;
  appId: AppIdentifier;
  sc: FDC3ServerInstance;
  ih: IntentHandler;

  constructor(r: IntentRequest, sc: FDC3ServerInstance, ih: IntentHandler, appId: AppIdentifier) {
    this.r = r;
    this.appId = appId;
    this.sc = sc;
    this.ih = ih;

    // handle the timeout
    setTimeout(() => {
      if (!this.complete) {
        errorResponseId(sc, r.requestUuid, r.from, ResolveError.IntentDeliveryFailed, r.type);
        this.ih.pendingIntents.delete(this);
      }
    }, ih.timeoutMs);
  }

  async accept(arg0: IntentListenerRegistration): Promise<void> {
    if (
      arg0.appId == this.appId.appId &&
      arg0.intentName == this.r.intent &&
      (arg0.instanceId == this.appId.instanceId || this.appId.instanceId == undefined)
    ) {
      this.complete = true;
      this.ih.pendingIntents.delete(this);
      forwardRequest(this.r, { appId: arg0.appId, instanceId: arg0.instanceId }, this.sc);
    }
  }
}

export class IntentHandler implements MessageHandler {
  readonly pendingIntents: Set<PendingIntent> = new Set();
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    this.timeoutMs = timeoutMs;
  }

  cleanup(instanceId: InstanceID, sc: FDC3ServerInstance): void {
    sc.removeIntentListenersByInstance(instanceId);
    //don't clean up pendingIntents as some apps may load

    //cleanup pendingResolutions
    sc.removePendingResolutionsByInstance(instanceId);
  }

  shutdown(): void {}

  async narrowIntents(
    raiser: AppIdentifier,
    appIntents: AppIntent[],
    context: Context,
    sc: FDC3ServerInstance
  ): Promise<AppIntent[]> {
    const out = await sc.narrowIntents(raiser, appIntents, context);
    return out;
  }

  async accept(msg: AppRequestMessage, sc: FDC3ServerInstance, uuid: InstanceID): Promise<void> {
    const from = sc.getInstanceDetails(uuid);

    if (from == null) {
      // this handler only deals with connected apps
      return;
    }

    try {
      switch (msg.type as string) {
        // finding intents
        case 'findIntentsByContextRequest':
          return await this.findIntentsByContextRequest(msg as FindIntentsByContextRequest, sc, from);
        case 'findIntentRequest':
          return await this.findIntentRequest(msg as FindIntentRequest, sc, from);

        // listeners
        case 'addIntentListenerRequest':
          return await this.onAddIntentListener(msg as AddIntentListenerRequest, sc, from);
        case 'intentListenerUnsubscribeRequest':
          return await this.onUnsubscribe(msg as IntentListenerUnsubscribeRequest, sc, from);

        // raising intents and returning results
        case 'raiseIntentRequest':
          return await this.raiseIntentRequest(msg as RaiseIntentRequest, sc, from);
        case 'raiseIntentForContextRequest':
          return await this.raiseIntentForContextRequest(msg as RaiseIntentForContextRequest, sc, from);
        case 'intentResultRequest':
          return await this.intentResultRequest(msg as IntentResultRequest, sc, from);
      }
    } catch (e) {
      const responseType = msg.type.replace(new RegExp('Request$'), 'Response') as AgentResponseMessage['type'];
      errorResponse(sc, msg, from, (e as Error).message ?? e, responseType);
    }
  }

  /**
   * Called when target app handles an intent
   */
  intentResultRequest(
    arg0: IntentResultRequest,
    sc: FDC3ServerInstance,
    from: FullAppIdentifier
  ): void | PromiseLike<void> {
    const requestId = arg0.payload.raiseIntentRequestUuid;
    const to = sc.getPendingResolution(requestId);
    if (to && to.instanceId) {
      // post the result to the app that raised the intent
      //   if its still connected, otherwise do nothing
      successResponseId(
        sc,
        requestId,
        to as FullAppIdentifier,
        {
          intentResult: arg0.payload.intentResult,
        },
        'raiseIntentResultResponse'
      );

      sc.removePendingResolution(requestId);
    }
    // respond to the app that handled the intent
    successResponse(sc, arg0, from, {}, 'intentResultResponse');
  }

  onUnsubscribe(arg0: IntentListenerUnsubscribeRequest, sc: FDC3ServerInstance, from: FullAppIdentifier): void {
    const id = arg0.payload.listenerUUID;
    const removed = sc.removeIntentListener(id);
    if (removed) {
      successResponse(sc, arg0, from, {}, 'intentListenerUnsubscribeResponse');
    } else {
      errorResponse(sc, arg0, from, 'Non-Existent Listener', 'intentListenerUnsubscribeResponse');
    }
  }

  onAddIntentListener(arg0: AddIntentListenerRequest, sc: FDC3ServerInstance, from: FullAppIdentifier): void {
    const lr: IntentListenerRegistration = {
      appId: from.appId,
      instanceId: from.instanceId,
      intentName: arg0.payload.intent,
      listenerUUID: sc.createUUID(),
    };

    sc.addIntentListener(lr);
    successResponse(
      sc,
      arg0,
      from,
      {
        listenerUUID: lr.listenerUUID,
      },
      'addIntentListenerResponse'
    );

    // see if this intent listener is the destination for any pending intents
    for (const x of this.pendingIntents) {
      x.accept(lr);
      if (x.complete) {
        this.pendingIntents.delete(x);
      }
    }
  }

  hasListener(instanceId: string, intentName: string, sc: FDC3ServerInstance): boolean {
    return sc.getIntentListeners().find(r => r.instanceId == instanceId && r.intentName == intentName) != null;
  }

  async startWithPendingIntent(arg0: IntentRequest, sc: FDC3ServerInstance, target: AppIdentifier): Promise<void> {
    // app exists but needs starting
    const pi = new PendingIntent(arg0, sc, this, target);
    this.pendingIntents.add(pi);
    sc.open(target.appId).then(() => {
      return undefined;
    });
  }

  async raiseIntentRequestToSpecificInstance(
    arg0: IntentRequest[],
    sc: FDC3ServerInstance,
    target: FullAppIdentifier
  ): Promise<void> {
    if (!(await sc.isAppConnected(target.instanceId))) {
      // instance doesn't exist
      return errorResponseId(
        sc,
        arg0[0].requestUuid,
        arg0[0].from,
        ResolveError.TargetInstanceUnavailable,
        arg0[0].type
      );
    }

    const requestsWithListeners = arg0.filter(r => this.hasListener(target.instanceId, r.intent, sc));

    if (requestsWithListeners.length == 0) {
      this.createPendingIntentIfAllowed(arg0[0], sc, target);
    } else {
      // ok, deliver to the current running app.
      return forwardRequest(requestsWithListeners[0], target, sc);
    }
  }

  async createPendingIntentIfAllowed(ir: IntentRequest, sc: FDC3ServerInstance, target: AppIdentifier) {
    // if this app declares that it supports the intent, we'll create a pending intent
    const matchingIntents: DirectoryIntent[] = sc.getDirectory().retrieveIntents(ir.context.type, ir.intent, undefined);
    const declared = matchingIntents.find(i => i.appId == target.appId);

    if (declared) {
      // maybe listener hasn't been registered yet - create a pending intent
      const pi = new PendingIntent(ir, sc, this, target);
      this.pendingIntents.add(pi);
    } else {
      errorResponseId(sc, ir.requestUuid, ir.from, ResolveError.NoAppsFound, ir.type);
    }
  }

  async raiseIntentRequestToSpecificAppId(
    arg0: IntentRequest[],
    sc: FDC3ServerInstance,
    target: AppIdentifier
  ): Promise<void> {
    const appRecords = sc.getDirectory().retrieveAppsById(target.appId);
    if (appRecords.length == 0) {
      return errorResponseId(sc, arg0[0].requestUuid, arg0[0].from, ResolveError.TargetAppUnavailable, arg0[0].type);
    }

    const convertDirectoryIntentsToAppIntents = (intents: DirectoryIntent[], appId: string): AppIntent[] => {
      // group by intent name
      const intentNames = new Set(intents.map(i => i.intentName));
      return Array.from(intentNames).map(intentName => {
        const intentsWithName = intents.filter(i => i.intentName === intentName);
        return {
          intent: { name: intentName, displayName: intentName },
          apps: intentsWithName.filter(i => i.appId === appId).map(i => ({ appId: i.appId })),
        };
      });
    };

    const intentsAllHaveApps = (appIntents: AppIntent[]): boolean => {
      return appIntents.every(ai => ai.apps.length > 0);
    };

    // in this version of the method, we always open an app as no
    // specific instance is specified.  But only if the app supports the intent.
    const context: Context = arg0[0].context;
    const matchingIntents: DirectoryIntent[] = sc
      .getDirectory()
      .retrieveIntents(context.type, arg0[0].intent, undefined);
    const appIntents = convertDirectoryIntentsToAppIntents(matchingIntents, target.appId);

    if (appIntents.length == 0) {
      return errorResponseId(sc, arg0[0].requestUuid, arg0[0].from, ResolveError.NoAppsFound, arg0[0].type);
    }

    if (!intentsAllHaveApps(appIntents)) {
      return errorResponseId(sc, arg0[0].requestUuid, arg0[0].from, ResolveError.IntentDeliveryFailed, arg0[0].type);
    }

    const narrowedAppIntents = await this.narrowIntents(arg0[0].from, appIntents, context, sc);

    if (narrowedAppIntents.length == 1) {
      if (narrowedAppIntents[0].apps.length == 1) {
        // no running instance, single app
        const appRecords = sc.getDirectory().retrieveAppsById(target.appId);
        if (appRecords.length >= 1) {
          const ir: IntentRequest = {
            ...arg0[0],
            intent: narrowedAppIntents[0].intent.name,
          };
          return this.startWithPendingIntent(ir, sc, target);
        }
      }
    }
    // app doesn't exist
    return errorResponseId(sc, arg0[0].requestUuid, arg0[0].from, ResolveError.NoAppsFound, arg0[0].type);
  }

  oneAppOnly(appIntent: AppIntent): boolean {
    const apps = appIntent.apps.map(a => a.appId);
    const uniqueApps = apps.filter((v, i, a) => a.indexOf(v) === i).length;
    return uniqueApps == 1;
  }

  async raiseIntentToAnyApp(arg0: IntentRequest[], sc: FDC3ServerInstance): Promise<void> {
    const connectedApps = await sc.getConnectedApps();
    const matchingIntents = arg0.flatMap(i => sc.getDirectory().retrieveIntents(i.context.type, i.intent, undefined));
    const matchingRegistrations = arg0.flatMap(i => sc.getIntentListeners().filter(r => r.intentName == i.intent));
    const uniqueIntentNames = [
      ...matchingIntents.map(i => i.intentName),
      ...matchingRegistrations.map(r => r.intentName),
    ].filter((v, i, a) => a.indexOf(v) === i);

    const allIntents = sc.getDirectory().retrieveAllIntents();

    const appIntents: AppIntent[] = uniqueIntentNames.map(i => {
      const directoryAppsWithIntent = matchingIntents.filter(mi => mi.intentName == i).map(mi => mi.appId);
      const runningDirectoryApps = connectedApps.filter(ca => directoryAppsWithIntent.includes(ca.appId));
      const appRegistrations = matchingRegistrations
        .filter(registration => registration.intentName === i) // filter registrations for the current intent
        .map(listener => ({ appId: listener.appId, instanceId: listener.instanceId, state: State.Connected }))
        .filter(appRegistration => allIntents.every(intent => intent.appId !== appRegistration.appId)); // filter out apps that have intents registered in the directory

      const runningApps: AppRegistration[] = [...runningDirectoryApps, ...appRegistrations];

      return {
        intent: {
          name: i,
          displayName: i,
        },
        apps: [
          ...runningApps,
          ...directoryAppsWithIntent.map(d => {
            return { appId: d };
          }),
        ],
      };
    });

    const narrowedAppIntents = await this.narrowIntents(arg0[0].from, appIntents, arg0[0].context, sc);

    if (narrowedAppIntents.length == 0) {
      // nothing can resolve the intent, fail
      return errorResponseId(sc, arg0[0].requestUuid, arg0[0].from, ResolveError.NoAppsFound, arg0[0].type);
    }

    if (narrowedAppIntents.length == 1) {
      const theAppIntent = narrowedAppIntents[0];
      if (this.oneAppOnly(theAppIntent)) {
        const instanceCount = theAppIntent.apps.filter(a => a.instanceId).length;
        const ir: IntentRequest = {
          ...arg0[0],
          intent: narrowedAppIntents[0].intent.name,
        };
        if (instanceCount == 1 && isFullAppIdentifier(theAppIntent.apps[0])) {
          // app is running
          return forwardRequest(ir, theAppIntent.apps[0], sc);
        } else if (instanceCount == 0) {
          return this.startWithPendingIntent(ir, sc, theAppIntent.apps[0]);
        }
      }
    }

    if (arg0[0].type == 'raiseIntentResponse') {
      // raise intent
      return successResponseId(
        sc,
        arg0[0].requestUuid,
        arg0[0].from,
        {
          appIntent: narrowedAppIntents[0],
        },
        arg0[0].type
      );
    } else {
      // raise intent for context
      return successResponseId(sc, arg0[0].requestUuid, arg0[0].from, { appIntents: narrowedAppIntents }, arg0[0].type);
    }
  }

  async raiseIntentRequest(arg0: RaiseIntentRequest, sc: FDC3ServerInstance, from: FullAppIdentifier): Promise<void> {
    const intentRequest: IntentRequest = {
      context: arg0.payload.context,
      from,
      intent: arg0.payload.intent,
      requestUuid: arg0.meta.requestUuid,
      type: 'raiseIntentResponse',
    };

    const target = arg0.payload.app;
    if (target) {
      if (isFullAppIdentifier(target)) {
        return this.raiseIntentRequestToSpecificInstance([intentRequest], sc, target);
      } else if (target.appId) {
        return this.raiseIntentRequestToSpecificAppId([intentRequest], sc, target);
      } else {
        //invalid target
        console.warn('Received an invalid target argument for raiseIntent', target, arg0);
        return errorResponseId(
          sc,
          arg0.meta.requestUuid,
          from,
          ResolveError.TargetAppUnavailable,
          'raiseIntentResponse'
        );
      }
    } else {
      //No target
      return this.raiseIntentToAnyApp([intentRequest], sc);
    }
  }

  async raiseIntentForContextRequest(
    arg0: RaiseIntentForContextRequest,
    sc: FDC3ServerInstance,
    from: FullAppIdentifier
  ): Promise<void> {
    // dealing with a specific instance of an app
    const mappedIntents = sc.getDirectory().retrieveIntents(arg0.payload.context.type, undefined, undefined);
    const uniqueIntentNames = mappedIntents.filter((v, i, a) => a.findIndex(v2 => v2.intentName == v.intentName) == i);
    const possibleIntentRequests: IntentRequest[] = uniqueIntentNames.map(i => {
      return {
        context: arg0.payload.context,
        from,
        intent: i.intentName,
        requestUuid: arg0.meta.requestUuid,
        type: 'raiseIntentForContextResponse',
      };
    });

    if (possibleIntentRequests.length == 0) {
      return errorResponseId(
        sc,
        arg0.meta.requestUuid,
        from,
        ResolveError.NoAppsFound,
        'raiseIntentForContextResponse'
      );
    }

    const target = arg0.payload.app;
    if (target) {
      if (isFullAppIdentifier(target)) {
        return this.raiseIntentRequestToSpecificInstance(possibleIntentRequests, sc, target);
      } else if (target.appId) {
        return this.raiseIntentRequestToSpecificAppId(possibleIntentRequests, sc, target);
      } else {
        //invalid target
        console.warn('Received an invalid target argument for raiseIntentForContext', target, arg0);
        return errorResponseId(
          sc,
          arg0.meta.requestUuid,
          from,
          ResolveError.TargetAppUnavailable,
          'raiseIntentForContextResponse'
        );
      }
    } else {
      //No target
      return this.raiseIntentToAnyApp(possibleIntentRequests, sc);
    }
  }

  async findIntentsByContextRequest(
    r: FindIntentsByContextRequest,
    sc: FDC3ServerInstance,
    from: FullAppIdentifier
  ): Promise<void> {
    const { context, resultType } = r.payload;

    const apps1 = sc.getDirectory().retrieveIntents(context?.type, undefined, resultType);

    // fold apps so same intents aren't duplicated
    const apps2: AppIntent[] = [];
    //don't use foreach as the handling function is async and needs to process serially
    for (let index = 0; index < apps1.length; index++) {
      const a1 = apps1[index];
      const existing = apps2.find(a2 => a2.intent.name == a1.intentName);
      const runningInstances = await this.retrieveRunningInstances(a1.appId, sc);
      if (existing) {
        existing.apps.push({ appId: a1.appId });
        runningInstances.forEach(ri => existing.apps.push({ appId: a1.appId, instanceId: ri.instanceId }));
      } else {
        const appIntent: AppIntent = {
          intent: {
            name: a1.intentName,
            displayName: a1.displayName ?? a1.intentName,
          },
          apps: [
            {
              appId: a1.appId,
            },
          ],
        };
        runningInstances.forEach(ri => appIntent.apps.push({ appId: a1.appId, instanceId: ri.instanceId }));
        apps2.push(appIntent);
      }
    }

    successResponse(
      sc,
      r,
      from,
      {
        appIntents: apps2,
      },
      'findIntentsByContextResponse'
    );
  }

  async findIntentRequest(r: FindIntentRequest, sc: FDC3ServerInstance, from: FullAppIdentifier): Promise<void> {
    const { intent, context, resultType } = r.payload;

    // listeners for connected applications
    const apps2 = (await this.retrieveListeners(intent, sc)).map(lr => {
      return {
        appId: lr.appId,
        instanceId: lr.instanceId,
      };
    }) as AppIdentifier[];

    // directory entries
    const apps1 = sc
      .getDirectory()
      .retrieveApps(context?.type, intent, resultType)
      .map(a => {
        return {
          appId: a.appId,
        };
      });

    //combine the lists, no need to de-duplicate as we should return both a directory record with just appId + any instance with appId/instanceId
    const finalApps = [...apps1, ...apps2];

    // just need this for the (deprecated) display name
    const allMatchingIntents = sc.getDirectory().retrieveIntents(context?.type, intent, resultType);
    const displayName = allMatchingIntents.length > 0 ? allMatchingIntents[0].displayName : undefined;

    successResponse(
      sc,
      r,
      from,
      {
        appIntent: {
          intent: {
            name: intent,
            displayName,
          },
          apps: finalApps,
        },
      },
      'findIntentResponse'
    );
  }

  async retrieveListeners(
    intentName: string | undefined,
    sc: FDC3ServerInstance
  ): Promise<IntentListenerRegistration[]> {
    const activeApps = await sc.getConnectedApps();
    const matching = sc.getIntentListeners().filter(r => r.intentName == intentName);
    const active = matching.filter(r => activeApps.find(a => a.instanceId == r.instanceId));
    return active;
  }

  async retrieveRunningInstances(appId: string, sc: FDC3ServerInstance) {
    const activeApps = await sc.getConnectedApps();
    const filteredApps = activeApps.filter(a => a.appId === appId);
    return filteredApps;
  }

  async handleEvent(): Promise<void> {}
}
