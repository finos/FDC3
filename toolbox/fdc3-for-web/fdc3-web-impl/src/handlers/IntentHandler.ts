import { MessageHandler } from '../BasicFDC3Server';
import { AppRegistration, InstanceID, ServerContext } from '../ServerContext';
import { Directory, DirectoryIntent } from '../directory/DirectoryInterface';
import { Context } from '@kite9/fdc3-context';
import { AppIntent, ResolveError, AppIdentifier } from '@kite9/fdc3-standard';
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
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';

type ListenerRegistration = {
  appId: string;
  instanceId: string;
  intentName: string;
  listenerUUID: string;
};

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
async function forwardRequest(
  arg0: IntentRequest,
  to: FullAppIdentifier,
  sc: ServerContext<AppRegistration>,
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
      eventUuid: sc.createUUID(),
      timestamp: new Date(),
    },
  };

  // register the resolution destination
  ih.pendingResolutions.set(arg0.requestUuid, arg0.from);
  await sc.post(out, to.instanceId);
  successResponseId(
    sc,
    arg0.requestUuid,
    arg0.from,
    {
      intentResolution: {
        intent: arg0.intent,
        source: to,
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
  sc: ServerContext<AppRegistration>;
  ih: IntentHandler;

  constructor(r: IntentRequest, sc: ServerContext<AppRegistration>, ih: IntentHandler, appId: AppIdentifier) {
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

  async accept(arg0: ListenerRegistration): Promise<void> {
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

export class IntentHandler implements MessageHandler {
  private readonly directory: Directory;
  private readonly registrations: ListenerRegistration[] = [];
  readonly pendingIntents: Set<PendingIntent> = new Set();
  readonly pendingResolutions: Map<string, FullAppIdentifier> = new Map();
  readonly timeoutMs: number;

  constructor(d: Directory, timeoutMs: number) {
    this.directory = d;
    this.timeoutMs = timeoutMs;
  }

  shutdown(): void {}

  async narrowIntents(
    raiser: AppIdentifier,
    appIntents: AppIntent[],
    context: Context,
    sc: ServerContext<AppRegistration>
  ): Promise<AppIntent[]> {
    const out = await sc.narrowIntents(raiser, appIntents, context);
    return out;
  }

  async accept(msg: AppRequestMessage, sc: ServerContext<AppRegistration>, uuid: InstanceID): Promise<void> {
    const from = sc.getInstanceDetails(uuid);

    if (from == null) {
      // this handler only deals with connected apps
      return;
    }

    try {
      switch (msg.type as string) {
        // finding intents
        case 'findIntentsByContextRequest':
          return this.findIntentsByContextRequest(msg as FindIntentsByContextRequest, sc, from);
        case 'findIntentRequest':
          return this.findIntentRequest(msg as FindIntentRequest, sc, from);

        // listeners
        case 'addIntentListenerRequest':
          return this.onAddIntentListener(msg as AddIntentListenerRequest, sc, from);
        case 'intentListenerUnsubscribeRequest':
          return this.onUnsubscribe(msg as IntentListenerUnsubscribeRequest, sc, from);

        // raising intents and returning results
        case 'raiseIntentRequest':
          return this.raiseIntentRequest(msg as RaiseIntentRequest, sc, from);
        case 'raiseIntentForContextRequest':
          return this.raiseIntentForContextRequest(msg as RaiseIntentForContextRequest, sc, from);
        case 'intentResultRequest':
          return this.intentResultRequest(msg as IntentResultRequest, sc, from);
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
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ): void | PromiseLike<void> {
    const requestId = arg0.payload.raiseIntentRequestUuid;
    const to = this.pendingResolutions.get(requestId);
    if (to) {
      // post the result to the app that raised the intent
      successResponseId(
        sc,
        requestId,
        to,
        {
          intentResult: arg0.payload.intentResult,
        },
        'raiseIntentResultResponse'
      );

      // respond to the app that handled the intent
      successResponse(sc, arg0, from, {}, 'intentResultResponse');
      this.pendingResolutions.delete(requestId);
    } else {
      // no-one waiting for this result
      errorResponse(sc, arg0, from, 'No-one waiting for this result', 'intentResultResponse');
    }
  }

  onUnsubscribe(
    arg0: IntentListenerUnsubscribeRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ): void {
    const id = arg0.payload.listenerUUID;
    const fi = this.registrations.findIndex(e => e.listenerUUID == id);
    if (fi > -1) {
      this.registrations.splice(fi, 1);
      successResponse(sc, arg0, from, {}, 'intentListenerUnsubscribeResponse');
    } else {
      errorResponse(sc, arg0, from, 'Non-Existent Listener', 'intentListenerUnsubscribeResponse');
    }
  }

  onAddIntentListener(
    arg0: AddIntentListenerRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ): void {
    const lr: ListenerRegistration = {
      appId: from.appId,
      instanceId: from.instanceId,
      intentName: arg0.payload.intent,
      listenerUUID: sc.createUUID(),
    };

    this.registrations.push(lr);
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

  hasListener(instanceId: string, intentName: string): boolean {
    return this.registrations.find(r => r.instanceId == instanceId && r.intentName == intentName) != null;
  }

  async getRunningApps(appId: string, sc: ServerContext<AppRegistration>): Promise<FullAppIdentifier[]> {
    return (await sc.getConnectedApps()).filter(a => a.appId == appId);
  }

  async startWithPendingIntent(
    arg0: IntentRequest,
    sc: ServerContext<AppRegistration>,
    target: AppIdentifier
  ): Promise<void> {
    // app exists but needs starting
    const pi = new PendingIntent(arg0, sc, this, target);
    this.pendingIntents.add(pi);
    sc.open(target.appId).then(() => {
      return undefined;
    });
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

  async raiseIntentRequestToSpecificInstance(
    arg0: IntentRequest[],
    sc: ServerContext<AppRegistration>,
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

    const requestsWithListeners = arg0.filter(r => this.hasListener(target.instanceId, r.intent));

    if (requestsWithListeners.length == 0) {
      this.createPendingIntentIfAllowed(arg0[0], sc, target);
    } else {
      // ok, deliver to the current running app.
      return forwardRequest(requestsWithListeners[0], target, sc, this);
    }
  }

  async createPendingIntentIfAllowed(ir: IntentRequest, sc: ServerContext<AppRegistration>, target: AppIdentifier) {
    // if this app declares that it supports the intent, we'll create a pending intent
    const matchingIntents: DirectoryIntent[] = this.directory.retrieveIntents(ir.context.type, ir.intent, undefined);
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
    sc: ServerContext<AppRegistration>,
    target: AppIdentifier
  ): Promise<void> {
    // dealing with a specific app, which may or may not be open
    const runningApps = await this.getRunningApps(target.appId, sc);

    const appIntents = this.createAppIntents(arg0, [...runningApps, { appId: target.appId }]);

    const narrowedAppIntents = await this.narrowIntents(arg0[0].from, appIntents, arg0[0].context, sc);

    if (narrowedAppIntents.length == 1) {
      if (narrowedAppIntents[0].apps.length == 2 && narrowedAppIntents[0].apps[0].instanceId) {
        // single running instance
        return this.raiseIntentRequestToSpecificInstance(arg0, sc, runningApps[0]);
      } else if (narrowedAppIntents[0].apps.length == 1) {
        // no running instance, single app
        const appRecords = this.directory.retrieveAppsById(target.appId);
        if (appRecords.length >= 1) {
          const ir: IntentRequest = {
            ...arg0[0],
            intent: narrowedAppIntents[0].intent.name,
          };
          return this.startWithPendingIntent(ir, sc, target);
        } else {
          // app doesn't exist
          return errorResponseId(
            sc,
            arg0[0].requestUuid,
            arg0[0].from,
            ResolveError.TargetAppUnavailable,
            arg0[0].type
          );
        }
      }
    }

    // need to use the resolver to choose a running app instance

    if (arg0[0].type == 'raiseIntentResponse') {
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
      return successResponseId(
        sc,
        arg0[0].requestUuid,
        arg0[0].from,
        {
          appIntents: narrowedAppIntents,
        },
        arg0[0].type
      );
    }
  }

  oneAppOnly(appIntent: AppIntent): boolean {
    const apps = appIntent.apps.map(a => a.appId);
    const uniqueApps = apps.filter((v, i, a) => a.indexOf(v) === i).length;
    return uniqueApps == 1;
  }

  async raiseIntentToAnyApp(arg0: IntentRequest[], sc: ServerContext<AppRegistration>): Promise<void> {
    const connectedApps = await sc.getConnectedApps();
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
          return forwardRequest(ir, theAppIntent.apps[0], sc, this);
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

  async raiseIntentRequest(
    arg0: RaiseIntentRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ): Promise<void> {
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
        return this.raiseIntentToAnyApp([intentRequest], sc);
      }
    } else {
      //No target
      return this.raiseIntentToAnyApp([intentRequest], sc);
    }
  }

  async raiseIntentForContextRequest(
    arg0: RaiseIntentForContextRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ): Promise<void> {
    // dealing with a specific instance of an app
    const mappedIntents = this.directory.retrieveIntents(arg0.payload.context.type, undefined, undefined);
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
        return this.raiseIntentToAnyApp(possibleIntentRequests, sc);
      }
    } else {
      //No target
      return this.raiseIntentToAnyApp(possibleIntentRequests, sc);
    }
  }

  async findIntentsByContextRequest(
    r: FindIntentsByContextRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ): Promise<void> {
    // TODO: Add result type
    const { context } = r.payload;

    const apps1 = this.directory.retrieveIntents(context?.type, undefined, undefined);

    // fold apps so same intents aren't duplicated
    const apps2: AppIntent[] = [];
    apps1.forEach(a1 => {
      const existing = apps2.find(a2 => a2.intent.name == a1.intentName);
      if (existing) {
        existing.apps.push({ appId: a1.appId });
      } else {
        apps2.push({
          intent: {
            name: a1.intentName,
            displayName: a1.displayName ?? a1.intentName,
          },
          apps: [
            {
              appId: a1.appId,
            },
          ],
        });
      }
    });

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

  async findIntentRequest(
    r: FindIntentRequest,
    sc: ServerContext<AppRegistration>,
    from: FullAppIdentifier
  ): Promise<void> {
    const { intent, context, resultType } = r.payload;

    // listeners for connected applications
    const apps2 = (await this.retrieveListeners(intent, sc)).map(lr => {
      return {
        appId: lr.appId,
        instanceId: lr.instanceId,
      };
    }) as AppIdentifier[];

    // directory entries
    const apps1 = this.directory
      .retrieveApps(context?.type, intent, resultType)
      .map(a => {
        return {
          appId: a.appId,
        };
      })
      .filter(i => {
        // remove any directory entries that are already started
        const running = apps2.find(i2 => i2.appId == i.appId);
        return !running;
      }) as AppIdentifier[];

    // just need this for the (deprecated) display name
    const allMatchingIntents = this.directory.retrieveIntents(context?.type, intent, resultType);
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
          apps: [...apps1, ...apps2],
        },
      },
      'findIntentResponse'
    );
  }

  async retrieveListeners(
    intentName: string | undefined,
    sc: ServerContext<AppRegistration>
  ): Promise<ListenerRegistration[]> {
    const activeApps = await sc.getConnectedApps();
    const matching = this.registrations.filter(r => r.intentName == intentName);
    const active = matching.filter(r => activeApps.find(a => a.instanceId == r.instanceId));
    return active;
  }
}
