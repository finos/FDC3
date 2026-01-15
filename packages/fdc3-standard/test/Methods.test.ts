import { vi, beforeEach, afterAll, describe, test, expect } from 'vitest';
import { mock } from 'vitest-mock-extended';
import {
  addContextListener,
  addIntentListener,
  addEventListener,
  broadcast,
  compareVersionNumbers,
  ContextHandler,
  DesktopAgent,
  findIntent,
  findIntentsByContext,
  getCurrentChannel,
  getInfo,
  getAppMetadata,
  getOrCreateChannel,
  getUserChannels,
  getSystemChannels,
  ImplementationMetadata,
  joinChannel,
  joinUserChannel,
  leaveCurrentChannel,
  open,
  raiseIntent,
  raiseIntentForContext,
  versionIsAtLeast,
  createPrivateChannel,
  findInstances,
  isStandardContextType,
  isStandardIntent,
} from '../src/index.js';

const UnavailableError = new Error('FDC3 DesktopAgent not available at `window.fdc3`.');
const TimeoutError = new Error('Timed out waiting for `fdc3Ready` event.');
const UnexpectedError = new Error('`fdc3Ready` event fired, but `window.fdc3` not set to DesktopAgent.');

const ContactContext = {
  type: 'fdc3.contact',
  id: { email: 'test@example.com' },
};

expect.extend({
  toRejectWithUnavailableError(received) {
    expect(received).rejects.toEqual(UnavailableError);
    return { pass: true, message: () => '' };
  },
  toThrowUnavailableError(received) {
    expect(received).toThrowError(UnavailableError);
    return { pass: true, message: () => '' };
  },
});

beforeEach(() => {
  vi.resetAllMocks();
});

describe('test ES6 module', () => {
  describe('without `window.fdc3` global', () => {
    test('open (via name) should reject', async () => {
      await expect(open(expect.any(String))).rejects.toEqual(UnavailableError);
    });

    test('open (via AppIdentifier) should reject', async () => {
      await expect(open(expect.any(Object))).rejects.toEqual(UnavailableError);
    });

    test('findIntent should reject', async () => {
      await expect(findIntent(expect.any(String))).rejects.toEqual(UnavailableError);
    });

    test('findIntentsByContext should reject', async () => {
      await expect(findIntentsByContext(expect.any(Object))).rejects.toEqual(UnavailableError);
    });

    test('broadcast should reject', async () => {
      await expect(broadcast(expect.any(Object))).rejects.toEqual(UnavailableError);
    });

    test('raiseIntent should reject', async () => {
      await expect(raiseIntent(expect.any(String), expect.any(Object))).rejects.toEqual(UnavailableError);
    });

    test('raiseIntentForContext should reject', async () => {
      await expect(raiseIntentForContext(expect.any(Object))).rejects.toEqual(UnavailableError);
    });

    test('addIntentListener should reject', async () => {
      await expect(addIntentListener(expect.any(String), expect.any(Function))).rejects.toEqual(UnavailableError);
    });

    test('addContextListener should reject', async () => {
      await expect(addContextListener(expect.any(Object))).rejects.toEqual(UnavailableError);

      await expect(addContextListener(expect.any(String), expect.any(Object))).rejects.toEqual(UnavailableError);
    });

    test('getUserChannels should reject', async () => {
      await expect(getUserChannels()).rejects.toEqual(UnavailableError);
    });

    test('addEventListener should reject', async () => {
      await expect(addEventListener(expect.any(String), expect.any(Object))).rejects.toEqual(UnavailableError);
    });

    test('joinChannel should reject', async () => {
      await expect(joinChannel(expect.any(String))).rejects.toEqual(UnavailableError);
    });

    test('joinUserChannel should reject', async () => {
      await expect(joinUserChannel(expect.any(String))).rejects.toEqual(UnavailableError);
    });

    test('getOrCreateChannel should reject', async () => {
      await expect(getOrCreateChannel(expect.any(String))).rejects.toEqual(UnavailableError);
    });

    test('getCurrentChannel should reject', async () => {
      await expect(getCurrentChannel()).rejects.toEqual(UnavailableError);
    });

    test('leaveCurrentChannel should reject', async () => {
      await expect(leaveCurrentChannel()).rejects.toEqual(UnavailableError);
    });

    test('getInfo should reject', async () => {
      await expect(() => getInfo()).rejects.toEqual(UnavailableError);
    });

    test('createPrivateChannel should reject', async () => {
      await expect(() => createPrivateChannel()).rejects.toEqual(UnavailableError);
    });

    test('findInstances should reject', async () => {
      await expect(() => findInstances(expect.any(Object))).rejects.toEqual(UnavailableError);
    });

    test('getAppMetadata should reject', async () => {
      await expect(() => getAppMetadata(expect.any(Object))).rejects.toEqual(UnavailableError);
    });
  });

  describe('with `window.fdc3` global', () => {
    beforeEach(() => {
      window.fdc3 = mock<DesktopAgent>();
    });

    afterAll(() => {
      window.fdc3 = undefined as unknown as DesktopAgent;
    });

    test('open should delegate to window.fdc3?.open', async () => {
      const target = 'MyApp';

      await open(target, ContactContext);

      expect(window.fdc3?.open).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.open).toHaveBeenCalledWith(target, ContactContext);
    });

    test('findIntent should delegate to window.fdc3?.findIntent', async () => {
      const intent = 'ViewChart';

      await findIntent(intent, ContactContext);

      expect(window.fdc3?.findIntent).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.findIntent).toHaveBeenLastCalledWith(intent, ContactContext, undefined);
    });

    test('findIntent should delegate to window.fdc3?.findIntent (with additional output type argument)', async () => {
      const intent = 'ViewChart';

      await findIntent(intent, ContactContext, 'fdc3.contact');

      expect(window.fdc3?.findIntent).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.findIntent).toHaveBeenLastCalledWith(intent, ContactContext, 'fdc3.contact');
    });

    test('findIntentsByContext should delegate to window.fdc3?.findIntentsByContext', async () => {
      await findIntentsByContext(ContactContext);

      expect(window.fdc3?.findIntentsByContext).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.findIntentsByContext).toHaveBeenLastCalledWith(ContactContext, undefined);
    });

    test('findIntentsByContext should delegate to window.fdc3?.findIntentsByContext (with additional output type argument)', async () => {
      await findIntentsByContext(ContactContext, 'fdc3.contact');

      expect(window.fdc3?.findIntentsByContext).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.findIntentsByContext).toHaveBeenLastCalledWith(ContactContext, 'fdc3.contact');
    });

    test('broadcast should delegate to window.fdc3?.broadcast', async () => {
      await broadcast(ContactContext);

      expect(window.fdc3?.broadcast).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.broadcast).toHaveBeenCalledWith(ContactContext);
    });

    test('raiseIntent should delegate to window.fdc3?.raiseIntent', async () => {
      const intent = 'ViewChart';
      const target = 'MyApp';

      await raiseIntent(intent, ContactContext, target);

      expect(window.fdc3?.raiseIntent).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.raiseIntent).toHaveBeenCalledWith(intent, ContactContext, target);
    });

    test('raiseIntentForContext should delegate to window.fdc3?.raiseIntentForContext', async () => {
      const app = 'MyApp';

      await raiseIntentForContext(ContactContext, app);

      expect(window.fdc3?.raiseIntentForContext).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.raiseIntentForContext).toHaveBeenCalledWith(ContactContext, app);
    });

    test('addIntentListener should delegate to window.fdc3?.addIntentListener', async () => {
      const intent = 'ViewChart';
      const handler: ContextHandler = _ => {};

      await addIntentListener(intent, handler);

      expect(window.fdc3?.addIntentListener).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.addIntentListener).toHaveBeenCalledWith(intent, handler);
    });

    test('addContextListener should delegate to window.fdc3?.addContextListener', async () => {
      const type = 'fdc3.instrument';
      const handler1: ContextHandler = _ => {};
      const handler2: ContextHandler = _ => {};

      await addContextListener(type, handler1);
      await addContextListener(handler2);

      expect(window.fdc3?.addContextListener).toHaveBeenCalledTimes(2);
      expect(window.fdc3?.addContextListener).toHaveBeenNthCalledWith(1, type, handler1);
      expect(window.fdc3?.addContextListener).toHaveBeenNthCalledWith(2, null, handler2);
    });

    test('getUserChannels should delegate to window.fdc3?.getUserChannels', async () => {
      await getUserChannels();

      expect(window.fdc3?.getUserChannels).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.getUserChannels).toHaveBeenCalledWith();
    });

    test('getSystemChannels should delegate to window.fdc3?.getUserChannels', async () => {
      await getSystemChannels();

      expect(window.fdc3?.getUserChannels).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.getUserChannels).toHaveBeenCalledWith();
    });

    test('joinChannel should delegate to window.fdc3?.joinUserChannel', async () => {
      const channelId = 'channel';

      await joinChannel(channelId);

      expect(window.fdc3?.joinUserChannel).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.joinUserChannel).toHaveBeenCalledWith(channelId);
    });

    test('joinUserChannel should delegate to window.fdc3?.joinUserChannel', async () => {
      const channelId = 'channel';

      await joinUserChannel(channelId);

      expect(window.fdc3?.joinUserChannel).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.joinUserChannel).toHaveBeenCalledWith(channelId);
    });

    test('getOrCreateChannel should delegate to window.fdc3?.getOrCreateChannel', async () => {
      const channelId = 'channel';

      await getOrCreateChannel(channelId);

      expect(window.fdc3?.getOrCreateChannel).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.getOrCreateChannel).toHaveBeenCalledWith(channelId);
    });

    test('getCurrentChannel should delegate to window.fdc3?.getCurrentChannel', async () => {
      await getCurrentChannel();

      expect(window.fdc3?.getCurrentChannel).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.getCurrentChannel).toHaveBeenCalledWith();
    });

    test('leaveCurrentChannel should delegate to window.fdc3?.leaveCurrentChannel', async () => {
      await leaveCurrentChannel();

      expect(window.fdc3?.leaveCurrentChannel).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.leaveCurrentChannel).toHaveBeenCalledWith();
    });

    test('getInfo should delegate to window.fdc3?.getInfo', async () => {
      await getInfo();

      expect(window.fdc3?.getInfo).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.getInfo).toHaveBeenCalledWith();
    });

    test('getAppMetadata should delegate to window.fdc3?.getAppMetadata', async () => {
      const dummyApp = { appId: 'dummy' };
      await getAppMetadata(dummyApp);

      expect(window.fdc3?.getAppMetadata).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.getAppMetadata).toHaveBeenCalledWith(dummyApp);
    });

    test('createPrivateChannel should delegate to window.fdc3?.createPrivateChannel', async () => {
      await createPrivateChannel();

      expect(window.fdc3?.createPrivateChannel).toHaveBeenCalledTimes(1);
    });

    test('findInstances should delegate to window.fdc3?.findInstances', async () => {
      const dummyApp = { appId: 'dummy' };
      await findInstances(dummyApp);

      expect(window.fdc3?.findInstances).toHaveBeenCalledTimes(1);
      expect(window.fdc3?.findInstances).toHaveBeenCalledWith(dummyApp);
    });
  });
});

describe('test version comparison functions', () => {
  test('compareVersionNumbers', () => {
    expect(compareVersionNumbers('1.1', '1.2')).toBe(-1);
    expect(compareVersionNumbers('1.2', '1.1')).toBe(1);
    expect(compareVersionNumbers('1.2', '1.2')).toBe(0);
    expect(compareVersionNumbers('1.1.1', '1.2')).toBe(-1);
    expect(compareVersionNumbers('1.1.1', '1.1')).toBe(1);
    expect(compareVersionNumbers('1.1', '1.1.1')).toBe(-1);
    expect(compareVersionNumbers('1.1.1', '1.1.1')).toBe(0);
  });

  test('versionIsAtLeast', () => {
    const metaOneTwo: ImplementationMetadata = {
      fdc3Version: '1.2',
      provider: 'test',
      appMetadata: { appId: 'dummy', name: 'dummy' },
      optionalFeatures: {
        OriginatingAppMetadata: true,
        UserChannelMembershipAPIs: false,
        DesktopAgentBridging: false,
      },
    };
    expect(versionIsAtLeast(metaOneTwo, '1.1')).toBe(true);
    expect(versionIsAtLeast(metaOneTwo, '1.2')).toBe(true);
    expect(versionIsAtLeast(metaOneTwo, '1.2.1')).toBe(false);
    expect(versionIsAtLeast(metaOneTwo, '2.0')).toBe(false);

    const metaOneTwoOne: ImplementationMetadata = {
      fdc3Version: '1.2.1',
      provider: 'test',
      appMetadata: { appId: 'dummy', name: 'dummy' },
      optionalFeatures: {
        OriginatingAppMetadata: true,
        UserChannelMembershipAPIs: false,
        DesktopAgentBridging: false,
      },
    };
    expect(versionIsAtLeast(metaOneTwoOne, '1.1')).toBe(true);
    expect(versionIsAtLeast(metaOneTwoOne, '1.2')).toBe(true);
    expect(versionIsAtLeast(metaOneTwoOne, '1.2.1')).toBe(true);
    expect(versionIsAtLeast(metaOneTwoOne, '2.0')).toBe(false);
  });

  test('isStandardContextType should return TRUE for standard context types', () => {
    expect(isStandardContextType('fdc3.action')).toBe(true);
    expect(isStandardContextType('fdc3.chart')).toBe(true);
    expect(isStandardContextType('fdc3.chat.initSettings')).toBe(true);
    expect(isStandardContextType('fdc3.chat.message')).toBe(true);
    expect(isStandardContextType('fdc3.chat.room')).toBe(true);
    expect(isStandardContextType('fdc3.chat.searchCriteria')).toBe(true);
    expect(isStandardContextType('fdc3.contact')).toBe(true);
    expect(isStandardContextType('fdc3.contactList')).toBe(true);
    expect(isStandardContextType('fdc3.country')).toBe(true);
    expect(isStandardContextType('fdc3.currency')).toBe(true);
    expect(isStandardContextType('fdc3.email')).toBe(true);
    expect(isStandardContextType('fdc3.instrument')).toBe(true);
    expect(isStandardContextType('fdc3.instrumentList')).toBe(true);
    expect(isStandardContextType('fdc3.interaction')).toBe(true);
    expect(isStandardContextType('fdc3.message')).toBe(true);
    expect(isStandardContextType('fdc3.organization')).toBe(true);
    expect(isStandardContextType('fdc3.portfolio')).toBe(true);
    expect(isStandardContextType('fdc3.position')).toBe(true);
    expect(isStandardContextType('fdc3.nothing')).toBe(true);
    expect(isStandardContextType('fdc3.timeRange')).toBe(true);
    expect(isStandardContextType('fdc3.transactionResult')).toBe(true);
    expect(isStandardContextType('fdc3.valuation')).toBe(true);
  });

  test('isStandardContextType should return FALSE for custom context types', () => {
    expect(isStandardContextType('myApp.customContext')).toBe(false);
  });

  test('isStandardIntent should return TRUE for standard intents', () => {
    expect(isStandardIntent('CreateInteraction')).toBe(true);
    expect(isStandardIntent('SendChatMessage')).toBe(true);
    expect(isStandardIntent('StartCall')).toBe(true);
    expect(isStandardIntent('StartChat')).toBe(true);
    expect(isStandardIntent('StartEmail')).toBe(true);
    expect(isStandardIntent('ViewAnalysis')).toBe(true);
    expect(isStandardIntent('ViewChat')).toBe(true);
    expect(isStandardIntent('ViewChart')).toBe(true);
    expect(isStandardIntent('ViewContact')).toBe(true);
    expect(isStandardIntent('ViewHoldings')).toBe(true);
    expect(isStandardIntent('ViewInstrument')).toBe(true);
    expect(isStandardIntent('ViewInteractions')).toBe(true);
    expect(isStandardIntent('ViewMessages')).toBe(true);
    expect(isStandardIntent('ViewNews')).toBe(true);
    expect(isStandardIntent('ViewOrders')).toBe(true);
    expect(isStandardIntent('ViewProfile')).toBe(true);
    expect(isStandardIntent('ViewQuote')).toBe(true);
    expect(isStandardIntent('ViewResearch')).toBe(true);
  });

  test('isStandardIntent should return FALSE for custom intents', () => {
    expect(isStandardIntent('myApp.CustomIntent')).toBe(false);
  });
});
