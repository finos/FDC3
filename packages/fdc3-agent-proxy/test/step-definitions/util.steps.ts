import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { throwIfUndefined } from '../../src/util';
import { AgentResponseMessage } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';
import { OpenError } from '@finos/fdc3-standard';
import expect from 'expect';

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
