import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { throwIfUndefined } from '../../src/util/throwIfUndefined';
import { AgentResponseMessage } from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { OpenError } from '@finos/fdc3-standard';
import expect from 'expect';
import { Logger } from '../../src/util/Logger';

When('I call throwIfUndefined it throws if a specified property is not defined', async function (this: CustomWorld) {
  let thrown: Error | null = null;
  const someObject: Record<string, string> = { someProperty: 'value' };
  const dummyMessage: AgentResponseMessage = {
    type: 'broadcastResponse',
    meta: {
      requestUuid: '123',
      responseUuid: '456',
      timestamp: new Date(),
    },
    payload: {},
  };
  try {
    throwIfUndefined(
      someObject.nonExistent,
      'Deliberately undefined prop did not exist ;-)',
      dummyMessage,
      OpenError.MalformedContext
    );
  } catch (e) {
    thrown = e as Error;
  }

  expect(thrown).not.toBeNull();
  //should be an error object, with the message we passed in
  expect(thrown?.message).toEqual(OpenError.MalformedContext);
});

When(
  'I call throwIfUndefined it does NOT throw if a specified property IS defined',
  async function (this: CustomWorld) {
    let thrown: Error | null = null;
    const someObject: Record<string, string> = { someProperty: 'value' };
    const dummyMessage: AgentResponseMessage = {
      type: 'broadcastResponse',
      meta: {
        requestUuid: '123',
        responseUuid: '456',
        timestamp: new Date(),
      },
      payload: {},
    };
    try {
      throwIfUndefined(
        someObject.someProperty,
        'Deliberately undefined prop did not exist ;-)',
        dummyMessage,
        OpenError.MalformedContext
      );
    } catch (e) {
      thrown = e as Error;
    }

    expect(thrown).toBeNull();
  }
);

const TEST_ERROR = 'Test error - This is expected on the console';

When('All log functions are used with a message', async function (this: CustomWorld) {
  Logger.enableDebugLogs(true);
  Logger.enableHeartbeatLogs(true);
  Logger.debug('Debug msg');
  Logger.heartbeatLog('Heartbeat debug msg');
  Logger.log('Log msg');
  Logger.warn('Warning msg');
  Logger.error('Error msg');
});

When('All log functions are used with an error', async function (this: CustomWorld) {
  Logger.enableDebugLogs(true);
  Logger.enableHeartbeatLogs(true);
  Logger.debug('debug-level error: ', new Error(TEST_ERROR));
  Logger.heartbeatLog('heartbeat debug-level error: ', new Error(TEST_ERROR));
  Logger.log('log-level error: ', new Error(TEST_ERROR));
  Logger.warn('warn-level error: ', new Error(TEST_ERROR));
  Logger.error('error-level error: ', new Error(TEST_ERROR));
});
