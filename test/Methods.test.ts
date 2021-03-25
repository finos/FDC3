import {
  addContextListener,
  addIntentListener,
  broadcast,
  ContextHandler,
  ContextTypes,
  DesktopAgent,
  findIntent,
  findIntentsByContext,
  getCurrentChannel,
  getOrCreateChannel,
  getSystemChannels,
  joinChannel,
  leaveCurrentChannel,
  open,
  raiseIntent,
  raiseIntentForContext,
  ImplementationMetadata,
} from '../src';
import * as methods from '../src/api/Methods';

declare global {
  namespace jest {
    interface Matchers<R> {
      toRejectWithUnavailableError: () => CustomMatcherResult;
      toThrowUnavailableError: () => CustomMatcherResult;
    }
  }
}

const UnavailableError = new Error(
  'FDC3 DesktopAgent not available at `window.fdc3`.'
);

const ContactContext = {
  type: ContextTypes.Contact,
  id: { email: 'test@example.com' },
};

expect.extend({
  toRejectWithUnavailableError(received) {
    expect(received).rejects.toEqual(UnavailableError);
    return { pass: true } as jest.CustomMatcherResult;
  },
  toThrowUnavailableError(received) {
    expect(received).toThrowError(UnavailableError);
    return { pass: true } as jest.CustomMatcherResult;
  },
});

describe('test ES6 module', () => {
  describe('without `window.fdc3` global', () => {
    let originalFdc3: DesktopAgent;
    beforeAll(() => {
      originalFdc3 = window.fdc3;
      window.fdc3 = (undefined as unknown) as DesktopAgent;
    });

    afterAll(() => {
      window.fdc3 = originalFdc3;
    });

    test('open should reject', () => {
      expect(open(expect.any(String))).toRejectWithUnavailableError();
    });

    test('findIntent should reject', () => {
      expect(findIntent(expect.any(String))).toRejectWithUnavailableError();
    });

    test('findIntentsByContext should reject', () => {
      expect(
        findIntentsByContext(expect.any(Object))
      ).toRejectWithUnavailableError();
    });

    test('broadcast should throw', () => {
      expect(() => broadcast(expect.any(Object))).toThrowUnavailableError();
    });

    test('raiseIntent should reject', () => {
      expect(
        raiseIntent(expect.any(String), expect.any(Object))
      ).toRejectWithUnavailableError();
    });

    test('raiseIntentForContext should reject', () => {
      expect(
        raiseIntentForContext(expect.any(Object))
      ).toRejectWithUnavailableError();
    });

    test('addIntentListener should throw', () => {
      expect(() =>
        addIntentListener(expect.any(String), expect.any(Function))
      ).toThrowUnavailableError();
    });

    test('addContextListener should throw', () => {
      expect(() =>
        addContextListener(expect.any(Object))
      ).toThrowUnavailableError();

      expect(() =>
        addContextListener(expect.any(String), expect.any(Object))
      ).toThrowUnavailableError();
    });

    test('getSystemChannels should reject', () => {
      expect(getSystemChannels()).toRejectWithUnavailableError();
    });

    test('joinChannel should reject', () => {
      expect(joinChannel(expect.any(String))).toRejectWithUnavailableError();
    });

    test('getOrCreateChannel should reject', () => {
      expect(
        getOrCreateChannel(expect.any(String))
      ).toRejectWithUnavailableError();
    });

    test('getCurrentChannel should reject', () => {
      expect(getCurrentChannel()).toRejectWithUnavailableError();
    });
  });

  describe('with `window.fdc3` global', () => {
    const mocks: Map<string, jest.Mock<any, any>> = new Map();
    const getMock: (name: string) => jest.Mock<any, any> = name => {
      const mock = mocks.get(name);
      if (!mock) {
        throw new Error('No mock named ' + name);
      }
      return mock;
    };

    beforeAll(() => {
      const fdc3 = {};

      for (const method of Object.keys(methods)) {
        const mock = jest.fn();
        mocks.set(method, mock);
        Object.defineProperty(fdc3, method, { value: mock });
      }

      window.fdc3 = fdc3 as DesktopAgent;
    });

    it('open should delegate to window.fdc3.open', () => {
      const app = 'MyApp';

      open(app, ContactContext);

      const mock = getMock('open');
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls[0]).toEqual([app, ContactContext]);
    });

    it('findIntent should delegate to window.fdc3.findIntent', () => {
      const intent = 'ViewChat';

      findIntent(intent, ContactContext);

      const mock = getMock('findIntent');
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls[0]).toEqual([intent, ContactContext]);
    });

    it('findIntentsByContext should delegate to window.fdc3.findIntentsByContext', () => {
      findIntentsByContext(ContactContext);

      const mock = getMock('findIntentsByContext');
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls[0]).toEqual([ContactContext]);
    });

    it('broadcast should delegate to window.fdc3.broadcast', () => {
      broadcast(ContactContext);

      const mock = getMock('broadcast');
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls[0]).toEqual([ContactContext]);
    });

    it('raiseIntent should delegate to window.fdc3.raiseIntent', () => {
      const intent = 'ViewChat';
      const target = 'MyApp';

      raiseIntent(intent, ContactContext, target);

      const mock = getMock('raiseIntent');
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls[0]).toEqual([intent, ContactContext, target]);
    });

    it('raiseIntentForContext should delegate to window.fdc3.raiseIntentForContext', () => {
      const app = 'MyApp';

      raiseIntentForContext(ContactContext, app);

      const mock = getMock('raiseIntentForContext');
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls[0]).toEqual([ContactContext, app]);
    });

    it('addIntentListener should delegate to window.fdc3.addIntentListener', () => {
      const intent = 'ViewChat';
      const handler: ContextHandler = _ => {};

      addIntentListener(intent, handler);

      const mock = getMock('addIntentListener');
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls[0]).toEqual([intent, handler]);
    });

    it('addContextListener should delegate to window.fdc3.addContextListener', () => {
      const type = 'fdc3.instrument';
      const handler1: ContextHandler = _ => {};
      const handler2: ContextHandler = _ => {};

      addContextListener(type, handler1);
      addContextListener(handler2);

      const mock = getMock('addContextListener');
      expect(mock.mock.calls.length).toBe(2);
      expect(mock.mock.calls[0]).toEqual([type, handler1]);
      expect(mock.mock.calls[1]).toEqual([handler2]);
    });

    it('getSystemChannels should delegate to window.fdc3.getSystemChannels', () => {
      getSystemChannels();

      const mock = getMock('getSystemChannels');
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls[0]).toEqual([]);
    });

    it('joinChannel should delegate to window.fdc3.joinChannel', () => {
      const channelId = 'channel';

      joinChannel(channelId);

      const mock = getMock('joinChannel');
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls[0]).toEqual([channelId]);
    });

    it('getOrCreateChannel should delegate to window.fdc3.getOrCreateChannel', () => {
      const channelId = 'channel';

      getOrCreateChannel(channelId);

      const mock = getMock('getOrCreateChannel');
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls[0]).toEqual([channelId]);
    });

    it('getCurrentChannel should delegate to window.fdc3.getCurrentChannel', () => {
      getCurrentChannel();

      const mock = getMock('getCurrentChannel');
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls[0]).toEqual([]);
    });

    it('leaveCurrentChannel should delegate to window.fdc3.leaveCurrentChannel', () => {
      leaveCurrentChannel();

      const mock = getMock('leaveCurrentChannel');
      expect(mock.mock.calls.length).toBe(1);
      expect(mock.mock.calls[0]).toEqual([]);
    });
  });
});

describe('test version comparison functions', () => {
  test('compareVersionNumbers', () => {
    expect(methods.compareVersionNumbers('1.1', '1.2')).toBe(-1);
    expect(methods.compareVersionNumbers('1.2', '1.1')).toBe(1);
    expect(methods.compareVersionNumbers('1.2', '1.2')).toBe(0);
    expect(methods.compareVersionNumbers('1.1.1', '1.2')).toBe(-1);
    expect(methods.compareVersionNumbers('1.1.1', '1.1')).toBe(1);
    expect(methods.compareVersionNumbers('1.1', '1.1.1')).toBe(-1);
    expect(methods.compareVersionNumbers('1.1.1', '1.1.1')).toBe(0);
  });

  test('versionIsAtLeast', () => {
    const metaOneTwo: ImplementationMetadata = {
      fdc3Version: '1.2',
      provider: 'test',
    };
    expect(methods.versionIsAtLeast(metaOneTwo, '1.1')).toBe(true);
    expect(methods.versionIsAtLeast(metaOneTwo, '1.2')).toBe(true);
    expect(methods.versionIsAtLeast(metaOneTwo, '1.2.1')).toBe(false);
    expect(methods.versionIsAtLeast(metaOneTwo, '2.0')).toBe(false);

    const metaOneTwoOne: ImplementationMetadata = {
      fdc3Version: '1.2.1',
      provider: 'test',
    };
    expect(methods.versionIsAtLeast(metaOneTwoOne, '1.1')).toBe(true);
    expect(methods.versionIsAtLeast(metaOneTwoOne, '1.2')).toBe(true);
    expect(methods.versionIsAtLeast(metaOneTwoOne, '1.2.1')).toBe(true);
    expect(methods.versionIsAtLeast(metaOneTwoOne, '2.0')).toBe(false);
  });
});
