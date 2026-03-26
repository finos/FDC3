import { AppIdentifier, ResolveError } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { v4 as uuidv4 } from 'uuid';
import { AbstractMessaging } from '../../src/messaging/AbstractMessaging.js';
import { RegisterableListener } from '../../src/listeners/RegisterableListener.js';
import { FindIntent } from './responses/FindIntent.js';
import { FindIntentByContext } from './responses/FindIntentByContext.js';
import { RaiseIntent } from './responses/RaiseIntent.js';
import { GetAppMetadata } from './responses/GetAppMetadata.js';
import { FindInstances } from './responses/FindInstances.js';
import { Open } from './responses/Open.js';
import { GetOrCreateChannel } from './responses/GetOrCreateChannel.js';
import { ChannelState } from './responses/ChannelState.js';
import { GetUserChannels } from './responses/GetUserChannels.js';
import { RegisterListeners } from './responses/RegisterListeners.js';
import { UnsubscribeListeners } from './responses/UnsubscribeListeners.js';
import { CreatePrivateChannel } from './responses/CreatePrivateChannel.js';
import { DisconnectPrivateChannel } from './responses/DisconnectPrivateChannel.js';
import { IntentResult } from './responses/IntentResult.js';
import { RaiseIntentForContext } from './responses/RaiseIntentForContext.js';
import {
  AgentEventMessage,
  AgentResponseMessage,
  AppRequestMessage,
  Channel,
  WebConnectionProtocol6Goodbye,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { GetInfo } from './responses/GetInfo.js';
import { AddEventListener } from './responses/AddEventListener.js';

export interface IntentDetail {
  app?: AppIdentifier;
  intent?: string;
  context?: string;
  resultType?: string;
}

export interface AutomaticResponse {
  filter: (t: string) => boolean;
  action: (input: AppRequestMessage, m: TestMessaging) => Promise<void>;
}

export interface PossibleIntentResult {
  context?: Context;
  channel?: Channel;
  error?: ResolveError;
  timeout?: boolean;
}

function matchStringOrUndefined(expected: string | undefined, actual: string | undefined) {
  if (expected && actual) {
    return expected == actual;
  } else {
    return true;
  }
}

function matchString(expected: string | undefined, actual: string | undefined) {
  return expected == actual;
}

function removeGenericType(t: string) {
  const startOfGeneric = t.indexOf('<');
  if (startOfGeneric > -1) {
    return t.substring(0, startOfGeneric - 1);
  } else {
    return t;
  }
}

function matchResultTypes(expected: string | undefined, actual: string | undefined) {
  if (expected) {
    if (expected.indexOf('<') > -1) {
      // looking for a complete match involving generics
      return expected == actual;
    } else if (actual == undefined) {
      // no actual, only expected
      return false;
    } else {
      // expected doesn't have generics, match without
      const actualType = removeGenericType(actual);
      return expected == actualType;
    }
  } else {
    return true;
  }
}

export function intentDetailMatches(
  instance: IntentDetail,
  template: IntentDetail,
  contextMustMatch: boolean
): boolean {
  return (
    matchStringOrUndefined(template.app?.appId, instance.app?.appId) &&
    matchStringOrUndefined(template.app?.instanceId, instance.app?.instanceId) &&
    matchStringOrUndefined(template.intent, instance.intent) &&
    (contextMustMatch
      ? matchString(template.context, instance.context)
      : matchStringOrUndefined(template.context, instance.context)) &&
    matchResultTypes(template.resultType, instance.resultType)
  );
}

export class TestMessaging extends AbstractMessaging {
  readonly allPosts: (AppRequestMessage | WebConnectionProtocol6Goodbye)[] = [];
  readonly listeners: Map<string, RegisterableListener> = new Map();
  readonly intentDetails: IntentDetail[] = [];
  readonly channelState: { [key: string]: Context[] };
  currentChannel: Channel | null = null;

  readonly automaticResponses: AutomaticResponse[];

  constructor(channelState: { [key: string]: Context[] }) {
    super({ appId: 'cucumber-app', instanceId: 'cucumber-instance' });

    this.channelState = channelState;
    this.automaticResponses = [
      new FindIntent(),
      new FindIntentByContext(),
      new RaiseIntent(),
      new RaiseIntentForContext(),
      new IntentResult(),
      new GetAppMetadata(),
      new GetInfo(),
      new FindInstances(),
      new Open(),
      new GetOrCreateChannel(),
      new ChannelState(this.channelState),
      new GetUserChannels(),
      new RegisterListeners(),
      new UnsubscribeListeners(),
      new CreatePrivateChannel(),
      new DisconnectPrivateChannel(),
      new AddEventListener(),
    ];
  }

  createUUID(): string {
    return uuidv4();
  }

  getTimeoutMs(): number {
    return 1000;
  }

  async disconnect(): Promise<void> {
    //Theres no explicit disconnect call for the DA in FDC3, but the DesktopAgentProxy implementation includes one that is called to pagehide
    const bye: WebConnectionProtocol6Goodbye = {
      type: 'WCP6Goodbye',
      meta: {
        timestamp: new Date(),
      },
    };
    await this.post(bye);
  }

  post(message: AppRequestMessage | WebConnectionProtocol6Goodbye): Promise<void> {
    this.allPosts.push(message);

    if (message.type != 'WCP6Goodbye') {
      for (let i = 0; i < this.automaticResponses.length; i++) {
        const ar = this.automaticResponses[i];
        if (ar.filter(message.type)) {
          return ar.action(message, this);
        }
      }
    }

    return Promise.resolve();
  }

  addAppIntentDetail(id: IntentDetail) {
    this.intentDetails.push(id);
  }

  register(l: RegisterableListener) {
    if (l.id == null) {
      throw new Error('Listener must have ID set');
    } else {
      this.listeners.set(l.id, l);
    }
  }

  unregister(id: string) {
    this.listeners.delete(id);
  }

  createMeta() {
    return {
      requestUuid: this.createUUID(),
      timestamp: new Date(),
      source: this.getAppIdentifier(),
    };
  }

  /**
   * Used in testing steps
   */
  createResponseMeta() {
    return {
      ...this.createMeta(),
      responseUuid: this.createUUID(),
    };
  }

  /**
   * Used in testing steps
   */
  createEventMeta() {
    return {
      ...this.createMeta(),
      eventUuid: this.createUUID(),
    };
  }

  receive(m: AgentResponseMessage | AgentEventMessage, log?: (s: string) => void) {
    this.listeners.forEach((v, k) => {
      if (v.filter(m)) {
        if (log) {
          log('Processing in ' + k);
        }
        v.action(m);
      } else {
        if (log) {
          log('Ignoring in ' + k);
        }
      }
    });
  }

  private ir: PossibleIntentResult | null = null;

  getIntentResult() {
    return this.ir;
  }

  setIntentResult(o: PossibleIntentResult) {
    this.ir = o;
  }
}
