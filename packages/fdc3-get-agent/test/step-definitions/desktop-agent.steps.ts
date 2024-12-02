import { After, DataTable, Given, When } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { handleResolve, setupGenericSteps } from '@kite9/testing';
import { MockDocument } from '../support/MockDocument';
import { MockWindow } from '../support/MockWindow';
import { fdc3Ready, getAgent } from '../../src';
import {
  DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX,
  DesktopAgentDetails,
  GetAgentParams,
  WebDesktopAgentType,
} from '@kite9/fdc3-standard';
import { dummyInstanceId, EMBED_URL, MockFDC3Server } from '../support/MockFDC3Server';
import { MockStorage } from '../support/MockStorage';
import { DesktopAgent, ImplementationMetadata } from '@kite9/fdc3-standard';
import { clearAgentPromise } from '../../src/strategies/getAgent';
import expect from 'expect';

interface MockPageTransitionEvent extends Event {
  persisted?: boolean;
}

setupGenericSteps();
Given(
  'Parent Window desktop {string} listens for postMessage events in {string}, returns direct message response',
  async function (this: CustomWorld, field: string, w: string) {
    const mockWindow = handleResolve(w, this);
    this.mockFDC3Server = new MockFDC3Server(mockWindow as any, false, this.mockContext);
    this.props[field] = this.mockFDC3Server;
    this.mockContext.open(dummyInstanceId.appId);
  }
);

Given(
  'Parent Window desktop {string} listens for postMessage events in {string}, returns iframe response',
  async function (this: CustomWorld, field: string, w: string) {
    const mockWindow = handleResolve(w, this);
    this.mockFDC3Server = new MockFDC3Server(mockWindow as any, true, this.mockContext);
    this.props[field] = this.mockFDC3Server;
    this.mockContext.open(dummyInstanceId.appId);
  }
);

Given(
  '{string} is a function which opens an iframe for communications on {string}',
  function (this: CustomWorld, fn: string, doc: string) {
    this.props[fn] = () => {
      this.mockContext.open(dummyInstanceId.appId);
      const document = handleResolve(doc, this) as MockDocument;
      let ifrm = document.createElement('iframe');
      this.mockFDC3Server = new MockFDC3Server(ifrm as any, false, this.mockContext);
      ifrm.setAttribute('src', EMBED_URL + '?connectionAttemptUuid=124');
      document.body.appendChild(ifrm);
      return ifrm;
    };
  }
);

Given('an existing app instance in {string}', async function (this: CustomWorld, field: string) {
  const uuid = this.mockContext.open(dummyInstanceId.appId);
  this.props[field] = uuid;
});

Given('A Dummy Desktop Agent in {string}', async function (this: CustomWorld, field: string) {
  const da: DesktopAgent = {
    async getInfo(): Promise<ImplementationMetadata> {
      return {
        fdc3Version: '2.0',
        appMetadata: {
          appId: 'cucumber-app',
        },
        provider: 'cucumber-provider',
      } as any;
    },
  } as any;

  this.props[field] = da;
  this.props['result'] = null;
});

Given(
  '`window.fdc3` is injected into the runtime with the value in {string}',
  async function (this: CustomWorld, field: string) {
    const object = handleResolve(field, this);
    window.fdc3 = object;
    window.dispatchEvent(new Event('fdc3.ready'));
  }
);

When('I call getAgent for a promise result', function (this: CustomWorld) {
  try {
    this.props['result'] = getAgent();
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
  console.log('Cleaning up');
  clearAgentPromise();
  // setTimeout(() => {
  //     //console.log((process as any)._getActiveHandles())
  //     wtf.dump()
  // }, 10000)
});

When('I call getAgent for a promise result with the following options', function (this: CustomWorld, dt: DataTable) {
  try {
    const first = dt.hashes()[0];
    const toArgs = Object.fromEntries(
      Object.entries(first).map(([k, v]) => {
        const val = handleResolve(v, this);
        const val2 = isNaN(val) ? val : Number(val);
        const val3 = val2 === 'true' ? true : val2 === 'false' ? false : val2;
        return [k, val3];
      })
    );
    this.props['result'] = getAgent(toArgs as GetAgentParams);
  } catch (error) {
    this.props['result'] = error;
  }
});

Given(
  'a parent window document in {string}, window in {string}, child window document in {string} and window in {string}',
  async function (this: CustomWorld, pd: string, pw: string, cd: string, cw: string) {
    //create the parent window
    const mpw = new MockWindow('mockParentWindow', this, 'parentWin');
    this.props[pw] = mpw as any;

    // mock parent window document
    this.props[pd] = new MockDocument('parentDoc', mpw) as any;

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
    globalThis.sessionStorage = new MockStorage() as any;
  }
);

Given(
  'the session identity is set to {string} with identityUrl {string}',
  async function (this: CustomWorld, uuid: string, identityUrl: string) {
    const theUuid = handleResolve(uuid, this);
    const theIdentityUrl = handleResolve(identityUrl, this);
    const details: Record<string, DesktopAgentDetails> = {};
    details[theIdentityUrl] = {
      agentType: WebDesktopAgentType.ProxyParent,
      instanceUuid: theUuid,
      appId: 'cucumber-app',
      instanceId: 'uuid-0',
      identityUrl: theIdentityUrl,
      actualUrl: theIdentityUrl,
    };

    globalThis.sessionStorage.setItem(DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX + '-mocky', JSON.stringify(details));
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
