import {
  AppIdentifier,
  AppIntent,
  AppMetadata,
  DesktopAgent,
  Icon,
  Image,
  IntentResolution,
  IntentHandler,
  ContextHandler,
  Listener,
} from 'fdc3-2.0';
import { SendMessage } from '../message';
import { DesktopAgent as DesktopAgent1_2 } from 'fdc3-1.2';
import {
  Context,
  SailAppIntent,
  SailTargetIdentifier,
} from '/@main/types/FDC3Message';
import { FDC3_2_0_TOPICS } from '/@main/handlers/fdc3/2.0/topics';
import { INTENT_TIMEOUT, convertTarget } from '../lib/lib';
import { createChannelObject, createPrivateChannelObject } from './channel';
import { ResolverTimeout } from '/@main/types/FDC3Errors';
import { SailChannelData, SailIntentResolution } from '/@main/types/FDC3Data';
import { createResultPromise } from './connect';

function convertAppIntent(sai: SailAppIntent): AppIntent {
  const apps: AppMetadata[] = sai.apps.map((m) => {
    return {
      appId: m.appId ?? 'unknown',
      name: m.name ?? m.appId ?? 'unknown',
      version: m.version,
      title: m.title,
      tooltip: m.tooltip,
      description: m.description,
      icons: m.icons as Icon[],
      images: m.screenshots as Image[],
    };
  });

  return {
    intent: sai.intent,
    apps,
  };
}

function setupResolverListener(
  resolve: (value: IntentResolution) => void,
  version: string,
  intent?: string,
) {
  const intentTimeout = -1;
  //listen for resolve intent
  document.addEventListener(
    FDC3_2_0_TOPICS.RESOLVE_INTENT,
    (event: Event) => {
      const cEvent = event as CustomEvent;
      console.log('***** intent resolution received', cEvent.detail);
      if (intentTimeout) {
        window.clearTimeout(intentTimeout);
      }

      resolve({
        version: version,
        intent: intent!,
        source: cEvent.detail?.source || { name: 'unknown' },
        async getResult() {
          // fix me
        },
      });
    },
    { once: true },
  );
}

export function createDesktopAgentInstance(
  sendMessage: SendMessage,
  version: string,
  base: DesktopAgent1_2,
): DesktopAgent {
  const addIntentListener1_2 = base.addIntentListener;
  const addContextListener1_2 = base.addContextListener;

  const getUserChannels2_0 = async () => {
    const r: Array<SailChannelData> = await sendMessage(
      FDC3_2_0_TOPICS.GET_USER_CHANNELS,
      {},
    );
    console.log('result', r);
    const channels = r.map((c: SailChannelData) => {
      return createChannelObject(
        sendMessage,
        c.id,
        'user',
        c.displayMetadata || { name: c.id },
      );
    });
    return channels;
  };

  return {
    ...base,

    async getInfo() {
      return sendMessage(FDC3_2_0_TOPICS.GET_APP_ID, {
        // no data
      }).then((details) => {
        console.log('GetInfo returned ' + JSON.stringify(details));
        return {
          fdc3Version: version,
          provider: 'fdc3-sail',
          optionalFeatures: {
            OriginatingAppMetadata: true,
            UserChannelMembershipAPIs: true,
          },
          appMetadata: details.appMetadata,
        };
      });
    },

    open(app: any, context?: Context) {
      return sendMessage(FDC3_2_0_TOPICS.OPEN, {
        target: convertTarget(app),
        context: context,
      }).then((details) => {
        return {
          appId: details.appId,
          instanceId: details.instanceId,
        };
      });
    },

    async findInstances(app: AppIdentifier) {
      const data = (await sendMessage(FDC3_2_0_TOPICS.FIND_INSTANCES, {
        app,
      })) as SailTargetIdentifier[];
      const result: AppIdentifier[] = data.map((e) => {
        return {
          appId: e.appId!,
          instanceId: e.instanceId,
        };
      });

      return result;
    },

    async getUserChannels() {
      return getUserChannels2_0();
    },

    async getSystemChannels() {
      return getUserChannels2_0();
    },

    async getOrCreateChannel(channelId: string) {
      const result: SailChannelData = await sendMessage(
        FDC3_2_0_TOPICS.GET_OR_CREATE_CHANNEL,
        { channel: channelId },
      );

      return createChannelObject(
        sendMessage,
        result.id,
        result.type,
        result.displayMetadata || { name: result.id },
      );
    },

    async createPrivateChannel() {
      const result: SailChannelData = await sendMessage(
        FDC3_2_0_TOPICS.CREATE_PRIVATE_CHANNEL,
        {},
      );

      return createPrivateChannelObject(sendMessage, result.id);
    },

    async leaveCurrentChannel() {
      return await sendMessage(FDC3_2_0_TOPICS.LEAVE_CURRENT_CHANNEL, {});
    },

    async joinUserChannel(channel: string) {
      return await sendMessage(FDC3_2_0_TOPICS.JOIN_CHANNEL, {
        channel: channel,
      });
    },

    async getCurrentChannel() {
      const result: SailChannelData = await sendMessage(
        FDC3_2_0_TOPICS.GET_CURRENT_CHANNEL,
        {},
      );

      return result == null
        ? null
        : createChannelObject(
            sendMessage,
            result.id,
            result.type,
            result.displayMetadata || { name: result.id },
          );
    },

    async getAppMetadata(app: AppIdentifier) {
      let result: AppMetadata = await sendMessage(
        FDC3_2_0_TOPICS.GET_APP_METADATA,
        {
          app: app,
        },
      );

      if (app.instanceId) {
        result = { ...result, instanceId: app.instanceId };
      }

      console.log('Returned metadata: ' + JSON.stringify(result));

      return result;
    },

    async findIntent(
      intent: string,
      context: Context,
      resultType: string | undefined,
    ) {
      const sai: SailAppIntent = await sendMessage(
        FDC3_2_0_TOPICS.FIND_INTENT,
        {
          intent,
          context,
          resultType,
        },
      );

      return convertAppIntent(sai);
    },

    async findIntentsByContext(context: Context) {
      const appIntents: SailAppIntent[] = await sendMessage(
        FDC3_2_0_TOPICS.FIND_INTENTS_BY_CONTEXT,
        {
          context: context,
        },
      );

      return appIntents.map(convertAppIntent);
    },

    async broadcast(context: Context) {
      return await sendMessage(FDC3_2_0_TOPICS.BROADCAST, { context: context });
    },

    raiseIntent(intent: string, context: Context, app?: any) {
      return new Promise<IntentResolution>((resolve, reject) => {
        const target = convertTarget(app);
        console.log('Converted', target);

        sendMessage(FDC3_2_0_TOPICS.RAISE_INTENT, {
          intent: intent,
          context: context,
          target: target,
          fdc3Version: version,
        }).then(
          (result: SailIntentResolution) => {
            console.log('***** got intent resolution ', result);
            if (result.openingResolver) {
              setupResolverListener(resolve, version, result.intent);
            } else {
              const resultPromise = createResultPromise(result.result);
              const out = {
                source: {
                  appId: result.source!.appId!,
                  instanceId: result.source!.instanceId,
                },
                intent: result.intent!,
                getResult() {
                  return resultPromise;
                },
                version: result.version,
              };
              console.log('RaiseIntent Returning ', out);
              resolve(out);
            }
          },
          (error) => {
            reject(error);
          },
        );

        //timeout the intent resolution
        window.setTimeout(() => {
          reject(new Error(ResolverTimeout));
        }, INTENT_TIMEOUT);
      });
    },

    async raiseIntentForContext(context: Context, app?: any) {
      return await sendMessage(FDC3_2_0_TOPICS.RAISE_INTENT_FOR_CONTEXT, {
        context: context,
        target: convertTarget(app),
      });
    },

    async addIntentListener(
      intent: string,
      handler: IntentHandler,
    ): Promise<Listener> {
      return addIntentListener1_2(intent, handler);
    },

    async addContextListener(
      context: ContextHandler | string | null,
      handler?: ContextHandler,
    ): Promise<Listener> {
      return addContextListener1_2(context as any, handler as any);
    },
  };
}
