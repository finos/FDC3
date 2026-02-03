import { Given, Then, When, After } from 'quickpickle';
import { DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../world/index.js';
import { doesRowMatch, handleResolve, matchData } from '@finos/testing';
import { MockDocument } from '../support/MockDocument.js';
import { MockWindow } from '../support/MockWindow.js';
import { fdc3Ready, getAgent } from '../../src/index.js';
import {
  DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX,
  DesktopAgentDetails,
  GetAgentLogLevels,
  GetAgentParams,
  LogLevel,
} from '@finos/fdc3-standard';
import { EMBED_URL, MockFDC3Server } from '../support/MockFDC3Server.js';
import { MockStorage } from '../support/MockStorage.js';
import { DesktopAgent, ImplementationMetadata } from '@finos/fdc3-standard';
import { clearAgentPromise } from '../../src/strategies/getAgent.js';
import { expect } from 'vitest';
import { dummyInstanceDetails } from '../support/TestServerContext.js';
import { MockIFrame } from '../support/MockIFrame.js';

interface MockPageTransitionEvent extends Event {
  persisted?: boolean;
}

//Change logging settings here when debugging test failures
export const loggingSettings: GetAgentLogLevels = {
  connection: LogLevel.INFO,
  proxy: LogLevel.INFO,
};

// Package-specific steps

Given(
  'Parent Window desktop {string} listens for postMessage events in {string}, returns direct message response',
  async (world: CustomWorld, field: string, w: string) => {
    const mockWindow = handleResolve(w, world);
    world.mockFDC3Server = new MockFDC3Server(mockWindow, false, world.mockContext);
    world.props[field] = world.mockFDC3Server;
    world.mockContext.open(dummyInstanceDetails[0].appId);
    world.mockContext.open(dummyInstanceDetails[1].appId);
  }
);

Given(
  'Parent Window desktop {string} listens for postMessage events in {string}, returns direct message response, but times out identity validation',
  async (world: CustomWorld, field: string, w: string) => {
    const mockWindow = handleResolve(w, world);
    world.mockFDC3Server = new MockFDC3Server(mockWindow, false, world.mockContext, true, true);
    world.props[field] = world.mockFDC3Server;
    world.mockContext.open(dummyInstanceDetails[0].appId);
    world.mockContext.open(dummyInstanceDetails[1].appId);
  }
);

Given(
  'Parent Window desktop {string} listens for postMessage events in {string}, returns direct message response and uses default UI URLs',
  async (world: CustomWorld, field: string, w: string) => {
    const mockWindow = handleResolve(w, world);
    world.mockFDC3Server = new MockFDC3Server(mockWindow, false, world.mockContext, true);
    world.props[field] = world.mockFDC3Server;
    world.mockContext.open(dummyInstanceDetails[0].appId);
    world.mockContext.open(dummyInstanceDetails[1].appId);
  }
);

Given(
  'Parent Window desktop {string} listens for postMessage events in {string}, returns direct message response and times out message exchanges',
  async (world: CustomWorld, field: string, w: string) => {
    const mockWindow = handleResolve(w, world);
    world.mockFDC3Server = new MockFDC3Server(mockWindow, false, world.mockContext, true, false, true);
    world.props[field] = world.mockFDC3Server;
    world.mockContext.open(dummyInstanceDetails[0].appId);
    world.mockContext.open(dummyInstanceDetails[1].appId);
  }
);

Given(
  'Parent Window desktop {string} listens for postMessage events in {string}, returns direct message response, times out message exchanges and uses message exchange timeout {string} ms and app launch timeout {string} ms',
  async (world: CustomWorld, field: string, w: string, t1: string, t2: string) => {
    const mockWindow = handleResolve(w, world);
    const messageExchangeTimeout: number = handleResolve(t1, world);
    const appLaunchTimeout: number = handleResolve(t2, world);
    world.mockFDC3Server = new MockFDC3Server(
      mockWindow,
      false,
      world.mockContext,
      true,
      false,
      true,
      messageExchangeTimeout,
      appLaunchTimeout
    );
    world.props[field] = world.mockFDC3Server;
    world.mockContext.open(dummyInstanceDetails[0].appId);
    world.mockContext.open(dummyInstanceDetails[1].appId);
  }
);

Given(
  'Parent Window desktop {string} listens for postMessage events in {string}, returns iframe response',
  async (world: CustomWorld, field: string, w: string) => {
    const mockWindow = handleResolve(w, world);
    world.mockFDC3Server = new MockFDC3Server(mockWindow, true, world.mockContext);
    world.props[field] = world.mockFDC3Server;
    world.mockContext.open(dummyInstanceDetails[0].appId);
    world.mockContext.open(dummyInstanceDetails[1].appId);
  }
);

Given(
  '{string} is a function which opens an iframe for communications on {string}',
  (world: CustomWorld, fn: string, doc: string) => {
    world.props[fn] = () => {
      world.mockContext.open(dummyInstanceDetails[0].appId);
      const document = handleResolve(doc, world) as MockDocument;
      const ifrm = document.createElement('iframe');

      world.mockFDC3Server = new MockFDC3Server(ifrm as unknown as MockIFrame, false, world.mockContext);
      ifrm.setAttribute('src', EMBED_URL);
      document.body.appendChild(ifrm);
      return ifrm;
    };
  }
);

Given(
  '{string} is a function which opens an iframe for communications on {string} but times out identity validation',
  (world: CustomWorld, fn: string, doc: string) => {
    world.props[fn] = () => {
      world.mockContext.open(dummyInstanceDetails[0].appId);
      const document = handleResolve(doc, world) as MockDocument;
      const ifrm = document.createElement('iframe');

      world.mockFDC3Server = new MockFDC3Server(ifrm as unknown as MockIFrame, false, world.mockContext, true, true);
      ifrm.setAttribute('src', EMBED_URL);
      document.body.appendChild(ifrm);
      return ifrm;
    };
  }
);

Given(
  '{string} is a function which opens an iframe for communications on {string} and times out message exchanges',
  (world: CustomWorld, fn: string, doc: string) => {
    world.props[fn] = () => {
      world.mockContext.open(dummyInstanceDetails[0].appId);
      const document = handleResolve(doc, world) as MockDocument;
      const ifrm = document.createElement('iframe');

      world.mockFDC3Server = new MockFDC3Server(
        ifrm as unknown as MockIFrame,
        false,
        world.mockContext,
        false,
        false,
        true
      );
      ifrm.setAttribute('src', EMBED_URL);
      document.body.appendChild(ifrm);
      return ifrm;
    };
  }
);

Given(
  '{string} is a function which opens an iframe for communications on {string}, times out message exchanges and uses message exchange timeout {string} ms and app launch timeout {string} ms',
  (world: CustomWorld, fn: string, doc: string, t1: string, t2: string) => {
    const messageExchangeTimeout: number = handleResolve(t1, world);
    const appLaunchTimeout: number = handleResolve(t2, world);
    world.props[fn] = () => {
      world.mockContext.open(dummyInstanceDetails[0].appId);
      const document = handleResolve(doc, world) as MockDocument;
      const ifrm = document.createElement('iframe');

      world.mockFDC3Server = new MockFDC3Server(
        ifrm as unknown as MockIFrame,
        false,
        world.mockContext,
        false,
        false,
        true,
        messageExchangeTimeout,
        appLaunchTimeout
      );
      ifrm.setAttribute('src', EMBED_URL);
      document.body.appendChild(ifrm);
      return ifrm;
    };
  }
);

Given('an existing app instance in {string}', async (world: CustomWorld, field: string) => {
  const uuid = world.mockContext.open(dummyInstanceDetails[0].appId);
  world.props[field] = uuid;
});

Given('A Dummy Desktop Agent in {string}', async (world: CustomWorld, field: string) => {
  const notImplemented = () => {
    throw new Error('Function not implemented.');
  };
  const da: DesktopAgent = {
    async getInfo(): Promise<ImplementationMetadata> {
      return {
        fdc3Version: '2.0',
        optionalFeatures: {
          DesktopAgentBridging: false,
          OriginatingAppMetadata: false,
          UserChannelMembershipAPIs: false,
        },
        appMetadata: {
          appId: 'cucumber-app',
          instanceId: 'uuid-0',
        },
        provider: 'preload-provider',
      };
    },
    open: notImplemented,
    findIntent: notImplemented,
    findIntentsByContext: notImplemented,
    findInstances: notImplemented,
    broadcast: notImplemented,
    raiseIntent: notImplemented,
    raiseIntentForContext: notImplemented,
    addIntentListener: notImplemented,
    addContextListener: notImplemented,
    addEventListener: notImplemented,
    getUserChannels: notImplemented,
    joinUserChannel: notImplemented,
    getOrCreateChannel: notImplemented,
    createPrivateChannel: notImplemented,
    getCurrentChannel: notImplemented,
    leaveCurrentChannel: notImplemented,
    getAppMetadata: notImplemented,
    getSystemChannels: notImplemented,
    joinChannel: notImplemented,
  };

  world.props[field] = da;
  world.props['result'] = null;
});

Given(
  '`window.fdc3` is injected into the runtime with the value in {string}',
  async (world: CustomWorld, field: string) => {
    const object = handleResolve(field, world);
    window.fdc3 = object;
  }
);

Given(
  '`window.fdc3` is injected into the runtime with the value in {string} and fdc3Ready is fired',
  async (world: CustomWorld, field: string) => {
    const object = handleResolve(field, world);
    window.fdc3 = object;
    window.dispatchEvent(new Event('fdc3Ready'));
  }
);

When('I call getAgent for a promise result', (world: CustomWorld) => {
  try {
    const params: GetAgentParams = {
      logLevels: loggingSettings,
    };
    world.props['result'] = getAgent(params);
  } catch (error) {
    world.props['result'] = error;
  }
});

When('I call fdc3Ready for a promise result', (world: CustomWorld) => {
  try {
    world.props['result'] = fdc3Ready();
  } catch (error) {
    world.props['result'] = error;
  }
});

// After hook for cleanup (runs after each scenario)
After((world: CustomWorld) => {
  console.log('    Cleaning up test infrastructure');
  clearAgentPromise();
  MockDocument.shutdownAllDocuments();
});

When('I call getAgent for a promise result with the following options', (world: CustomWorld, dt: DataTable) => {
  try {
    const first = dt.hashes()[0];
    const toArgs: GetAgentParams = Object.fromEntries(
      Object.entries(first).map(([k, v]) => {
        const val = handleResolve(v, world);
        const val2 = isNaN(val) ? val : Number(val);
        const val3 = val2 === 'true' ? true : val2 === 'false' ? false : val2;
        return [k, val3];
      })
    );
    //add logging settings to help with debug
    toArgs.logLevels = loggingSettings;
    world.props['result'] = getAgent(toArgs);
  } catch (error) {
    world.props['result'] = error;
  }
});

Given(
  'a parent window document in {string}, window in {string}, child window document in {string} and window in {string}',
  async (world: CustomWorld, pd: string, pw: string, cd: string, cw: string) => {
    //create the parent window
    const mpw = new MockWindow('mockParentWindow', world, 'parentWin');
    world.props[pw] = mpw;

    // mock parent window document
    world.props[pd] = new MockDocument('parentDoc', mpw);

    // creates the mock app window
    const mcw = new MockWindow('mockWindow', world, 'mocky');
    world.props[cw] = mcw;

    // mock app document
    world.props[cd] = new MockDocument('childDoc', mcw);

    //run tests from the perspective of the child window
    globalThis.window = world.props[cw];
    globalThis.document = world.props[cd];

    // create parent relationship
    mcw.parent = mpw;

    //create child relationship (for attributing postMessage calls)
    mpw.child = mcw;

    // session storage (will be common between windows, which is ok as DA doesn't use this)
    globalThis.sessionStorage = new MockStorage();
  }
);

Given(
  'SessionStorage contains instanceUuid {string}, appId {string} with identityUrl {string} and agentType {string}',
  async (world: CustomWorld, uuid: string, appId: string, identityUrl: string, agentType: string) => {
    const theUuid = handleResolve(uuid, world);
    const theAppId = handleResolve(appId, world);
    const theIdentityUrl = handleResolve(identityUrl, world);
    const theAgentType = handleResolve(agentType, world);
    const details: Record<string, DesktopAgentDetails> = {};
    details[theIdentityUrl] = {
      agentType: theAgentType,
      instanceUuid: theUuid,
      appId: theAppId,
      instanceId: 'uuid-0',
      identityUrl: theIdentityUrl,
      actualUrl: theIdentityUrl,
    };

    globalThis.sessionStorage.setItem(DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX + '-mocky', JSON.stringify(details));
  }
);

Given(
  'SessionStorage contains instanceUuid {string}, appId {string} with identityUrl {string}, agentType {string} and agentUrl {string}',
  async (world: CustomWorld, uuid: string, appId: string, identityUrl: string, agentType: string, agentUrl: string) => {
    const theUuid = handleResolve(uuid, world);
    const theAppId = handleResolve(appId, world);
    const theIdentityUrl = handleResolve(identityUrl, world);
    const theAgentType = handleResolve(agentType, world);
    const theAgentUrl = handleResolve(agentUrl, world);
    const details: Record<string, DesktopAgentDetails> = {};
    details[theIdentityUrl] = {
      agentType: theAgentType,
      instanceUuid: theUuid,
      appId: theAppId,
      instanceId: 'uuid-0',
      identityUrl: theIdentityUrl,
      actualUrl: theIdentityUrl,
      agentUrl: theAgentUrl,
    };

    globalThis.sessionStorage.setItem(DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX + '-mocky', JSON.stringify(details));
  }
);

Given(
  'SessionStorage contains partial data with with identityUrl {string}, appId {string} and agentType {string}',
  async (world: CustomWorld, identityUrl: string, agentType: string, appId: string) => {
    const theIdentityUrl = handleResolve(identityUrl, world);
    const theAgentType = handleResolve(agentType, world);
    const theAppId = handleResolve(appId, world);

    const partialDetails: Record<string, Partial<DesktopAgentDetails>> = {};
    partialDetails[theIdentityUrl] = {
      agentType: theAgentType,
      appId: theAppId,
      identityUrl: identityUrl,
    };

    globalThis.sessionStorage.setItem(
      DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX + '-mocky',
      JSON.stringify(partialDetails)
    );
  }
);

Given('SessionStorage contains corrupted data', async (world: CustomWorld) => {
  const corruptedData = ['All your base are belong to us'];

  globalThis.sessionStorage.setItem(DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX + '-mocky', JSON.stringify(corruptedData));
});

Given('SessionStorage is clear', async () => {
  globalThis.sessionStorage.clear();
});

Then(
  'SessionStorage should contain instanceUuid {string}, appId {string} with identityUrl {string}, agentType {string} and agentUrl {string}',
  async (world: CustomWorld, uuid: string, appId: string, identityUrl: string, agentType: string, agentUrl: string) => {
    const theUuid = handleResolve(uuid, world);
    const theAppId = handleResolve(appId, world);
    const theIdentityUrl = handleResolve(identityUrl, world);
    const theAgentType = handleResolve(agentType, world);
    const theAgentUrl = handleResolve(agentUrl, world);

    const value = globalThis.sessionStorage.getItem(DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX + '-mocky');
    expect(value).toBeTruthy();
    const theObject = JSON.parse(value!);
    const details = theObject[theIdentityUrl];
    expect(details).toBeTruthy();
    expect(details.agentType).toEqual(theAgentType);
    expect(details.agentUrl).toEqual(theAgentUrl);
    expect(details.appId).toEqual(theAppId);
    expect(details.instanceUuid).toEqual(theUuid);
  }
);

Then(
  'SessionStorage for identityUrl {string} should contain the following values',
  (world: CustomWorld, identityUrl: string, dt: DataTable) => {
    const theIdentityUrl = handleResolve(identityUrl, world);
    const value = globalThis.sessionStorage.getItem(DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX + '-mocky');
    expect(value).toBeTruthy();
    const theObject = JSON.parse(value!);
    const details = theObject[theIdentityUrl];
    const table = dt.hashes();
    expect(doesRowMatch(world, table[0], details)).toBeTruthy();
  }
);

When(
  '{string} pagehide occurs with persisted = {string}',
  async (world: CustomWorld, field: string, persisted: string) => {
    const window: MockWindow = handleResolve(field, world);
    const isPersisted = handleResolve(persisted, world);
    const transitionEvent: MockPageTransitionEvent = new Event('pagehide');
    transitionEvent.persisted = isPersisted;
    window.dispatchEvent(transitionEvent);
  }
);

When('The Desktop Agent receives a WCP6Goodbye message', async (world: CustomWorld) => {
  expect(world.mockFDC3Server?.hasReceivedGoodbye).toBeTruthy();
});
