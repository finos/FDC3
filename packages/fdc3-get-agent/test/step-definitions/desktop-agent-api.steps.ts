import { When } from 'quickpickle';
import { handleResolve } from '@finos/testing';
import { CustomWorld } from '../world/index.js';
import { DesktopAgent } from '@finos/fdc3-standard';
import { Instrument } from '@finos/fdc3-context';

When(
  'I call broadcast with an fdc3.instrument context on {string} and allow 3 seconds',
  async (world: CustomWorld, field: string) => {
    try {
      const da: DesktopAgent = handleResolve(field, world);
      const instrument: Instrument = {
        type: 'fdc3.instrument',
        id: { ticker: 'MSFT' },
        name: 'microsoft',
      };
      const result = await da.broadcast(instrument);
      world.props['result'] = result;
      world.log('Received non-error result: ' + JSON.stringify(result));
    } catch (error) {
      world.props['result'] = error;
      world.log('Received error with message: ' + ((error as Error).message ?? error));
    }
  }
);

When(
  'I call open with appId {string} on {string} and allow 3 seconds',
  async (world: CustomWorld, appId: string, field: string) => {
    try {
      const da: DesktopAgent = handleResolve(field, world);
      const result = await da.open({ appId: appId });
      world.props['result'] = result;
      world.log('Received non-error result: ' + JSON.stringify(result));
    } catch (error) {
      world.props['result'] = error;
      world.log('Received error with message: ' + ((error as Error).message ?? error));
    }
  }
);
