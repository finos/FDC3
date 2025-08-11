import { Context } from '@finos/fdc3-context';
import { AppIntent, ResolveError, AppIdentifier } from '@finos/fdc3-standard';
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
import { AbstractHandler } from './AbstractHandler';
import { ServerContext } from './ServerContext';

/**
 * Re-writes the request to forward it on to the target application
 */
async function forwardRequest(
  arg0: IntentRequest,
  to: FullAppIdentifier,
  sc: ServerContext,
  ih: IntentHandler
): Promise<void> {
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
      eventUuid: this.createUUID(), // TODO: Use this.createUUID() instead of sc.createUUID()
      timestamp: new Date(),
    },
  };

  // register the resolution destination
  ih.pendingResolutions.set(arg0.requestUuid, arg0.from);
  await sc.post(out, to.instanceId);
  ih.successResponseId(
    arg0.requestUuid,
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
  sc: ServerContext;
  ih: IntentHandler;

  constructor(r: IntentRequest, sc: ServerContext, ih: IntentHandler, appId: AppIdentifier) {
    this.r = r;
    this.appId = appId;
    this.sc = sc;
    this.ih = ih;

    // handle the timeout
    setTimeout(() => {
      if (!this.complete) {
        ih.errorResponseId(r.requestUuid, ResolveError.IntentDeliveryFailed, r.type);
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
      forwardRequest(this.r, { appId: arg0.appId, instanceId: arg0.instanceId }, this.sc, this.ih);
    }
  }
}

export class IntentHandler extends AbstractHandler {
  readonly timeoutMs: number;

  constructor(d: Directory, timeoutMs: number, sc: ServerContext) {
    super(sc);
    this.directory = d;
    this.timeoutMs = timeoutMs;
  }

  cleanup(instanceId: InstanceID): void {
    this.registrations = this.registrations.filter(reg => reg.instanceId != instanceId);
    //don't clean up pendingIntents as some apps may load

    //cleanup pendingResolutions
    this.pendingResolutions.forEach((val, key) => {
      if (val.instanceId === instanceId) {
        this.pendingResolutions.delete(key);
      }
    });
  }

  shutdown(): void {}

  async narrowIntents(raiser: AppIdentifier, appIntents: AppIntent[], context: Context): Promise<AppIntent[]> {
    // TODO: Implement narrowIntents method - this was previously on ServerContext<AppRegistration>
    // but the new ServerContext interface doesn't have this method
    return appIntents;
  }

  async accept(msg: AppRequestMessage): Promise<void> {
    try {
      switch (msg.type as string) {
        // finding intents
        case 'findIntentsByContextRequest':
          return await this.findIntentsByContextRequest(msg as FindIntentsByContextRequest);
        case 'findIntentRequest':
          return await this.findIntentRequest(msg as FindIntentRequest);

        // listeners
        case 'addIntentListenerRequest':
          return await this.onAddIntentListener(msg as AddIntentListenerRequest);
        case 'intentListenerUnsubscribeRequest':
          return await this.onUnsubscribe(msg as IntentListenerUnsubscribeRequest);

        // raising intents and returning results
        case 'raiseIntentRequest':
          return await this.raiseIntentRequest(msg as RaiseIntentRequest);
        case 'raiseIntentForContextRequest':
          return await this.raiseIntentForContextRequest(msg as RaiseIntentForContextRequest);
        case 'intentResultRequest':
          return await this.intentResultRequest(msg as IntentResultRequest);
      }
    } catch (e) {
      const responseType = msg.type.replace(new RegExp('Request$'), 'Response') as AgentResponseMessage['type'];
      this.errorResponse(msg, (e as Error).message ?? e, responseType);
    }
  }

  /**
   * Called when target app handles an intent
   */
  intentResultRequest(arg0: IntentResultRequest): void | PromiseLike<void> {
    const requestId = arg0.payload.raiseIntentRequestUuid;
    const to = this.pendingResolutions.get(requestId);
    if (to) {
      // post the result to the app that raised the intent
      //   if its still connected, otherwise do nothing
      this.successResponseId(
        requestId,
        {
          intentResult: arg0.payload.intentResult,
        },
        'raiseIntentResultResponse'
      );

      this.pendingResolutions.delete(requestId);
    }
    // respond to the app that handled the intent
    this.successResponse(arg0, {}, 'intentResultResponse');
  }

  onUnsubscribe(arg0: IntentListenerUnsubscribeRequest): void {
    const id = arg0.payload.listenerUUID;
    const fi = this.registrations.findIndex(e => e.listenerUUID == id);
    if (fi > -1) {
      this.registrations.splice(fi, 1);
      this.successResponse(arg0, {}, 'intentListenerUnsubscribeResponse');
    } else {
      this.errorResponse(arg0, 'Non-Existent Listener', 'intentListenerUnsubscribeResponse');
    }
  }

  onAddIntentListener(arg0: AddIntentListenerRequest): void {
    // TODO: Need to get appId and instanceId from context - this was previously from parameters
    const lr: IntentListenerRegistration = {
      appId: 'TODO: Get appId from context', // TODO: Need to get appId from context
      instanceId: 'TODO: Get instanceId from context', // TODO: Need to get instanceId from context
      intentName: arg0.payload.intent,
      listenerUUID: this.createUUID(),
    };

    this.registrations.push(lr);
    this.successResponse(
      arg0,
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

  hasListener(instanceId: string, intentName: string): boolean {
    return this.registrations.find(r => r.instanceId == instanceId && r.intentName == intentName) != null;
  }

  async startWithPendingIntent(arg0: IntentRequest, target: AppIdentifier): Promise<void> {
    // app exists but needs starting
    const pi = new PendingIntent(arg0, this.da, this, target);
    this.pendingIntents.add(pi);
    // TODO: Implement app opening - this was previously sc.open(target.appId)
    // but the new ServerContext interface doesn't have this method
  }

  createAppIntents(ir: IntentRequest[], target: AppIdentifier[]): AppIntent[] {
    return ir.map(r => {
      return {
        intent: {
          name: r.intent,
          displayName: r.intent,
        },
        apps: target,
      };
    });
  }

  async raiseIntentRequestToSpecificInstance(arg0: IntentRequest[], target: FullAppIdentifier): Promise<void> {
    // TODO: Implement isAppConnected check - this was previously sc.isAppConnected(target.instanceId)
    // but the new ServerContext interface doesn't have this method
    const isConnected = true; // Placeholder

    if (!isConnected) {
      // instance doesn't exist
      return this.errorResponseId(arg0[0].requestUuid, ResolveError.TargetInstanceUnavailable, arg0[0].type);
    }

    const requestsWithListeners = arg0.filter(r => this.hasListener(target.instanceId, r.intent));

    if (requestsWithListeners.length == 0) {
      this.createPendingIntentIfAllowed(arg0[0], target);
    } else {
      // ok, deliver to the current running app.
      return forwardRequest(requestsWithListeners[0], target, this.da, this);
    }
  }

  async createPendingIntentIfAllowed(ir: IntentRequest, target: AppIdentifier) {
    // if this app declares that it supports the intent, we'll create a pending intent
    const matchingIntents: DirectoryIntent[] = this.directory.retrieveIntents(ir.context.type, ir.intent, undefined);
    const declared = matchingIntents.find(i => i.appId == target.appId);

    if (declared) {
      // maybe listener hasn't been registered yet - create a pending intent
      const pi = new PendingIntent(ir, this.da, this, target);
      this.pendingIntents.add(pi);
    } else {
      this.errorResponseId(ir.requestUuid, ResolveError.NoAppsFound, ir.type);
    }
  }

  async raiseIntentRequestToSpecificAppId(arg0: IntentRequest[], target: AppIdentifier): Promise<void> {
    // in this version of the method, we always open an app as no
    // specific instance is specified
    const appIntents = this.createAppIntents(arg0, [{ appId: target.appId }]);

    const narrowedAppIntents = await this.narrowIntents(arg0[0].from, appIntents, arg0[0].context);

    if (narrowedAppIntents.length == 1) {
      if (narrowedAppIntents[0].apps.length == 1) {
        // no running instance, single app
        const appRecords = this.directory.retrieveAppsById(target.appId);
        if (appRecords.length >= 1) {
          const ir: IntentRequest = {
            ...arg0[0],
            intent: narrowedAppIntents[0].intent.name,
          };
          return this.startWithPendingIntent(ir, target);
        }
      }
    }
    // app doesn't exist
    return this.errorResponseId(arg0[0].requestUuid, ResolveError.TargetAppUnavailable, arg0[0].type);
  }

  oneAppOnly(appIntent: AppIntent): boolean {
    const apps = appIntent.apps.map(a => a.appId);
    const uniqueApps = apps.filter((v, i, a) => a.indexOf(v) === i).length;
    return uniqueApps == 1;
  }

  async raiseIntentToAnyApp(arg0: IntentRequest[]): Promise<void> {
    // TODO: Implement getConnectedApps - this was previously sc.getConnectedApps()
    // but the new ServerContext interface doesn't have this method
    const connectedApps: FullAppIdentifier[] = []; // Placeholder

    const matchingIntents = arg0.flatMap(i => this.directory.retrieveIntents(i.context.type, i.intent, undefined));
    const uniqueIntentNames = matchingIntents.map(i => i.intentName).filter((v, i, a) => a.indexOf(v) === i);

    const appIntents: AppIntent[] = uniqueIntentNames.map(i => {
      const directoryAppsWithIntent = matchingIntents.filter(mi => mi.intentName == i).map(mi => mi.appId);
      const runningApps = connectedApps.filter(ca => directoryAppsWithIntent.includes(ca.appId));

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

    const narrowedAppIntents = await this.narrowIntents(arg0[0].from, appIntents, arg0[0].context);

    if (narrowedAppIntents.length == 0) {
      // nothing can resolve the intent, fail
      return this.errorResponseId(arg0[0].requestUuid, ResolveError.NoAppsFound, arg0[0].type);
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
          return forwardRequest(ir, theAppIntent.apps[0], this.da, this);
        } else if (instanceCount == 0) {
          return this.startWithPendingIntent(ir, theAppIntent.apps[0]);
        }
      }
    }

    if (arg0[0].type == 'raiseIntentResponse') {
      // raise intent
      return this.successResponseId(
        arg0[0].requestUuid,
        {
          appIntent: narrowedAppIntents[0],
        },
        arg0[0].type
      );
    } else {
      // raise intent for context
      return this.successResponseId(arg0[0].requestUuid, { appIntents: narrowedAppIntents }, arg0[0].type);
    }
  }

  async raiseIntentRequest(arg0: RaiseIntentRequest): Promise<void> {
    const intentRequest: IntentRequest = {
      context: arg0.payload.context,
      from: 'TODO: Get from context', // TODO: Need to get from context
      intent: arg0.payload.intent,
      requestUuid: arg0.meta.requestUuid,
      type: 'raiseIntentResponse',
    };

    const target = arg0.payload.app;
    if (target) {
      if (isFullAppIdentifier(target)) {
        return this.raiseIntentRequestToSpecificInstance([intentRequest], target);
      } else if (target.appId) {
        return this.raiseIntentRequestToSpecificAppId([intentRequest], target);
      } else {
        //invalid target
        console.warn('Received an invalid target argument for raiseIntent', target, arg0);
        return this.errorResponseId(arg0.meta.requestUuid, ResolveError.TargetAppUnavailable, 'raiseIntentResponse');
      }
    } else {
      //No target
      return this.raiseIntentToAnyApp([intentRequest]);
    }
  }

  async raiseIntentForContextRequest(arg0: RaiseIntentForContextRequest): Promise<void> {
    // dealing with a specific instance of an app
    const mappedIntents = this.directory.retrieveIntents(arg0.payload.context.type, undefined, undefined);
    const uniqueIntentNames = mappedIntents.filter((v, i, a) => a.findIndex(v2 => v2.intentName == v.intentName) == i);
    const possibleIntentRequests: IntentRequest[] = uniqueIntentNames.map(i => {
      return {
        context: arg0.payload.context,
        from: 'TODO: Get from context', // TODO: Need to get from context
        intent: i.intentName,
        requestUuid: arg0.meta.requestUuid,
        type: 'raiseIntentForContextResponse',
      };
    });

    if (possibleIntentRequests.length == 0) {
      return this.errorResponseId(arg0.meta.requestUuid, ResolveError.NoAppsFound, 'raiseIntentForContextResponse');
    }

    const target = arg0.payload.app;
    if (target) {
      if (isFullAppIdentifier(target)) {
        return this.raiseIntentRequestToSpecificInstance(possibleIntentRequests, target);
      } else if (target.appId) {
        return this.raiseIntentRequestToSpecificAppId(possibleIntentRequests, target);
      } else {
        //invalid target
        console.warn('Received an invalid target argument for raiseIntentForContext', target, arg0);
        return this.errorResponseId(
          arg0.meta.requestUuid,
          ResolveError.TargetAppUnavailable,
          'raiseIntentForContextResponse'
        );
      }
    } else {
      //No target
      return this.raiseIntentToAnyApp(possibleIntentRequests);
    }
  }

  async findIntentsByContextRequest(r: FindIntentsByContextRequest): Promise<void> {
    const { context, resultType } = r.payload;

    const apps1 = this.directory.retrieveIntents(context?.type, undefined, resultType);

    // fold apps so same intents aren't duplicated
    const apps2: AppIntent[] = [];
    //don't use foreach as the handling function is async and needs to process serially
    for (let index = 0; index < apps1.length; index++) {
      const a1 = apps1[index];
      const existing = apps2.find(a2 => a2.intent.name == a1.intentName);
      const runningInstances = await this.retrieveRunningInstances(a1.appId);
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

    this.successResponse(
      r,
      {
        appIntents: apps2,
      },
      'findIntentsByContextResponse'
    );
  }

  async findIntentRequest(r: FindIntentRequest): Promise<void> {
    const { intent, context, resultType } = r.payload;

    // listeners for connected applications
    const apps2 = (await this.retrieveListeners(intent)).map(lr => {
      return {
        appId: lr.appId,
        instanceId: lr.instanceId,
      };
    }) as AppIdentifier[];

    // directory entries
    const apps1 = this.directory.retrieveApps(context?.type, intent, resultType).map(a => {
      return {
        appId: a.appId,
      };
    });

    //combine the lists, no need to de-duplicate as we should return both a directory record with just appId + any instance with appId/instanceId
    const finalApps = [...apps1, ...apps2];

    // just need this for the (deprecated) display name
    const allMatchingIntents = this.directory.retrieveIntents(context?.type, intent, resultType);
    const displayName = allMatchingIntents.length > 0 ? allMatchingIntents[0].displayName : undefined;

    this.successResponse(
      r,
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

  async retrieveListeners(intentName: string | undefined): Promise<IntentListenerRegistration[]> {
    // TODO: Implement getConnectedApps - this was previously sc.getConnectedApps()
    // but the new ServerContext interface doesn't have this method
    const activeApps: FullAppIdentifier[] = []; // Placeholder

    const matching = this.registrations.filter(r => r.intentName == intentName);
    const active = matching.filter(r => activeApps.find(a => a.instanceId == r.instanceId));
    return active;
  }

  async retrieveRunningInstances(appId: string) {
    // TODO: Implement getConnectedApps - this was previously sc.getConnectedApps()
    // but the new ServerContext interface doesn't have this method
    const activeApps: FullAppIdentifier[] = []; // Placeholder

    const filteredApps = activeApps.filter(a => a.appId === appId);
    return filteredApps;
  }
}
