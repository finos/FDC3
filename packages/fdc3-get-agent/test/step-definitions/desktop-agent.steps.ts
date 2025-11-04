import { After, DataTable, Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { doesRowMatch, handleResolve, setupGenericSteps } from '@finos/testing';
import { MockDocument } from '../support/MockDocument';
import { MockWindow } from '../support/MockWindow';
import { fdc3Ready, getAgent } from '../../src';
import {
  DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX,
  DesktopAgentDetails,
  GetAgentLogLevels,
  GetAgentParams,
  LogLevel,
} from '@finos/fdc3-standard';
import { EMBED_URL, MockFDC3Server } from '../support/MockFDC3Server';
import { MockStorage } from '../support/MockStorage';
import { DesktopAgent, ImplementationMetadata } from '@finos/fdc3-standard';
import { clearAgentPromise } from '../../src/strategies/getAgent';
import expect from 'expect';
import { dummyInstanceDetails } from '../support/MockFDC3Server';
import { MockIFrame } from '../support/MockIFrame';

interface MockPageTransitionEvent extends Event {
  persisted?: boolean;
}

setupGenericSteps();

//Change logging settings here when debugging test failures
export const loggingSettings: GetAgentLogLevels = {
  connection: LogLevel.INFO,
  proxy: LogLevel.INFO,
};

Given(
  'Parent Window desktop {string} listens for postMessage events in {string}, returns direct message response',
  async function (this: CustomWorld, field: string, w: string) {
    const mockWindow = handleResolve(w, this);
    this.mockFDC3Server = new MockFDC3Server(mockWindow, false, this);
    this.props[field] = this.mockFDC3Server;
    this.mockFDC3Server.open(dummyInstanceDetails[0].appId);
    this.mockFDC3Server.open(dummyInstanceDetails[1].appId);
  }
);

Given(
  'Parent Window desktop {string} listens for postMessage events in {string}, returns direct message response, but times out identity validation',
  async function (this: CustomWorld, field: string, w: string) {
    const mockWindow = handleResolve(w, this);
    this.mockFDC3Server = new MockFDC3Server(mockWindow, false, this, [], [], undefined, true, true);
    this.props[field] = this.mockFDC3Server;
    this.mockFDC3Server.open(dummyInstanceDetails[0].appId);
    this.mockFDC3Server.open(dummyInstanceDetails[1].appId);
  }
);

Given(
  'Parent Window desktop {string} listens for postMessage events in {string}, returns direct message response and uses default UI URLs',
  async function (this: CustomWorld, field: string, w: string) {
    const mockWindow = handleResolve(w, this);
    this.mockFDC3Server = new MockFDC3Server(mockWindow, false, this, [], [], undefined, true);
    this.props[field] = this.mockFDC3Server;
    this.mockFDC3Server.open(dummyInstanceDetails[0].appId);
    this.mockFDC3Server.open(dummyInstanceDetails[1].appId);
  }
);

Given(
  'Parent Window desktop {string} listens for postMessage events in {string}, returns direct message response and times out message exchanges',
  async function (this: CustomWorld, field: string, w: string) {
    const mockWindow = handleResolve(w, this);
    this.mockFDC3Server = new MockFDC3Server(mockWindow, false, this, [], [], undefined, true, false, true);
    this.props[field] = this.mockFDC3Server;
    this.mockFDC3Server.open(dummyInstanceDetails[0].appId);
    this.mockFDC3Server.open(dummyInstanceDetails[1].appId);
  }
);

Given(
  'Parent Window desktop {string} listens for postMessage events in {string}, returns direct message response, times out message exchanges and uses message exchange timeout {string} ms and app launch timeout {string} ms',
  async function (this: CustomWorld, field: string, w: string, t1: string, t2: string) {
    const mockWindow = handleResolve(w, this);
    const messageExchangeTimeout: number = handleResolve(t1, this);
    const appLaunchTimeout: number = handleResolve(t2, this);
    this.mockFDC3Server = new MockFDC3Server(
      mockWindow,
      false,
      this,
      [],
      [],
      undefined,
      true,
      false,
      true,
      messageExchangeTimeout,
      appLaunchTimeout
    );
    this.props[field] = this.mockFDC3Server;
    this.mockFDC3Server.open(dummyInstanceDetails[0].appId);
    this.mockFDC3Server.open(dummyInstanceDetails[1].appId);
  }
);

Given(
  'Parent Window desktop {string} listens for postMessage events in {string}, returns iframe response',
  async function (this: CustomWorld, field: string, w: string) {
    const mockWindow = handleResolve(w, this);
    this.mockFDC3Server = new MockFDC3Server(mockWindow, true, this);
    this.props[field] = this.mockFDC3Server;
    this.mockFDC3Server.open(dummyInstanceDetails[0].appId);
    this.mockFDC3Server.open(dummyInstanceDetails[1].appId);
  }
);

Given(
  '{string} is a function which opens an iframe for communications on {string}',
  function (this: CustomWorld, fn: string, doc: string) {
    this.props[fn] = () => {
      const document = handleResolve(doc, this) as MockDocument;
      const ifrm = document.createElement('iframe');

      this.mockFDC3Server = new MockFDC3Server(ifrm as unknown as MockIFrame, false, this);
      this.mockFDC3Server.open(dummyInstanceDetails[0].appId);
      ifrm.setAttribute('src', EMBED_URL);
      document.body.appendChild(ifrm);
      return ifrm;
    };
  }
);

Given(
  '{string} is a function which opens an iframe for communications on {string} but times out identity validation',
  function (this: CustomWorld, fn: string, doc: string) {
    this.props[fn] = () => {
      const document = handleResolve(doc, this) as MockDocument;
      const ifrm = document.createElement('iframe');

      this.mockFDC3Server = new MockFDC3Server(
        ifrm as unknown as MockIFrame,
        false,
        this,
        [],
        [],
        undefined,
        true,
        true
      );
      this.mockFDC3Server.open(dummyInstanceDetails[0].appId);
      ifrm.setAttribute('src', EMBED_URL);
      document.body.appendChild(ifrm);
      return ifrm;
    };
  }
);

Given(
  '{string} is a function which opens an iframe for communications on {string} and times out message exchanges',
  function (this: CustomWorld, fn: string, doc: string) {
    this.props[fn] = () => {
      const document = handleResolve(doc, this) as MockDocument;
      const ifrm = document.createElement('iframe');

      this.mockFDC3Server = new MockFDC3Server(
        ifrm as unknown as MockIFrame,
        false,
        this,
        [],
        [],
        undefined,
        false,
        false,
        true
      );
      this.mockFDC3Server.open(dummyInstanceDetails[0].appId);
      ifrm.setAttribute('src', EMBED_URL);
      document.body.appendChild(ifrm);
      return ifrm;
    };
  }
);

Given(
  '{string} is a function which opens an iframe for communications on {string}, times out message exchanges and uses message exchange timeout {string} ms and app launch timeout {string} ms',
  function (this: CustomWorld, fn: string, doc: string, t1: string, t2: string) {
    const messageExchangeTimeout: number = handleResolve(t1, this);
    const appLaunchTimeout: number = handleResolve(t2, this);
    this.props[fn] = () => {
      const document = handleResolve(doc, this) as MockDocument;
      const ifrm = document.createElement('iframe');

      this.mockFDC3Server = new MockFDC3Server(
        ifrm as unknown as MockIFrame,
        false,
        this,
        [],
        [],
        undefined,
        false,
        false,
        true,
        messageExchangeTimeout,
        appLaunchTimeout
      );
      this.mockFDC3Server.open(dummyInstanceDetails[0].appId);
      ifrm.setAttribute('src', EMBED_URL);
      document.body.appendChild(ifrm);
      return ifrm;
    };
  }
);

Given('an existing app instance in {string}', async function (this: CustomWorld, field: string) {
  const uuid = await this.mockFDC3Server!.open(dummyInstanceDetails[0].appId);
  this.props[field] = uuid;
});

Given('A Dummy Desktop Agent in {string}', async function (this: CustomWorld, field: string) {
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

  this.props[field] = da;
  this.props['result'] = null;
});

Given(
  '`window.fdc3` is injected into the runtime with the value in {string}',
  async function (this: CustomWorld, field: string) {
    const object = handleResolve(field, this);
    window.fdc3 = object;
  }
);

Given(
  '`window.fdc3` is injected into the runtime with the value in {string} and fdc3Ready is fired',
  async function (this: CustomWorld, field: string) {
    const object = handleResolve(field, this);
    window.fdc3 = object;
    window.dispatchEvent(new Event('fdc3Ready'));
  }
);

When('I call getAgent for a promise result', function (this: CustomWorld) {
  try {
    const params: GetAgentParams = {
      logLevels: loggingSettings,
    };
    this.props['result'] = getAgent(params);
  } catch (error) {
    this.props['result'] = error;
  }
});

When('I call fdc3Ready for a promise result', function (this: CustomWorld) {
  try {
    this.props['result'] = fdc3Ready();
  } catch (error) {
    this.props['result'] = error;
  }
});

After(function (this: CustomWorld) {
  console.log('    Cleaning up test infrastructure');
  clearAgentPromise();
  MockDocument.shutdownAllDocuments();
});

When('I call getAgent for a promise result with the following options', function (this: CustomWorld, dt: DataTable) {
  try {
    const first = dt.hashes()[0];
    const toArgs: GetAgentParams = Object.fromEntries(
      Object.entries(first).map(([k, v]) => {
        const val = handleResolve(v, this);
        const val2 = isNaN(val) ? val : Number(val);
        const val3 = val2 === 'true' ? true : val2 === 'false' ? false : val2;
        return [k, val3];
      })
    );
    //add logging settings to help with debug
    toArgs.logLevels = loggingSettings;
    this.props['result'] = getAgent(toArgs);
  } catch (error) {
    this.props['result'] = error;
  }
});

Given(
  'a parent window document in {string}, window in {string}, child window document in {string} and window in {string}',
  async function (this: CustomWorld, pd: string, pw: string, cd: string, cw: string) {
    //create the parent window
    const mpw = new MockWindow('mockParentWindow', this, 'parentWin');
    this.props[pw] = mpw;

    // mock parent window document
    this.props[pd] = new MockDocument('parentDoc', mpw);

    // creates the mock app window
    const mcw = new MockWindow('mockWindow', this, 'mocky');
    this.props[cw] = mcw;

    // mock app document
    this.props[cd] = new MockDocument('childDoc', mcw);

    //run tests from the perspective of the child window
    globalThis.window = this.props[cw];
    globalThis.document = this.props[cd];

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
  async function (this: CustomWorld, uuid: string, appId: string, identityUrl: string, agentType: string) {
    const theUuid = handleResolve(uuid, this);
    const theAppId = handleResolve(appId, this);
    const theIdentityUrl = handleResolve(identityUrl, this);
    const theAgentType = handleResolve(agentType, this);
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
  async function (
    this: CustomWorld,
    uuid: string,
    appId: string,
    identityUrl: string,
    agentType: string,
    agentUrl: string
  ) {
    const theUuid = handleResolve(uuid, this);
    const theAppId = handleResolve(appId, this);
    const theIdentityUrl = handleResolve(identityUrl, this);
    const theAgentType = handleResolve(agentType, this);
    const theAgentUrl = handleResolve(agentUrl, this);
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
  async function (this: CustomWorld, identityUrl: string, agentType: string, appId: string) {
    const theIdentityUrl = handleResolve(identityUrl, this);
    const theAgentType = handleResolve(agentType, this);
    const theAppId = handleResolve(appId, this);

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

Given('SessionStorage contains corrupted data', async function (this: CustomWorld) {
  const corruptedData = ['All your base are belong to us'];

  globalThis.sessionStorage.setItem(DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX + '-mocky', JSON.stringify(corruptedData));
});

Given('SessionStorage is clear', async function () {
  globalThis.sessionStorage.clear();
});

Then(
  'SessionStorage should contain instanceUuid {string}, appId {string} with identityUrl {string}, agentType {string} and agentUrl {string}',
  async function (
    this: CustomWorld,
    uuid: string,
    appId: string,
    identityUrl: string,
    agentType: string,
    agentUrl: string
  ) {
    const theUuid = handleResolve(uuid, this);
    const theAppId = handleResolve(appId, this);
    const theIdentityUrl = handleResolve(identityUrl, this);
    const theAgentType = handleResolve(agentType, this);
    const theAgentUrl = handleResolve(agentUrl, this);

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
  function (this: CustomWorld, identityUrl: string, dt: DataTable) {
    const theIdentityUrl = handleResolve(identityUrl, this);
    const value = globalThis.sessionStorage.getItem(DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX + '-mocky');
    expect(value).toBeTruthy();
    const theObject = JSON.parse(value!);
    const details = theObject[theIdentityUrl];
    const table = dt.hashes();
    expect(doesRowMatch(this, table[0], details)).toBeTruthy();
  }
);

When(
  '{string} pagehide occurs with persisted = {string}',
  async function (this: CustomWorld, field: string, persisted: string) {
    const window: MockWindow = handleResolve(field, this);
    const isPersisted = handleResolve(persisted, this);
    const transitionEvent: MockPageTransitionEvent = new Event('pagehide');
    transitionEvent.persisted = isPersisted;
    window.dispatchEvent(transitionEvent);
  }
);

When('The Desktop Agent receives a WCP6Goodbye message', async function (this: CustomWorld) {
  expect(this.mockFDC3Server?.hasReceivedGoodbye).toBeTruthy();
});
