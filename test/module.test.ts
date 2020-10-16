import { broadcast, ContextTypes, DesktopAgent } from '../src';

describe('test ES6 module', () => {
  let mockBroadcast: jest.Mock<any, any>;

  beforeAll(() => {
    window.fdc3 = {} as DesktopAgent;
    mockBroadcast = jest.fn();
    window.fdc3.broadcast = mockBroadcast;
  });

  it('broadcast should delegate to window.fdc3.broadcast', () => {
    const context = {
      type: ContextTypes.Contact,
      id: { email: 'test@example.com' },
    };
    broadcast(context);
    expect(mockBroadcast.mock.calls.length).toBe(1);
    expect(mockBroadcast.mock.calls[0]).toEqual([context]);
  });
});
