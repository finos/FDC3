import { Given, When } from 'quickpickle';
import { CustomWorld } from '../world/index.js';
import { handleResolve } from '@finos/cucumber-testing-steps';
import { parseAntiReplayClaims } from '@finos/fdc3-schema/test/parseAntiReplayClaims.js';
import { Context } from '@finos/fdc3-context';
import { ContextMetadata, ResolveError } from '@finos/fdc3-standard';
import { IntentEvent } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

Given('app {string}', (world: CustomWorld, appStr: string) => {
  const [appId, instanceId] = appStr.split('/');
  const app = { appId, instanceId };
  world.messaging?.addAppIntentDetail({
    app,
  });
  world.props[instanceId] = app;
});

Given('{string} is app identifier {string}', (world: CustomWorld, field: string, appId: string) => {
  world.props[field] = { appId };
});

Given('app {string} resolves intent {string}', (world: CustomWorld, appStr: string, intent: string) => {
  const [appId, instanceId] = appStr.split('/');
  const app = { appId, instanceId };
  world.messaging?.addAppIntentDetail({
    app,
    intent,
  });
  world.props[instanceId] = app;
  world.props[appId] = {
    appId,
  };
});

Given(
  'app {string} resolves intent {string} with result type {string}',
  (world: CustomWorld, appStr: string, intent: string, resultType: string) => {
    const [appId, instanceId] = appStr.split('/');
    const app = { appId, instanceId };
    world.messaging?.addAppIntentDetail({
      app,
      intent,
      resultType,
    });
    world.props[instanceId] = app;
    world.props[appId] = {
      appId,
    };
  }
);

Given(
  'app {string} resolves intent {string} with context {string}',
  (world: CustomWorld, appStr: string, intent: string, context: string) => {
    const [appId, instanceId] = appStr.split('/');
    const app = { appId, instanceId };
    world.messaging?.addAppIntentDetail({
      app,
      intent,
      context,
    });
    world.props[instanceId] = app;
    world.props[appId] = {
      appId,
    };
  }
);

Given(
  'app {string} resolves intent {string} with context {string} and result type {string}',
  (world: CustomWorld, appStr: string, intent: string, context: string, resultType: string) => {
    const [appId, instanceId] = appStr.split('/');
    const app = { appId, instanceId };
    world.messaging?.addAppIntentDetail({
      app,
      intent,
      context,
      resultType,
    });
    world.props[instanceId] = app;
  }
);

Given('Raise Intent returns a context of {string}', (world: CustomWorld, result: string) => {
  world.messaging?.setIntentResult({
    context: handleResolve(result, world),
  });
});

Given(
  'Raise Intent returns a context of {string} with traceId {string} and signature {string} and antiReplay claims {string}',
  (world: CustomWorld, result: string, traceId: string, signature: string, antiReplayClaims: string) => {
    world.messaging?.setIntentResult({
      context: handleResolve(result, world),
      resultMetadata: {
        source: { appId: 'some-app', instanceId: 'abc123' },
        timestamp: new Date('2024-01-01T00:00:00Z'),
        traceId,
        signature: {
          protected: signature + ' (protected part)',
          signature: signature + ' (signature part)',
        },
        antiReplay: parseAntiReplayClaims(antiReplayClaims),
        custom: { priority: 'high' },
      },
    });
  }
);

Given('Raise Intent will throw a {string} error', (world: CustomWorld, error: ResolveError) => {
  world.messaging?.setIntentResult({
    error,
  });
});

Given('Raise Intent returns no result', (world: CustomWorld) => {
  world.messaging?.setIntentResult({});
});

Given('Raise Intent times out', (world: CustomWorld) => {
  world.messaging?.setIntentResult({
    timeout: true,
  });
});

Given('Raise Intent returns an app channel', (world: CustomWorld) => {
  world.messaging?.setIntentResult({
    channel: {
      type: 'app',
      id: 'result-channel',
      displayMetadata: {
        color: 'purple',
        name: 'Result Channel',
      },
    },
  });
});

Given('Raise Intent returns a user channel', (world: CustomWorld) => {
  world.messaging?.setIntentResult({
    channel: {
      type: 'user',
      id: 'result-channel',
      displayMetadata: {
        color: 'purple',
        name: 'Result Channel',
      },
    },
  });
});

Given('Raise Intent returns a private channel', (world: CustomWorld) => {
  world.messaging?.setIntentResult({
    channel: {
      type: 'private',
      id: 'result-channel',
      displayMetadata: {
        color: 'purple',
        name: 'Result Channel',
      },
    },
  });
});

Given(
  '{string} is a intentEvent message with intent {string} and context {string}',
  (world: CustomWorld, field: string, intent: string, context: string) => {
    const msg: IntentEvent = {
      type: 'intentEvent',
      meta: {
        eventUuid: world.messaging!.createUUID(),
        timestamp: new Date(),
      },
      payload: {
        context: handleResolve(context, world),
        intent,
        raiseIntentRequestUuid: 'request-id',
        metadata: {
          timestamp: new Date(),
          source: world.messaging!.getAppIdentifier(),
          traceId: world.messaging!.createUUID(),
        },
      },
    };

    world.props[field] = msg;
  }
);

Given('{string} pipes intent to {string}', (world: CustomWorld, intentHandlerName: string, field: string) => {
  world.props[field] = [];
  world.props[intentHandlerName] = (context: Context, metadata: ContextMetadata) => {
    world.props[field].push({
      context,
      metadata,
    });
  };
});

Given('{string} returns a context item', (world: CustomWorld, intentHandlerName: string) => {
  world.props[intentHandlerName] = async () => {
    return {
      type: 'fdc3.returned-intent',
      id: {
        in: 'one',
        out: 'two',
      },
    };
  };
});

Given('{string} returns a channel', (world: CustomWorld, intentHandlerName: string) => {
  world.props[intentHandlerName] = async () => {
    return {
      type: 'private',
      id: 'some-channel-id',
      displayMetadata: {
        color: 'ochre',
        name: 'Some Channel',
      },
    };
  };
});

Given('{string} returns a void promise', (world: CustomWorld, intentHandlerName: string) => {
  world.props[intentHandlerName] = async () => {
    return null;
  };
});

Given(
  '{string} is metadata with traceId {string} and signature {string} and antiReplay claims {string}',
  (world: CustomWorld, field: string, traceId: string, signature: string, antiReplayClaims: string) => {
    world.props[field] = {
      traceId,
      signature: {
        protected: signature + ' (protected part)',
        signature: signature + ' (signature part)',
      },
      antiReplay: parseAntiReplayClaims(antiReplayClaims),
      custom: { priority: 'high' },
    };
  }
);

Given(
  '{string} is an array of contexts including {string} and {string}',
  (world: CustomWorld, field: string, valueOne: string, valueTwo: string) => {
    world.props[field] = [valueOne, valueTwo];
  }
);

When(
  'I call {string} with {string} using arguments {string}, {string}, {string}, {string}, and {string}',
  async (
    world: CustomWorld,
    field: string,
    fnName: string,
    p1: string,
    p2: string,
    p3: string,
    p4: string,
    p5: string
  ) => {
    try {
      const object = handleResolve(field, world) as Record<string, (...args: unknown[]) => unknown>;
      const fn = object[fnName];
      const resolved = [p1, p2, p3, p4, p5].map(param => handleResolve(param, world));
      world.props['result'] = await fn.call(object, ...resolved);
    } catch (error) {
      world.props['result'] = error;
    }
  }
);
