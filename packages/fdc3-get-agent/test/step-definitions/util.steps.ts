import { After, Given, Then, When } from 'quickpickle';
import { CustomWorld } from '../world/index.js';
import { expect } from 'vitest';
import { Logger } from '../../src/util/Logger.js';
import { createUUID } from '../../src/util/Uuid.js';
import { HelloHandler } from '../../src/strategies/HelloHandler.js';

const TEST_ERROR = 'Test error - This is expected on the console';
const CONSOLE_METHODS = ['debug', 'log', 'warn', 'error'] as const;

type ConsoleMethod = (typeof CONSOLE_METHODS)[number];
type ConsoleCapture = {
  original: Record<ConsoleMethod, (...data: unknown[]) => void>;
  calls: Record<ConsoleMethod, unknown[][]>;
};

function getConsoleCapture(world: CustomWorld): ConsoleCapture {
  const capture = world.props['consoleCapture'] as ConsoleCapture | undefined;
  expect(capture).toBeDefined();
  return capture!;
}

function restoreConsoleCapture(world: CustomWorld) {
  const capture = world.props['consoleCapture'] as ConsoleCapture | undefined;
  if (!capture) {
    return;
  }

  for (const method of CONSOLE_METHODS) {
    console[method] = capture.original[method] as (typeof console)[typeof method];
  }
  delete world.props['consoleCapture'];
}

function stringifyConsoleCalls(calls: unknown[][]): string {
  return calls
    .map(args =>
      args
        .map(arg => {
          if (typeof arg === 'string') {
            return arg;
          }
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        })
        .join(' ')
    )
    .join('\n');
}

Given('console output is captured', async (world: CustomWorld) => {
  restoreConsoleCapture(world);

  const capture: ConsoleCapture = {
    original: {
      debug: console.debug,
      log: console.log,
      warn: console.warn,
      error: console.error,
    },
    calls: {
      debug: [],
      log: [],
      warn: [],
      error: [],
    },
  };

  for (const method of CONSOLE_METHODS) {
    console[method] = ((...args: unknown[]) => {
      capture.calls[method].push(args);
    }) as (typeof console)[typeof method];
  }

  world.props['consoleCapture'] = capture;
});

After((world: CustomWorld) => {
  restoreConsoleCapture(world);
});

When('All log functions are used with a message', async (world: CustomWorld) => {
  Logger.debug('Debug msg');
  Logger.log('Log msg');
  Logger.warn('Warning msg');
  Logger.error('Error msg');
});

When('All log functions are used with an error', async (world: CustomWorld) => {
  Logger.debug('debug-level error: ', new Error(TEST_ERROR));
  Logger.log('log-level error: ', new Error(TEST_ERROR));
  Logger.warn('warn-level error: ', new Error(TEST_ERROR));
  Logger.error('error-level error: ', new Error(TEST_ERROR));
});

When('A uuid is generated', async (world: CustomWorld) => {
  return createUUID();
});

When(
  'a HelloHandler for connection attempt {string} receives unrelated postMessage traffic',
  async (_world: CustomWorld, connectionUuid: string) => {
    const handler = new HelloHandler({}, connectionUuid);
    handler.listenForHelloResponses();

    globalThis.window.dispatchEvent({
      type: 'message',
      data: {
        id: 'fdsMetadata',
        type: 'READY_CONFIRMATION',
        name: 'containerChain',
      },
    } as unknown as MessageEvent);

    handler.cancel();
  }
);

When(
  'a HelloHandler for connection attempt {string} receives WCP messages for other connection attempts',
  async (_world: CustomWorld, connectionUuid: string) => {
    const handler = new HelloHandler({}, connectionUuid);
    handler.listenForHelloResponses();

    const messages = [
      {
        type: 'WCP2LoadUrl',
        meta: {
          connectionAttemptUuid: 'wcp2-other-connection-uuid',
          timestamp: new Date(),
        },
        payload: {
          iframeUrl: 'https://example.com/desktop-agent',
        },
      },
      {
        type: 'WCP3Handshake',
        meta: {
          connectionAttemptUuid: 'wcp3-other-connection-uuid',
          timestamp: new Date(),
        },
        payload: {
          fdc3Version: '2.2',
          intentResolverUrl: true,
          channelSelectorUrl: true,
        },
      },
    ];

    for (const data of messages) {
      globalThis.window.dispatchEvent({ type: 'message', data } as unknown as MessageEvent);
    }

    handler.cancel();
  }
);

Then(
  'captured console {word} output should contain {string}',
  async (world: CustomWorld, method: ConsoleMethod, text: string) => {
    const capture = getConsoleCapture(world);
    expect(stringifyConsoleCalls(capture.calls[method])).toContain(text);
  }
);

Then(
  'captured console {word} output should not contain {string}',
  async (world: CustomWorld, method: ConsoleMethod, text: string) => {
    const capture = getConsoleCapture(world);
    expect(stringifyConsoleCalls(capture.calls[method])).not.toContain(text);
  }
);
