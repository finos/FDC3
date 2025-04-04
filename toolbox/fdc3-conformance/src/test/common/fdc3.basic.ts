import { assert, expect } from 'chai';
import { InfoControl } from './control/info-control';
import { ChannelControl } from './control/channel-control';

export let basicCL1 = (fdc3: any, documentation: string, listener: any) => {
  it('(BasicCL1) Method is callable', async () => {
    const contextType = 'fdc3.contact';
    try {
      listener = await fdc3.addContextListener(contextType, (info: any) => {
        console.log(`Context listener of type ${contextType} triggered with result ${info}`);
      });
      assert.isTrue(listener && typeof listener === 'object', documentation);
      expect(
        typeof listener.unsubscribe,
        'the listener did not contain an unsubscribe function' + documentation
      ).to.be.equals('function');
      if (listener !== undefined) {
        listener.unsubscribe();
        listener = undefined;
      }
    } catch (ex) {
      assert.fail(documentation + (ex.message ?? ex));
    }
  });
};

export let basicCL2 = (fdc3: any, documentation: string, listener: any) => {
  it('(BasicCL2) Returns listener object', async () => {
    try {
      listener = await fdc3.addContextListener(null, () => {});
      assert.isTrue(listener && typeof listener === 'object', documentation);
      expect(typeof listener.unsubscribe, documentation).to.be.equals('function');
      if (listener !== undefined) {
        listener.unsubscribe();
        listener = undefined;
      }
    } catch (ex) {
      assert.fail(documentation + (ex.message ?? ex));
    }
  });
};

export let basicIL1 = (fdc3: any, documentation: string, listener: any) => {
  it('(BasicIL1) Method is callable', async () => {
    const intentName = 'ConformanceListener';
    try {
      listener = await fdc3.addIntentListener(intentName, (info: any) => {
        console.log(`Intent listener for intent ${intentName} triggered with result ${info}`);
      });
      expect(listener).to.have.property('unsubscribe').that.is.a('function');
      if (listener !== undefined) {
        listener.unsubscribe();
        listener = undefined;
      }
    } catch (ex) {
      assert.fail('\r\nDocumentation: ' + documentation + '\r\nCause' + (ex.message ?? ex));
    }
  });
};

export let basicGI1 = (control: InfoControl<any>, documentation: string) => {
  console.log('coming here in');
  it('(BasicGI1) Returns ImplementationMetadata object', async () => {
    try {
      let info = await control.getInfo();
      expect(info, documentation).to.have.property('fdc3Version');
      expect(info, documentation).to.have.property('provider');
    } catch (ex) {
      assert.fail(documentation + (ex.message ?? ex));
    }
  });
};

export let basicAC1 = (fdc3: any, documentation: string) => {
  it('(BasicAC1) Returns Channel object', async () => {
    try {
      const channel = await fdc3.getOrCreateChannel('FDC3Conformance');
      expect(channel, documentation).to.have.property('id');
      expect(channel, documentation).to.have.property('type');
      expect(channel, documentation).to.have.property('broadcast');
      expect(channel, documentation).to.have.property('getCurrentContext');
      expect(channel, documentation).to.have.property('addContextListener');
    } catch (ex) {
      assert.fail(documentation + (ex.message ?? ex));
    }
  });
};

export let basicUC1 = (control: InfoControl<any>, documentation: string) => {
  it('(BasicUC1) Channel object is valid', async () => {
    try {
      const channels = await control.getUserChannels();
      expect(channels.length, documentation).to.be.greaterThan(0);
      expect(typeof channels).to.be.equals('object', documentation);
      for (let i = 0; i < channels.length; i++) {
        expect(channels[0]).to.have.property('type');
        expect(channels[0]).to.have.property('id');
      }
    } catch (ex) {
      assert.fail(documentation + (ex.message ?? ex));
    }
  });
};

export let basicJC1 = (control: ChannelControl<any, any, any>, fdc3: any, documentation: string) => {
  it("(BasicJC1) getCurrentChannel should retrieve 'null' or a channel object depending upon whether the channel has been joined or not", async () => {
    const channels = await fdc3.getSystemChannels();
    if (channels.length > 0) {
      try {
        await control.joinChannel(channels[0]);
        const currentChannel = await control.getCurrentChannel();
        if (typeof currentChannel !== 'object') {
          assert.fail('getCurrentChannel did not retrieve a channel object');
        }
        expect(currentChannel.id).to.eql(channels[0].id);
        await control.leaveChannel();
        const currentChannelAfterLeave = await control.getCurrentChannel();
        expect(currentChannelAfterLeave).to.be.null;
      } catch (ex) {
        assert.fail(documentation + (ex.message ?? ex));
      }
    } else {
      assert.fail('No system channels available');
    }
  });
};

export let basicRI1 = (fdc3: any, documentation: string, intent: string, contextType: string) => {
  const basicRI1 =
    '(BasicRI1) application should be able to raise an intent by passing Intent name and gets a promise in return';
  it(basicRI1, async () => {
    try {
      await fdc3.raiseIntent(intent, { type: contextType });
    } catch (ex) {
      assert.fail(documentation + (ex.message ?? ex));
    }
  });
};

export let basicRI2 = (fdc3: any, documentation: string, contextType: string) => {
  const basicRI2 =
    '(BasicRI2) application should be able to raise an intent for some item by passing context and gets a promise in return';
  it(basicRI2, async () => {
    const context = {
      type: contextType,
    };

    try {
      await fdc3.raiseIntentForContext(context);
    } catch (ex) {
      assert.fail(documentation + (ex.message ?? ex));
    }
  });
};
