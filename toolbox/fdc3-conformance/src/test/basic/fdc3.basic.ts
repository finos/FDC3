import { DesktopAgent, getAgent } from '@finos/fdc3';

import { APIDocumentation2_0 } from '../support/apiDocuments-2.0';
import { ContextType, Intent } from '../support/intent-support-2.0';
import { closeMockAppWindow } from '../fdc3-2_0-utils';

import { assert, expect } from 'chai';
import { handleFail } from '../../utils';

const getAgent2_2 = (fdc3: DesktopAgent, documentation: string) => {
  it('(GetAgentAPI) Method is callable', async () => {
    const agent = await getAgent()
    const info = await agent.getInfo();
    assert.isTrue(info.fdc3Version.startsWith('2.'), documentation);
    const userChannels = await agent.getUserChannels();
    assert.isTrue(userChannels.length > 0, documentation);
  });
};


let basicCL1 = (fdc3: DesktopAgent, documentation: string) => {
  it('(BasicCL1) Method is callable', async () => {
    const contextType = 'fdc3.contact';
    try {
      const listener = await fdc3.addContextListener(contextType, (info: any) => {
        console.log(`Context listener of type ${contextType} triggered with result ${info}`);
      });
      assert.isTrue(listener && typeof listener === 'object', documentation);
      expect(
        typeof listener.unsubscribe,
        'the listener did not contain an unsubscribe function' + documentation
      ).to.be.equals('function');
      if (listener !== undefined) {
        listener.unsubscribe();
      }
    } catch (ex) {
      handleFail(documentation, ex);
    }
  });
};

let basicCL2 = (fdc3: DesktopAgent, documentation: string) => {
  it('(BasicCL2) Returns listener object', async () => {
    try {
      const listener = await fdc3.addContextListener(null, () => { });
      assert.isTrue(listener && typeof listener === 'object', documentation);
      expect(typeof listener.unsubscribe, documentation).to.be.equals('function');
      if (listener !== undefined) {
        listener.unsubscribe();
      }
    } catch (ex) {
      handleFail(documentation, ex);
    }
  });
};

let basicIL1 = (fdc3: DesktopAgent, documentation: string) => {
  it('(BasicIL1) Method is callable', async () => {
    const intentName = 'ConformanceListener';
    try {
      const listener = await fdc3.addIntentListener(intentName, (info: any) => {
        console.log(`Intent listener for intent ${intentName} triggered with result ${info}`);
      });
      expect(listener).to.have.property('unsubscribe').that.is.a('function');
      if (listener !== undefined) {
        listener.unsubscribe();
      }
    } catch (ex) {
      handleFail(documentation, ex);
    }
  });
};

let basicGI1 = (fdc3: DesktopAgent, documentation: string) => {
  console.log('coming here in');
  it('(BasicGI1) Returns ImplementationMetadata object', async () => {
    try {
      let info = await fdc3.getInfo();
      expect(info, documentation).to.have.property('fdc3Version');
      expect(info, documentation).to.have.property('provider');
    } catch (ex) {
      handleFail(documentation, ex);
    }
  });
};

let basicAC1 = (fdc3: DesktopAgent, documentation: string) => {
  it('(BasicAC1) Returns Channel object', async () => {
    try {
      const channel = await fdc3.getOrCreateChannel('FDC3Conformance');
      expect(channel, documentation).to.have.property('id');
      expect(channel, documentation).to.have.property('type');
      expect(channel, documentation).to.have.property('broadcast');
      expect(channel, documentation).to.have.property('getCurrentContext');
      expect(channel, documentation).to.have.property('addContextListener');
    } catch (ex) {
      handleFail(documentation, ex);
    }
  });
};

let basicUC1 = (fdc3: DesktopAgent, documentation: string) => {
  it('(BasicUC1) Channel object is valid', async () => {
    try {
      const channels = await fdc3.getUserChannels();
      expect(channels.length, documentation).to.be.greaterThan(0);
      expect(typeof channels).to.be.equals('object', documentation);
      for (let i = 0; i < channels.length; i++) {
        expect(channels[0]).to.have.property('type');
        expect(channels[0]).to.have.property('id');
      }
    } catch (ex) {
      handleFail(documentation, ex);
    }
  });
};

let basicJC1 = (fdc3: DesktopAgent, documentation: string) => {
  it("(BasicJC1) getCurrentChannel should retrieve 'null' or a channel object depending upon whether the channel has been joined or not", async () => {
    const channels = await fdc3.getUserChannels();
    if (channels.length > 0) {
      try {
        await fdc3.joinUserChannel(channels[0].id);
        const currentChannel = await fdc3.getCurrentChannel();
        if (typeof currentChannel !== 'object') {
          assert.fail('getCurrentChannel did not retrieve a channel object');
        }
        expect(currentChannel?.id).to.eql(channels[0].id);
        await fdc3.leaveCurrentChannel();
        const currentChannelAfterLeave = await fdc3.getCurrentChannel();
        expect(currentChannelAfterLeave).to.be.null;
      } catch (ex) {
        handleFail(documentation, ex);
      }
    } else {
      assert.fail('No system channels available');
    }
  });
};

let basicRI1 = (fdc3: DesktopAgent, documentation: string, intent: string, contextType: string) => {
  const basicRI1 =
    '(BasicRI1) application should be able to raise an intent by passing Intent name and gets a promise in return';
  it(basicRI1, async () => {
    try {
      await fdc3.raiseIntent(intent, { type: contextType });
    } catch (ex) {
      handleFail(documentation, ex);
    }
  });
};

let basicRI2 = (fdc3: DesktopAgent, documentation: string, contextType: string) => {
  const basicRI2 =
    '(BasicRI2) application should be able to raise an intent for some item by passing context and gets a promise in return';
  it(basicRI2, async () => {
    const context = {
      type: contextType,
    };

    try {
      await fdc3.raiseIntentForContext(context);
    } catch (ex) {
      handleFail(documentation, ex);
    }
  });
};

declare let fdc3: DesktopAgent;

const documentation_CL = '\r\nDocumentation: ' + APIDocumentation2_0.addContextListener + '\r\nCause';
const documentation_IL = '\r\nDocumentation: ' + APIDocumentation2_0.addIntentListener + '\r\nCause';
const documentation_GI = '\r\nDocumentation: ' + APIDocumentation2_0.getInfo + '\r\nCause';
const documentation_AC = '\r\nDocumentation: ' + APIDocumentation2_0.getOrCreateChannel + '\r\nCause';
const documentation_UC = '\r\nDocumentation: ' + APIDocumentation2_0.getUserChannels + '\r\nCause';
const documentation_JC = '\r\nDocumentation: ' + APIDocumentation2_0.getCurrentChannel + '\r\nCause';
const documentation_RI = '\r\nDocumentation: ' + APIDocumentation2_0.raiseIntentForContext + '\r\nCause';
const documentation_GA = '\r\nDocumentation: ' + APIDocumentation2_0.getAgent + '\r\nCause';

export let fdc3BasicGetAgent_2_2 = () => describe('fdc3.basicGetAgent_2.2', () => getAgent2_2(fdc3, documentation_GA));
export let fdc3BasicCL1_2_0 = () => describe('fdc3.basicCL1_2.0', () => basicCL1(fdc3, documentation_CL));
export let fdc3BasicCL2_2_0 = () => describe('fdc3.basicCL2_2.0', () => basicCL2(fdc3, documentation_CL));
export let fdc3BasicIL1_2_0 = () => describe('fdc3.basicIL1_2.0', () => basicIL1(fdc3, documentation_IL));
export let fdc3BasicGI1_2_0 = () => describe('fdc3.basicGI1_2.0', () => basicGI1(fdc3, documentation_GI));
export let fdc3BasicAC1_2_0 = () => describe('fdc3.basicAC1_2.0', () => basicAC1(fdc3, documentation_AC));
export let fdc3BasicUC1_2_0 = () => describe('fdc3.basicUC1_2.0', () => basicUC1(fdc3, documentation_UC));
export let fdc3BasicJC1_2_0 = () => describe('fdc3.basicJC1_2.0', () => basicJC1(fdc3, documentation_JC));

export let fdc3BasicRI1_2_0 = () =>
  describe('fdc3.basicRI1_2.0', () => {
    after(async function after() {
      await closeMockAppWindow(this.currentTest?.title ?? 'Unknown test');
    });
    basicRI1(fdc3, documentation_RI, Intent.aTestingIntent, ContextType.testContextX);
  });

export let fdc3BasicRI2_2_0 = () =>
  describe('fdc3.basicRI2_2.0', () => {
    after(async function after() {
      await closeMockAppWindow(this.currentTest?.title ?? 'Unknown test');
    });
    basicRI2(fdc3, documentation_RI, ContextType.testContextZ);
  });
