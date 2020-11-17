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
} from '../src';
import * as methods from '../src/api/methods';

describe('test ES6 module', () => {
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
    const name = 'MyApp';
    const context = {
      type: ContextTypes.Contact,
      id: { email: 'test@example.com' },
    };

    open(name, context);

    const mock = getMock('open');
    expect(mock.mock.calls.length).toBe(1);
    expect(mock.mock.calls[0]).toEqual([name, context]);
  });

  it('findIntent should delegate to window.fdc3.findIntent', () => {
    const intent = 'ViewChat';
    const context = {
      type: ContextTypes.Contact,
      id: { email: 'test@example.com' },
    };

    findIntent(intent, context);

    const mock = getMock('findIntent');
    expect(mock.mock.calls.length).toBe(1);
    expect(mock.mock.calls[0]).toEqual([intent, context]);
  });

  it('findIntentsByContext should delegate to window.fdc3.findIntentsByContext', () => {
    const context = {
      type: ContextTypes.Contact,
      id: { email: 'test@example.com' },
    };

    findIntentsByContext(context);

    const mock = getMock('findIntentsByContext');
    expect(mock.mock.calls.length).toBe(1);
    expect(mock.mock.calls[0]).toEqual([context]);
  });

  it('broadcast should delegate to window.fdc3.broadcast', () => {
    const context = {
      type: ContextTypes.Contact,
      id: { email: 'test@example.com' },
    };

    broadcast(context);

    const mock = getMock('broadcast');
    expect(mock.mock.calls.length).toBe(1);
    expect(mock.mock.calls[0]).toEqual([context]);
  });

  it('raiseIntent should delegate to window.fdc3.raiseIntent', () => {
    const intent = 'ViewChat';
    const context = {
      type: ContextTypes.Contact,
      id: { email: 'test@example.com' },
    };
    const target = 'MyApp';

    raiseIntent(intent, context, target);

    const mock = getMock('raiseIntent');
    expect(mock.mock.calls.length).toBe(1);
    expect(mock.mock.calls[0]).toEqual([intent, context, target]);
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
